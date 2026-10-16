import { SiteSettings } from '@/types';

export const THEME_PRESETS = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan (Default Midnight)',
    primaryColor: '#00E5FF',
    secondaryColor: '#8B5CF6',
    backgroundColor: '#080D1A',
    cardColor: '#111C32',
    borderColor: '#24324A',
    textColor: '#F1F5F9',
    mutedColor: '#94A3B8',
    buttonRadius: 'rounded-lg' as const,
    cardRadius: 'rounded-xl' as const,
    fontFamily: 'inter' as const,
  },
  {
    id: 'neon-violet',
    name: 'Neon Violet Protocol',
    primaryColor: '#A855F7',
    secondaryColor: '#EC4899',
    backgroundColor: '#090514',
    cardColor: '#150E28',
    borderColor: '#3B2368',
    textColor: '#F8FAFC',
    mutedColor: '#A1A1AA',
    buttonRadius: 'pill' as const,
    cardRadius: 'rounded-2xl' as const,
    fontFamily: 'space-grotesk' as const,
  },
  {
    id: 'electric-ice',
    name: 'Electric Ice Stealth',
    primaryColor: '#38BDF8',
    secondaryColor: '#6366F1',
    backgroundColor: '#050B14',
    cardColor: '#0E1726',
    borderColor: '#1E293B',
    textColor: '#FFFFFF',
    mutedColor: '#94A3B8',
    buttonRadius: 'rounded-md' as const,
    cardRadius: 'rounded-lg' as const,
    fontFamily: 'rajdhani' as const,
  },
  {
    id: 'deep-emerald',
    name: 'Deep Matrix Emerald',
    primaryColor: '#10B981',
    secondaryColor: '#06B6D4',
    backgroundColor: '#04110B',
    cardColor: '#0A2016',
    borderColor: '#133E2B',
    textColor: '#ECFDF5',
    mutedColor: '#6EE7B7',
    buttonRadius: 'sharp' as const,
    cardRadius: 'none' as const,
    fontFamily: 'orbitron' as const,
  }
];

export const DEFAULT_SITE_CONFIG: SiteSettings = {
  brandName: "NEXORA DNS",
  tagline: "FREE FIRE MOBILE DNS. BUILT FOR YOUR DEVICE.",
  defaultCurrency: "PKR",
  pkrToUsdRate: 280,
  whatsappNumber: "+923001234567",
  whatsappDisplay: "+92 300 1234567",
  discordUrl: "https://discord.gg/nexoradns",
  supportEmail: "support@nexoradns.com",
  sandboxMode: true,
  easypaisaAccountTitle: "NEXORA GAMING TECHNOLOGIES",
  easypaisaAccountNumber: "0300-1234567",
  jazzcashAccountTitle: "NEXORA GAMING TECHNOLOGIES",
  jazzcashAccountNumber: "0301-7654321",
  announcementText: "⚡ DEDICATED FREE FIRE ANYCAST NODES ACTIVE FOR ANDROID (DoT) & iOS (DoH)",
  announcementActive: true,
  
  // Theme Settings
  theme: {
    brandName: "NEXORA DNS",
    tagline: "FREE FIRE MOBILE DNS. BUILT FOR YOUR DEVICE.",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#00E5FF",
    secondaryColor: "#8B5CF6",
    backgroundColor: "#080D1A",
    cardColor: "#111C32",
    borderColor: "#24324A",
    textColor: "#F1F5F9",
    mutedColor: "#94A3B8",
    fontFamily: "inter",
    buttonRadius: "rounded-lg",
    cardRadius: "rounded-xl",
    animationIntensity: "normal",
    headerStyle: "glass",
    activePreset: "cyber-cyan",
  },

  // Homepage Config
  homepage: {
    heroHeadline: "FREE FIRE MOBILE DNS. BUILT FOR YOUR DEVICE.",
    heroSubheadline: "Explore dedicated DNS configuration packages for compatible Android and iOS devices, with clear setup guides and secure order delivery.",
    heroAndroidCta: "EXPLORE ANDROID DNS",
    heroIosCta: "EXPLORE iOS DNS",
    heroBadgeText: "GARENA FREE FIRE MOBILE ROUTING • ANDROID & iOS COMPATIBLE",
    heroImageUrl: "",
    announcementActive: true,
    announcementText: "⚡ DEDICATED FREE FIRE ANYCAST NODES ACTIVE FOR ANDROID (DoT) & iOS (DoH)",
    announcementLink: "/store",
    sectionsOrder: ["announcement", "hero", "device_comparison", "products_catalog", "features", "faq", "cta_banner"],
    enabledSections: {
      announcement: true,
      hero: true,
      device_comparison: true,
      products_catalog: true,
      features: true,
      faq: true,
      cta_banner: true,
    },
    features: [
      {
        id: "feat-1",
        title: "Clean Domain Resolution",
        description: "Zero ad injection or malware redirect delays during Garena matchmaking handshakes.",
        icon: "Shield",
      },
      {
        id: "feat-2",
        title: "Encrypted DNS-over-TLS & DoH",
        description: "Cryptographically protected lookup queries directly on mobile network connections.",
        icon: "Lock",
      },
      {
        id: "feat-3",
        title: "BGP Anycast Edge Peering",
        description: "Ultra-low distance hops to regional internet exchange points in Pakistan & MENA.",
        icon: "Wifi",
      },
      {
        id: "feat-4",
        title: "Native OS Implementation",
        description: "100% compliant with Garena Fair Play rules using native Android Private DNS and Apple profiles.",
        icon: "Smartphone",
      }
    ],
    faqs: [
      {
        id: "faq-1",
        question: "Does NEXORA DNS guarantee lower ping or zero lag?",
        answer: "No. Network latency depends fundamentally on your ISP, cell tower load, physical distance to Garena game servers, and carrier routing. What NEXORA DNS delivers is clean, ad-free, unthrottled domain resolution, native DoH/DoT encryption, bypass of congested local mobile ISP recursive resolvers (Jazz, Zong, Telenor, Ufone), and low-jitter matchmaking authentication.",
        category: "Performance",
      },
      {
        id: "faq-2",
        question: "Can I get banned in Free Fire for using this DNS?",
        answer: "No. NEXORA DNS operates purely at the smartphone operating system network layer via Android Private DNS (Port 853 DoT) and Apple Encrypted Profiles (DoH). It does NOT inject code, hook game memory, modify Free Fire APK/OBB files, or change game network payloads. It complies 100% with Garena Fair Play regulations.",
        category: "Security",
      },
      {
        id: "faq-3",
        question: "Do I need to install any third-party VPN apps?",
        answer: "No third-party VPN apps are required. Android uses the built-in Private DNS setting in Android 9+, and Apple uses the official signed Encrypted DNS profile (.mobileconfig) in iOS 14+.",
        category: "Setup",
      },
      {
        id: "faq-4",
        question: "How fast do I receive my DNS credentials?",
        answer: "Free trial and verified orders receive their DNS configuration immediately upon automated or verified administrator payment confirmation on screen and via delivery receipt.",
        category: "Orders",
      }
    ]
  },

  // Site Content
  content: {
    aboutTitle: "About NEXORA DNS",
    aboutText: "NEXORA DNS provides high-performance, low-jitter DNS resolution infrastructure engineered specifically for mobile esports competitors playing Garena Free Fire. We bypass throttled, congested ISP recursive resolvers to deliver clean routing and rock-solid domain lookup reliability.",
    supportEmail: "support@nexoradns.com",
    whatsappNumber: "+923001234567",
    whatsappDisplay: "+92 300 1234567",
    telegramUrl: "https://t.me/nexoradns",
    discordUrl: "https://discord.gg/nexoradns",
    termsText: "By purchasing and utilizing NEXORA DNS configurations, you acknowledge that DNS routing optimizes hostname resolution and does not modify in-game mechanics or guarantee competitive advantages. Reselling or distributing assigned hostnames is prohibited.",
    privacyText: "NEXORA DNS maintains a strict zero-query logging policy on all gaming Anycast nodes. We do not store, monitor, or monetize your DNS lookup telemetry. Customer billing details are handled securely.",
    refundText: "We offer full refunds within 24 hours of purchase if our DNS servers fail to resolve on your validated compatible Android or iOS mobile device. Incompatibility due to unauthorized root/jailbreak tweaks is exempt.",
    androidGuideInstructions: "Go to Settings > Network & Internet (or Connections) > More Connection Settings > Private DNS. Select 'Private DNS provider hostname', enter your assigned NEXORA hostname, and tap Save.",
    iosGuideInstructions: "Download your customized NEXORA .mobileconfig profile from your order confirmation screen. Go to iPhone Settings > Profile Downloaded > Install. Confirm passcode and install profile.",
  },

  // SEO Config
  seo: {
    metaTitle: "NEXORA DNS — Free Fire Mobile DNS for Android & iOS",
    metaDescription: "Explore dedicated Free Fire DNS configuration packages for compatible Android and iOS devices, with clear setup guides and secure order delivery.",
    keywords: "Free Fire DNS, Android Private DNS Free Fire, iOS DNS Profile Free Fire, Pakistan Free Fire DNS, Garena Server Route Optimization",
    ogImageUrl: "/images/og-nexora.png",
  },

  // Notification Config
  notifications: {
    emailProvider: "none",
    adminEmail: "admin@nexoradns.com",
    notifyOnOrder: true,
    notifyOnVerification: true,
    webhookUrl: "",
    webhookEnabled: false,
  },

  // Maintenance Config
  maintenance: {
    enabled: false,
    title: "System Maintenance Underway",
    message: "NEXORA DNS core infrastructure is undergoing routine scheduled maintenance to enhance routing capacity. Our DNS Anycast nodes remain online. Store purchases will resume shortly.",
    estimatedDuration: "20 minutes",
    allowAdminBypass: true,
  },

  version: 1,
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const SITE_METADATA = {
  title: "NEXORA DNS — Free Fire Mobile DNS for Android & iOS",
  description: "Explore dedicated Free Fire DNS configuration packages for compatible Android and iOS devices, with clear setup guides and secure order delivery.",
  url: "https://nexoradns.com",
  ogImage: "/images/og-nexora.png",
  keywords: [
    "Free Fire DNS",
    "Free Fire Mobile DNS",
    "Android Private DNS Free Fire",
    "iOS DNS Profile Free Fire",
    "Free Fire MAX DNS",
    "Pakistan Free Fire DNS",
    "DoT Android Free Fire",
    "DoH iOS Free Fire",
    "Garena Server Route Optimization"
  ],
};

export const HONEST_DISCLAIMER = {
  shortNotice: "Network latency depends fundamentally on your ISP, physical distance to Garena game servers, and cellular carrier infrastructure. NEXORA optimizes DNS lookup handshakes and provides encrypted transport; it does not alter in-game UDP physics or guarantee headshots/zero lag.",
  fullNotice: "Transparency Policy: No DNS service can guarantee lower ping or zero lag in Free Fire matches. What NEXORA DNS delivers is clean, ad-free, unthrottled domain resolution, native DoH/DoT encryption, bypass of congested local mobile ISP recursive resolvers (Jazz, Zong, Telenor, Ufone), and low-jitter lobby and matchmaking authentication. In-game combat ping remains governed by your physical network connection and proximity to Garena regional servers."
};
