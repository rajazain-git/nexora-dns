export interface CompatibilityRule {
  id: string;
  platform: 'android' | 'ios';
  osVersions: string[];
  supportedMethods: string[];
  status: 'verified_compatible' | 'partially_compatible' | 'incompatible' | 'unverified';
  statusLabel: {
    en: string;
    ur: string;
  };
  summary: {
    en: string;
    ur: string;
  };
  prerequisites: {
    en: string[];
    ur: string[];
  };
  setupSteps: {
    en: string[];
    ur: string[];
  };
  limitations: {
    en: string[];
    ur: string[];
  };
  compatibleProductIds: string[];
  troubleshootingSlug: string;
}

export const COMPATIBILITY_RULES: CompatibilityRule[] = [
  {
    id: 'android-modern-dot',
    platform: 'android',
    osVersions: ['Android 15', 'Android 14', 'Android 13', 'Android 12', 'Android 11', 'Android 10', 'Android 9.0 (Pie)'],
    supportedMethods: ['Native Private DNS (DNS-over-TLS Port 853)'],
    status: 'verified_compatible',
    statusLabel: {
      en: '100% Native Compatible (Zero App Required)',
      ur: 'مکمل ہم آہنگ (بغیر کسی ایپ کے نیشل پرائیویٹ ڈی این ایس)'
    },
    summary: {
      en: 'Your Android device features native Android Private DNS (RFC 7858). You can enter the NEXORA DoT hostname directly in your system settings without battery drain or background apps.',
      ur: 'آپ کے اینڈرائیڈ فون میں پرائیویٹ ڈی این ایس موجود ہے۔ آپ بغیر کسی ایپ اور بیٹری کے نقصان کے براہ راست سیٹنگز میں نکسورا ڈی این ایس چلا سکتے ہیں۔'
    },
    prerequisites: {
      en: [
        'Android OS 9.0 or higher (Stock, One UI, MIUI/HyperOS, ColorOS, FunTouch, XOS, HiOS)',
        'Active internet connection (4G/5G LTE or Wi-Fi)',
        'Carrier network permitting TCP Port 853 (Jazz, Zong, Telenor, Ufone, PTCL, StormFiber verified)'
      ],
      ur: [
        'اینڈرائیڈ 9 یا اس سے نیا ورژن',
        'فعال انٹرنیٹ کنکشن (جاز، زونگ، ٹیلی نار، یوفون، پی ٹی سی ایل، اسٹورم فائبر)',
        'پورٹ 853 کی فراہمی'
      ]
    },
    setupSteps: {
      en: [
        'Open your Android device "Settings".',
        'Navigate to "Network & Internet" or "Connections" -> "More Connection Settings".',
        'Tap on "Private DNS".',
        'Select "Private DNS provider hostname".',
        'Enter your assigned NEXORA DoT hostname (e.g., ff-pk.nexoradns.com).',
        'Tap "Save". Launch Free Fire or Free Fire MAX and verify smooth matchmaking.'
      ],
      ur: [
        'اپنے موبائل کی سیٹنگز (Settings) کھولیں۔',
        '"Network & Internet" یا "Connections" پر جائیں۔',
        '"Private DNS" کے آپشن کو منتخب کریں۔',
        '"Private DNS provider hostname" پر کلک کریں۔',
        'اپنا فراہم کردہ نکسورا ڈی این ایس درج کریں۔',
        '"Save" دبائیں اور فری فائر چلا کر میچ میکنگ چیک کریں۔'
      ]
    },
    limitations: {
      en: [
        'Does not alter in-game gun mechanics, recoil, or hit registration.',
        'Requires TCP port 853 to be unblocked by your local Wi-Fi router or campus firewall.',
        'If carrier disconnects, temporarily set Private DNS to "Automatic" to diagnose.'
      ],
      ur: [
        'یہ ریکوئل یا گن ڈیمیج کو تبدیل نہیں کرتا، صرف نیٹ ورک روٹنگ کو تیز کرتا ہے۔',
        'اگر راؤٹر پر پورٹ 853 بلاک ہو تو یہ کام نہیں کرے گا۔'
      ]
    },
    compatibleProductIds: [
      'nexora-ff-android-pro',
      'nexora-ff-android-season',
      'nexora-ff-android-trial'
    ],
    troubleshootingSlug: 'android-private-dns-error'
  },
  {
    id: 'android-legacy',
    platform: 'android',
    osVersions: ['Android 8.1 (Oreo) and below'],
    supportedMethods: ['Manual Wi-Fi Static DNS (IPv4)'],
    status: 'partially_compatible',
    statusLabel: {
      en: 'Partially Compatible (Wi-Fi Only / No Native DoT)',
      ur: 'جزوی ہم آہنگ (صرف وائی فائی / سم ڈیٹا پر نااہل)'
    },
    summary: {
      en: 'Android 8.1 and earlier lack native Private DNS (DoT). NEXORA primary/secondary IPv4 anycast IPs can be configured on individual Wi-Fi networks, but mobile data (4G/5G) cannot use native encrypted DNS without external VPN wrappers.',
      ur: 'اینڈرائیڈ 8 اور اس سے پرانے ورژنز میں پرائیویٹ ڈی این ایس موجود نہیں ہے۔ صرف وائی فائی پر مینوئل آئی پی کے ذریعے استعمال کیا جا سکتا ہے۔'
    },
    prerequisites: {
      en: [
        'Static Wi-Fi IP configuration access',
        'NEXORA Primary and Secondary IPv4 Anycast addresses'
      ],
      ur: [
        'وائی فائی نیٹ ورک پر اسٹیٹک آئی پی سیٹ کرنے کی سہولت'
      ]
    },
    setupSteps: {
      en: [
        'Open Wi-Fi settings and long-press your active Wi-Fi connection.',
        'Select "Modify Network" -> "Advanced Options".',
        'Change IP Settings from "DHCP" to "Static".',
        'Keep existing IP/Gateway and set DNS 1 & DNS 2 to NEXORA Anycast IPs.',
        'Save network settings.'
      ],
      ur: [
        'وائی فائی سیٹنگز میں جا کر اپنے نیٹ ورک پر لانگ پریس کریں۔',
        '"Modify Network" منتخب کریں اور IP Settings کو "Static" کریں۔',
        'DNS 1 اور DNS 2 میں نکسورا کے آئی پی ایڈریس درج کریں۔'
      ]
    },
    limitations: {
      en: [
        'Only works when connected to that specific Wi-Fi network.',
        'Does not protect or optimize mobile cellular data (4G/5G).',
        'Upgrading to a phone running Android 9+ is strongly recommended.'
      ],
      ur: [
        'صرف مخصوص وائی فائی پر کام کرے گا، سم ڈیٹا پر کام نہیں کرے گا۔'
      ]
    },
    compatibleProductIds: [
      'nexora-ff-android-pro',
      'nexora-ff-android-season'
    ],
    troubleshootingSlug: 'android-legacy-no-private-dns'
  },
  {
    id: 'ios-modern-doh',
    platform: 'ios',
    osVersions: ['iOS 18', 'iOS 17', 'iOS 16', 'iOS 15', 'iOS 14'],
    supportedMethods: ['Apple Encrypted DNS Profile (.mobileconfig DoH)'],
    status: 'verified_compatible',
    statusLabel: {
      en: '100% Native Apple Verified (Zero Jailbreak)',
      ur: '100% مصدقہ ایپل پروٹوکول (بغیر کسی جیل بریک)'
    },
    summary: {
      en: 'Your iPhone/iPad natively supports Apple Encrypted DNS (RFC 8484) via a signed .mobileconfig profile. Operates system-wide across both 4G/5G cellular and Wi-Fi networks with zero battery impact.',
      ur: 'آپ کا آئی فون یا آئی پیڈ باقاعدہ ایپل ڈی این ایس پروفائل کو سپورٹ کرتا ہے۔ یہ سم ڈیٹا اور وائی فائی دونوں پر بہترین کام کرتا ہے۔'
    },
    prerequisites: {
      en: [
        'Apple iOS 14.0 or later (iPhone 11, 12, 13, 14, 15, 16 series, iPhone SE 2/3, iPad)',
        'Apple Safari Browser to download the .mobileconfig profile',
        'Device Passcode to authorize profile installation in Settings'
      ],
      ur: [
        'ایپل آئی او ایس 14 یا اس سے نیا ورژن',
        'سفاری براؤزر پروفائل ڈاؤن لوڈ کرنے کے لیے',
        'فون کا پاس کوڈ پروفائل انسٹال کرنے کے لیے'
      ]
    },
    setupSteps: {
      en: [
        'Open Safari and tap the Download Profile link provided in your order fulfillment page.',
        'Tap "Allow" when Safari asks to download the configuration profile.',
        'Open iOS "Settings" -> tap the new "Profile Downloaded" banner at the top.',
        'Tap "Install" in the top-right corner and enter your iPhone passcode.',
        'Tap "Install" again to confirm.',
        'Go to Settings -> General -> VPN & Device Management -> DNS, and ensure NEXORA DoH is selected.',
        'Launch Free Fire and enjoy stable routing.'
      ],
      ur: [
        'سفاری براؤزر کھولیں اور اپنی پروڈکٹ ڈیلیوری سے پروفائل ڈاؤن لوڈ کریں۔',
        'پاپ اپ میں "Allow" پر کلک کریں۔',
        'آئی فون کی "Settings" کھولیں اور "Profile Downloaded" پر ٹیپ کریں۔',
        'اوپر دائیں کونے میں "Install" دبائیں اور اپنا پاس کوڈ درج کریں۔',
        'سیٹنگز -> VPN & Device Management -> DNS میں جا کر نکسورا کو منتخب کریں۔'
      ]
    },
    limitations: {
      en: [
        'Must be downloaded through Safari browser (Chrome or Firefox on iOS cannot install system profiles).',
        'Third-party VPN apps will take precedence over encrypted DNS profiles while active.',
        'Does not guarantee lower base ping if your physical distance from ISP cell tower is high.'
      ],
      ur: [
        'پروفائل کو لازمی سفاری براؤزر سے ڈاؤن لوڈ کرنا ہوگا۔',
        'اگر کوئی دوسرا وی پی این آن ہو تو ڈی این ایس عارضی طور پر رک سکتا ہے۔'
      ]
    },
    compatibleProductIds: [
      'nexora-ff-ios-pro',
      'nexora-ff-ios-season',
      'nexora-ff-ios-trial'
    ],
    troubleshootingSlug: 'ios-profile-not-active'
  },
  {
    id: 'ios-legacy',
    platform: 'ios',
    osVersions: ['iOS 13 and below'],
    supportedMethods: ['Manual Wi-Fi DNS Settings'],
    status: 'incompatible',
    statusLabel: {
      en: 'Incompatible for Encrypted DoH Profile',
      ur: 'نااہل (پرانے آئی او ایس پر انکرپٹڈ پروفائل کام نہیں کرتی)'
    },
    summary: {
      en: 'Apple added system-wide Encrypted DNS (DoH/DoT) profiles starting in iOS 14. iOS 13 and earlier cannot use NEXORA mobileconfig profiles. Updating your device via Settings -> General -> Software Update is required.',
      ur: 'ایپل نے انکرپٹڈ پروفائلز آئی او ایس 14 سے متعارف کروائی ہیں۔ پرانے آئی او ایس کو پہلے اپڈیٹ کریں۔'
    },
    prerequisites: {
      en: ['Software update to iOS 14 or later'],
      ur: ['آئی او ایس کو کم از کم ورژن 14 پر اپڈیٹ کریں']
    },
    setupSteps: {
      en: [
        'Check if your iPhone model supports iOS 14 or higher.',
        'Go to Settings -> General -> Software Update and install the latest available update.',
        'Re-run this compatibility checker once updated.'
      ],
      ur: [
        'سیٹنگز -> جنرل -> سافٹ ویئر اپڈیٹ میں جا کر فون کو اپڈیٹ کریں۔'
      ]
    },
    limitations: {
      en: ['Device cannot run signed encrypted profiles on legacy iOS kernels.'],
      ur: ['پرانے فون پر انکرپٹڈ پروفائل سپورٹڈ نہیں ہے۔']
    },
    compatibleProductIds: [],
    troubleshootingSlug: 'ios-version-outdated'
  }
];

export function checkDeviceCompatibility(
  platform: 'android' | 'ios',
  osVersion: string
): CompatibilityRule | null {
  const match = COMPATIBILITY_RULES.find(rule => 
    rule.platform === platform && rule.osVersions.some(v => osVersion.toLowerCase().includes(v.toLowerCase()))
  );
  return match || null;
}
