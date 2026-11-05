import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCblRates, isCblRateFresh, usdCentsToLrdCents, CBL_RATES_URL } from "../server/cblRates";

const fixture = [
  '<html><body><table><thead><tr><th>Date</th><th>Buying</th><th>Selling</th></tr></thead><tbody>',
  '<tr><td>Wednesday, November 4, 2026</td><td>L$169.3336/US$1.00</td><td>L$171.3815/US$1.00</td></tr>',
  '<tr><td>Tuesday, November 3, 2026</td><td>L$169.3701/US$1.00</td><td>L$171.4180/US$1.00</td></tr>',
  '</tbody></table></body></html>'
].join("");

test("reads CBL official dated buying and selling rate",()=>{
  const r=parseCblRates(fixture, "2026-11-05T08:00:00.000Z");
  assert.equal(r.date,"2026-11-04");
  assert.equal(r.buying,169.3336);
  assert.equal(r.selling,171.3815);
  assert.equal(r.rateSide,"selling");
  assert.equal(r.sourceUrl,CBL_RATES_URL);
});
test("converts USD into LRD cents with published four-decimal selling rate",()=>{
  assert.equal(usdCentsToLrdCents(1500,171.3815),257072);
  assert.equal(usdCentsToLrdCents(2500,171.3815),428454);
  assert.equal(usdCentsToLrdCents(3500,171.3815),599835);
  assert.equal(usdCentsToLrdCents(0,171.3815),0);
});
test("rejects invented, malformed or future rates",()=>{
  assert.throws(()=>parseCblRates("<html>No rates published</html>"));
  assert.throws(()=>parseCblRates(fixture.replace("L$171.3815","L$16.3815")));
  assert.throws(()=>usdCentsToLrdCents(1500,0));
  assert.throws(()=>usdCentsToLrdCents(-2,171.3815));
});
test("prevents LRD checkout using stale or future published rates",()=>{
  const r=parseCblRates(fixture);
  assert.equal(isCblRateFresh(r,new Date("2026-11-05T23:00:00Z")),true);
  assert.equal(isCblRateFresh(r,new Date("2026-11-09T00:00:00Z")),false);
  assert.equal(isCblRateFresh(r,new Date("2026-11-03T00:00:00Z")),false);
});
