export interface TroubleshootingArticle {
  id: string;
  title: string;
  platform: 'android' | 'ios' | 'general';
  category: 'setup' | 'connection' | 'payment' | 'gameplay';
  summary: string;
  symptoms: string[];
  steps: string[];
  revertInstructions: string;
  urgency: 'low' | 'medium' | 'high';
}

export const TROUBLESHOOTING_ARTICLES: TroubleshootingArticle[] = [
  {
    id: 'android-private-dns-couldnt-connect',
    title: 'Android: "Couldn\'t connect" or "No internet access" when saving Private DNS',
    platform: 'android',
    category: 'connection',
    summary: 'Occurs when Android cannot complete the TLS handshake on Port 853 with the resolver hostname.',
    symptoms: [
      'Android displays "Couldn\'t connect" under Private DNS setting.',
      'Wi-Fi icon shows an exclamation mark or reports "No internet".',
      'Free Fire fails to connect to login servers.'
    ],
    steps: [
      'Check for Typo / Protocol Prefix: In Android Private DNS, do NOT write "https://", "dot://", or port numbers. Enter only the exact hostname (e.g. "ff-pk.nexoradns.com").',
      'Test Cellular vs Wi-Fi: Switch from your local Wi-Fi to Mobile Data (Jazz, Zong, Telenor, Ufone). If mobile data connects instantly, your Wi-Fi router or ISP has outbound TCP Port 853 filtered.',
      'Verify System Date & Time: Android TLS validation strictly rejects certificates if your device clock is off by more than 2 minutes. Enable "Use network-provided time".',
      'Disable Active VPNs: Third-party VPN apps or ad-blockers running in the background will intercept Android Private DNS sockets.'
    ],
    revertInstructions: 'To restore standard connectivity immediately, navigate to Settings > Network & Internet > Private DNS, and select "Automatic" or "Off", then tap Save.',
    urgency: 'high'
  },
  {
    id: 'ios-profile-download-safari',
    title: 'Apple iOS: Profile downloaded but not showing in Settings or not active',
    platform: 'ios',
    category: 'setup',
    summary: 'Apple requires configuration profiles to be downloaded strictly through Safari and approved with your device passcode.',
    symptoms: [
      'Tapping "Download Profile" in Chrome or Firefox gives an error or downloads a raw text file.',
      'Settings does not show the "Profile Downloaded" banner at the top.',
      'DNS queries are still routing through standard mobile carrier.'
    ],
    steps: [
      'Use Safari Only: Apple iOS does not allow Chrome, Opera, or Firefox to install system profiles. Copy your profile link and open it in Safari.',
      'Tap "Allow": When the browser prompt asks "This website is trying to download a configuration profile. Do you want to allow this?", tap "Allow".',
      'Authorize in Settings: Open iOS Settings > tap the top banner "Profile Downloaded" (or Settings > General > VPN & Device Management). Tap "Install" in the top right corner.',
      'Confirm DNS Selection: Under Settings > General > VPN & Device Management > DNS, ensure "NEXORA Encrypted DoH" is checked with a blue checkmark.'
    ],
    revertInstructions: 'To remove the profile at any time, open iOS Settings > General > VPN & Device Management > NEXORA DNS Profile > tap "Remove Profile" and enter your device passcode.',
    urgency: 'medium'
  },
  {
    id: 'jazz-zong-mobile-carrier-dns',
    title: 'Mobile Carrier Data: DNS working on Wi-Fi but timing out on 4G/5G SIM',
    platform: 'general',
    category: 'connection',
    summary: 'Certain local mobile cell towers intercept port 53 or throttle unusual ports during peak hours.',
    symptoms: [
      'Connecting to Wi-Fi works seamlessly, but toggling to 4G/LTE drops connectivity.',
      'Free Fire takes more than 10 seconds to enter matchmaking queue.'
    ],
    steps: [
      'Toggle Airplane Mode: Toggle Airplane mode ON for 10 seconds, then OFF to force your SIM to re-register on a fresh cell tower IP.',
      'Check APN Protocol: In Settings > Mobile Networks > Access Point Names > Your Carrier APN > ensure APN Protocol is set to "IPv4/IPv6".',
      'Use Anycast Regional Hostname: If using our primary node, switch to your assigned secondary regional node (e.g. "ff-backup.nexoradns.com").'
    ],
    revertInstructions: 'Switch Private DNS back to "Automatic" in your phone settings to verify if your carrier SIM has active data quota.',
    urgency: 'medium'
  },
  {
    id: 'payment-tid-pending-status',
    title: 'Billing: Paid via Easypaisa or JazzCash but status shows "Awaiting Verification"',
    platform: 'general',
    category: 'payment',
    summary: 'Guest orders paid through manual Easypaisa/JazzCash require our finance team to reconcile the SMS Transaction ID (TID).',
    symptoms: [
      'Checkout success page shows amber clock icon and "Awaiting Verification".',
      'Order reference is generated but credentials are not yet visible.'
    ],
    steps: [
      'Allow Verification Window: Reconciliations are completed within 5-15 minutes between 9:00 AM and 12:00 AM PKT.',
      'Check Track My Order: Open the /track-order page with your Order Reference to see live progress.',
      'Submit Receipt to WhatsApp: If your order has been pending for more than 30 minutes, click our WhatsApp support link and send a screenshot of your Easypaisa/JazzCash transaction receipt.'
    ],
    revertInstructions: 'If your payment was sent to an incorrect number, notify support immediately with your payment timestamp and sender account.',
    urgency: 'low'
  },
  {
    id: 'gameplay-ping-limitations-honesty',
    title: 'Free Fire Ping: Why ping did not drop to 10ms or hit registration seems unchanged',
    platform: 'general',
    category: 'gameplay',
    summary: 'Honest technical disclosure on the laws of physics and network routing.',
    symptoms: [
      'Customer expected 5ms ping on a 4G connection located far from game servers.',
      'In-game ping remains around 40-60ms.'
    ],
    steps: [
      'Understanding DNS Role: DNS optimizes domain name lookup routes to Garena edge matchmakers. Once a match begins, packets travel over your ISP physical fiber/cellular tower directly to Garena game servers.',
      'Physical Distance Realities: Light travels through fiber-optic cables at ~200km/ms. From Pakistan to Singapore Garena servers, the physical round-trip time is ~60-80ms; to Middle East servers it is ~35-50ms. No DNS can bypass physics.',
      'What NEXORA Actually Does: Eliminates carrier DNS packet jitter, DNS lookup delays, and regional server resolve failures. It does not manipulate gun recoil or game mechanics.'
    ],
    revertInstructions: 'You can test your edge latency at any time using our Route Tester tool (/ping-test).',
    urgency: 'low'
  }
];

export interface DiagnosticQuestion {
  id: string;
  text: string;
  options: Array<{
    label: string;
    nextStepId?: string;
    recommendedArticleId?: string;
    solutionNote?: string;
  }>;
}

export const DIAGNOSTIC_FLOW: Record<string, DiagnosticQuestion> = {
  start: {
    id: 'start',
    text: 'What platform is your mobile device running?',
    options: [
      { label: 'Android (Samsung, Xiaomi, Poco, Infinix, etc.)', nextStepId: 'android-issue' },
      { label: 'Apple iOS (iPhone, iPad)', nextStepId: 'ios-issue' },
      { label: 'Billing, Order Delivery, or Other', nextStepId: 'billing-issue' }
    ]
  },
  'android-issue': {
    id: 'android-issue',
    text: 'What specific problem are you encountering on Android?',
    options: [
      { 
        label: 'Phone says "Couldn\'t connect" when entering Private DNS', 
        recommendedArticleId: 'android-private-dns-couldnt-connect' 
      },
      { 
        label: 'Works on Wi-Fi, but fails or loses internet on Mobile Data', 
        recommendedArticleId: 'jazz-zong-mobile-carrier-dns' 
      },
      { 
        label: 'Cannot find "Private DNS" menu in phone settings', 
        solutionNote: 'If your device is running Android 8.1 or below, native Private DNS is not supported. Please check Settings > About Phone to confirm Android OS version.' 
      }
    ]
  },
  'ios-issue': {
    id: 'ios-issue',
    text: 'What specific issue is occurring on your Apple device?',
    options: [
      { 
        label: 'Cannot download or install the .mobileconfig profile', 
        recommendedArticleId: 'ios-profile-download-safari' 
      },
      { 
        label: 'Profile installed, but DNS shows disconnected or inactive', 
        solutionNote: 'Go to Settings > General > VPN & Device Management > DNS, and confirm that NEXORA Encrypted DNS is selected with a blue checkmark.' 
      },
      { 
        label: 'Free Fire in-game ping questions', 
        recommendedArticleId: 'gameplay-ping-limitations-honesty' 
      }
    ]
  },
  'billing-issue': {
    id: 'billing-issue',
    text: 'What is your question regarding billing or delivery?',
    options: [
      { 
        label: 'I paid via Easypaisa/JazzCash but haven\'t received credentials', 
        recommendedArticleId: 'payment-tid-pending-status' 
      },
      { 
        label: 'I want to track an existing guest order', 
        solutionNote: 'Use our /track-order page with your Order Reference (NX-...) to view live status.' 
      }
    ]
  }
};
