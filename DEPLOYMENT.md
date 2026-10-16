# 🚀 NEXORA DNS — GITHUB & VERCEL DEPLOYMENT GUIDE

This document contains the step-by-step production deployment instructions, build verification results, and environment configuration guidelines for launching **NEXORA DNS** on Vercel and GitHub.

---

## 1. 📋 Deployment Specifications & Runtime Invariants

| Parameter | Specification | Details |
|---|---|---|
| **Framework** | Next.js 14.2.35 (App Router) | Static export and dynamic serverless routes |
| **Node.js Engine** | `^18.18.0` or `>=20.0.0` | Tested on Node.js v24.21.0 |
| **Package Manager** | `npm` (Lockfile: `package-lock.json`) | Deterministic dependencies |
| **Build Command** | `npm run build` or `next build` | Compiles 38/38 static/dynamic routes |
| **Output Directory** | `.next` (Default) | Automatically handled by Vercel |
| **Test / Check Command** | `npm run test` | Unit tests + `tsc --noEmit` static typing |
| **Development Server** | `npm run dev` | Local development at `http://localhost:3000` |

---

## 2. 🛡️ Security & Clean Repository Guarantees

Before pushing to GitHub:
- **Zero Secrets Committed**: Scanned repository for private keys, passwords, and service account tokens. No `.env`, `.env.local`, or `*.key` / `*.pem` files exist in the repository.
- **Robust `.gitignore`**: Excludes:
  - `node_modules/`
  - `.next/`, `out/`, `build/`
  - `.env`, `.env*.local`, `.env.production`, `.env.development`
  - `*service-account*.json`, `*firebase-admin*.json`
  - `*.key`, `*.pem`, `*.pfx`, `*.log`
  - `.vercel/`
  - `*.tsbuildinfo`
- **Template Only**: Required environment variable keys are fully documented in `.env.example` with safe placeholder values only.

---

## 3. ⚙️ Environment Variables for Vercel

When importing the project in your [Vercel Dashboard](https://vercel.com/), add the following variables under **Project Settings &rarr; Environment Variables**:

### A. Public Branding & Local Settings
```env
NEXT_PUBLIC_SITE_NAME="NEXORA DNS"
NEXT_PUBLIC_SITE_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_DEFAULT_CURRENCY="PKR"
```

### B. Firebase Client SDK (Frontend Auth & Firestore)
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="nexora-dns.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="nexora-dns"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="nexora-dns.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```
*(Note: If Firebase credentials are not provided initially, NEXORA DNS seamlessly falls back to its built-in client memory & localStorage store so the site is 100% operational).*

### C. Admin Security & Whitelist
```env
ADMIN_EMAILS="admin@nexoradns.com,your-email@domain.com"
```

### D. Payment Gateways (Easypaisa / JazzCash / Sandbox)
```env
PAYMENT_SANDBOX_MODE="true"
EASYPAISA_STORE_ID="12345"
EASYPAISA_HASH_KEY="sandbox_hash_key"
EASYPAISA_MERCHANT_NO="03001234567"
EASYPAISA_ACCOUNT_TITLE="NEXORA GAMING"
JAZZCASH_MERCHANT_ID="MC12345"
JAZZCASH_PASSWORD="jazzcash_password"
JAZZCASH_INTEGRITY_SALT="jazzcash_salt"
JAZZCASH_ACCOUNT_TITLE="NEXORA GAMING"
```

---

## 4. 📦 Step-by-Step GitHub Setup (Awaiting Your Approval)

Run these commands in PowerShell once you are ready to publish to your GitHub repository:

```powershell
# 1. Initialize local Git repository
git init

# 2. Stage all files (verifying .gitignore excludes node_modules and .next)
git add .

# 3. Create initial deployment commit
git commit -m "feat: complete NEXORA Free Fire mobile DNS storefront & admin control center"

# 4. Set default branch to main
git branch -M main

# 5. Connect your GitHub remote repository
# Replace <YOUR-GITHUB-USERNAME> and <YOUR-REPO-NAME> with your actual repository URL:
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 5. ▲ Step-by-Step Vercel Deployment

1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account and select your `nexora-dns` repository.
3. In the **Configure Project** screen:
   - **Framework Preset**: `Next.js` (automatically detected).
   - **Root Directory**: `./` (default).
   - **Build Command**: `next build` (default).
   - **Output Directory**: `.next` (default).
4. Expand **Environment Variables** and paste the keys from `.env.example`.
5. Click **Deploy**.
6. Deployment will complete in under 2 minutes.

---

## 6. 🧪 Build & Test Verification Evidence

### Unit Tests & Type Check:
```bash
> node --test tests/core-logic.test.mjs && tsc --noEmit

✔ Coupon Validation: Valid coupon applies correct discount (2.6ms)
✔ Ledger Revenue Calculation: Strictly separates Net vs Gross and excludes Pending (0.6ms)
✔ License Key & DNS Credential Generator (1.0ms)
✔ Product Scope Invariant: All products must be strictly Android or Apple iOS Free Fire (6.6ms)
✔ Device Compatibility Rules: Android 9+ and iOS 14+ must be verified compatible (1.3ms)
✔ Secure Guest Order Verification & Sanitization: Never leaks PII or admin notes (1.0ms)
✔ Troubleshooting Logic: Every article includes safe revert instructions and valid platform (0.6ms)

ℹ tests 7 passed, 0 failed
```

### Next.js Production Build:
```bash
> next build

  ▲ Next.js 14.2.35
   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
 ✓ Generating static pages (38/38)
   Finalizing page optimization ...
   Collecting build traces ...
```
**Status**: 0 build errors. 38 routes successfully generated.
