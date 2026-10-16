export type ProductCategory = 
  | 'android'
  | 'ios'
  | 'free-trial';

export type PlatformType = 
  | 'iOS'
  | 'Android';

export type MobilePlatform = 'android' | 'ios';

export type DurationType = 
  | 'trial-3d'
  | '1-month'
  | '3-months'
  | '6-months'
  | '1-year'
  | 'lifetime';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  platform: MobilePlatform; // Strictly 'android' | 'ios'
  pricePKR: number;
  priceUSD: number;
  duration: DurationType;
  durationLabel: string;
  isRecurring: boolean;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  coverImage: string;
  supportedGames: string[];
  supportedPlatforms: PlatformType[];
  compatibleDevices?: string; // e.g. 'Samsung, Xiaomi, Poco, Infinix, Tecno (Android 9-15)' or 'iPhone 11-16, iPad (iOS 14-18)'
  configMethod?: string; // e.g. 'Android Private DNS (DoT)' or 'Apple DoH Profile (.mobileconfig)'
  features: string[];
  limitations: string[];
  specs: {
    protocol: string; // e.g., 'DNS-over-HTTPS (DoH), DoT, Anycast IPv4/IPv6'
    encryption: string; // 'TLS 1.3 / Quad-Layer ECC'
    targetRegion: string; // 'Asia-South (Pakistan / MENA Edge)'
    routingOptimization: string; // 'BGP Anycast Edge Peering'
  };
  dnsConfig: {
    primaryIP: string;
    secondaryIP: string;
    ipv6Primary?: string;
    ipv6Secondary?: string;
    dohUrl?: string;
    dotHost?: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  badge?: string;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedDuration: DurationType;
}

export type PaymentMethod = 'easypaisa' | 'jazzcash' | 'card' | 'sandbox';
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'refunded';
export type FulfillmentStatus = 'pending' | 'provisioning' | 'fulfilled' | 'failed';

export interface AssignedDNSConfig {
  productId: string;
  productName: string;
  primaryIP: string;
  secondaryIP: string;
  dohUrl: string;
  dotHost: string;
  licenseKey: string;
  assignedAt: string;
  expiresAt?: string;
  setupGuideUrl: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  duration: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  currency: 'PKR' | 'USD';
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentProof?: {
    transactionId?: string;
    senderAccount?: string;
    notes?: string;
    verifiedAt?: string;
    verifiedBy?: string;
  };
  fulfillmentStatus: FulfillmentStatus;
  assignedConfigurations: AssignedDNSConfig[];
  adminNotes?: Array<{
    id: string;
    adminEmail: string;
    note: string;
    timestamp: string;
  }>;
  refundDetails?: {
    amount: number;
    reason: string;
    refundedAt: string;
    refundedBy: string;
  };
  paymentVerificationLog?: {
    verifiedBy: string;
    method: string;
    notes: string;
    timestamp: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
  phone?: string;
  country?: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number; // e.g. Rs. 100 or 15%
  minSpendPKR?: number;
  active: boolean;
  usageCount: number;
  maxUses?: number;
  expiresAt?: string;
  platformRestriction?: 'all' | 'android' | 'ios';
}

export interface SupportTicketReply {
  id: string;
  sender: 'customer' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  orderId?: string;
  subject: string;
  message: string;
  category: 'order' | 'dns-setup' | 'routing' | 'billing' | 'general';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  replies: SupportTicketReply[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  adminEmail: string;
  targetType: 'order' | 'product' | 'coupon' | 'ticket' | 'settings' | 'user' | 'backup' | 'maintenance';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface SiteTheme {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string; // Electric Cyan #00E5FF
  secondaryColor: string; // Neon Violet #8B5CF6
  backgroundColor: string; // Midnight Navy #080D1A
  cardColor: string; // Slate Blue #111C32
  borderColor: string; // #24324A
  textColor: string; // #F1F5F9
  mutedColor: string; // #94A3B8
  fontFamily: 'inter' | 'space-grotesk' | 'rajdhani' | 'orbitron';
  buttonRadius: 'sharp' | 'rounded-md' | 'rounded-lg' | 'pill';
  cardRadius: 'none' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl';
  animationIntensity: 'none' | 'subtle' | 'normal' | 'energetic';
  headerStyle: 'glass' | 'solid' | 'floating';
  activePreset: string;
}

export interface HomepageFeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HomepageFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface HomepageConfig {
  heroHeadline: string;
  heroSubheadline: string;
  heroAndroidCta: string;
  heroIosCta: string;
  heroBadgeText: string;
  heroImageUrl?: string;
  announcementActive: boolean;
  announcementText: string;
  announcementLink?: string;
  sectionsOrder: string[]; // ['announcement', 'hero', 'device_comparison', 'products_catalog', 'features', 'faq', 'cta_banner']
  enabledSections: Record<string, boolean>;
  features: HomepageFeatureItem[];
  faqs: HomepageFaqItem[];
}

export interface SiteContent {
  aboutTitle: string;
  aboutText: string;
  supportEmail: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  telegramUrl: string;
  discordUrl: string;
  termsText: string;
  privacyText: string;
  refundText: string;
  androidGuideInstructions: string;
  iosGuideInstructions: string;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImageUrl?: string;
}

export interface NotificationConfig {
  emailProvider: 'smtp' | 'resend' | 'none';
  adminEmail: string;
  notifyOnOrder: boolean;
  notifyOnVerification: boolean;
  webhookUrl: string;
  webhookEnabled: boolean;
}

export interface MaintenanceConfig {
  enabled: boolean;
  title: string;
  message: string;
  estimatedDuration: string;
  allowAdminBypass: boolean;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  defaultCurrency: 'PKR' | 'USD';
  pkrToUsdRate: number;
  whatsappNumber: string;
  whatsappDisplay: string;
  discordUrl: string;
  supportEmail: string;
  sandboxMode: boolean;
  easypaisaAccountTitle: string;
  easypaisaAccountNumber: string;
  jazzcashAccountTitle: string;
  jazzcashAccountNumber: string;
  announcementText?: string;
  announcementActive?: boolean;
  // Upgraded Full Control Center Sections:
  theme: SiteTheme;
  homepage: HomepageConfig;
  content: SiteContent;
  seo: SeoConfig;
  notifications: NotificationConfig;
  maintenance: MaintenanceConfig;
  updatedAt?: string;
  publishedAt?: string;
  version?: number;
}

export interface SettingsVersion {
  id: string;
  versionNumber: number;
  timestamp: string;
  adminEmail: string;
  note: string;
  settings: SiteSettings;
}
