import { Product } from '@/types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // ANDROID FREE FIRE DNS PACKAGES
  // ==========================================
  {
    id: "nexora-ff-android-pro",
    name: "NEXORA Free Fire Android Elite (30 Days)",
    slug: "nexora-ff-android-pro",
    platform: "android",
    category: "android",
    shortDescription: "Native Private DNS configuration for Android phones, tuned specifically for Free Fire matchmaking routes.",
    description: "Engineered specifically for competitive Free Fire mobile players on Android. Bypasses overloaded mobile carrier recursive resolvers (Jazz, Zong, Telenor, Ufone) by providing dedicated DNS-over-TLS (DoT) routing to regional Garena matchmaker edges. Zero third-party apps required, zero background battery consumption.",
    pricePKR: 350,
    priceUSD: 1.49,
    duration: "1-month",
    durationLabel: "30 Days Access",
    isRecurring: false,
    availability: "in-stock",
    coverImage: "/images/products/android-elite.webp",
    supportedGames: ["Free Fire", "Free Fire MAX"],
    supportedPlatforms: ["Android"],
    compatibleDevices: "Samsung Galaxy, Xiaomi/Redmi, Poco, Infinix, Tecno, Realme, Vivo, Oppo, Google Pixel (Android 9.0 – 15+)",
    configMethod: "Native Android Private DNS (DNS-over-TLS on Port 853)",
    features: [
      "Dedicated Private DNS Hostname (ff-android.pk.nexoradns.com)",
      "High-speed domain resolution for Garena Free Fire auth & match lobbies",
      "Native Android 9+ integration with zero third-party VPN apps",
      "Seamless operation across 4G/5G cellular data and Wi-Fi",
      "Strict TLS 1.3 encryption on Port 853",
      "Blocks invasive background mobile ad networks to keep connection clean",
      "100% compliant with Free Fire fair-play terms (no anti-cheat bans)"
    ],
    limitations: [
      "Physical in-game match ping is governed by your ISP's routing to Garena game servers",
      "Cannot fix signal drops caused by cellular tower congestion or poor Wi-Fi range"
    ],
    specs: {
      protocol: "Private DNS (DNS-over-TLS / DoT), Port 853",
      encryption: "TLS 1.3 Strict / Quad-Layer ECC",
      targetRegion: "Asia-South (Pakistan / Singapore Edge)",
      routingOptimization: "Mobile Carrier Peering (Jazz, Zong, Nayatel, PTCL)"
    },
    dnsConfig: {
      primaryIP: "103.181.160.22",
      secondaryIP: "103.181.160.23",
      dohUrl: "https://ff-android.nexoradns.com/dns-query",
      dotHost: "ff-android.pk.nexoradns.com"
    },
    faqs: [
      {
        question: "How do I activate this on my Android phone?",
        answer: "Go to Settings > Network & Internet (or Connections) > Private DNS > Select 'Private DNS provider hostname' > Paste your assigned hostname (e.g. ff-android.pk.nexoradns.com) > Tap Save. Takes under 30 seconds."
      },
      {
        question: "Will this get my Free Fire account banned?",
        answer: "No. DNS is an essential internet protocol built directly into Android. It only looks up server domain names. It does not modify game files, inject scripts, or interfere with anti-cheat."
      },
      {
        question: "Does it work on mobile data as well as Wi-Fi?",
        answer: "Yes! Android's native Private DNS applies system-wide across Jazz, Zong, Telenor, Ufone cellular data and all Wi-Fi routers."
      }
    ],
    badge: "Android Best Seller",
    isFeatured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z"
  },
  {
    id: "nexora-ff-android-season",
    name: "NEXORA Free Fire Android Season Pass (90 Days)",
    slug: "nexora-ff-android-season",
    platform: "android",
    category: "android",
    shortDescription: "Quarterly rank season pass for serious Free Fire scrim & tournament players on Android devices.",
    description: "Designed for competitive Free Fire guild members and tournament players competing over full ranked seasons. Features unbroken 90-day validity, dual Asia-South Anycast edge routing, and priority WhatsApp setup support.",
    pricePKR: 750,
    priceUSD: 2.99,
    duration: "3-months",
    durationLabel: "90 Days (Best Value)",
    isRecurring: false,
    availability: "in-stock",
    coverImage: "/images/products/android-season.webp",
    supportedGames: ["Free Fire", "Free Fire MAX"],
    supportedPlatforms: ["Android"],
    compatibleDevices: "All Android 9.0–15+ smartphones and gaming tablets (Samsung Tab, Xiaomi Pad)",
    configMethod: "Native Android Private DNS (DoT Strict)",
    features: [
      "90-day unbroken validity for full Ranked Clash Squad / Battle Royale seasons",
      "Dedicated Private DNS Hostname with Asia-South priority tier",
      "Low-jitter domain query resolution for smooth lobby matchmaking transitions",
      "Works across all Pakistani cellular carriers (Jazz, Zong, Telenor, Ufone)",
      "Priority WhatsApp engineering support for setup verification",
      "Zero VPN overhead — zero battery drain"
    ],
    limitations: [
      "Physical ping depends on your mobile carrier's physical routing to Garena matchmaker servers",
      "Requires Android 9 or newer"
    ],
    specs: {
      protocol: "DNS-over-TLS (DoT), Port 853 Strict",
      encryption: "TLS 1.3 / ChaCha20-Poly1305",
      targetRegion: "Asia-South / MENA Edge Clusters",
      routingOptimization: "Tier 1 Mobile Peering Optimizations"
    },
    dnsConfig: {
      primaryIP: "103.181.160.30",
      secondaryIP: "103.181.160.31",
      dohUrl: "https://ff-season.nexoradns.com/dns-query",
      dotHost: "ff-season.pk.nexoradns.com"
    },
    faqs: [
      {
        question: "Can I use this across both my Android phone and tablet?",
        answer: "Yes, you can configure your authorized Private DNS hostname on your personal Android phone and tablet."
      }
    ],
    badge: "Season Pass",
    isFeatured: true,
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z"
  },
  {
    id: "nexora-ff-android-trial",
    name: "NEXORA Free Fire Android Test Drive (3-Day Free Trial)",
    slug: "nexora-ff-android-trial",
    platform: "android",
    category: "free-trial",
    shortDescription: "Try dedicated Free Fire Private DNS on your Android phone for 72 hours with zero payment.",
    description: "Test how our Anycast edge resolvers perform on your Android phone and local carrier network before purchasing a full plan. 100% free with instant activation in your customer dashboard.",
    pricePKR: 0,
    priceUSD: 0,
    duration: "trial-3d",
    durationLabel: "72 Hours Free Trial",
    isRecurring: false,
    availability: "in-stock",
    coverImage: "/images/products/android-trial.webp",
    supportedGames: ["Free Fire", "Free Fire MAX"],
    supportedPlatforms: ["Android"],
    compatibleDevices: "Any Android phone running Android 9.0 or higher",
    configMethod: "Android Private DNS Hostname",
    features: [
      "72-hour trial access to test resolution on Free Fire",
      "Instant activation in your Customer Dashboard",
      "No payment method or credit card required",
      "Step-by-step setup instructions included",
      "Seamless upgrade to 30-day or 90-day plan anytime"
    ],
    limitations: [
      "Access expires automatically after 72 hours",
      "Limited to one trial per registered account"
    ],
    specs: {
      protocol: "DNS-over-TLS (DoT)",
      encryption: "TLS 1.3",
      targetRegion: "Asia-South Edge",
      routingOptimization: "Standard Anycast"
    },
    dnsConfig: {
      primaryIP: "103.195.100.8",
      secondaryIP: "103.195.100.9",
      dohUrl: "https://ff-trial.nexoradns.com/dns-query",
      dotHost: "ff-trial.pk.nexoradns.com"
    },
    faqs: [
      {
        question: "Do I need to enter payment details for the trial?",
        answer: "No. The trial is completely free with no payment required."
      }
    ],
    badge: "100% Free Trial",
    isFeatured: false,
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z"
  },

  // ==========================================
  // iOS FREE FIRE DNS PACKAGES
  // ==========================================
  {
    id: "nexora-ff-ios-pro",
    name: "NEXORA Free Fire iOS Pro (30 Days)",
    slug: "nexora-ff-ios-pro",
    platform: "ios",
    category: "ios",
    shortDescription: "Native Apple signed configuration profile for iPhone & iPad, optimized for Free Fire mobile matchmaking.",
    description: "Configured specifically for competitive iPhone and iPad gamers playing Free Fire. Utilizes Apple's native NetworkExtension framework to deliver encrypted DNS-over-HTTPS (DoH) resolution directly to Garena gaming servers without installing third-party VPN apps or draining battery.",
    pricePKR: 450,
    priceUSD: 1.99,
    duration: "1-month",
    durationLabel: "30 Days Access",
    isRecurring: false,
    availability: "in-stock",
    coverImage: "/images/products/ios-pro.webp",
    supportedGames: ["Free Fire", "Free Fire MAX"],
    supportedPlatforms: ["iOS"],
    compatibleDevices: "iPhone 11 through iPhone 16 Pro Max, iPad Pro, iPad Air, iPad Mini (iOS 14.0 – 18+)",
    configMethod: "Apple Signed .mobileconfig Profile (DNS-over-HTTPS)",
    features: [
      "Official Apple signed .mobileconfig profile with 1-click Safari install",
      "Encrypted DNS-over-HTTPS (DoH) via native iOS NetworkExtension",
      "Pre-cached resolution for Garena Singapore & Middle East game hosts",
      "Zero VPN apps required — prevents VPN detection bans in tournaments",
      "Works continuously across Wi-Fi and 4G/5G mobile cellular",
      "Zero battery drain or background processing overhead",
      "100% compliant with Garena fair play standards"
    ],
    limitations: [
      "Requires iOS 14.0 or newer (built-in Apple Encrypted DNS support)",
      "In-game latency remains governed by physical distance and ISP routing to game servers"
    ],
    specs: {
      protocol: "Apple Encrypted DNS (DoH), TLS 1.3 HTTP/2",
      encryption: "TLS 1.3 / AES-256-GCM Apple Secure Enclave",
      targetRegion: "Asia-South (Pakistan / Singapore Edge)",
      routingOptimization: "Direct Peering with Apple & Garena Cloud CDN"
    },
    dnsConfig: {
      primaryIP: "185.193.125.10",
      secondaryIP: "185.193.125.11",
      dohUrl: "https://ff-ios.nexoradns.com/dns-query",
      dotHost: "ff-ios.pk.nexoradns.com"
    },
    faqs: [
      {
        question: "How do I install this on my iPhone?",
        answer: "Open your Customer Dashboard in Safari, tap 'Download iOS Profile (.mobileconfig)', tap Allow, then go to iPhone Settings > Profile Downloaded > Tap Install > Enter passcode. Done in 45 seconds."
      },
      {
        question: "Does this require jailbreak or third-party apps?",
        answer: "No. It uses Apple's official native Encrypted DNS protocol introduced in iOS 14. No jailbreak and zero apps required."
      },
      {
        question: "Will it interfere with FaceTime or Apple Pay?",
        answer: "Not at all. It strictly handles domain name lookups and does not alter Apple device certificates or system features."
      }
    ],
    badge: "iOS Best Seller",
    isFeatured: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z"
  },
  {
    id: "nexora-ff-ios-season",
    name: "NEXORA Free Fire iOS Season Pass (90 Days)",
    slug: "nexora-ff-ios-season",
    platform: "ios",
    category: "ios",
    shortDescription: "Quarterly rank season pass for competitive Free Fire players on iPhone and iPad.",
    description: "Built for competitive iOS Free Fire athletes competing in ranked seasons, scrims, and community cups. Provides 90 days of uninterrupted encrypted DoH resolution, dual Asia-South Anycast edge nodes, and priority WhatsApp setup support.",
    pricePKR: 950,
    priceUSD: 3.99,
    duration: "3-months",
    durationLabel: "90 Days (Best Value)",
    isRecurring: false,
    availability: "in-stock",
    coverImage: "/images/products/ios-season.webp",
    supportedGames: ["Free Fire", "Free Fire MAX"],
    supportedPlatforms: ["iOS"],
    compatibleDevices: "All compatible Apple iPhones and iPads running iOS 14.0–18+",
    configMethod: "Apple DoH Profile with Dual Edge Peering",
    features: [
      "90-day unbroken validity for full Free Fire competitive seasons",
      "Native Apple .mobileconfig profile with signed cryptographic verification",
      "Optimized lookup for Garena Free Fire auth & matchmaker clusters",
      "Works on both mobile data and home Wi-Fi",
      "Priority WhatsApp technical support",
      "Zero third-party apps or battery drain"
    ],
    limitations: [
      "In-game match ping is governed by your ISP's physical connection to matchmaker servers",
      "Requires iOS 14.0 or newer"
    ],
    specs: {
      protocol: "DNS-over-HTTPS (DoH), TLS 1.3",
      encryption: "TLS 1.3 / Apple Secure Enclave Compatible",
      targetRegion: "Asia-South / Middle East Edge Nodes",
      routingOptimization: "Tier 1 Apple & Garena Peering"
    },
    dnsConfig: {
      primaryIP: "185.193.125.20",
      secondaryIP: "185.193.125.21",
      dohUrl: "https://ff-ios-season.nexoradns.com/dns-query",
      dotHost: "ff-ios-season.pk.nexoradns.com"
    },
    faqs: [
      {
        question: "Can I install the profile on both my iPhone and iPad?",
        answer: "Yes, you can install the signed profile file on both your personal iPhone and iPad."
      }
    ],
    badge: "iOS Season Pass",
    isFeatured: true,
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z"
  },
  {
    id: "nexora-ff-ios-trial",
    name: "NEXORA Free Fire iOS Test Drive (3-Day Free Trial)",
    slug: "nexora-ff-ios-trial",
    platform: "ios",
    category: "free-trial",
    shortDescription: "Experience encrypted Free Fire DNS on your iPhone or iPad for 72 hours risk-free.",
    description: "Test our Apple signed DNS-over-HTTPS profile on your iPhone or iPad before purchasing a full plan. 100% free with instant activation in your customer dashboard.",
    pricePKR: 0,
    priceUSD: 0,
    duration: "trial-3d",
    durationLabel: "72 Hours Free Trial",
    isRecurring: false,
    availability: "in-stock",
    coverImage: "/images/products/ios-trial.webp",
    supportedGames: ["Free Fire", "Free Fire MAX"],
    supportedPlatforms: ["iOS"],
    compatibleDevices: "Any iPhone or iPad running iOS 14.0 or higher",
    configMethod: "Apple Signed Encrypted DNS Profile",
    features: [
      "72-hour trial profile for Free Fire on iOS",
      "Instant activation in your Customer Dashboard",
      "No payment method or credit card required",
      "Step-by-step Safari install walkthrough included",
      "Upgrade to 30-day or 90-day plan anytime"
    ],
    limitations: [
      "Access expires automatically after 72 hours",
      "Limited to one trial per registered account"
    ],
    specs: {
      protocol: "DNS-over-HTTPS (DoH)",
      encryption: "TLS 1.3",
      targetRegion: "Asia-South Edge",
      routingOptimization: "Standard Anycast"
    },
    dnsConfig: {
      primaryIP: "185.193.125.30",
      secondaryIP: "185.193.125.31",
      dohUrl: "https://ff-ios-trial.nexoradns.com/dns-query",
      dotHost: "ff-ios-trial.pk.nexoradns.com"
    },
    faqs: [
      {
        question: "Is the iOS trial completely free?",
        answer: "Yes, it is 100% free with no credit card required."
      }
    ],
    badge: "100% Free Trial",
    isFeatured: false,
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z"
  }
];
