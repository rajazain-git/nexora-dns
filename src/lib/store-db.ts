import { 
  Product, 
  Order, 
  Coupon, 
  SupportTicket, 
  AuditLog, 
  SiteSettings, 
  SettingsVersion,
  AssignedDNSConfig,
  PaymentStatus,
  FulfillmentStatus
} from '@/types';
import { INITIAL_PRODUCTS } from './products';
import { DEFAULT_SITE_CONFIG } from './config';

const PRODUCTS_KEY = 'nexora_ff_mobile_products';
const ORDERS_KEY = 'nexora_orders';
const COUPONS_KEY = 'nexora_coupons';
const TICKETS_KEY = 'nexora_tickets';
const AUDIT_KEY = 'nexora_audit_logs';
const SETTINGS_KEY = 'nexora_settings';
const PUBLISHED_SETTINGS_KEY = 'nexora_published_settings';
const DRAFT_SETTINGS_KEY = 'nexora_draft_settings';
const SETTINGS_VERSIONS_KEY = 'nexora_settings_versions';

const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'NEXORA10',
    discountPercentage: 10,
    minSpendPKR: 300,
    active: true,
    usageCount: 14,
    maxUses: 100,
  },
  {
    code: 'PROGAMER20',
    discountPercentage: 20,
    minSpendPKR: 600,
    active: true,
    usageCount: 28,
    maxUses: 50,
  },
  {
    code: 'EASYPAISA',
    discountPercentage: 15,
    minSpendPKR: 400,
    active: true,
    usageCount: 42,
    maxUses: 200,
  }
];

// Unified persistent store across Node.js server routes and browser client
const serverMemoryStore = new Map<string, string>();

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    const cached = serverMemoryStore.get(key);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return defaultValue;
      }
    }
    return defaultValue;
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  const serialized = JSON.stringify(value);
  if (typeof window === 'undefined') {
    serverMemoryStore.set(key, serialized);
    return;
  }
  try {
    localStorage.setItem(key, serialized);
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// PRODUCTS API
export function getStoredProducts(): Product[] {
  const products = getStorageItem<Product[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
  if (!products || products.length === 0) {
    setStorageItem(PRODUCTS_KEY, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  return products;
}

export function getProductById(idOrSlug: string): Product | undefined {
  const products = getStoredProducts();
  return products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
}

export function saveProduct(product: Product, adminEmail: string = 'admin@nexoradns.com'): void {
  const products = getStoredProducts();
  const index = products.findIndex(p => p.id === product.id);
  
  if (index >= 0) {
    products[index] = { ...product, updatedAt: new Date().toISOString() };
    addAuditLog('product_updated', adminEmail, 'product', product.id, `Updated product ${product.name}`);
  } else {
    products.push({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    addAuditLog('product_created', adminEmail, 'product', product.id, `Created product ${product.name}`);
  }
  setStorageItem(PRODUCTS_KEY, products);
}

export function deleteProduct(id: string, adminEmail: string = 'admin@nexoradns.com'): boolean {
  const products = getStoredProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length !== products.length) {
    setStorageItem(PRODUCTS_KEY, filtered);
    addAuditLog('product_deleted', adminEmail, 'product', id, `Deleted product with ID ${id}`);
    return true;
  }
  return false;
}

// ORDERS API
export function getStoredOrders(): Order[] {
  return getStorageItem<Order[]>(ORDERS_KEY, []);
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  const orders = getStoredOrders();
  return orders.filter(o => o.customerId === customerId);
}

export function getOrderById(orderId: string): Order | undefined {
  const orders = getStoredOrders();
  return orders.find(o => o.id === orderId);
}

export function generateOrderId(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NX-${dateStr}-${randomSuffix}`;
}

export function generateLicenseKey(): string {
  const seg = () => Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NX-${seg()}-${seg()}-${seg()}-${seg()}`;
}

export function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'assignedConfigurations'>): Order {
  const newId = generateOrderId();
  const now = new Date().toISOString();

  // If this is a free trial order or immediately verified sandbox order, provision now
  let fulfillmentStatus: FulfillmentStatus = orderData.fulfillmentStatus;
  let paymentStatus: PaymentStatus = orderData.paymentStatus;
  let assignedConfigurations: AssignedDNSConfig[] = [];

  const isFree = orderData.totalAmount === 0;
  if (isFree) {
    paymentStatus = 'verified';
    fulfillmentStatus = 'fulfilled';
  }

  const newOrder: Order = {
    ...orderData,
    id: newId,
    paymentStatus,
    fulfillmentStatus,
    assignedConfigurations,
    createdAt: now,
    updatedAt: now,
  };

  if (fulfillmentStatus === 'fulfilled' || isFree) {
    newOrder.assignedConfigurations = provisionConfigsForOrder(newOrder);
  }

  const existing = getStoredOrders();
  existing.unshift(newOrder);
  setStorageItem(ORDERS_KEY, existing);

  return newOrder;
}

export function provisionConfigsForOrder(order: Order): AssignedDNSConfig[] {
  const products = getStoredProducts();
  const configs: AssignedDNSConfig[] = [];

  order.items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    let expiresAt: string | undefined;
    const now = new Date();
    if (product.duration === 'trial-3d') {
      expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    } else if (product.duration === '1-month') {
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (product.duration === '3-months') {
      expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();
    } else if (product.duration === '1-year') {
      expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    const licenseKey = generateLicenseKey();
    configs.push({
      productId: product.id,
      productName: product.name,
      primaryIP: product.dnsConfig.primaryIP,
      secondaryIP: product.dnsConfig.secondaryIP,
      dohUrl: `${product.dnsConfig.dohUrl || 'https://doh.nexoradns.com/dns-query'}?key=${licenseKey}`,
      dotHost: product.dnsConfig.dotHost || 'core.nexoradns.com',
      licenseKey,
      assignedAt: new Date().toISOString(),
      expiresAt,
      setupGuideUrl: `/setup-guides/${product.supportedPlatforms[0]?.toLowerCase().includes('ios') ? 'ios' : 'android'}`
    });
  });

  return configs;
}

export function updateOrderStatus(
  orderId: string, 
  paymentStatus: PaymentStatus, 
  fulfillmentStatus: FulfillmentStatus,
  adminEmail: string = 'admin@nexoradns.com',
  notes?: string
): Order | null {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  order.paymentStatus = paymentStatus;
  order.fulfillmentStatus = fulfillmentStatus;
  order.updatedAt = new Date().toISOString();

  if (notes && order.paymentProof) {
    order.paymentProof.notes = notes;
  }

  if (paymentStatus === 'verified' && fulfillmentStatus === 'fulfilled' && order.assignedConfigurations.length === 0) {
    order.assignedConfigurations = provisionConfigsForOrder(order);
  }

  setStorageItem(ORDERS_KEY, orders);
  addAuditLog(
    'order_status_updated',
    adminEmail,
    'order',
    orderId,
    `Order status updated to payment: ${paymentStatus}, fulfillment: ${fulfillmentStatus}`
  );
  return order;
}

export function verifyPayment(orderId: string, adminEmail: string, verificationNotes: string): Order | null {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  order.paymentStatus = 'verified';
  order.fulfillmentStatus = 'fulfilled';
  order.updatedAt = new Date().toISOString();

  if (!order.paymentProof) {
    order.paymentProof = {};
  }
  order.paymentProof.verifiedAt = new Date().toISOString();
  order.paymentProof.verifiedBy = adminEmail;
  order.paymentProof.notes = verificationNotes;

  order.paymentVerificationLog = {
    verifiedBy: adminEmail,
    method: 'admin_manual_audit',
    notes: verificationNotes,
    timestamp: new Date().toISOString()
  };

  if (order.assignedConfigurations.length === 0) {
    order.assignedConfigurations = provisionConfigsForOrder(order);
  }

  setStorageItem(ORDERS_KEY, orders);
  addAuditLog(
    'order_payment_verified',
    adminEmail,
    'order',
    orderId,
    `Verified payment with note: ${verificationNotes}. Provisioned DNS.`
  );
  return order;
}

export function refundOrder(orderId: string, adminEmail: string, amount: number, reason: string): Order | null {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  order.paymentStatus = 'refunded';
  order.updatedAt = new Date().toISOString();
  order.refundDetails = {
    amount,
    reason,
    refundedAt: new Date().toISOString(),
    refundedBy: adminEmail
  };

  setStorageItem(ORDERS_KEY, orders);
  addAuditLog(
    'order_refunded',
    adminEmail,
    'order',
    orderId,
    `Refunded Rs. ${amount}. Reason: ${reason}`
  );
  return order;
}

export function addOrderAdminNote(orderId: string, adminEmail: string, note: string): Order | null {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  if (!order.adminNotes) order.adminNotes = [];
  order.adminNotes.unshift({
    id: `NOTE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    adminEmail,
    note,
    timestamp: new Date().toISOString()
  });
  order.updatedAt = new Date().toISOString();

  setStorageItem(ORDERS_KEY, orders);
  addAuditLog('order_note_added', adminEmail, 'order', orderId, `Added internal note: ${note.substring(0, 40)}...`);
  return order;
}

export function manuallyFulfillOrder(orderId: string, adminEmail: string): Order | null {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  order.fulfillmentStatus = 'fulfilled';
  order.updatedAt = new Date().toISOString();
  if (order.assignedConfigurations.length === 0) {
    order.assignedConfigurations = provisionConfigsForOrder(order);
  }

  setStorageItem(ORDERS_KEY, orders);
  addAuditLog('order_manually_fulfilled', adminEmail, 'order', orderId, 'Manual DNS fulfillment executed.');
  return order;
}

export function exportOrdersToCSV(): string {
  const orders = getStoredOrders();
  const headers = ['Order ID', 'Date', 'Customer Name', 'Customer Email', 'Phone', 'Items', 'Subtotal PKR', 'Discount PKR', 'Total PKR', 'Payment Method', 'Payment Status', 'Fulfillment Status', 'Transaction ID'];
  const rows = orders.map(o => [
    `"${o.id}"`,
    `"${o.createdAt}"`,
    `"${(o.customerName || '').replace(/"/g, '""')}"`,
    `"${o.customerEmail}"`,
    `"${o.customerPhone || ''}"`,
    `"${o.items.map(i => `${i.productName} (x${i.quantity})`).join('; ')}"`,
    o.subtotal,
    o.discountAmount,
    o.totalAmount,
    `"${o.paymentMethod}"`,
    `"${o.paymentStatus}"`,
    `"${o.fulfillmentStatus}"`,
    `"${o.paymentProof?.transactionId || ''}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// COUPONS API
export function getStoredCoupons(): Coupon[] {
  const coupons = getStorageItem<Coupon[]>(COUPONS_KEY, []);
  if (!coupons || coupons.length === 0) {
    setStorageItem(COUPONS_KEY, INITIAL_COUPONS);
    return INITIAL_COUPONS;
  }
  return coupons;
}

export function validateCoupon(
  code: string, 
  subtotalPKR: number, 
  platform?: 'android' | 'ios'
): { valid: boolean; discountPercentage?: number; discountAmount?: number; message: string } {
  const coupons = getStoredCoupons();
  const cleanCode = code.trim().toUpperCase();
  const found = coupons.find(c => c.code.toUpperCase() === cleanCode);

  if (!found) {
    return { valid: false, message: 'Invalid coupon code.' };
  }
  if (!found.active) {
    return { valid: false, message: 'This coupon is no longer active.' };
  }
  if (found.expiresAt && new Date(found.expiresAt).getTime() < Date.now()) {
    return { valid: false, message: 'This coupon has expired.' };
  }
  if (found.maxUses && found.usageCount >= found.maxUses) {
    return { valid: false, message: 'This coupon has reached maximum redemption limit.' };
  }
  if (found.minSpendPKR && subtotalPKR < found.minSpendPKR) {
    return { valid: false, message: `Minimum spend of Rs. ${found.minSpendPKR} required for this coupon.` };
  }
  if (platform && found.platformRestriction && found.platformRestriction !== 'all' && found.platformRestriction !== platform) {
    return { valid: false, message: `This coupon is exclusively valid for ${found.platformRestriction.toUpperCase()} packages.` };
  }

  let discountAmount = 0;
  let discountPercentage = found.discountPercentage || 0;

  if (found.discountType === 'fixed' && found.discountValue) {
    discountAmount = Math.min(found.discountValue, subtotalPKR);
    discountPercentage = Math.round((discountAmount / subtotalPKR) * 100);
  } else {
    discountAmount = Math.round((subtotalPKR * discountPercentage) / 100);
  }

  return { 
    valid: true, 
    discountPercentage, 
    discountAmount,
    message: `${discountPercentage}% discount applied successfully (-Rs. ${discountAmount})!` 
  };
}

export function saveCoupon(coupon: Coupon, adminEmail: string = 'admin@nexoradns.com'): void {
  const coupons = getStoredCoupons();
  const idx = coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
  if (idx >= 0) {
    coupons[idx] = coupon;
    addAuditLog('coupon_updated', adminEmail, 'coupon', coupon.code, `Updated coupon ${coupon.code}`);
  } else {
    coupons.push(coupon);
    addAuditLog('coupon_created', adminEmail, 'coupon', coupon.code, `Created coupon ${coupon.code}`);
  }
  setStorageItem(COUPONS_KEY, coupons);
}

export function deleteCoupon(code: string, adminEmail: string = 'admin@nexoradns.com'): boolean {
  const coupons = getStoredCoupons();
  const filtered = coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
  if (filtered.length !== coupons.length) {
    setStorageItem(COUPONS_KEY, filtered);
    addAuditLog('coupon_deleted', adminEmail, 'coupon', code, `Deleted coupon ${code}`);
    return true;
  }
  return false;
}

// SUPPORT TICKETS API
export function getStoredTickets(): SupportTicket[] {
  return getStorageItem<SupportTicket[]>(TICKETS_KEY, []);
}

export function getTicketsByCustomerId(customerId: string): SupportTicket[] {
  const tickets = getStoredTickets();
  return tickets.filter(t => t.customerId === customerId);
}

export function createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'replies'>): SupportTicket {
  const newTicket: SupportTicket = {
    ...ticket,
    id: `TCK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    replies: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const tickets = getStoredTickets();
  tickets.unshift(newTicket);
  setStorageItem(TICKETS_KEY, tickets);
  return newTicket;
}

export function replyToTicket(ticketId: string, reply: { sender: 'customer' | 'admin'; senderName: string; message: string }): SupportTicket | null {
  const tickets = getStoredTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  ticket.replies.push({
    id: `REP-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    ...reply,
    timestamp: new Date().toISOString()
  });
  ticket.updatedAt = new Date().toISOString();
  if (reply.sender === 'admin' && ticket.status === 'open') {
    ticket.status = 'in-progress';
  }
  setStorageItem(TICKETS_KEY, tickets);
  return ticket;
}

export function updateTicketStatus(ticketId: string, status: SupportTicket['status'], adminEmail: string = 'admin@nexoradns.com'): SupportTicket | null {
  const tickets = getStoredTickets();
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return null;

  ticket.status = status;
  ticket.updatedAt = new Date().toISOString();
  setStorageItem(TICKETS_KEY, tickets);
  addAuditLog('ticket_status_updated', adminEmail, 'ticket', ticketId, `Updated ticket status to ${status}`);
  return ticket;
}

// AUDIT LOGS
export function getStoredAuditLogs(): AuditLog[] {
  return getStorageItem<AuditLog[]>(AUDIT_KEY, []);
}

export function addAuditLog(action: string, adminEmail: string, targetType: AuditLog['targetType'], targetId: string, details: string): void {
  const logs = getStoredAuditLogs();
  logs.unshift({
    id: `LOG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    action,
    adminEmail,
    targetType,
    targetId,
    details,
    timestamp: new Date().toISOString(),
  });
  // Keep last 300 logs
  if (logs.length > 300) logs.pop();
  setStorageItem(AUDIT_KEY, logs);
}

// DRAFT & PUBLISHED SETTINGS WITH VERSIONING
export function getPublishedSettings(): SiteSettings {
  return getStorageItem<SiteSettings>(PUBLISHED_SETTINGS_KEY, DEFAULT_SITE_CONFIG);
}

export function getDraftSettings(): SiteSettings {
  const published = getPublishedSettings();
  return getStorageItem<SiteSettings>(DRAFT_SETTINGS_KEY, published);
}

export function saveDraftSettings(settings: SiteSettings, adminEmail: string = 'admin@nexoradns.com'): void {
  const updated: SiteSettings = {
    ...settings,
    updatedAt: new Date().toISOString()
  };
  setStorageItem(DRAFT_SETTINGS_KEY, updated);
  addAuditLog('settings_draft_saved', adminEmail, 'settings', 'draft', 'Saved draft settings');
}

export function publishSettings(adminEmail: string = 'admin@nexoradns.com', note: string = 'Published live updates'): { success: boolean; version: SettingsVersion } {
  const draft = getDraftSettings();
  const versions = getSettingsVersions();
  
  const newVersionNumber = (versions[0]?.versionNumber || 0) + 1;
  const newVersion: SettingsVersion = {
    id: `VER-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    versionNumber: newVersionNumber,
    timestamp: new Date().toISOString(),
    adminEmail,
    note,
    settings: JSON.parse(JSON.stringify(draft))
  };

  versions.unshift(newVersion);
  if (versions.length > 30) versions.pop();
  setStorageItem(SETTINGS_VERSIONS_KEY, versions);

  const published: SiteSettings = {
    ...draft,
    version: newVersionNumber,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  setStorageItem(PUBLISHED_SETTINGS_KEY, published);
  setStorageItem(DRAFT_SETTINGS_KEY, published);
  setStorageItem(SETTINGS_KEY, published);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nexora-settings-updated', { detail: published }));
  }

  addAuditLog('settings_published', adminEmail, 'settings', `v${newVersionNumber}`, `Published version ${newVersionNumber}: ${note}`);
  return { success: true, version: newVersion };
}

export function getSettingsVersions(): SettingsVersion[] {
  return getStorageItem<SettingsVersion[]>(SETTINGS_VERSIONS_KEY, []);
}

export function restoreSettingsVersion(versionId: string, adminEmail: string = 'admin@nexoradns.com'): { success: boolean; restored: SiteSettings | null } {
  const versions = getSettingsVersions();
  const target = versions.find(v => v.id === versionId);
  if (!target) return { success: false, restored: null };

  const restored = JSON.parse(JSON.stringify(target.settings));
  restored.updatedAt = new Date().toISOString();
  
  setStorageItem(DRAFT_SETTINGS_KEY, restored);
  publishSettings(adminEmail, `Restored from version ${target.versionNumber} (${target.note || 'Backup'})`);

  addAuditLog('settings_restored', adminEmail, 'backup', versionId, `Restored settings from v${target.versionNumber}`);
  return { success: true, restored };
}

// Legacy aliases
export function getStoredSettings(): SiteSettings {
  return getPublishedSettings();
}

export function updateStoredSettings(settings: SiteSettings, adminEmail: string = 'admin@nexoradns.com'): void {
  saveDraftSettings(settings, adminEmail);
  publishSettings(adminEmail, 'Direct settings update');
}
