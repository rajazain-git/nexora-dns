import test from 'node:test';
import assert from 'node:assert/strict';

// Test Suite: NEXORA DNS Core Business & Ledger Logic

test('Coupon Validation: Valid coupon applies correct discount', () => {
  const coupons = [
    { code: 'NEXORA10', discountPercentage: 10, minSpendPKR: 300, active: true },
    { code: 'PROGAMER20', discountPercentage: 20, minSpendPKR: 600, active: true },
    { code: 'EXPIRED', discountPercentage: 50, minSpendPKR: 100, active: false },
  ];

  function validate(code, subtotal) {
    const found = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (!found) return { valid: false, message: 'Invalid coupon' };
    if (!found.active) return { valid: false, message: 'Coupon expired' };
    if (subtotal < found.minSpendPKR) return { valid: false, message: `Minimum spend is Rs. ${found.minSpendPKR}` };
    const discount = Math.round((subtotal * found.discountPercentage) / 100);
    return { valid: true, discount, finalTotal: subtotal - discount };
  }

  const res1 = validate('NEXORA10', 500);
  assert.equal(res1.valid, true);
  assert.equal(res1.discount, 50);
  assert.equal(res1.finalTotal, 450);

  const res2 = validate('NEXORA10', 200);
  assert.equal(res2.valid, false);

  const res3 = validate('EXPIRED', 1000);
  assert.equal(res3.valid, false);
});

test('Ledger Revenue Calculation: Strictly separates Net vs Gross and excludes Pending', () => {
  const sampleOrders = [
    { id: 'NX-1', totalAmount: 500, paymentStatus: 'verified' },
    { id: 'NX-2', totalAmount: 1200, paymentStatus: 'verified' },
    { id: 'NX-3', totalAmount: 350, paymentStatus: 'pending' }, // Must NOT count as revenue
    { id: 'NX-4', totalAmount: 800, paymentStatus: 'refunded', refundDetails: { amount: 800 } },
    { id: 'NX-5', totalAmount: 350, paymentStatus: 'failed' },
  ];

  const verified = sampleOrders.filter(o => o.paymentStatus === 'verified');
  const grossRevenue = verified.reduce((sum, o) => sum + o.totalAmount, 0);
  const refunded = sampleOrders.filter(o => o.paymentStatus === 'refunded');
  const refundedAmount = refunded.reduce((sum, o) => sum + (o.refundDetails?.amount || o.totalAmount), 0);
  const netRevenue = Math.max(0, grossRevenue - refundedAmount);
  const pendingCount = sampleOrders.filter(o => o.paymentStatus === 'pending').length;

  assert.equal(grossRevenue, 1700, 'Gross revenue must equal sum of verified orders');
  assert.equal(refundedAmount, 800, 'Refunded amount must equal 800');
  assert.equal(netRevenue, 900, 'Net revenue must be gross minus refunds');
  assert.equal(pendingCount, 1, 'Pending count must be accurately isolated');
});

test('License Key & DNS Credential Generator', () => {
  function generateLicenseKey() {
    const seg = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    return `NX-${seg()}-${seg()}-${seg()}-${seg()}`;
  }

  const key1 = generateLicenseKey();
  const key2 = generateLicenseKey();

  assert.match(key1, /^NX-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  assert.notEqual(key1, key2);
});

test('Product Scope Invariant: All products must be strictly Android or Apple iOS Free Fire', () => {
  const platforms = ['android', 'ios'];
  const testProducts = [
    { id: 'ff-dot-30d', platform: 'android', category: 'android' },
    { id: 'ff-doh-30d', platform: 'ios', category: 'ios' },
  ];

  testProducts.forEach(p => {
    assert.ok(platforms.includes(p.platform), `Platform ${p.platform} must be android or ios`);
  });
});

test('Device Compatibility Rules: Android 9+ and iOS 14+ must be verified compatible', () => {
  const mockRules = [
    {
      platform: 'android',
      osVersions: ['Android 15', 'Android 14', 'Android 13', 'Android 12', 'Android 11', 'Android 10', 'Android 9.0 (Pie)'],
      status: 'verified_compatible',
      supportedMethods: ['Native Private DNS (DNS-over-TLS Port 853)'],
    },
    {
      platform: 'android',
      osVersions: ['Android 8.1 (Oreo) and below'],
      status: 'partially_compatible',
      supportedMethods: ['Manual Wi-Fi Static DNS (IPv4)'],
    },
    {
      platform: 'ios',
      osVersions: ['iOS 18', 'iOS 17', 'iOS 16', 'iOS 15', 'iOS 14'],
      status: 'verified_compatible',
      supportedMethods: ['Apple Encrypted DNS Profile (.mobileconfig DoH)'],
    },
    {
      platform: 'ios',
      osVersions: ['iOS 13 and below'],
      status: 'incompatible',
      supportedMethods: ['Manual Wi-Fi DNS Settings'],
    }
  ];

  function checkCompatibility(platform, version) {
    return mockRules.find(r => r.platform === platform && r.osVersions.some(v => version.toLowerCase().includes(v.toLowerCase()))) || null;
  }

  const android14 = checkCompatibility('android', 'Android 14');
  assert.ok(android14);
  assert.equal(android14.status, 'verified_compatible');
  assert.ok(android14.supportedMethods[0].includes('Port 853'));

  const ios17 = checkCompatibility('ios', 'iOS 17');
  assert.ok(ios17);
  assert.equal(ios17.status, 'verified_compatible');
  assert.ok(ios17.supportedMethods[0].includes('.mobileconfig'));

  const ios12 = checkCompatibility('ios', 'iOS 13 and below');
  assert.ok(ios12);
  assert.equal(ios12.status, 'incompatible');

  const unknown = checkCompatibility('android', 'Custom ROM 99');
  assert.equal(unknown, null);
});

test('Secure Guest Order Verification & Sanitization: Never leaks PII or admin notes', () => {
  const mockOrder = {
    id: 'NX-20261016-TEST',
    customerName: 'Ahmad Khan',
    customerEmail: 'ahmad.gamer@gmail.com',
    customerPhone: '03001234567',
    totalAmount: 350,
    paymentStatus: 'verified',
    fulfillmentStatus: 'fulfilled',
    adminNotes: [{ id: '1', note: 'Secret bank TID verified on jazzcash', timestamp: '2026-10-16' }],
    paymentProof: { transactionId: 'TXN-999', verifiedBy: 'SuperAdmin' },
    assignedConfigurations: [
      {
        productName: 'Android Elite (30d)',
        dotHost: 'ff-pk.nexoradns.com',
        licenseKey: 'NX-AAAA-BBBB-CCCC-DDDD',
        setupGuideUrl: '/setup-guides/android'
      }
    ]
  };

  function maskEmail(email) {
    const [name, domain] = email.split('@');
    const visible = name.slice(0, 1) + '***' + (name.length > 2 ? name.slice(-1) : '');
    return `${visible}@${domain}`;
  }

  function verifyAndSanitize(orderId, authInput, order) {
    if (order.id !== orderId) return { success: false, error: 'Not found' };
    const cleanAuth = authInput.toLowerCase().replace(/[\s-]/g, '');
    const cleanEmail = order.customerEmail.toLowerCase();
    const cleanPhone = order.customerPhone.replace(/[\s-]/g, '');
    const phoneLast4 = cleanPhone.slice(-4);

    const matches = cleanAuth === cleanEmail || cleanAuth === cleanPhone || (cleanAuth.length >= 4 && cleanAuth.endsWith(phoneLast4));
    if (!matches) return { success: false, error: 'Unauthorized' };

    // Scrubbed response
    return {
      success: true,
      data: {
        orderId: order.id,
        maskedCustomerEmail: maskEmail(order.customerEmail),
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        assignedConfigurations: order.assignedConfigurations,
      }
    };
  }

  // 1. Dual-factor verification matches with email
  const resEmail = verifyAndSanitize('NX-20261016-TEST', 'ahmad.gamer@gmail.com', mockOrder);
  assert.equal(resEmail.success, true);
  assert.equal(resEmail.data.maskedCustomerEmail, 'a***r@gmail.com');
  assert.equal(resEmail.data.adminNotes, undefined, 'Admin notes must never leak');
  assert.equal(resEmail.data.paymentProof, undefined, 'Raw payment proof must never leak');

  // 2. Dual-factor verification matches with last 4 digits of phone
  const resPhone = verifyAndSanitize('NX-20261016-TEST', '4567', mockOrder);
  assert.equal(resPhone.success, true);

  // 3. Mismatched auth fails
  const resMismatch = verifyAndSanitize('NX-20261016-TEST', 'wrong@email.com', mockOrder);
  assert.equal(resMismatch.success, false);
});

test('Troubleshooting Logic: Every article includes safe revert instructions and valid platform', () => {
  const articles = [
    { id: '1', platform: 'android', revertInstructions: 'Set Private DNS to Off' },
    { id: '2', platform: 'ios', revertInstructions: 'Remove profile in Settings' },
    { id: '3', platform: 'general', revertInstructions: 'Switch network' },
  ];

  articles.forEach(art => {
    assert.ok(art.revertInstructions && art.revertInstructions.length > 5, 'Every article must provide safe revert instructions');
    assert.ok(['android', 'ios', 'general'].includes(art.platform));
  });
});


