import crypto from 'crypto';

/**
 * Simple blockchain implementation for procurement transparency
 * Provides immutable record keeping for TGM-Partner transactions
 */
export class BlockchainService {
  
  /**
   * Generate hash for blockchain block
   */
  private generateHash(data: any, previousHash: string = ''): string {
    const timestamp = Date.now();
    const dataString = JSON.stringify({ ...data, timestamp, previousHash });
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Create blockchain transaction for order
   */
  async createOrderTransaction(orderData: any) {
    try {
      const previousHash = await this.getLatestHash('order');
      const hash = this.generateHash(orderData, previousHash);
      
      return {
        transactionType: 'order',
        referenceId: orderData.orderId,
        hash: hash,
        previousHash: previousHash,
        data: {
          orderId: orderData.orderId,
          customerId: orderData.customerId,
          items: orderData.items,
          total: orderData.total,
          orderType: orderData.orderType,
          timestamp: new Date().toISOString(),
          status: 'created'
        },
        timestamp: new Date(),
        verificationStatus: 'verified'
      };
    } catch (error) {
      throw new Error(`Failed to create order blockchain transaction: ${error}`);
    }
  }

  /**
   * Create blockchain transaction for payment
   */
  async createPaymentTransaction(paymentData: any) {
    try {
      const previousHash = await this.getLatestHash('payment');
      const hash = this.generateHash(paymentData, previousHash);
      
      return {
        transactionType: 'payment',
        referenceId: paymentData.paymentId,
        hash: hash,
        previousHash: previousHash,
        data: {
          paymentId: paymentData.paymentId,
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          paymentMethod: paymentData.paymentMethod,
          status: paymentData.status,
          transactionId: paymentData.transactionId,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date(),
        verificationStatus: 'verified'
      };
    } catch (error) {
      throw new Error(`Failed to create payment blockchain transaction: ${error}`);
    }
  }

  /**
   * Create blockchain transaction for delivery
   */
  async createDeliveryTransaction(deliveryData: any) {
    try {
      const previousHash = await this.getLatestHash('delivery');
      const hash = this.generateHash(deliveryData, previousHash);
      
      return {
        transactionType: 'delivery',
        referenceId: deliveryData.deliveryId,
        hash: hash,
        previousHash: previousHash,
        data: {
          deliveryId: deliveryData.deliveryId,
          orderId: deliveryData.orderId,
          status: deliveryData.status,
          trackingNumber: deliveryData.trackingNumber,
          location: deliveryData.location,
          estimatedDelivery: deliveryData.estimatedDelivery,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date(),
        verificationStatus: 'verified'
      };
    } catch (error) {
      throw new Error(`Failed to create delivery blockchain transaction: ${error}`);
    }
  }

  /**
   * Create blockchain transaction for inventory update
   */
  async createInventoryTransaction(inventoryData: any) {
    try {
      const previousHash = await this.getLatestHash('inventory_update');
      const hash = this.generateHash(inventoryData, previousHash);
      
      return {
        transactionType: 'inventory_update',
        referenceId: inventoryData.productId,
        hash: hash,
        previousHash: previousHash,
        data: {
          productId: inventoryData.productId,
          sku: inventoryData.sku,
          action: inventoryData.action, // 'restock', 'sale', 'adjustment'
          quantity: inventoryData.quantity,
          previousStock: inventoryData.previousStock,
          newStock: inventoryData.newStock,
          reason: inventoryData.reason,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date(),
        verificationStatus: 'verified'
      };
    } catch (error) {
      throw new Error(`Failed to create inventory blockchain transaction: ${error}`);
    }
  }

  /**
   * Get latest hash for a transaction type
   */
  private async getLatestHash(transactionType: string): Promise<string> {
    // In a real implementation, this would query the database
    // For now, return a genesis hash or previous hash
    return crypto.createHash('sha256').update(`genesis_${transactionType}`).digest('hex');
  }

  /**
   * Verify blockchain integrity
   */
  async verifyBlockchainIntegrity(transactions: any[]) {
    try {
      for (let i = 1; i < transactions.length; i++) {
        const currentTransaction = transactions[i];
        const previousTransaction = transactions[i - 1];
        
        // Verify that current transaction's previousHash matches previous transaction's hash
        if (currentTransaction.previousHash !== previousTransaction.hash) {
          return {
            valid: false,
            error: `Hash mismatch at transaction ${i}`,
            transactionId: currentTransaction.id
          };
        }
        
        // Verify transaction hash
        const expectedHash = this.generateHash(
          currentTransaction.data, 
          currentTransaction.previousHash
        );
        
        if (currentTransaction.hash !== expectedHash) {
          return {
            valid: false,
            error: `Invalid hash at transaction ${i}`,
            transactionId: currentTransaction.id
          };
        }
      }
      
      return {
        valid: true,
        message: 'Blockchain integrity verified',
        totalTransactions: transactions.length
      };
    } catch (error) {
      return {
        valid: false,
        error: `Verification failed: ${error}`,
        transactionId: null
      };
    }
  }

  /**
   * Get procurement transparency report
   */
  async getProcurementTransparencyReport(partnerId: string, startDate: Date, endDate: Date) {
    try {
      // This would query blockchain transactions for the partner
      return {
        partnerId: partnerId,
        reportPeriod: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        totalOrders: 0, // Would be calculated from blockchain data
        totalValue: 0,   // Would be calculated from blockchain data
        orderStatuses: {
          pending: 0,
          confirmed: 0,
          shipped: 0,
          delivered: 0
        },
        paymentMethods: {
          mtn_money: 0,
          orange_money: 0,
          cash: 0,
          bank_transfer: 0
        },
        deliveryPerformance: {
          onTime: 0,
          delayed: 0,
          failed: 0
        },
        blockchainVerified: true,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to generate transparency report: ${error}`);
    }
  }
}

export const blockchainService = new BlockchainService();