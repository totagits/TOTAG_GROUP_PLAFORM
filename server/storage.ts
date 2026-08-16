import { 
  users, 
  contactInquiries, 
  services,
  livestock,
  crops,
  equipment,
  marketProducts,
  marketOrders,
  marketOrderItems,
  tasks,
  activities,
  inventory,
  tgmWholesaleOrders,
  tgmRetailSales,
  tgmInventory,
  tgmSuppliers,
  tgmDeliveries,
  tgmActivityLogs,
  carouselSlides,
  websiteContent,
  orders,
  deliveries,
  customers,
  creditors,
  creditPayments,
  subsidiaryEmails,
  employees,
  attendance,
  leaveRequests,
  payroll,
  performanceReviews,
  products,
  cargoShipments,
  petroleumOrders,
  equipmentRentals,
  stationeryOrders,
  institutionalContracts,
  partyMaster,
  enterpriseEvents,
  type InstitutionalContract,
  type InsertInstitutionalContract,
  type PartyMaster,
  type InsertPartyMaster,
  type EnterpriseEvent,
  type InsertEnterpriseEvent,
  type User, 


  type InsertUser,
  type ContactInquiry,
  type InsertContactInquiry,
  type Service,
  type InsertService,
  type Livestock,
  type InsertLivestock,
  type Crop,
  type InsertCrop,
  type Equipment,
  type InsertEquipment,
  type MarketProduct,
  type InsertMarketProduct,
  type MarketOrder,
  type InsertMarketOrder,
  type Task,
  type InsertTask,
  type Activity,
  type InsertActivity,
  type Inventory,
  type InsertInventory,
  type TgmWholesaleOrder,
  type InsertTgmWholesaleOrder,
  type TgmRetailSale,
  type InsertTgmRetailSale,
  type TgmInventory,
  type InsertTgmInventory,
  type TgmSupplier,
  type InsertTgmSupplier,
  type TgmDelivery,
  type InsertTgmDelivery,
  type TgmActivityLog,
  type CarouselSlide,
  type InsertCarouselSlide,
  type WebsiteContent,
  type InsertWebsiteContent,
  type Creditor,
  type InsertCreditor,
  type CreditPayment,
  type InsertCreditPayment,
  type SubsidiaryEmail,
  type InsertSubsidiaryEmail,
  type Employee,
  type InsertEmployee,
  type Attendance,
  type InsertAttendance,
  type LeaveRequest,
  type InsertLeaveRequest,
  type Payroll,
  type InsertPayroll,
  type PerformanceReview,
  type InsertPerformanceReview,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  cateringStaff,
  cateringRequests,
  cateringEvents,
  cateringTasks,
  cateringIncidents,
  cateringQuotations,
  type CateringStaff,
  type InsertCateringStaff,
  type CateringRequest,
  type InsertCateringRequest,
  type CateringEvent,
  type InsertCateringEvent,
  type CateringTask,
  type InsertCateringTask,
  type CateringIncident,
  type InsertCateringIncident,
  type CateringQuotation,
  type InsertCateringQuotation,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateLogin(username: string, password: string): Promise<User | null>;
  
  // Contact inquiry methods
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
  getContactInquiry(id: number): Promise<ContactInquiry | undefined>;
  updateContactInquiryStatus(id: number, status: string): Promise<ContactInquiry | undefined>;
  
  // Service methods
  getServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  getServiceBySlug(slug: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;

  // Order and delivery tracking methods
  createOrder(orderData: any): Promise<any>;
  getOrderByNumber(orderNumber: string): Promise<any>;
  getAllOrders(): Promise<any[]>;
  getAllDeliveries(): Promise<any[]>;
  createDelivery(deliveryData: any): Promise<any>;
  updateDeliveryStatus(trackingNumber: string, status: string, location?: string): Promise<any>;

  // Farm Management - Market Products (Public)
  getMarketProducts(): Promise<MarketProduct[]>;
  getAvailableMarketProducts(): Promise<MarketProduct[]>;
  getMarketProductById(id: number): Promise<MarketProduct | undefined>;
  
  // Farm Management - Livestock (Staff Only)
  getLivestock(): Promise<Livestock[]>;
  createLivestock(livestock: InsertLivestock): Promise<Livestock>;
  
  // Farm Management - Crops (Staff Only)
  getCrops(): Promise<Crop[]>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  
  // Farm Management - Equipment (Staff Only)
  getEquipment(): Promise<Equipment[]>;
  createEquipment(equipment: InsertEquipment): Promise<Equipment>;
  
  // Farm Management - Tasks (Staff Only)
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  
  // Farm Management - Activities (Staff Only)
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Farm Management - Inventory (Staff Only)
  getInventory(): Promise<Inventory[]>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;

  // TGM Operations - Role-based access control
  // Wholesale Operations (General Manager, Wholesale Head, Sales Team)
  getTgmWholesaleOrders(): Promise<TgmWholesaleOrder[]>;
  createTgmWholesaleOrder(order: InsertTgmWholesaleOrder): Promise<TgmWholesaleOrder>;
  updateTgmWholesaleOrderStatus(id: number, status: string, approvedBy?: number): Promise<TgmWholesaleOrder | undefined>;
  
  // Retail Operations (General Manager, Retail Head, Sales Team)
  getTgmRetailSales(): Promise<TgmRetailSale[]>;
  createTgmRetailSale(sale: InsertTgmRetailSale): Promise<TgmRetailSale>;
  getTgmRetailSalesByOutlet(outlet: string): Promise<TgmRetailSale[]>;
  
  // Inventory Management (General Manager, Inventory Manager)
  getTgmInventory(): Promise<TgmInventory[]>;
  createTgmInventoryItem(item: InsertTgmInventory): Promise<TgmInventory>;
  updateTgmInventoryQuantity(id: number, quantity: number, updatedBy: number): Promise<TgmInventory | undefined>;
  getLowStockItems(): Promise<TgmInventory[]>;
  
  // Supplier Management (General Manager, Inventory Manager)
  getTgmSuppliers(): Promise<TgmSupplier[]>;
  createTgmSupplier(supplier: InsertTgmSupplier): Promise<TgmSupplier>;
  updateTgmSupplierRating(id: number, rating: number): Promise<TgmSupplier | undefined>;
  
  // Logistics & Delivery (General Manager, Logistics Manager)
  getTgmDeliveries(): Promise<TgmDelivery[]>;
  createTgmDelivery(delivery: InsertTgmDelivery): Promise<TgmDelivery>;
  updateTgmDeliveryStatus(id: number, status: string, notes?: string): Promise<TgmDelivery | undefined>;
  
  // Activity Logging (All roles)
  getTgmActivityLogs(userId?: number): Promise<TgmActivityLog[]>;
  logTgmActivity(activity: { userId: number, action: string, entity: string, entityId?: string, details?: string }): Promise<TgmActivityLog>;

  // CMS Functions - Full Content Management
  getAllProducts(): Promise<any[]>;
  createProduct(productData: any): Promise<any>;
  updateProduct(id: number, productData: any): Promise<any>;
  deleteProduct(id: number): Promise<void>;
  
  // Role-based access methods for staff
  updateOrderStatus(id: number, updates: any): Promise<any>;
  updateDeliveryById(id: number, updates: any): Promise<any>;

  // Carousel Management
  getCarouselSlides(): Promise<CarouselSlide[]>;
  createCarouselSlide(slideData: InsertCarouselSlide): Promise<CarouselSlide>;
  updateCarouselSlide(id: number, slideData: Partial<InsertCarouselSlide>): Promise<CarouselSlide>;
  deleteCarouselSlide(id: number): Promise<void>;

  // Credit Management System methods
  createCreditor(creditorData: InsertCreditor): Promise<Creditor>;
  getAllCreditors(): Promise<Creditor[]>;
  getCreditorById(id: number): Promise<Creditor | undefined>;
  getCreditorsByCustomer(customerPhone: string, customerName: string): Promise<Creditor[]>;
  updateCreditorBalance(id: number, newBalance: number, nextPaymentDate?: Date): Promise<Creditor | undefined>;
  createCreditPayment(paymentData: InsertCreditPayment): Promise<CreditPayment>;
  getCreditPaymentsByCreditor(creditorId: number): Promise<CreditPayment[]>;
  processCustomerPayment(creditorId: number, paymentAmount: number, paymentMethod: string, transactionId?: string, processedBy?: number): Promise<{ payment: CreditPayment, updatedCreditor: Creditor }>;
  
  // Order methods for customer dashboard
  getOrdersByCustomer(customerPhone: string, customerName: string): Promise<Order[]>;

  // Website Content Management
  getWebsiteContent(): Promise<WebsiteContent[]>;
  updateWebsiteContent(contentData: any): Promise<WebsiteContent>;

  // Subsidiary Email Management
  getSubsidiaryEmails(): Promise<SubsidiaryEmail[]>;
  createSubsidiaryEmail(emailData: InsertSubsidiaryEmail): Promise<SubsidiaryEmail>;
  updateSubsidiaryEmail(id: number, emailData: Partial<InsertSubsidiaryEmail>): Promise<SubsidiaryEmail>;
  deleteSubsidiaryEmail(id: number): Promise<void>;
  getSubsidiaryEmailBySubsidiaryId(subsidiaryId: string): Promise<SubsidiaryEmail | undefined>;

  // Catering Operations Management
  getCateringStaffByUsername(username: string): Promise<CateringStaff | undefined>;
  getCateringStaffById(id: number): Promise<CateringStaff | undefined>;
  getAllCateringStaff(): Promise<CateringStaff[]>;
  createCateringStaff(staff: InsertCateringStaff): Promise<CateringStaff>;
  updateCateringStaff(id: number, updates: Partial<CateringStaff>): Promise<CateringStaff | undefined>;
  createCateringRequest(request: InsertCateringRequest): Promise<CateringRequest>;
  getCateringRequests(): Promise<CateringRequest[]>;
  getCateringRequestById(id: number): Promise<CateringRequest | undefined>;
  updateCateringRequest(id: number, updates: Partial<CateringRequest>): Promise<CateringRequest | undefined>;
  deleteCateringRequest(id: number): Promise<boolean>;
  createCateringEvent(event: InsertCateringEvent): Promise<CateringEvent>;
  getCateringEvents(): Promise<CateringEvent[]>;
  getCateringEventById(id: number): Promise<CateringEvent | undefined>;
  updateCateringEvent(id: number, updates: Partial<CateringEvent>): Promise<CateringEvent | undefined>;
  createCateringTask(task: InsertCateringTask): Promise<CateringTask>;
  getCateringTasks(filters?: { role?: string; eventId?: number; status?: string }): Promise<CateringTask[]>;
  updateCateringTask(id: number, updates: Partial<CateringTask>): Promise<CateringTask | undefined>;
  createCateringIncident(incident: InsertCateringIncident): Promise<CateringIncident>;
  getCateringIncidents(eventId?: number): Promise<CateringIncident[]>;
  updateCateringIncident(id: number, updates: Partial<CateringIncident>): Promise<CateringIncident | undefined>;
  createCateringQuotation(quotation: InsertCateringQuotation): Promise<CateringQuotation>;
  getCateringQuotations(): Promise<CateringQuotation[]>;
  getCateringQuotationById(id: number): Promise<CateringQuotation | undefined>;
  getCateringQuotationsByRequestId(requestId: number): Promise<CateringQuotation[]>;
  updateCateringQuotation(id: number, updates: Partial<CateringQuotation>): Promise<CateringQuotation | undefined>;

  // Cargo Operations
  getCargoShipments(): Promise<CargoShipment[]>;
  getCargoShipmentByTracking(trackingNumber: string): Promise<CargoShipment | undefined>;
  createCargoShipment(shipment: InsertCargoShipment): Promise<CargoShipment>;

  // Petroleum Operations
  getPetroleumOrders(): Promise<PetroleumOrder[]>;
  createPetroleumOrder(order: InsertPetroleumOrder): Promise<PetroleumOrder>;

  // Equipment Rental Operations
  getEquipmentRentals(): Promise<EquipmentRental[]>;
  createEquipmentRental(rental: InsertEquipmentRental): Promise<EquipmentRental>;

  // Stationery Operations
  getStationeryOrders(): Promise<StationeryOrder[]>;
  createStationeryOrder(order: InsertStationeryOrder): Promise<StationeryOrder>;

  // Solar Audit Operations
  getSolarAudits(): Promise<SolarAudit[]>;
  createSolarAudit(audit: InsertSolarAudit): Promise<SolarAudit>;

  // Institutional Services & Contracts
  getInstitutionalContracts(): Promise<InstitutionalContract[]>;
  createInstitutionalContract(contract: InsertInstitutionalContract): Promise<InstitutionalContract>;

  // Group CRM Party Master
  getParties(): Promise<PartyMaster[]>;
  createParty(party: InsertPartyMaster): Promise<PartyMaster>;

  // Enterprise Event Bus
  getEnterpriseEvents(): Promise<EnterpriseEvent[]>;
  publishEnterpriseEvent(event: InsertEnterpriseEvent): Promise<EnterpriseEvent>;
}



export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async validateLogin(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user || !user.isActive) return null;
    
    // Simple password validation (in production, use proper hashing)
    if (user.password === password) {
      return user;
    }
    return null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Contact inquiry methods
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [contactInquiry] = await db
      .insert(contactInquiries)
      .values(inquiry)
      .returning();
    return contactInquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries);
  }

  async getContactInquiry(id: number): Promise<ContactInquiry | undefined> {
    const [inquiry] = await db.select().from(contactInquiries).where(eq(contactInquiries.id, id));
    return inquiry || undefined;
  }

  async updateContactInquiryStatus(id: number, status: string): Promise<ContactInquiry | undefined> {
    const [inquiry] = await db
      .update(contactInquiries)
      .set({ status })
      .where(eq(contactInquiries.id, id))
      .returning();
    return inquiry || undefined;
  }

  // Service methods
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getActiveServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true));
  }

  async getServiceBySlug(slug: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.slug, slug));
    return service || undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db
      .insert(services)
      .values(service)
      .returning();
    return newService;
  }

  // Farm Management - Market Products (Public)
  async getMarketProducts(): Promise<MarketProduct[]> {
    return await db.select().from(marketProducts);
  }

  async getAvailableMarketProducts(): Promise<MarketProduct[]> {
    return await db.select().from(marketProducts).where(eq(marketProducts.isAvailable, true));
  }

  async getMarketProductById(id: number): Promise<MarketProduct | undefined> {
    const [product] = await db.select().from(marketProducts).where(eq(marketProducts.id, id));
    return product || undefined;
  }

  // Farm Management - Livestock (Staff Only)
  async getLivestock(): Promise<Livestock[]> {
    return await db.select().from(livestock);
  }

  async createLivestock(livestockData: InsertLivestock): Promise<Livestock> {
    const [newLivestock] = await db
      .insert(livestock)
      .values(livestockData)
      .returning();
    return newLivestock;
  }

  // Farm Management - Crops (Staff Only)
  async getCrops(): Promise<Crop[]> {
    return await db.select().from(crops);
  }

  async createCrop(cropData: InsertCrop): Promise<Crop> {
    const [newCrop] = await db
      .insert(crops)
      .values(cropData)
      .returning();
    return newCrop;
  }

  // Farm Management - Equipment (Staff Only)
  async getEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment);
  }

  async createEquipment(equipmentData: InsertEquipment): Promise<Equipment> {
    const [newEquipment] = await db
      .insert(equipment)
      .values(equipmentData)
      .returning();
    return newEquipment;
  }

  // Farm Management - Tasks (Staff Only)
  async getTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(taskData)
      .returning();
    return newTask;
  }

  // Farm Management - Activities (Staff Only)
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const [newActivity] = await db
      .insert(activities)
      .values(activityData)
      .returning();
    return newActivity;
  }

  // Farm Management - Inventory (Staff Only)
  async getInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory);
  }

  async createInventoryItem(itemData: InsertInventory): Promise<Inventory> {
    const [newItem] = await db
      .insert(inventory)
      .values(itemData)
      .returning();
    return newItem;
  }

  // TGM Operations Implementation
  // Wholesale Operations
  async getTgmWholesaleOrders(): Promise<TgmWholesaleOrder[]> {
    return await db.select().from(tgmWholesaleOrders);
  }

  async createTgmWholesaleOrder(orderData: InsertTgmWholesaleOrder): Promise<TgmWholesaleOrder> {
    const [newOrder] = await db
      .insert(tgmWholesaleOrders)
      .values(orderData)
      .returning();
    return newOrder;
  }

  async updateTgmWholesaleOrderStatus(id: number, status: string, approvedBy?: number): Promise<TgmWholesaleOrder | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (approvedBy) updateData.approvedBy = approvedBy;
    
    const [order] = await db
      .update(tgmWholesaleOrders)
      .set(updateData)
      .where(eq(tgmWholesaleOrders.id, id))
      .returning();
    return order || undefined;
  }

  // Retail Operations
  async getTgmRetailSales(): Promise<TgmRetailSale[]> {
    return await db.select().from(tgmRetailSales);
  }

  async createTgmRetailSale(saleData: InsertTgmRetailSale): Promise<TgmRetailSale> {
    const [newSale] = await db
      .insert(tgmRetailSales)
      .values(saleData)
      .returning();
    return newSale;
  }

  async getTgmRetailSalesByOutlet(outlet: string): Promise<TgmRetailSale[]> {
    return await db.select().from(tgmRetailSales).where(eq(tgmRetailSales.outlet, outlet));
  }

  // Inventory Management
  async getTgmInventory(): Promise<TgmInventory[]> {
    return await db.select().from(tgmInventory);
  }

  async createTgmInventoryItem(itemData: InsertTgmInventory): Promise<TgmInventory> {
    const [newItem] = await db
      .insert(tgmInventory)
      .values(itemData)
      .returning();
    return newItem;
  }

  async updateTgmInventoryQuantity(id: number, quantity: number, updatedBy: number): Promise<TgmInventory | undefined> {
    const [item] = await db
      .update(tgmInventory)
      .set({ quantity, lastUpdatedBy: updatedBy, updatedAt: new Date() })
      .where(eq(tgmInventory.id, id))
      .returning();
    return item || undefined;
  }

  async getLowStockItems(): Promise<TgmInventory[]> {
    return await db.select().from(tgmInventory)
      .where(eq(tgmInventory.status, 'low_stock'));
  }

  // Supplier Management
  async getTgmSuppliers(): Promise<TgmSupplier[]> {
    return await db.select().from(tgmSuppliers);
  }

  async createTgmSupplier(supplierData: InsertTgmSupplier): Promise<TgmSupplier> {
    const [newSupplier] = await db
      .insert(tgmSuppliers)
      .values(supplierData)
      .returning();
    return newSupplier;
  }

  async updateTgmSupplierRating(id: number, rating: number): Promise<TgmSupplier | undefined> {
    const [supplier] = await db
      .update(tgmSuppliers)
      .set({ rating: rating.toString(), updatedAt: new Date() })
      .where(eq(tgmSuppliers.id, id))
      .returning();
    return supplier || undefined;
  }

  // Logistics & Delivery
  async getTgmDeliveries(): Promise<TgmDelivery[]> {
    return await db.select().from(tgmDeliveries);
  }

  async createTgmDelivery(deliveryData: InsertTgmDelivery): Promise<TgmDelivery> {
    const [newDelivery] = await db
      .insert(tgmDeliveries)
      .values(deliveryData)
      .returning();
    return newDelivery;
  }

  async updateTgmDeliveryStatus(id: number, status: string, notes?: string): Promise<TgmDelivery | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (notes) updateData.trackingNotes = notes;
    
    const [delivery] = await db
      .update(tgmDeliveries)
      .set(updateData)
      .where(eq(tgmDeliveries.id, id))
      .returning();
    return delivery || undefined;
  }

  // Activity Logging
  async getTgmActivityLogs(userId?: number): Promise<TgmActivityLog[]> {
    if (userId) {
      return await db.select().from(tgmActivityLogs).where(eq(tgmActivityLogs.userId, userId));
    }
    return await db.select().from(tgmActivityLogs);
  }

  async logTgmActivity(activityData: { userId: number, action: string, entity: string, entityId?: string, details?: string }): Promise<TgmActivityLog> {
    const [newLog] = await db
      .insert(tgmActivityLogs)
      .values(activityData)
      .returning();
    return newLog;
  }

  // Order and delivery tracking methods
  async createOrder(orderData: any): Promise<any> {
    try {
      // Generate unique order number
      const orderNumber = `TGM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Handle different order structures (online vs in-store)
      let subtotal, deliveryFee, total, customerInfo, deliveryAddress;
      
      if (orderData.customerInfo) {
        // Online order structure
        subtotal = parseFloat(orderData.subtotal);
        deliveryFee = parseFloat(orderData.deliveryFee || "0");
        total = subtotal + deliveryFee;
        customerInfo = orderData.customerInfo;
        deliveryAddress = `${customerInfo.address}, ${customerInfo.city}`;
      } else {
        // In-store order structure
        subtotal = parseFloat(orderData.total || "0");
        deliveryFee = 0;
        total = subtotal;
        customerInfo = {
          name: orderData.customerName,
          phone: orderData.customerPhone,
          email: orderData.customerEmail
        };
        deliveryAddress = orderData.deliveryAddress || "TGM Store - In-Store Pickup";
      }

      // Create customer record if needed (required for credit orders)
      let customerId = null;
      if (customerInfo.email || orderData.paymentMethod === "credit") {
        try {
          const customerData = {
            firstName: customerInfo.firstName || customerInfo.name || orderData.customerName || "Customer",
            lastName: customerInfo.lastName || "",
            email: customerInfo.email || `customer_${Date.now()}@tgm.local`,
            phone: customerInfo.phone || orderData.customerPhone,
            address: deliveryAddress
          };
          
          const [customer] = await db.insert(customers).values(customerData)
            .onConflictDoUpdate({
              target: customers.email,
              set: {
                firstName: customerData.firstName,
                phone: customerData.phone,
                address: customerData.address,
                updatedAt: new Date()
              }
            }).returning();
          
          customerId = customer.id;
        } catch (error) {
          console.log("Customer creation error:", error);
          // For credit orders, this is critical, so we create a fallback
          if (orderData.paymentMethod === "credit") {
            throw new Error("Customer record creation is required for credit orders");
          }
        }
      }

      // Create order record
      const orderRecord = {
        customerId,
        customerName: `${customerInfo.firstName || customerInfo.name || orderData.customerName || "Customer"} ${customerInfo.lastName || ""}`.trim(),
        customerPhone: customerInfo.phone || orderData.customerPhone,
        customerEmail: customerInfo.email || orderData.customerEmail,
        orderNumber,
        status: orderData.orderType === "in_store" ? "Processing" : "confirmed",
        orderType: orderData.orderType || (orderData.customerInfo?.isWholesalePartner ? "wholesale" : "retail"),
        subtotal: subtotal.toString(),
        deliveryFee: deliveryFee.toString(),
        total: total.toString(),
        paymentStatus: "paid",
        paymentMethod: orderData.paymentMethod,
        deliveryOption: orderData.deliveryOption,
        deliveryAddress: deliveryAddress,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        notes: orderData.notes || "",
        blockchainHash: `blockchain_${orderNumber}_${Date.now()}`
      };

      const [order] = await db.insert(orders).values(orderRecord).returning();

      // Handle credit payment - create creditor record
      if (orderData.paymentMethod === "credit") {
        if (!customerId) {
          throw new Error("Customer ID is required for credit orders");
        }
        
        const downPayment = parseFloat(orderData.downPayment || "0");
        const outstandingBalance = total - downPayment;
        
        if (outstandingBalance > 0) {
          const creditorData: InsertCreditor = {
            customerId: customerId,
            orderId: order.id,
            customerName: customerInfo.name || orderData.customerName,
            customerPhone: customerInfo.phone || orderData.customerPhone,
            customerEmail: customerInfo.email || orderData.customerEmail,
            productDetails: orderData.items || [],
            totalAmount: total.toString(),
            downPayment: downPayment.toString(),
            outstandingBalance: outstandingBalance.toString(),
            paymentTerms: orderData.paymentTerms || "monthly",
            installmentAmount: orderData.installmentAmount || Math.ceil(outstandingBalance / 6).toString(), // Default 6 months
            nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            finalPaymentDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
            notes: orderData.creditNotes || "",
            createdBy: orderData.createdBy || null
          };

          await this.createCreditor(creditorData);
        }
      }

      // Create delivery tracking record
      const trackingNumber = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const deliveryRecord = {
        orderId: order.id,
        deliveryMethod: orderData.deliveryOption,
        status: "confirmed",
        trackingNumber,
        driverName: "Michael Johnson",
        driverPhone: "+231-888-999-777",
        vehicleInfo: "Toyota Truck - LBR-2024-TGM",
        currentLocation: "TGM Warehouse, Monrovia",
        coordinates: JSON.stringify({ lat: 6.3106, lng: -10.8048 }),
        estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        blockchainHash: `delivery_${trackingNumber}_${Date.now()}`
      };

      const [delivery] = await db.insert(deliveries).values(deliveryRecord).returning();

      return {
        order,
        delivery,
        orderNumber,
        trackingNumber
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<any> {
    try {
      const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
      if (!order) return null;

      const [delivery] = await db.select().from(deliveries).where(eq(deliveries.orderId, order.id));
      
      return {
        order,
        delivery
      };
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  }

  async getAllOrders(): Promise<any[]> {
    try {
      const allOrders = await db.select().from(orders).orderBy(orders.createdAt);
      return allOrders;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return [];
    }
  }

  async getAllDeliveries(): Promise<any[]> {
    try {
      const allDeliveries = await db.select().from(deliveries).orderBy(deliveries.createdAt);
      return allDeliveries;
    } catch (error) {
      console.error("Error fetching all deliveries:", error);
      return [];
    }
  }

  async createDelivery(deliveryData: any): Promise<any> {
    const [delivery] = await db.insert(deliveries).values(deliveryData).returning();
    return delivery;
  }

  async updateDeliveryStatus(trackingNumber: string, status: string, location?: string): Promise<any> {
    try {
      const updateData: any = { 
        status,
        updatedAt: new Date()
      };
      
      if (location) {
        updateData.currentLocation = location;
      }
      
      if (status === "delivered") {
        updateData.actualDelivery = new Date();
      }

      const [delivery] = await db
        .update(deliveries)
        .set(updateData)
        .where(eq(deliveries.trackingNumber, trackingNumber))
        .returning();
        
      return delivery;
    } catch (error) {
      console.error("Error updating delivery status:", error);
      throw error;
    }
  }



  async updateDelivery(deliveryId: number, updateData: any): Promise<any> {
    const [delivery] = await db
      .update(deliveries)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(deliveries.id, deliveryId))
      .returning();
    
    return delivery;
  }

  // Content Management System methods for GM control
  async getCarouselSlides(): Promise<CarouselSlide[]> {
    return await db.select().from(carouselSlides).orderBy(carouselSlides.order);
  }

  async createCarouselSlide(slideData: InsertCarouselSlide): Promise<CarouselSlide> {
    const [slide] = await db.insert(carouselSlides).values(slideData).returning();
    return slide;
  }

  async updateCarouselSlide(id: number, slideData: Partial<InsertCarouselSlide>): Promise<CarouselSlide> {
    const [slide] = await db.update(carouselSlides)
      .set({ ...slideData, updatedAt: new Date() })
      .where(eq(carouselSlides.id, id))
      .returning();
    return slide;
  }

  async deleteCarouselSlide(id: number): Promise<void> {
    await db.delete(carouselSlides).where(eq(carouselSlides.id, id));
  }

  async getWebsiteContent(): Promise<WebsiteContent[]> {
    return await db.select().from(websiteContent);
  }

  async updateWebsiteContent(contentData: InsertWebsiteContent): Promise<WebsiteContent> {
    const existing = await db.select().from(websiteContent)
      .where(and(eq(websiteContent.section, contentData.section), eq(websiteContent.key, contentData.key)));
    
    if (existing.length > 0) {
      const [content] = await db.update(websiteContent)
        .set({ ...contentData, updatedAt: new Date() })
        .where(and(eq(websiteContent.section, contentData.section), eq(websiteContent.key, contentData.key)))
        .returning();
      return content;
    } else {
      const [content] = await db.insert(websiteContent).values(contentData).returning();
      return content;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.name);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db.update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Role-based access methods for staff
  async updateOrderStatus(id: number, updates: any): Promise<any> {
    const [order] = await db.update(orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async updateDeliveryById(id: number, updates: any): Promise<any> {
    const [delivery] = await db.update(deliveries)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(deliveries.id, id))
      .returning();
    return delivery;
  }

  // Credit Management System implementation
  async createCreditor(creditorData: InsertCreditor): Promise<Creditor> {
    const [creditor] = await db
      .insert(creditors)
      .values(creditorData)
      .returning();
    return creditor;
  }

  async getAllCreditors(): Promise<Creditor[]> {
    return await db.select().from(creditors).orderBy(creditors.createdAt);
  }

  async getCreditorById(id: number): Promise<Creditor | undefined> {
    const [creditor] = await db.select().from(creditors).where(eq(creditors.id, id));
    return creditor;
  }

  async getCreditorsByCustomer(customerPhone: string, customerName: string): Promise<Creditor[]> {
    const result = await db.select()
      .from(creditors)
      .where(
        and(
          eq(creditors.customerPhone, customerPhone),
          eq(creditors.customerName, customerName)
        )
      )
      .orderBy(creditors.createdAt);
    return result;
  }



  async updateCreditorBalance(id: number, newBalance: number, nextPaymentDate?: Date): Promise<Creditor | undefined> {
    const updateData: any = { 
      outstandingBalance: newBalance.toString(),
      updatedAt: new Date()
    };
    
    if (nextPaymentDate) updateData.nextPaymentDate = nextPaymentDate;
    if (newBalance <= 0) updateData.status = "paid_off";

    const [creditor] = await db
      .update(creditors)
      .set(updateData)
      .where(eq(creditors.id, id))
      .returning();
    return creditor;
  }

  async createCreditPayment(paymentData: InsertCreditPayment): Promise<CreditPayment> {
    const [payment] = await db
      .insert(creditPayments)
      .values(paymentData)
      .returning();
    return payment;
  }

  async getCreditPaymentsByCreditor(creditorId: number): Promise<CreditPayment[]> {
    return await db.select().from(creditPayments)
      .where(eq(creditPayments.creditorId, creditorId))
      .orderBy(creditPayments.paymentDate);
  }

  async processCustomerPayment(
    creditorId: number, 
    paymentAmount: number, 
    paymentMethod: string, 
    transactionId?: string, 
    processedBy?: number
  ): Promise<{ payment: CreditPayment, updatedCreditor: Creditor }> {
    // Get current creditor record
    const creditor = await this.getCreditorById(creditorId);
    if (!creditor) throw new Error("Creditor not found");

    const currentBalance = parseFloat(creditor.outstandingBalance);
    const newBalance = Math.max(0, currentBalance - paymentAmount);

    // Create payment record - only include processedBy if it's a valid user ID
    const paymentData: InsertCreditPayment = {
      creditorId,
      customerId: creditor.customerId,
      paymentAmount: paymentAmount.toString(),
      paymentMethod,
      transactionId,
      remainingBalance: newBalance.toString(),
      blockchainHash: `payment_${creditorId}_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`
    };

    // Only set processedBy if it's a valid user ID (not 0 or undefined)
    if (processedBy && processedBy > 0) {
      paymentData.processedBy = processedBy;
    }

    const payment = await this.createCreditPayment(paymentData);

    // Calculate next payment date based on payment terms
    let nextPaymentDate: Date | undefined;
    if (newBalance > 0) {
      const now = new Date();
      switch (creditor.paymentTerms) {
        case "weekly":
          nextPaymentDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case "bi_weekly":
          nextPaymentDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          nextPaymentDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
          break;
      }
    }

    // Update creditor balance
    const updatedCreditor = await this.updateCreditorBalance(creditorId, newBalance, nextPaymentDate);
    if (!updatedCreditor) throw new Error("Failed to update creditor balance");

    return { payment, updatedCreditor };
  }

  // Order methods for customer dashboard
  async getOrdersByCustomer(customerPhone: string, customerName: string): Promise<Order[]> {
    const result = await db.select()
      .from(orders)
      .where(
        and(
          eq(orders.customerPhone, customerPhone),
          eq(orders.customerName, customerName)
        )
      )
      .orderBy(orders.createdAt);
    return result;
  }

  // Subsidiary Email Management
  async getSubsidiaryEmails(): Promise<SubsidiaryEmail[]> {
    const result = await db.select().from(subsidiaryEmails).orderBy(subsidiaryEmails.subsidiaryName);
    return result;
  }

  async createSubsidiaryEmail(emailData: InsertSubsidiaryEmail): Promise<SubsidiaryEmail> {
    emailData.updatedAt = new Date();
    const [result] = await db.insert(subsidiaryEmails).values(emailData).returning();
    return result;
  }

  async updateSubsidiaryEmail(id: number, emailData: Partial<InsertSubsidiaryEmail>): Promise<SubsidiaryEmail> {
    emailData.updatedAt = new Date();
    const [result] = await db.update(subsidiaryEmails)
      .set(emailData)
      .where(eq(subsidiaryEmails.id, id))
      .returning();
    return result;
  }

  async deleteSubsidiaryEmail(id: number): Promise<void> {
    await db.delete(subsidiaryEmails).where(eq(subsidiaryEmails.id, id));
  }

  async getSubsidiaryEmailBySubsidiaryId(subsidiaryId: string): Promise<SubsidiaryEmail | undefined> {
    const [result] = await db.select()
      .from(subsidiaryEmails)
      .where(eq(subsidiaryEmails.subsidiaryId, subsidiaryId));
    return result;
  }

  // HRMIS (Human Resource Management Information System) Methods
  
  // Employee Management
  async getAllEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(employees.employeeId);
  }

  async getEmployeeById(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.employeeId, employeeId));
    return employee || undefined;
  }

  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    return await db.select().from(employees).where(eq(employees.department, department));
  }

  async getActiveEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).where(eq(employees.employmentStatus, 'active'));
  }

  async createEmployee(employeeData: InsertEmployee): Promise<Employee> {
    const [employee] = await db
      .insert(employees)
      .values(employeeData)
      .returning();
    return employee;
  }

  async updateEmployee(id: number, updates: Partial<Employee>): Promise<Employee | undefined> {
    const [employee] = await db
      .update(employees)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return employee || undefined;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    try {
      await db.delete(employees).where(eq(employees.id, id));
      return true;
    } catch (error) {
      return false;
    }
  }

  // Attendance Management
  async getAttendanceByEmployee(employeeId: number, startDate?: Date, endDate?: Date): Promise<Attendance[]> {
    let query = db.select().from(attendance).where(eq(attendance.employeeId, employeeId));
    return await query.orderBy(attendance.date);
  }

  async getAllAttendance(date?: Date): Promise<Attendance[]> {
    return await db.select().from(attendance).orderBy(attendance.date);
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [attendance_record] = await db
      .insert(attendance)
      .values(attendanceData)
      .returning();
    return attendance_record;
  }

  async updateAttendance(id: number, updates: Partial<Attendance>): Promise<Attendance | undefined> {
    const [attendance_record] = await db
      .update(attendance)
      .set(updates)
      .where(eq(attendance.id, id))
      .returning();
    return attendance_record || undefined;
  }

  // Leave Request Management
  async getLeaveRequestsByEmployee(employeeId: number): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, employeeId));
  }

  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).orderBy(leaveRequests.appliedDate);
  }

  async getPendingLeaveRequests(): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).where(eq(leaveRequests.status, 'pending'));
  }

  async createLeaveRequest(leaveData: InsertLeaveRequest): Promise<LeaveRequest> {
    const [leaveRequest] = await db
      .insert(leaveRequests)
      .values(leaveData)
      .returning();
    return leaveRequest;
  }

  async updateLeaveRequest(id: number, updates: Partial<LeaveRequest>): Promise<LeaveRequest | undefined> {
    const [leaveRequest] = await db
      .update(leaveRequests)
      .set(updates)
      .where(eq(leaveRequests.id, id))
      .returning();
    return leaveRequest || undefined;
  }

  // Payroll Management
  async getPayrollByEmployee(employeeId: number): Promise<Payroll[]> {
    return await db.select().from(payroll).where(eq(payroll.employeeId, employeeId));
  }

  async getAllPayroll(): Promise<Payroll[]> {
    return await db.select().from(payroll).orderBy(payroll.payPeriodStart);
  }

  async createPayroll(payrollData: InsertPayroll): Promise<Payroll> {
    const [payroll_record] = await db
      .insert(payroll)
      .values(payrollData)
      .returning();
    return payroll_record;
  }

  async updatePayroll(id: number, updates: Partial<Payroll>): Promise<Payroll | undefined> {
    const [payroll_record] = await db
      .update(payroll)
      .set(updates)
      .where(eq(payroll.id, id))
      .returning();
    return payroll_record || undefined;
  }

  // Performance Review Management
  async getPerformanceReviewsByEmployee(employeeId: number): Promise<PerformanceReview[]> {
    return await db.select().from(performanceReviews).where(eq(performanceReviews.employeeId, employeeId));
  }

  async getAllPerformanceReviews(): Promise<PerformanceReview[]> {
    return await db.select().from(performanceReviews).orderBy(performanceReviews.reviewDate);
  }

  async getPerformanceReviewsByReviewer(reviewerId: number): Promise<PerformanceReview[]> {
    return await db.select().from(performanceReviews).where(eq(performanceReviews.reviewerId, reviewerId));
  }

  async createPerformanceReview(reviewData: InsertPerformanceReview): Promise<PerformanceReview> {
    const [review] = await db
      .insert(performanceReviews)
      .values(reviewData)
      .returning();
    return review;
  }

  async updatePerformanceReview(id: number, updates: Partial<PerformanceReview>): Promise<PerformanceReview | undefined> {
    const [review] = await db
      .update(performanceReviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(performanceReviews.id, id))
      .returning();
    return review || undefined;
  }

  // ===== Catering Operations Management =====
  async getCateringStaffByUsername(username: string): Promise<CateringStaff | undefined> {
    const [staff] = await db.select().from(cateringStaff).where(eq(cateringStaff.username, username));
    return staff || undefined;
  }

  async getCateringStaffById(id: number): Promise<CateringStaff | undefined> {
    const [staff] = await db.select().from(cateringStaff).where(eq(cateringStaff.id, id));
    return staff || undefined;
  }

  async getAllCateringStaff(): Promise<CateringStaff[]> {
    return await db.select().from(cateringStaff).where(eq(cateringStaff.isActive, true));
  }

  async createCateringStaff(staff: InsertCateringStaff): Promise<CateringStaff> {
    const [created] = await db.insert(cateringStaff).values(staff).returning();
    return created;
  }

  async updateCateringStaff(id: number, updates: Partial<CateringStaff>): Promise<CateringStaff | undefined> {
    const [updated] = await db.update(cateringStaff).set(updates).where(eq(cateringStaff.id, id)).returning();
    return updated || undefined;
  }

  async createCateringRequest(request: InsertCateringRequest): Promise<CateringRequest> {
    const [created] = await db.insert(cateringRequests).values(request).returning();
    return created;
  }

  async getCateringRequests(): Promise<CateringRequest[]> {
    return await db.select().from(cateringRequests).orderBy(desc(cateringRequests.createdAt));
  }

  async getCateringRequestById(id: number): Promise<CateringRequest | undefined> {
    const [req] = await db.select().from(cateringRequests).where(eq(cateringRequests.id, id));
    return req || undefined;
  }

  async updateCateringRequest(id: number, updates: Partial<CateringRequest>): Promise<CateringRequest | undefined> {
    const [updated] = await db.update(cateringRequests).set({ ...updates, updatedAt: new Date() }).where(eq(cateringRequests.id, id)).returning();
    return updated || undefined;
  }

  async deleteCateringRequest(id: number): Promise<boolean> {
    const result = await db.delete(cateringRequests).where(eq(cateringRequests.id, id)).returning();
    return result.length > 0;
  }

  async createCateringEvent(event: InsertCateringEvent): Promise<CateringEvent> {
    const [created] = await db.insert(cateringEvents).values(event).returning();
    return created;
  }

  async getCateringEvents(): Promise<CateringEvent[]> {
    return await db.select().from(cateringEvents).orderBy(desc(cateringEvents.createdAt));
  }

  async getCateringEventById(id: number): Promise<CateringEvent | undefined> {
    const [ev] = await db.select().from(cateringEvents).where(eq(cateringEvents.id, id));
    return ev || undefined;
  }

  async updateCateringEvent(id: number, updates: Partial<CateringEvent>): Promise<CateringEvent | undefined> {
    const [updated] = await db.update(cateringEvents).set({ ...updates, updatedAt: new Date() }).where(eq(cateringEvents.id, id)).returning();
    return updated || undefined;
  }

  async createCateringTask(task: InsertCateringTask): Promise<CateringTask> {
    const [created] = await db.insert(cateringTasks).values(task).returning();
    return created;
  }

  async getCateringTasks(filters?: { role?: string; eventId?: number; status?: string }): Promise<CateringTask[]> {
    let query = db.select().from(cateringTasks);
    const conditions = [];
    if (filters?.role) conditions.push(eq(cateringTasks.role, filters.role));
    if (filters?.eventId) conditions.push(eq(cateringTasks.eventId, filters.eventId));
    if (filters?.status) conditions.push(eq(cateringTasks.status, filters.status));
    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(cateringTasks.createdAt));
    }
    return await query.orderBy(desc(cateringTasks.createdAt));
  }

  async updateCateringTask(id: number, updates: Partial<CateringTask>): Promise<CateringTask | undefined> {
    const [updated] = await db.update(cateringTasks).set(updates).where(eq(cateringTasks.id, id)).returning();
    return updated || undefined;
  }

  async createCateringIncident(incident: InsertCateringIncident): Promise<CateringIncident> {
    const [created] = await db.insert(cateringIncidents).values(incident).returning();
    return created;
  }

  async getCateringIncidents(eventId?: number): Promise<CateringIncident[]> {
    if (eventId) {
      return await db.select().from(cateringIncidents).where(eq(cateringIncidents.eventId, eventId)).orderBy(desc(cateringIncidents.createdAt));
    }
    return await db.select().from(cateringIncidents).orderBy(desc(cateringIncidents.createdAt));
  }

  async updateCateringIncident(id: number, updates: Partial<CateringIncident>): Promise<CateringIncident | undefined> {
    const [updated] = await db.update(cateringIncidents).set(updates).where(eq(cateringIncidents.id, id)).returning();
    return updated || undefined;
  }

  async createCateringQuotation(quotation: InsertCateringQuotation): Promise<CateringQuotation> {
    const [created] = await db.insert(cateringQuotations).values(quotation).returning();
    return created;
  }

  async getCateringQuotations(): Promise<CateringQuotation[]> {
    return await db.select().from(cateringQuotations).orderBy(desc(cateringQuotations.createdAt));
  }

  async getCateringQuotationById(id: number): Promise<CateringQuotation | undefined> {
    const [q] = await db.select().from(cateringQuotations).where(eq(cateringQuotations.id, id));
    return q || undefined;
  }

  async getCateringQuotationsByRequestId(requestId: number): Promise<CateringQuotation[]> {
    return await db.select().from(cateringQuotations).where(eq(cateringQuotations.requestId, requestId)).orderBy(desc(cateringQuotations.createdAt));
  }

  async updateCateringQuotation(id: number, updates: Partial<CateringQuotation>): Promise<CateringQuotation | undefined> {
    const [updated] = await db.update(cateringQuotations).set({ ...updates, updatedAt: new Date() }).where(eq(cateringQuotations.id, id)).returning();
    return updated || undefined;
  }

  // Cargo Operations
  async getCargoShipments(): Promise<CargoShipment[]> {
    return await db.select().from(cargoShipments).orderBy(desc(cargoShipments.createdAt));
  }

  async getCargoShipmentByTracking(trackingNumber: string): Promise<CargoShipment | undefined> {
    const [shipment] = await db.select().from(cargoShipments).where(eq(cargoShipments.trackingNumber, trackingNumber));
    return shipment || undefined;
  }

  async createCargoShipment(shipment: InsertCargoShipment): Promise<CargoShipment> {
    const [created] = await db.insert(cargoShipments).values(shipment).returning();
    return created;
  }

  // Petroleum Operations
  async getPetroleumOrders(): Promise<PetroleumOrder[]> {
    return await db.select().from(petroleumOrders).orderBy(desc(petroleumOrders.createdAt));
  }

  async createPetroleumOrder(order: InsertPetroleumOrder): Promise<PetroleumOrder> {
    const [created] = await db.insert(petroleumOrders).values(order).returning();
    return created;
  }

  // Equipment Rental Operations
  async getEquipmentRentals(): Promise<EquipmentRental[]> {
    return await db.select().from(equipmentRentals).orderBy(desc(equipmentRentals.createdAt));
  }

  async createEquipmentRental(rental: InsertEquipmentRental): Promise<EquipmentRental> {
    const [created] = await db.insert(equipmentRentals).values(rental).returning();
    return created;
  }

  // Stationery Operations
  async getStationeryOrders(): Promise<StationeryOrder[]> {
    return await db.select().from(stationeryOrders).orderBy(desc(stationeryOrders.createdAt));
  }

  async createStationeryOrder(order: InsertStationeryOrder): Promise<StationeryOrder> {
    const [created] = await db.insert(stationeryOrders).values(order).returning();
    return created;
  }

  // Solar Audit Operations
  async getSolarAudits(): Promise<SolarAudit[]> {
    return await db.select().from(solarAudits).orderBy(desc(solarAudits.createdAt));
  }

  async createSolarAudit(audit: InsertSolarAudit): Promise<SolarAudit> {
    const [created] = await db.insert(solarAudits).values(audit).returning();
    return created;
  }

  // Institutional Contracts Operations
  async getInstitutionalContracts(): Promise<InstitutionalContract[]> {
    return await db.select().from(institutionalContracts).orderBy(desc(institutionalContracts.createdAt));
  }

  async createInstitutionalContract(contract: InsertInstitutionalContract): Promise<InstitutionalContract> {
    const [created] = await db.insert(institutionalContracts).values(contract).returning();
    return created;
  }

  // Group CRM Party Master Operations
  async getParties(): Promise<PartyMaster[]> {
    return await db.select().from(partyMaster).orderBy(desc(partyMaster.createdAt));
  }

  async createParty(party: InsertPartyMaster): Promise<PartyMaster> {
    const [created] = await db.insert(partyMaster).values(party).returning();
    return created;
  }

  // Enterprise Event Bus Operations
  async getEnterpriseEvents(): Promise<EnterpriseEvent[]> {
    return await db.select().from(enterpriseEvents).orderBy(desc(enterpriseEvents.createdAt));
  }

  async publishEnterpriseEvent(event: InsertEnterpriseEvent): Promise<EnterpriseEvent> {
    const [published] = await db.insert(enterpriseEvents).values(event).returning();
    return published;
  }
}

export const storage = new DatabaseStorage();


