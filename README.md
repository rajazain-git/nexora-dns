# YourBrand — Gaming DNS Store

A modern, fully responsive, premium gaming DNS store website with a glassmorphism design. Built as a real, trustworthy online store for selling gaming-optimized DNS servers to mobile gamers in Pakistan.

![Status](https://img.shields.io/badge/status-ready-34D399?style=flat-square)
![Platform](https://img.shields.io/badge/platform-iOS%20%26%20Android-8B5CF6?style=flat-square)
![Payment](https://img.shields.io/badge/payment-Easypaisa%20%26%20JazzCash-E8C987?style=flat-square)

---

## 🚀 Quick Start

No build tools needed — this is a static site. Just serve the files:

### Option 1: Open directly
Double-click `index.html` to open in your browser.

### Option 2: Local server (recommended for full functionality)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000

# Using VS Code
# Install "Live Server" extension, right-click index.html → "Open with Live Server"
```

Then visit `http://localhost:8000`.

---

## 📁 Project Structure

```
Dns Website/
├── index.html              # Home page (all 15 sections)
├── checkout.html           # Multi-step checkout flow
├── ios-guide.html          # iOS DNS setup guide
├── android-guide.html      # Android DNS setup guide
├── contact.html            # Contact & support form
├── order-tracking.html     # Order status tracking
├── terms.html              # Terms of Service
├── privacy.html            # Privacy Policy
├── refund.html             # Refund Policy
├── 404.html                # Styled 404 page
│
├── css/
│   ├── style.css           # Main stylesheet (design system, components, layout)
│   └── animations.css      # Animations (scroll reveal, hover, orbs, transitions)
│
├── js/
│   ├── config.js           # ⭐ ALL PLACEHOLDER DATA — edit this file!
│   ├── components.js       # Reusable UI components (toast, modal, validation)
│   ├── animations.js       # Animation controller (scroll, tilt, magnetic, counters)
│   ├── app.js              # Home page logic (renders sections from config)
│   ├── checkout.js         # Checkout flow logic
│   └── payment.js          # Payment provider interface (gateway-ready)
│
└── README.md               # This file
```

---

## ⚙️ Customization Guide

### Everything is in one file: `js/config.js`

Open `js/config.js` and edit the values. The entire site updates automatically — no need to touch any other file.

### 🏷️ Change Brand Name
```js
brand: {
  name: "YourBrand",         // ← Change to your brand name
  tagline: "Gaming DNS Built For Speed",
  description: "...",
  logo: null,                // ← Set path to your logo image, or leave null for text
}
```

### 💰 Change Prices (PKR)
```js
plans: [
  {
    id: "monthly",
    name: "Monthly",
    price: 250,              // ← Change price in PKR
    // ...
  },
  {
    id: "quarterly",
    name: "3 Months",
    price: 600,              // ← Change price
    savings: "Save Rs. 150", // ← Update savings text
    // ...
  },
]
```

### 💳 Change Easypaisa / JazzCash Account Details
```js
payment: {
  methods: [
    {
      id: "easypaisa",
      name: "Easypaisa",
      accountTitle: "Your Brand Name",   // ← Your account title
      accountNumber: "0300-1234567",     // ← Your Easypaisa number
    },
    {
      id: "jazzcash",
      name: "JazzCash",
      accountTitle: "Your Brand Name",   // ← Your account title
      accountNumber: "0301-9876543",     // ← Your JazzCash number
    },
  ],
  activationTime: "within 30 minutes",  // ← Expected activation time
}
```

### 🌐 Change DNS Addresses
```js
dnsServers: [
  {
    region: "Asia",
    servers: [
      {
        name: "Asia Primary",
        primary: "103.10.20.1",          // ← Your DNS IP
        secondary: "103.10.20.2",        // ← Your DNS IP
        hostname: "asia1.yourbrand.dns", // ← Your hostname
        tier: "free",                    // "free" or "premium"
        status: "online",               // "online" or "offline"
      },
    ],
  },
]
```

### 📱 Change WhatsApp Number
```js
brand: {
  whatsappNumber: "+923001234567",   // ← Full international format
  whatsappDisplay: "0300-1234567",   // ← Display format
}
```

### 🎮 Change Supported Games
```js
games: [
  { name: "PUBG Mobile", icon: "🎯" },
  { name: "Free Fire",   icon: "🔥" },
  // ← Add or remove games
]
```

### 📊 Change Stats
```js
stats: {
  activeUsers: 12500,
  serversOnline: 28,
  uptimePercent: 99.8,
  countriesServed: 15,
}
```

### 💬 Change Testimonials
```js
testimonials: [
  {
    name: "Ahmed K.",
    rating: 5,
    text: "...",
    device: "Android",
    verified: true,
  },
  // ← Add or modify reviews
]
```

---

## 💳 Payment Gateway Integration

The payment system is built with a **provider interface** for future gateway integration.

### Current Mode: Manual Verification
Customers send money via Easypaisa/JazzCash, enter their Transaction ID, and you verify manually.

### Adding a Real Payment Gateway

1. Open `js/payment.js`
2. Find the `EasypaisaProvider` or `JazzCashProvider` class
3. Implement the `submitPayment()` method with the official API:

```js
class EasypaisaProvider extends PaymentProvider {
  async submitPayment(orderData) {
    // Replace with official Easypaisa Merchant API call
    const response = await fetch('https://api.easypaisa.com/v1/pay', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EASYPAISA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: orderData.amount,
        orderId: orderData.orderId,
        // ... other required fields
      }),
    });
    return await response.json();
  }
}
```

4. Store API keys in environment variables — **never hardcode them**.

### Order Data Structure
Orders are saved to `localStorage` (for demo). Replace with your backend API:
```json
{
  "orderId": "YB-XXXXXX",
  "plan": "quarterly",
  "amount": 600,
  "customerName": "Ahmed",
  "email": "ahmed@example.com",
  "phone": "0300-1234567",
  "device": "android",
  "paymentMethod": "easypaisa",
  "transactionId": "TID123456",
  "status": "pending",
  "createdAt": "2026-01-01T12:00:00Z"
}
```

---

## 🎨 Design System

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#07070D` | Page background |
| `--bg-mid` | `#0D0B1A` | Gradient mid |
| `--bg-deep` | `#120E24` | Gradient end |
| `--primary` | `#8B5CF6` | Soft violet |
| `--secondary` | `#7DD3FC` | Ice blue highlights |
| `--accent-gold` | `#E8C987` | Premium CTA, badges |
| `--success` | `#34D399` | Online status |
| `--text-primary` | `#F5F5FA` | Main text |
| `--text-muted` | `#8E92A8` | Muted text |

### Typography
- **Headings**: Rajdhani (Google Fonts)
- **Body**: Inter (Google Fonts)

### Glass Card Effect
- Background: `rgba(255,255,255,0.05)`
- Backdrop filter: `blur(24px) saturate(140%)`
- Gradient border: bright top → dim bottom
- Soft violet glow behind cards

---

## 📋 Pages Overview

| Page | Description |
|------|-------------|
| `index.html` | Home — hero, trust bar, platforms, DNS servers, features, ping tester, how it works, games, pricing, stats, testimonials, guarantee, FAQ, CTA |
| `checkout.html` | 4-step checkout: Plan → Details → Payment → Confirmation |
| `ios-guide.html` | iOS DNS setup (Wi-Fi manual + DNS profile methods) |
| `android-guide.html` | Android DNS setup (Private DNS + Wi-Fi methods) |
| `contact.html` | Support form + WhatsApp/email contact |
| `order-tracking.html` | Track order status by Order ID or phone |
| `terms.html` | Terms of Service |
| `privacy.html` | Privacy Policy |
| `refund.html` | Refund Policy (3-day guarantee) |
| `404.html` | Styled 404 error page |

---

## ♿ Accessibility

- Semantic HTML5 elements (`header`, `nav`, `main`, `section`, `footer`)
- ARIA labels on interactive elements
- Keyboard navigation support (focus states, ESC to close)
- `prefers-reduced-motion` respected — all animations disabled
- Good color contrast ratios
- Screen reader friendly (sr-only class, alt text)

---

## 📄 License

© 2026 YourBrand. All rights reserved.
