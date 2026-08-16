// Client-Side Dynamic State & Event Bus Engine for GitHub Pages & Web Deployment

export interface CargoShipmentItem {
  id: string;
  trackingNumber: string;
  shipperName: string;
  consigneeName: string;
  originPort: string;
  destinationPort: string;
  containerSize: string;
  weightTons: number;
  status: "Booked" | "In Transit" | "Customs Clearance" | "Demurrage Accruing" | "Delivered";
  demurrageDays: number;
  demurrageCostUsd: number;
  createdAt: string;
}

export interface PetroleumOrderItem {
  id: string;
  orderNumber: string;
  clientName: string;
  fuelType: "AGO Diesel" | "PMS Gasoline" | "Jet A-1" | "Bunkering HFO";
  volumeLiters: number;
  deliveryLocation: string;
  totalCostUsd: number;
  status: "Pending Credit Check" | "Approved" | "Loading Arm" | "In Dispatch" | "Delivered (POD Signed)";
  createdAt: string;
}

export interface SolarLeadItem {
  id: string;
  customerName: string;
  contactPerson: string;
  phoneEmail: string;
  customerCategory: "Individual Residential" | "Commercial Client" | "Government Agency" | "NGO" | "UN Organization" | "Health Facility" | "School" | "Farm" | "Telecom Installation" | "Industrial Client" | "Tender/RFQ/RFP" | "Reseller Opportunity" | "Existing Customer Expansion";
  county: string;
  district: string;
  siteAddress: string;
  gpsCoords: string;
  proposedApplication: string;
  estimatedLoadKw: number;
  electricitySource: "LEC Grid Only" | "Diesel Generator Only" | "Off-Grid / None" | "Legacy Solar System";
  generatorKva?: string;
  lecHoursPerDay?: number;
  requestedAutonomyHours: number;
  budgetUsd: number;
  procurementMethod: "Direct Purchase" | "Tender / RFQ" | "Solar Lease" | "Power Purchase Agreement (PPA)";
  tenderNumber?: string;
  submissionDeadline?: string;
  leadSource: string;
  assignedEngineer: string;
  stage: "New Lead" | "Qualified" | "Site Assessment Required" | "Technical Design" | "Commercial Proposal" | "Negotiation" | "Won" | "Lost";
  probabilityPct: number;
  estimatedValueUsd: number;
  createdAt: string;
}

export interface SolarAuditItem {
  id: string;
  clientName: string;
  location: string;
  propertyType: string;
  connectedWatts: number;
  dailyKwh: number;
  recommendedPvKw: number;
  recommendedBatteryKwh: number;
  status: "Site Audit Requested" | "Engineering Design V2" | "Commissioned" | "NOC Monitored";
  createdAt: string;
}

export interface EnterpriseEventItem {
  id: string;
  eventType: string;
  sourceSubsidiary: string;
  targetSubsidiary: string;
  description: string;
  timestamp: string;
}

// Initial Mock Persistent State
const INITIAL_LEADS: SolarLeadItem[] = [
  {
    id: "lead-1",
    customerName: "UNDP Liberia Country Office",
    contactPerson: "Dr. Emmanuel Koffi",
    phoneEmail: "+231 777 900 112 / ekoffi@undp.org",
    customerCategory: "UN Organization",
    county: "Grand Gedeh",
    district: "Zwedru District",
    siteAddress: "UN Compound, Tubman Boulevard",
    gpsCoords: "6.0719° N, 8.1281° W",
    proposedApplication: "100% Off-Grid Solar & Battery Microgrid",
    estimatedLoadKw: 45,
    electricitySource: "Diesel Generator Only",
    generatorKva: "150 kVA Perkins Genset",
    lecHoursPerDay: 0,
    requestedAutonomyHours: 14,
    budgetUsd: 120000,
    procurementMethod: "Tender / RFQ",
    tenderNumber: "RFQ-UNDP-SOL-2026-088",
    submissionDeadline: "2026-09-15",
    leadSource: "UN Global Marketplace",
    assignedEngineer: "Eng. Tarkpor Williams",
    stage: "Site Assessment Required",
    probabilityPct: 85,
    estimatedValueUsd: 115000,
    createdAt: new Date().toISOString()
  },
  {
    id: "lead-2",
    customerName: "Mamba Point Hotel & Suites",
    contactPerson: "Sarah Jenkins",
    phoneEmail: "+231 886 543 210 / s.jenkins@mambapointhotel.com",
    customerCategory: "Commercial Client",
    county: "Montserrado",
    district: "Monrovia",
    siteAddress: "Mamba Point Beach Front",
    gpsCoords: "6.3150° N, 10.8072° W",
    proposedApplication: "Hybrid Grid-Tied Solar Peak Shaving",
    estimatedLoadKw: 75,
    electricitySource: "LEC Grid Only",
    generatorKva: "250 kVA Caterpillar",
    lecHoursPerDay: 8,
    requestedAutonomyHours: 8,
    budgetUsd: 180000,
    procurementMethod: "Direct Purchase",
    leadSource: "Direct Executive Referral",
    assignedEngineer: "Eng. Michael Gwoah",
    stage: "Technical Design",
    probabilityPct: 90,
    estimatedValueUsd: 165000,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_CARGO: CargoShipmentItem[] = [

  { id: "1", trackingNumber: "TOTAG-BL-8841", shipperName: "Maersk Liberia", consigneeName: "TOTAG General Merchandise", originPort: "Freeport of Monrovia", destinationPort: "Gbarnga Depot", containerSize: "40ft High Cube", weightTons: 24.5, status: "In Transit", demurrageDays: 0, demurrageCostUsd: 0, createdAt: new Date().toISOString() }
];

const INITIAL_PETROLEUM: PetroleumOrderItem[] = [
  { id: "1", orderNumber: "PET-2026-901", clientName: "Golden Veroleum Liberia", fuelType: "AGO Diesel", volumeLiters: 15000, deliveryLocation: "Sinoe Plantation", totalCostUsd: 19500, status: "In Dispatch", createdAt: new Date().toISOString() }
];

const INITIAL_SOLAR: SolarAuditItem[] = [
  { id: "1", clientName: "UNDP Liberia Health Microgrid", location: "Zwedru, Grand Gedeh", propertyType: "Hospital", connectedWatts: 38500, dailyKwh: 145.0, recommendedPvKw: 38.5, recommendedBatteryKwh: 90.0, status: "NOC Monitored", createdAt: new Date().toISOString() }
];

const INITIAL_EVENTS: EnterpriseEventItem[] = [
  { id: "1", eventType: "SolarAuditRequested", sourceSubsidiary: "Solar Energy", targetSubsidiary: "FIMS / Admin", description: "New 125kW Solar Microgrid proposal submitted for UNDP", timestamp: new Date().toLocaleTimeString() },
  { id: "2", eventType: "CargoShipmentBooked", sourceSubsidiary: "Cargo Handling", targetSubsidiary: "Merchandise", description: "Waybill TOTAG-BL-8841 dispatched for Gbarnga Depot", timestamp: new Date().toLocaleTimeString() }
];

export class EcosystemStateEngine {
  static getCargoShipments(): CargoShipmentItem[] {
    const data = localStorage.getItem("totag_cargo_shipments");
    return data ? JSON.parse(data) : INITIAL_CARGO;
  }

  static addCargoShipment(shipment: Omit<CargoShipmentItem, "id" | "createdAt">): CargoShipmentItem {
    const list = this.getCargoShipments();
    const newItem: CargoShipmentItem = {
      ...shipment,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    list.unshift(newItem);
    localStorage.setItem("totag_cargo_shipments", JSON.stringify(list));
    
    this.emitEvent({
      eventType: "CargoShipmentBooked",
      sourceSubsidiary: "Cargo Handling",
      targetSubsidiary: "FIMS / Admin",
      description: `Waybill ${newItem.trackingNumber} created for ${newItem.consigneeName}`
    });

    return newItem;
  }

  static getPetroleumOrders(): PetroleumOrderItem[] {
    const data = localStorage.getItem("totag_petroleum_orders");
    return data ? JSON.parse(data) : INITIAL_PETROLEUM;
  }

  static addPetroleumOrder(order: Omit<PetroleumOrderItem, "id" | "createdAt">): PetroleumOrderItem {
    const list = this.getPetroleumOrders();
    const newItem: PetroleumOrderItem = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    list.unshift(newItem);
    localStorage.setItem("totag_petroleum_orders", JSON.stringify(list));

    this.emitEvent({
      eventType: "FuelDeliveryCompleted",
      sourceSubsidiary: "Petroleum Services",
      targetSubsidiary: "FIMS / Admin",
      description: `Order ${newItem.orderNumber} (${newItem.volumeLiters}L ${newItem.fuelType}) created for ${newItem.clientName}`
    });

    return newItem;
  }

  static getSolarLeads(): SolarLeadItem[] {
    const data = localStorage.getItem("totag_solar_leads");
    return data ? JSON.parse(data) : INITIAL_LEADS;
  }

  static addSolarLead(lead: Omit<SolarLeadItem, "id" | "createdAt">): SolarLeadItem {
    const list = this.getSolarLeads();
    const newItem: SolarLeadItem = {
      ...lead,
      id: "lead-" + Math.random().toString(36).substr(2, 7),
      createdAt: new Date().toISOString()
    };
    list.unshift(newItem);
    localStorage.setItem("totag_solar_leads", JSON.stringify(list));

    this.emitEvent({
      eventType: "SolarLeadCreated",
      sourceSubsidiary: "Solar Energy",
      targetSubsidiary: "FIMS / CRM",
      description: `New Solar Opportunity: ${newItem.customerName} (${newItem.estimatedValueUsd.toLocaleString()} USD pipeline)`
    });

    return newItem;
  }

  static updateSolarLeadStage(id: string, stage: SolarLeadItem["stage"]): void {
    const list = this.getSolarLeads();
    const target = list.find(item => item.id === id);
    if (target) {
      target.stage = stage;
      localStorage.setItem("totag_solar_leads", JSON.stringify(list));
      this.emitEvent({
        eventType: "SolarLeadStageUpdated",
        sourceSubsidiary: "Solar Energy",
        targetSubsidiary: "FIMS / Sales",
        description: `Opportunity ${target.customerName} moved to stage '${stage}'`
      });
    }
  }

  static getSolarAudits(): SolarAuditItem[] {

    const data = localStorage.getItem("totag_solar_audits");
    return data ? JSON.parse(data) : INITIAL_SOLAR;
  }

  static addSolarAudit(audit: Omit<SolarAuditItem, "id" | "createdAt">): SolarAuditItem {
    const list = this.getSolarAudits();
    const newItem: SolarAuditItem = {
      ...audit,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    list.unshift(newItem);
    localStorage.setItem("totag_solar_audits", JSON.stringify(list));

    this.emitEvent({
      eventType: "SolarAuditRequested",
      sourceSubsidiary: "Solar Energy",
      targetSubsidiary: "FIMS / Admin",
      description: `Solar Proposal for ${newItem.clientName} (${newItem.recommendedPvKw}kW PV array) created`
    });

    return newItem;
  }

  static getEnterpriseEvents(): EnterpriseEventItem[] {
    const data = localStorage.getItem("totag_enterprise_events");
    return data ? JSON.parse(data) : INITIAL_EVENTS;
  }

  static emitEvent(event: Omit<EnterpriseEventItem, "id" | "timestamp">): EnterpriseEventItem {
    const list = this.getEnterpriseEvents();
    const newItem: EnterpriseEventItem = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString()
    };
    list.unshift(newItem);
    localStorage.setItem("totag_enterprise_events", JSON.stringify(list));
    return newItem;
  }
}
