/**
 * ============================================================
 *  SITE CONFIGURATION — Edit this file to customize everything.
 *  No UI code needs to change when you update values here.
 * ============================================================
 */

const SITE_CONFIG = {
  /* ── Brand ─────────────────────────────────────────────── */
  brand: {
    name: "YourBrand",
    tagline: "Gaming DNS Built For Speed",
    description: "Premium gaming-optimized DNS service for mobile gamers. Faster DNS lookups, optimized routing, and stable connections.",
    logo: null,                     // path to logo image, or null to use text
    copyrightYear: "2026",
    supportEmail: "support@yourbrand.com",
    supportHours: "Mon – Sun, 10 AM – 12 AM (PKT)",
    whatsappNumber: "+923001234567", // full international format
    whatsappDisplay: "0300-1234567",
    socialLinks: {
      instagram: "https://instagram.com/yourbrand",
      twitter: "https://twitter.com/yourbrand",
      discord: "https://discord.gg/yourbrand",
      youtube: "https://youtube.com/@yourbrand",
      facebook: "https://facebook.com/yourbrand",
    },
  },

  /* ── Currency ──────────────────────────────────────────── */
  currency: {
    code: "PKR",
    symbol: "Rs.",
  },

  /* ── DNS Servers ───────────────────────────────────────── */
  dnsServers: [
    {
      region: "Asia",
      flag: "🌏",
      servers: [
        { name: "Asia Primary",   primary: "103.10.20.1",  secondary: "103.10.20.2",  hostname: "asia1.yourbrand.dns", tier: "free",    status: "online"  },
        { name: "Asia Optimized", primary: "103.10.21.1",  secondary: "103.10.21.2",  hostname: "asia2.yourbrand.dns", tier: "premium", status: "online"  },
      ],
    },
    {
      region: "Middle East",
      flag: "🕌",
      servers: [
        { name: "ME Primary",    primary: "185.50.30.1",  secondary: "185.50.30.2",  hostname: "me1.yourbrand.dns",   tier: "free",    status: "online"  },
        { name: "ME Optimized",  primary: "185.50.31.1",  secondary: "185.50.31.2",  hostname: "me2.yourbrand.dns",   tier: "premium", status: "online"  },
      ],
    },
    {
      region: "Europe",
      flag: "🇪🇺",
      servers: [
        { name: "EU Primary",    primary: "80.90.10.1",   secondary: "80.90.10.2",   hostname: "eu1.yourbrand.dns",   tier: "free",    status: "online"  },
        { name: "EU Optimized",  primary: "80.90.11.1",   secondary: "80.90.11.2",   hostname: "eu2.yourbrand.dns",   tier: "premium", status: "offline" },
      ],
    },
    {
      region: "Global",
      flag: "🌐",
      servers: [
        { name: "Global Anycast",    primary: "45.60.70.1",  secondary: "45.60.70.2",  hostname: "global.yourbrand.dns",    tier: "free",    status: "online" },
        { name: "Global Ultra-Low",  primary: "45.60.71.1",  secondary: "45.60.71.2",  hostname: "globalpro.yourbrand.dns", tier: "premium", status: "online" },
      ],
    },
  ],

  /* ── Pricing Plans (PKR) ───────────────────────────────── */
  plans: [
    {
      id: "free",
      name: "Free",
      duration: "Forever",
      price: 0,
      period: "",
      features: [
        "2 DNS Regions",
        "Standard DNS Servers",
        "Basic Speed Optimization",
        "Community Support",
      ],
      disabledFeatures: [
        "Premium DNS Servers",
        "All Regions Unlocked",
        "Priority Support",
        "Fastest Routes",
      ],
      badge: null,
      recommended: false,
    },
    {
      id: "monthly",
      name: "Monthly",
      duration: "1 Month",
      price: 250,
      period: "/mo",
      features: [
        "All DNS Regions",
        "Premium DNS Servers",
        "Optimized Routing",
        "WhatsApp Support",
        "Instant Activation",
      ],
      disabledFeatures: [],
      badge: null,
      recommended: false,
    },
    {
      id: "quarterly",
      name: "3 Months",
      duration: "3 Months",
      price: 600,
      period: "/3 mo",
      savings: "Save Rs. 150",
      features: [
        "All DNS Regions",
        "Premium DNS Servers",
        "Optimized Routing",
        "Priority WhatsApp Support",
        "Instant Activation",
        "Auto-Renew Reminder",
      ],
      disabledFeatures: [],
      badge: "Best Value",
      recommended: true,
    },
    {
      id: "yearly",
      name: "Yearly",
      duration: "12 Months",
      price: 1800,
      period: "/yr",
      savings: "Save Rs. 1,200",
      features: [
        "All DNS Regions",
        "Premium DNS Servers",
        "Optimized Routing",
        "Priority WhatsApp Support",
        "Instant Activation",
        "Auto-Renew Reminder",
        "Early Access to New Servers",
      ],
      disabledFeatures: [],
      badge: "Pro Gamer",
      recommended: false,
    },
  ],

  /* ── Payment Methods ───────────────────────────────────── */
  payment: {
    methods: [
      {
        id: "easypaisa",
        name: "Easypaisa",
        icon: "📱",
        color: "#4CAF50",
        accountTitle: "Your Brand Name",
        accountNumber: "0300-1234567",
        instructions: [
          "Open the Easypaisa app or dial *786#",
          "Select 'Send Money'",
          "Enter the account number shown above",
          "Enter the exact plan amount",
          "Confirm and note the Transaction ID (TID)",
          "Come back here and enter your TID",
        ],
      },
      {
        id: "jazzcash",
        name: "JazzCash",
        icon: "📲",
        color: "#E4002B",
        accountTitle: "Your Brand Name",
        accountNumber: "0301-9876543",
        instructions: [
          "Open the JazzCash app or dial *786#",
          "Select 'Send Money'",
          "Enter the account number shown above",
          "Enter the exact plan amount",
          "Confirm and note the Transaction ID (TID)",
          "Come back here and enter your TID",
        ],
      },
    ],
    activationTime: "within 30 minutes",
    refundPolicy: "Refund available within 3 days of purchase if DNS credentials are unused.",
  },

  /* ── Supported Games ───────────────────────────────────── */
  games: [
    { name: "PUBG Mobile",         icon: "🎯" },
    { name: "Free Fire",           icon: "🔥" },
    { name: "Call of Duty Mobile", icon: "🎖️" },
    { name: "Mobile Legends",     icon: "⚔️" },
    { name: "Clash Royale",       icon: "🏰" },
    { name: "Genshin Impact",     icon: "⭐" },
    { name: "Roblox",             icon: "🧱" },
    { name: "Fortnite Mobile",    icon: "🏗️" },
    { name: "Stumble Guys",       icon: "🏃" },
    { name: "Brawl Stars",        icon: "💥" },
    { name: "Apex Legends Mobile",icon: "🦅" },
    { name: "Minecraft",          icon: "⛏️" },
  ],

  /* ── Stats (displayed on home page) ────────────────────── */
  stats: {
    activeUsers: 12500,
    serversOnline: 28,
    uptimePercent: 99.8,
    countriesServed: 15,
  },

  /* ── Testimonials ──────────────────────────────────────── */
  testimonials: [
    {
      name: "Ahmed K.",
      rating: 5,
      text: "My PUBG ping dropped noticeably after switching DNS. Setup took 2 minutes on my Android. Highly recommend!",
      device: "Android",
      verified: true,
    },
    {
      name: "Sara M.",
      rating: 5,
      text: "I was skeptical, but the difference in matchmaking speed on Free Fire is real. Worth every rupee.",
      device: "iOS",
      verified: true,
    },
    {
      name: "Hassan R.",
      rating: 4,
      text: "Good DNS service with fast activation. JazzCash payment was smooth. Support replied on WhatsApp within minutes.",
      device: "Android",
      verified: true,
    },
    {
      name: "Fatima Z.",
      rating: 5,
      text: "Finally a DNS service that works well in Pakistan. The yearly plan is great value. Easy iOS profile install.",
      device: "iOS",
      verified: true,
    },
    {
      name: "Bilal A.",
      rating: 4,
      text: "Been using for 3 months. Consistent performance on COD Mobile. The setup guide was very clear.",
      device: "Android",
      verified: true,
    },
  ],

  /* ── FAQ ────────────────────────────────────────────────── */
  faq: [
    {
      q: "What is DNS and how does it help gaming?",
      a: "DNS (Domain Name System) translates domain names into IP addresses. A faster, optimized DNS can speed up the initial connection to game servers, potentially reducing matchmaking time and improving route selection.",
    },
    {
      q: "Will this reduce my ping?",
      a: "DNS optimization can improve DNS lookup times and help your device find faster routes to game servers. The exact improvement varies by your location, ISP, and the game you play. We do not guarantee specific ping reductions, but most users report a noticeable improvement.",
    },
    {
      q: "Is it safe to change my DNS?",
      a: "Yes. Changing DNS is a standard network setting available on all devices. Our DNS servers do not log your browsing activity. You can revert to your default DNS at any time.",
    },
    {
      q: "How do I remove or reset DNS settings?",
      a: "Simply go back to your device's network settings and switch DNS back to 'Automatic' (iOS) or remove the Private DNS hostname (Android). Our setup guides include step-by-step removal instructions.",
    },
    {
      q: "Does it work on mobile data (4G/5G)?",
      a: "On Android, Private DNS works on both Wi-Fi and mobile data. On iOS, manual DNS settings apply per Wi-Fi network. For iOS mobile data, we offer a DNS profile that works system-wide.",
    },
    {
      q: "How long does activation take after payment?",
      a: "Most orders are activated within 30 minutes. During peak hours, it may take up to 1 hour. You will receive confirmation via WhatsApp.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Easypaisa and JazzCash. Simply send the plan amount to our account and share the Transaction ID for verification.",
    },
    {
      q: "What is your refund policy?",
      a: "We offer a refund within 3 days of purchase if the premium DNS credentials have not been used. Contact us via WhatsApp with your order ID to request a refund.",
    },
  ],

  /* ── Ping Test Regions (simulated, ready for real API) ─── */
  pingRegions: [
    { id: "asia",        label: "Asia",        baseLatency: 35,  variance: 15 },
    { id: "middle-east", label: "Middle East",  baseLatency: 45,  variance: 20 },
    { id: "europe",      label: "Europe",       baseLatency: 80,  variance: 25 },
    { id: "global",      label: "Global",       baseLatency: 55,  variance: 18 },
  ],

  /* ── Setup Guide Content ───────────────────────────────── */
  guides: {
    ios: {
      title: "iOS Setup Guide",
      subtitle: "Configure premium DNS on your iPhone or iPad",
      methods: [
        {
          name: "Wi-Fi DNS (Manual)",
          steps: [
            { title: "Open Settings",            description: "Go to Settings on your iPhone or iPad." },
            { title: "Tap Wi-Fi",                 description: "Select the Wi-Fi option from the list." },
            { title: "Tap the (i) icon",          description: "Tap the info icon next to your connected network." },
            { title: "Tap Configure DNS",         description: "Scroll down and tap 'Configure DNS'." },
            { title: "Select Manual",             description: "Change from 'Automatic' to 'Manual'." },
            { title: "Remove existing servers",   description: "Tap the red minus icon to remove existing DNS entries." },
            { title: "Add DNS servers",           description: "Tap 'Add Server' and enter the Primary DNS address. Repeat for the Secondary DNS." },
            { title: "Save",                      description: "Tap 'Save' in the top-right corner. You're all set!" },
          ],
        },
        {
          name: "DNS Profile (Recommended)",
          steps: [
            { title: "Download Profile",          description: "Tap the download button below to get the DNS configuration profile." },
            { title: "Open Settings",             description: "Go to Settings. You'll see a 'Profile Downloaded' prompt near the top." },
            { title: "Install Profile",           description: "Tap the prompt and follow the on-screen instructions to install." },
            { title: "Verify",                    description: "Go to Settings > General > VPN & Device Management to confirm the profile is active." },
          ],
          profileDownload: true,
        },
      ],
      mobileDataNote: "Manual DNS settings only apply to Wi-Fi networks. To use our DNS on mobile data (4G/5G), install the DNS profile above.",
      troubleshooting: [
        { q: "DNS settings reset after reconnecting to Wi-Fi", a: "This can happen on some iOS versions. We recommend using the DNS Profile method for persistent settings." },
        { q: "Cannot browse after changing DNS",                a: "Double-check the DNS addresses. If the issue persists, revert to 'Automatic' DNS and contact our support." },
        { q: "Profile fails to install",                        a: "Make sure you are using Safari to download the profile. Other browsers may not trigger the iOS profile installer." },
      ],
      removal: {
        title: "Remove DNS / Reset to Default",
        steps: [
          "Go to Settings > Wi-Fi > tap (i) on your network.",
          "Tap Configure DNS and switch back to 'Automatic'.",
          "If you installed a DNS profile, go to Settings > General > VPN & Device Management, select the profile, and tap 'Remove Profile'.",
        ],
      },
    },
    android: {
      title: "Android Setup Guide",
      subtitle: "Configure premium DNS on your Android device",
      methods: [
        {
          name: "Private DNS (Android 9+)",
          recommended: true,
          steps: [
            { title: "Open Settings",               description: "Go to Settings on your Android device." },
            { title: "Network & Internet",           description: "Tap 'Network & Internet' or 'Connections' (varies by device)." },
            { title: "Private DNS",                  description: "Tap 'Private DNS' (you may need to tap 'Advanced' or 'More connection settings' first)." },
            { title: "Select Private DNS provider",  description: "Choose 'Private DNS provider hostname'." },
            { title: "Enter hostname",               description: "Enter the DNS hostname provided to you (e.g., asia1.yourbrand.dns)." },
            { title: "Save",                         description: "Tap 'Save'. Private DNS now works on both Wi-Fi and mobile data!" },
          ],
        },
        {
          name: "Wi-Fi DNS (All Versions)",
          steps: [
            { title: "Open Settings",               description: "Go to Settings > Wi-Fi." },
            { title: "Long-press your network",      description: "Long-press (or tap the gear icon) on your connected network." },
            { title: "Modify Network",               description: "Tap 'Modify Network' or 'Advanced'." },
            { title: "Change IP settings",           description: "Change IP settings from 'DHCP' to 'Static'." },
            { title: "Enter DNS addresses",          description: "Enter the Primary DNS in 'DNS 1' and Secondary DNS in 'DNS 2'. Keep other fields unchanged." },
            { title: "Save",                         description: "Tap 'Save'. Your DNS is now configured for this Wi-Fi network." },
          ],
        },
      ],
      troubleshooting: [
        { q: "Cannot find Private DNS option",       a: "Private DNS is available on Android 9 (Pie) and above. If you're on an older version, use the Wi-Fi DNS method instead." },
        { q: "'Could not connect' error on Private DNS", a: "Verify the hostname is entered correctly with no spaces. Some ISPs block Private DNS — try switching to the Wi-Fi method." },
        { q: "DNS not working on mobile data",       a: "The Wi-Fi method only works on Wi-Fi. Use the Private DNS (hostname) method for mobile data support." },
      ],
      removal: {
        title: "Remove DNS / Reset to Default",
        steps: [
          "For Private DNS: Go to Settings > Network & Internet > Private DNS and select 'Automatic' or 'Off'.",
          "For Wi-Fi DNS: Go to Wi-Fi settings, modify your network, and change IP settings back to 'DHCP'.",
        ],
      },
    },
  },
};

/* Make config available globally */
if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}
