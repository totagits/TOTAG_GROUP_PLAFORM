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
