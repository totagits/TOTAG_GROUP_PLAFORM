export const EVENT_TYPES = [
  { value: "workshop", label: "Workshop / Training" },
  { value: "conference", label: "Conference / Meeting" },
  { value: "corporate", label: "Corporate Event" },
  { value: "reception", label: "Reception / Cocktail" },
  { value: "in-house", label: "In-House Catering (at your office)" },
  { value: "venue-rental", label: "Venue / Hall Rental Only" },
  { value: "full-package", label: "Full Package (Catering + Venue)" },
  { value: "wedding", label: "Wedding / Social Celebration" },
  { value: "other", label: "Other" },
];

export const PARTICIPANT_RANGES = [
  { value: "10-25",   label: "10 – 25 participants",   pricingCount: 25 },
  { value: "26-50",   label: "26 – 50 participants",   pricingCount: 50 },
  { value: "51-100",  label: "51 – 100 participants",  pricingCount: 100 },
  { value: "101-200", label: "101 – 200 participants", pricingCount: 200 },
  { value: "201-500", label: "201 – 500 participants", pricingCount: 500 },
];

export const URGENCY_LEVELS = [
  { value: "routine",      label: "Routine (24 hr+ notice)",       surchargePercent: 0 },
  { value: "short-notice", label: "Short Notice (48 hrs or less)", surchargePercent: 15 },
  { value: "emergency",    label: "Emergency (same-day)",          surchargePercent: 30 },
];

export const CATERING_SERVICES = [
  { id: "institutional-catering", label: "Institutional & Corporate Catering" },
  { id: "venue-hall-rental",      label: "Venue, Hall Rental & Conference Facilities" },
  { id: "event-planning",         label: "Event Planning & Logistics Management" },
  { id: "specialty-menus",        label: "Liberian & Continental Menus" },
  { id: "food-safety",            label: "Food Safety & Quality Assurance" },
  { id: "beverage-services",      label: "Beverage Services" },
  { id: "onsite-coordination",    label: "On-Site Coordination & Staff Deployment" },
  { id: "sustainability",         label: "Sustainability & Greening Practices" },
];

export interface ServiceLineItemTemplate {
  name: string;
  category: string;
  unitPrice: number;
  unit: string;
  scaledByParticipants: boolean;
  notes?: string;
}

export const SERVICE_LINE_ITEMS: Record<string, ServiceLineItemTemplate[]> = {
  "institutional-catering": [
    { name: "Full Meal Service (per person)",    category: "Catering",  unitPrice: 25, unit: "per person", scaledByParticipants: true },
    { name: "Tea / Coffee Break (per person)",   category: "Catering",  unitPrice: 5,  unit: "per person", scaledByParticipants: true },
    { name: "Custom Menu Design",                category: "Catering",  unitPrice: 150, unit: "flat fee",  scaledByParticipants: false },
  ],
  "venue-hall-rental": [
    { name: "Conference / Banquet Hall (full day)", category: "Venue",     unitPrice: 600,  unit: "per day",   scaledByParticipants: false },
    { name: "PA System & Sound",                    category: "Equipment", unitPrice: 150,  unit: "per event", scaledByParticipants: false },
    { name: "Projector & Screen",                   category: "Equipment", unitPrice: 100,  unit: "per event", scaledByParticipants: false },
    { name: "Table & Chair Set (10-seater)",        category: "Equipment", unitPrice: 25,   unit: "per set",   scaledByParticipants: false, notes: "Adjust quantity as needed" },
  ],
  "event-planning": [
    { name: "Event Coordination & Logistics",  category: "Planning",  unitPrice: 250, unit: "per event", scaledByParticipants: false },
    { name: "Setup & Teardown Crew",           category: "Staffing",  unitPrice: 100, unit: "per event", scaledByParticipants: false },
    { name: "AV & Technical Support",          category: "Equipment", unitPrice: 100, unit: "per event", scaledByParticipants: false },
  ],
  "specialty-menus": [
    { name: "Liberian & Continental Buffet (per person)", category: "Catering", unitPrice: 22, unit: "per person", scaledByParticipants: true },
    { name: "Dietary Special Menu Surcharge (per person)", category: "Catering", unitPrice: 5,  unit: "per person", scaledByParticipants: true, notes: "Apply only if special diets requested" },
  ],
  "food-safety": [
    { name: "HACCP Food Safety Compliance Package", category: "Compliance", unitPrice: 150, unit: "per event", scaledByParticipants: false },
    { name: "Food Safety Officer (on-site)",        category: "Staffing",   unitPrice: 100, unit: "per day",   scaledByParticipants: false },
  ],
  "beverage-services": [
    { name: "Beverage Package — Non-Alcoholic (per person)", category: "Beverages", unitPrice: 8, unit: "per person", scaledByParticipants: true },
    { name: "Premium Coffee & Tea Bar",                      category: "Beverages", unitPrice: 150, unit: "per event", scaledByParticipants: false },
  ],
  "onsite-coordination": [
    { name: "On-Site Event Coordinator",      category: "Staffing", unitPrice: 150, unit: "per event", scaledByParticipants: false },
    { name: "Wait Staff / Service Crew",      category: "Staffing", unitPrice: 50,  unit: "per event", scaledByParticipants: false, notes: "Add one staff per 25 participants" },
    { name: "Head Chef Services",             category: "Staffing", unitPrice: 200, unit: "per event", scaledByParticipants: false },
  ],
  "sustainability": [
    { name: "Eco-Friendly Packaging & Greening Package", category: "Sustainability", unitPrice: 3, unit: "per person", scaledByParticipants: true },
    { name: "Biodegradable Serviceware Package",         category: "Sustainability", unitPrice: 75, unit: "per event", scaledByParticipants: false },
  ],
};

export function getPricingCountFromGuestCount(guestCount: number | string | null | undefined): number {
  if (!guestCount) return 50;
  const n = typeof guestCount === "string" ? parseInt(guestCount) : guestCount;
  const match = PARTICIPANT_RANGES.find(r => {
    const [lo, hi] = r.value.split("-").map(Number);
    return n >= lo && n <= hi;
  });
  return match?.pricingCount ?? n;
}

export function getUrgencySurcharge(urgencyOrBudget: string | null | undefined): number {
  if (!urgencyOrBudget) return 0;
  const match = URGENCY_LEVELS.find(u => u.value === urgencyOrBudget);
  return match?.surchargePercent ?? 0;
}

export function getEventTypeLabel(value: string): string {
  return EVENT_TYPES.find(e => e.value === value)?.label ?? value;
}
