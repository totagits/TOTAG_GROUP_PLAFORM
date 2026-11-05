/**
 * Central Bank of Liberia exchange-rate reader.
 * Source of truth: CBL Daily Exchange Rates (published market buying/selling).
 * No environment-variable rate, hardcoded fallback or third-party rate may enable LRD collection.
 */
export const CBL_RATES_URL = "https://www.cbl.org.lr/research/buying-selling-rates?page=0";
export const CBL_RATE_SIDE = "selling" as const;
export const CBL_MAX_AGE_DAYS = 4;
const CACHE_MS = 30 * 60 * 1000;

export type CblRate = {
  date: string;
  buying: number;
  selling: number;
  sourceUrl: typeof CBL_RATES_URL;
  rateSide: typeof CBL_RATE_SIDE;
  verifiedAt: string;
};

function extractCell(s: string): string {
  return s.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;|&amp;/gi, " ")
    .replace(/\s+/g, " ").trim();
}

/** Parse a real CBL table row. No matching date/three-column record = no exchange rate. */
export function parseCblRates(html: string, verifiedAt = new Date().toISOString()): CblRate {
  if (html.length > 3_000_000) throw new Error("Unexpected CBL response size");
  const rows = [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  for (const row of rows) {
    const cells = [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)]
      .map(c => extractCell(c[1]));
    if (cells.length < 3) continue;
    const dateMatch = cells[0].match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+([A-Z][a-z]+)\s+(\d{1,2}),?\s+(20\d{2})/);
    if (!dateMatch) continue;
    const d = new Date(dateMatch[1] + " " + dateMatch[2] + ", " + dateMatch[3] + " 00:00:00 GMT");
    if (!Number.isFinite(d.getTime()) || d.getUTCFullYear() !== Number(dateMatch[3]))
      continue;
    const parseRate = (value: string) => {
      const match = value.match(/(?:L\s*\$|L\$)\s*([\d,]+\.\d{4})\s*\/?\s*(?:US\s*\$\s*1(?:\.00)?)?/i);
      return match ? Number(match[1].replace(/,/g, "")) : NaN;
    };
    const buying = parseRate(cells[1]), selling = parseRate(cells[2]);
    if (!(buying > 50 && buying < 1000 && selling >= buying && selling < 1000))
      continue;
    return {
      date: d.toISOString().slice(0,10),
      buying, selling, sourceUrl: CBL_RATES_URL,
      rateSide: CBL_RATE_SIDE, verifiedAt
    };
  }
  throw new Error("The official CBL page did not contain a verifiable dated exchange-rate table");
}

/** CBL publication is not daily on holidays. A quote must remain within a short dated window. */
export function isCblRateFresh(rate: CblRate, now = new Date()): boolean {
  const published = Date.parse(rate.date + "T00:00:00Z");
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const age = (today - published) / 86_400_000;
  return Number.isInteger(age) && age >= 0 && age <= CBL_MAX_AGE_DAYS;
}

export function usdCentsToLrdCents(usdCents: number, sellingRate: number): number {
  if (!Number.isSafeInteger(usdCents) || usdCents < 0 || !Number.isFinite(sellingRate) || sellingRate <= 0)
    throw new Error("Invalid currency conversion amount");
  const rateFourDp = Math.round(sellingRate * 10_000);
  const converted = Math.round((usdCents * rateFourDp) / 10_000);
  if (!Number.isSafeInteger(converted)) throw new Error("Converted amount out of range");
  return converted;
}

let cached: { rate: CblRate; until: number } | null = null;
export function clearCblCacheForTests() { cached = null; }

export async function getOfficialCblRate(fetcher: typeof fetch = fetch): Promise<CblRate> {
  const now = new Date();
  if (cached && cached.until > now.getTime() && isCblRateFresh(cached.rate, now))
    return cached.rate;
  const response = await fetcher(CBL_RATES_URL, {
    method: "GET", headers: {"Accept": "text/html"},
    signal: AbortSignal.timeout(8_000)
  });
  if (!response.ok) throw new Error("CBL rate source is unavailable (" + response.status + ")");
  const html = await response.text();
  const rate = parseCblRates(html, now.toISOString());
  if (!isCblRateFresh(rate, now))
    throw new Error("CBL published rate dated " + rate.date + " is outside the permitted " + CBL_MAX_AGE_DAYS + "-day window");
  cached = { rate, until: now.getTime() + CACHE_MS };
  return rate;
}
