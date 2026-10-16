/**
 * ============================================================
 * Payment Module & Provider Interface
 * Gateway-ready structure for future API integration.
 * Currently uses manual verification mode with localStorage.
 *
 * To add a real payment gateway:
 * 1. Create a new class implementing PaymentProvider
 * 2. Add it to the providers map in PaymentService
 * 3. Set API keys via environment variables (never hardcode)
 * ============================================================
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const paymentModule = factory();
    root.PaymentProvider = paymentModule.PaymentProvider;
    root.ManualPaymentProvider = paymentModule.ManualPaymentProvider;
    root.EasypaisaProvider = paymentModule.EasypaisaProvider;
    root.JazzCashProvider = paymentModule.JazzCashProvider;
    root.PaymentService = paymentModule.PaymentService;
  }
})(typeof self !== 'undefined' ? self : this, function () {

  /**
   * Base Payment Provider Interface
   */
  class PaymentProvider {
    constructor(config = {}) {
      this.config = config;
    }

    /**
     * Submit payment for an order
     * @param {Object} orderData
     * @returns {Promise<Object>}
     */
    async submitPayment(orderData) {
      throw new Error('submitPayment() must be implemented by payment provider subclass');
    }

    /**
     * Check payment status
     * @param {string} orderId
     * @returns {Promise<Object>}
     */
    async checkStatus(orderId) {
      throw new Error('checkStatus() must be implemented by payment provider subclass');
    }

    /**
     * Retrieve provider payment instructions
     * @returns {string[]}
     */
    getInstructions() {
      throw new Error('getInstructions() must be implemented by payment provider subclass');
    }
  }

  /**
   * Manual Payment Provider
   * Handles Pakistani mobile wallet payments (Easypaisa / JazzCash) via manual TID verification.
   * Stores orders in localStorage and simulates asynchronous gateway communication.
   */
  class ManualPaymentProvider extends PaymentProvider {
    constructor(config = {}) {
      super(config);
      this.storageKey = 'dns_orders';
    }

    /**
     * Read all orders from localStorage safely
     * @returns {Array<Object>}
     */
    _readOrders() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.warn('[ManualPaymentProvider] Failed to read from localStorage:', err);
        return [];
      }
    }

    /**
     * Write orders array to localStorage safely
     * @param {Array<Object>} orders
     */
    _writeOrders(orders) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(orders));
      } catch (err) {
        console.error('[ManualPaymentProvider] Failed to save to localStorage:', err);
        // If quota exceeded (due to screenshot dataURL), try saving without screenshot
        if (err.name === 'QuotaExceededError') {
          try {
            const stripped = orders.map((o) => ({ ...o, screenshot: null }));
            localStorage.setItem(this.storageKey, JSON.stringify(stripped));
            console.warn('[ManualPaymentProvider] Saved orders without screenshot data due to storage limit');
          } catch (retryErr) {
            console.error('[ManualPaymentProvider] Retry write failed:', retryErr);
          }
        }
      }
    }

    /**
     * Submit payment order
     * @param {Object} orderData
     * @returns {Promise<{success: boolean, orderId: string, order: Object}>}
     */
    async submitPayment(orderData) {
      // Simulate network latency (300-600ms)
      await new Promise((resolve) => setTimeout(resolve, 450));

      if (!orderData || !orderData.orderId) {
        throw new Error('Invalid order data: orderId is required.');
      }

      // Ensure proper structure matching design requirement:
      const standardizedOrder = {
        orderId: orderData.orderId,
        plan: orderData.plan,
        amount: Number(orderData.amount) || 0,
        customerName: orderData.customerName || '',
        email: orderData.email || '',
        phone: orderData.phone || '',
        device: orderData.device || 'ios',
        paymentMethod: orderData.paymentMethod || 'easypaisa',
        transactionId: orderData.transactionId || '',
        status: orderData.status || 'pending',
        createdAt: orderData.createdAt || new Date().toISOString(),
        screenshot: orderData.screenshot || null,
        // Additional helpful fields
        planName: orderData.planName || '',
        currency: orderData.currency || 'PKR',
        updatedAt: new Date().toISOString(),
      };

      const orders = this._readOrders();
      // Replace if existing order with same ID, else prepend
      const existingIdx = orders.findIndex((o) => o.orderId === standardizedOrder.orderId);
      if (existingIdx >= 0) {
        orders[existingIdx] = standardizedOrder;
      } else {
        orders.unshift(standardizedOrder);
      }

      this._writeOrders(orders);

      return {
        success: true,
        orderId: standardizedOrder.orderId,
        order: standardizedOrder,
      };
    }

    /**
     * Check order status
     * @param {string} orderId
     * @returns {Promise<{success: boolean, status: string, order: Object|null}>}
     */
    async checkStatus(orderId) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const orders = this._readOrders();
      const order = orders.find((o) => o.orderId === orderId);

      if (!order) {
        return {
          success: false,
          status: 'not_found',
          order: null,
        };
      }

      return {
        success: true,
        status: order.status, // 'pending' | 'approved' | 'rejected'
        order: order,
      };
    }

    /**
     * Get instructions for this payment method
     * @returns {string[]}
     */
    getInstructions() {
      return this.config.instructions || [];
    }
  }

  /**
   * Easypaisa Provider
   * Placeholder for official Easypaisa Merchant / Open API
   * When integrating official API:
   *   API_KEY should come from environment: process.env.EASYPAISA_API_KEY
   */
  class EasypaisaProvider extends PaymentProvider {
    constructor(config = {}) {
      super(config);
      this.manualProvider = new ManualPaymentProvider(config);
    }

    async submitPayment(orderData) {
      console.log('[Easypaisa Gateway] Submitting order to Easypaisa handler:', {
        orderId: orderData.orderId,
        amount: orderData.amount,
        phone: orderData.phone,
        transactionId: orderData.transactionId,
      });

      // When backend API exists:
      // return fetch('/api/payments/easypaisa', { method: 'POST', body: JSON.stringify(orderData) });

      // Fallback to manual verification
      return this.manualProvider.submitPayment(orderData);
    }

    async checkStatus(orderId) {
      return this.manualProvider.checkStatus(orderId);
    }

    getInstructions() {
      return this.manualProvider.getInstructions();
    }
  }

  /**
   * JazzCash Provider
   * Placeholder for official JazzCash Merchant API
   * When integrating official API:
   *   MERCHANT_ID & PASSWORD should come from backend environment variables
   */
  class JazzCashProvider extends PaymentProvider {
    constructor(config = {}) {
      super(config);
      this.manualProvider = new ManualPaymentProvider(config);
    }

    async submitPayment(orderData) {
      console.log('[JazzCash Gateway] Submitting order to JazzCash handler:', {
        orderId: orderData.orderId,
        amount: orderData.amount,
        phone: orderData.phone,
        transactionId: orderData.transactionId,
      });

      // When backend API exists:
      // return fetch('/api/payments/jazzcash', { method: 'POST', body: JSON.stringify(orderData) });

      // Fallback to manual verification
      return this.manualProvider.submitPayment(orderData);
    }

    async checkStatus(orderId) {
      return this.manualProvider.checkStatus(orderId);
    }

    getInstructions() {
      return this.manualProvider.getInstructions();
    }
  }

  /**
   * PaymentService
   * Central orchestrator managing payment provider registration and order processing.
   */
  const PaymentService = {
    providers: {},
    storageKey: 'dns_orders',

    /**
     * Initialize payment providers from SITE_CONFIG.payment.methods
     */
    init() {
      const configMethods =
        typeof window !== 'undefined' &&
        window.SITE_CONFIG &&
        window.SITE_CONFIG.payment &&
        Array.isArray(window.SITE_CONFIG.payment.methods)
          ? window.SITE_CONFIG.payment.methods
          : [];

      // Register default providers for each config method
      configMethods.forEach((method) => {
        if (method.id === 'easypaisa') {
          this.providers['easypaisa'] = new EasypaisaProvider(method);
        } else if (method.id === 'jazzcash') {
          this.providers['jazzcash'] = new JazzCashProvider(method);
        } else {
          this.providers[method.id] = new ManualPaymentProvider(method);
        }
      });

      // Ensure fallback providers exist even if config wasn't loaded yet
      if (!this.providers['easypaisa']) {
        this.providers['easypaisa'] = new EasypaisaProvider({ id: 'easypaisa', name: 'Easypaisa' });
      }
      if (!this.providers['jazzcash']) {
        this.providers['jazzcash'] = new JazzCashProvider({ id: 'jazzcash', name: 'JazzCash' });
      }

      console.log('[PaymentService] Initialized with providers:', Object.keys(this.providers));
    },

    /**
     * Retrieve provider instance by method identifier
     * @param {string} methodId
     * @returns {PaymentProvider}
     */
    getProvider(methodId) {
      if (!this.providers[methodId]) {
        // Fallback to manual provider on the fly
        console.warn(`[PaymentService] Provider '${methodId}' not found, falling back to manual.`);
        this.providers[methodId] = new ManualPaymentProvider({ id: methodId });
      }
      return this.providers[methodId];
    },

    /**
     * Validate and submit an order through the appropriate payment provider
     * @param {Object} orderData
     * @returns {Promise<{success: boolean, orderId: string, order: Object}>}
     */
    async submitOrder(orderData) {
      if (!orderData) {
        throw new Error('Order data is required.');
      }
      if (!orderData.orderId) {
        throw new Error('Order ID is required.');
      }
      if (!orderData.plan) {
        throw new Error('Selected plan is required.');
      }
      if (!orderData.customerName || !orderData.phone) {
        throw new Error('Customer contact details are required.');
      }
      if (!orderData.transactionId) {
        throw new Error('Transaction ID (TID) is required.');
      }

      const methodId = orderData.paymentMethod || 'easypaisa';
      const provider = this.getProvider(methodId);

      try {
        const result = await provider.submitPayment(orderData);
        return result;
      } catch (err) {
        console.error('[PaymentService] submitOrder error:', err);
        throw err;
      }
    },

    /**
     * Get order status and detail by orderId
     * @param {string} orderId
     * @returns {Promise<{success: boolean, status: string, order: Object|null}>}
     */
    async getOrderStatus(orderId) {
      if (!orderId) {
        return { success: false, status: 'missing_id', order: null };
      }

      // Check across manual provider
      const manual = new ManualPaymentProvider();
      return manual.checkStatus(orderId.trim());
    },

    /**
     * Retrieve all orders from localStorage
     * @returns {Array<Object>}
     */
    getAllOrders() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.error('[PaymentService] getAllOrders error:', err);
        return [];
      }
    },

    /**
     * Update order status (useful for admin simulation, testing, tracking)
     * @param {string} orderId
     * @param {'pending'|'approved'|'activated'|'rejected'} status
     * @returns {boolean}
     */
    updateOrderStatus(orderId, status) {
      const orders = this.getAllOrders();
      const idx = orders.findIndex((o) => o.orderId === orderId);
      if (idx >= 0) {
        orders[idx].status = status;
        orders[idx].updatedAt = new Date().toISOString();
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(orders));
          return true;
        } catch (e) {
          console.error('[PaymentService] Failed to update status in localStorage:', e);
          return false;
        }
      }
      return false;
    },
  };

  // Auto-init on load if in browser
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => PaymentService.init());
    } else {
      PaymentService.init();
    }
  }

  return {
    PaymentProvider,
    ManualPaymentProvider,
    EasypaisaProvider,
    JazzCashProvider,
    PaymentService,
  };
});
