/**
 * ============================================================
 * Checkout Flow Logic — Premium Gaming DNS Store
 * Handles multi-step checkout:
 *   Step 1: Plan Selection
 *   Step 2: Customer Details & Device
 *   Step 3: Payment Method, TID, Screenshot & Summary
 *   Step 4: Order Confirmation & Status Timeline
 * ============================================================
 */

class CheckoutFlow {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.selectedPlan = null;
    this.customerDetails = {
      name: '',
      email: '',
      phone: '',
      device: '',
    };
    this.paymentMethod = null;
    this.transactionId = '';
    this.screenshotData = null;
    this.screenshotFile = null;
    this.orderId = null;
    this.orderRecord = null;
  }

  /**
   * Initialize checkout flow
   */
  init() {
    // Ensure SITE_CONFIG is present
    if (typeof window.SITE_CONFIG === 'undefined') {
      console.error('[CheckoutFlow] SITE_CONFIG is not defined! Using fallback configuration.');
      window.SITE_CONFIG = this.getFallbackConfig();
    }

    // Ensure PaymentService is initialized
    if (typeof window.PaymentService !== 'undefined' && typeof window.PaymentService.init === 'function') {
      window.PaymentService.init();
    }

    // Render dynamic components
    this.renderPlanCards();
    this.renderPaymentMethods();

    // Check URL parameters for pre-selected plan
    this.checkUrlParams();

    // Bind all event listeners
    this.bindEvents();

    // Initial UI render
    this.renderOrderSummary();
    this.updateMobileBar();
    this.updateProgressBar();

    console.log('[CheckoutFlow] Initialized successfully at step 1.');
  }

  /**
   * Fallback configuration if SITE_CONFIG fails to load
   */
  getFallbackConfig() {
    return {
      brand: {
        name: 'YourBrand',
        whatsappNumber: '+923001234567',
        whatsappDisplay: '0300-1234567',
      },
      currency: { code: 'PKR', symbol: 'Rs.' },
      plans: [
        { id: 'monthly', name: 'Monthly', duration: '1 Month', price: 250, period: '/mo', features: ['All DNS Regions', 'Premium DNS Servers', 'Optimized Routing', 'Instant Activation'], recommended: false },
        { id: 'quarterly', name: '3 Months', duration: '3 Months', price: 600, period: '/3 mo', savings: 'Save Rs. 150', features: ['All DNS Regions', 'Premium DNS Servers', 'Optimized Routing', 'Priority WhatsApp Support'], badge: 'Best Value', recommended: true },
        { id: 'yearly', name: 'Yearly', duration: '12 Months', price: 1800, period: '/yr', savings: 'Save Rs. 1,200', features: ['All DNS Regions', 'Premium Servers', 'Fastest Routes', 'VIP Support'], badge: 'Pro Gamer', recommended: false },
      ],
      payment: {
        methods: [
          {
            id: 'easypaisa',
            name: 'Easypaisa',
            icon: '📱',
            accountTitle: 'Your Brand Name',
            accountNumber: '0300-1234567',
            instructions: [
              'Open the Easypaisa app or dial *786#',
              "Select 'Send Money'",
              'Enter the account number shown above',
              'Enter the exact plan amount',
              'Confirm and note the Transaction ID (TID)',
              'Come back here and enter your TID',
            ],
          },
          {
            id: 'jazzcash',
            name: 'JazzCash',
            icon: '📲',
            accountTitle: 'Your Brand Name',
            accountNumber: '0301-9876543',
            instructions: [
              'Open the JazzCash app or dial *786#',
              "Select 'Send Money'",
              'Enter the account number shown above',
              'Enter the exact plan amount',
              'Confirm and note the Transaction ID (TID)',
              'Come back here and enter your TID',
            ],
          },
        ],
        activationTime: 'within 30 minutes',
      },
    };
  }

  /**
   * Parse URL parameters to pre-select a plan
   */
  checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan') || params.get('tier');

    let planToSelect = null;
    const plans = window.SITE_CONFIG.plans || [];

    if (planParam) {
      planToSelect = plans.find((p) => p.id.toLowerCase() === planParam.toLowerCase());
    }

    if (!planToSelect) {
      // Pick recommended plan or first paid plan
      planToSelect = plans.find((p) => p.recommended && p.price > 0) || plans.find((p) => p.price > 0) || plans[0];
    }

    if (planToSelect) {
      this.selectPlan(planToSelect.id);
    }
  }

  /**
   * Render plan cards from SITE_CONFIG
   */
  renderPlanCards() {
    const container = document.getElementById('plans-grid');
    if (!container) return;

    const plans = window.SITE_CONFIG.plans || [];
    const currencySymbol = (window.SITE_CONFIG.currency && window.SITE_CONFIG.currency.symbol) || 'Rs.';

    container.innerHTML = plans
      .map((plan) => {
        const isSelected = this.selectedPlan && this.selectedPlan.id === plan.id;
        const isFree = plan.price === 0;

        const badgeHtml = plan.badge
          ? `<span class="plan-badge">${plan.badge}</span>`
          : plan.recommended
          ? `<span class="plan-badge best-value">Best Value</span>`
          : '';

        const savingsHtml = plan.savings
          ? `<span class="plan-savings-tag">${plan.savings}</span>`
          : '';

        const featuresHtml = (plan.features || [])
          .map(
            (feat) => `
          <li class="plan-feature-item">
            <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>${feat}</span>
          </li>`
          )
          .join('');

        return `
        <div class="glass-card plan-card ${isSelected ? 'selected' : ''} ${plan.recommended ? 'recommended' : ''}" data-plan-id="${plan.id}" tabindex="0" role="button" aria-pressed="${isSelected}">
          ${badgeHtml}
          <div class="plan-card-header">
            <h3 class="plan-name">${plan.name}</h3>
            <span class="plan-duration">${plan.duration}</span>
          </div>

          <div class="plan-pricing">
            <div class="plan-price-wrap">
              <span class="currency">${currencySymbol}</span>
              <span class="amount">${plan.price.toLocaleString()}</span>
              <span class="period">${plan.period || ''}</span>
            </div>
            ${savingsHtml}
          </div>

          <div class="plan-divider"></div>

          <ul class="plan-features">
            ${featuresHtml}
          </ul>

          <button type="button" class="plan-select-btn ${isSelected ? 'active' : ''}">
            <span class="btn-check-icon">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            </span>
            <span class="btn-label">${isSelected ? 'Selected' : 'Select Plan'}</span>
          </button>
        </div>
      `;
      })
      .join('');

    // Attach card click handlers
    container.querySelectorAll('.plan-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const planId = card.getAttribute('data-plan-id');
        this.selectPlan(planId);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const planId = card.getAttribute('data-plan-id');
          this.selectPlan(planId);
        }
      });
    });
  }

  /**
   * Select a plan by ID
   * @param {string} planId
   */
  selectPlan(planId) {
    const plans = window.SITE_CONFIG.plans || [];
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    this.selectedPlan = plan;

    // Update plan card selection in UI
    document.querySelectorAll('.plan-card').forEach((card) => {
      const isTarget = card.getAttribute('data-plan-id') === planId;
      card.classList.toggle('selected', isTarget);
      card.setAttribute('aria-pressed', isTarget ? 'true' : 'false');

      const btn = card.querySelector('.plan-select-btn');
      if (btn) {
        btn.classList.toggle('active', isTarget);
        const label = btn.querySelector('.btn-label');
        if (label) {
          label.textContent = isTarget ? 'Selected' : 'Select Plan';
        }
      }
    });

    // Clear any previous error on plan selection
    this.clearError('plan-error');

    // Update order summary & mobile bottom bar
    this.renderOrderSummary();
    this.updateMobileBar();
  }

  /**
   * Render payment method selector cards and detail container
   */
  renderPaymentMethods() {
    const container = document.getElementById('payment-methods-selector');
    if (!container) return;

    const methods = (window.SITE_CONFIG.payment && window.SITE_CONFIG.payment.methods) || [];
    if (!methods.length) return;

    // Default select first method if none selected
    if (!this.paymentMethod) {
      this.paymentMethod = methods[0];
    }

    container.innerHTML = methods
      .map((method) => {
        const isSelected = this.paymentMethod && this.paymentMethod.id === method.id;
        return `
        <div class="glass-card payment-method-card ${isSelected ? 'selected' : ''}" data-method-id="${method.id}" tabindex="0" role="button">
          <div class="method-card-radio">
            <span class="radio-dot"></span>
          </div>
          <div class="method-card-info">
            <span class="method-name">${method.name}</span>
            <span class="method-sub">Mobile Account / Wallet</span>
          </div>
          <span class="method-badge-brand ${method.id}">${method.name}</span>
        </div>
      `;
      })
      .join('');

    // Attach click events
    container.querySelectorAll('.payment-method-card').forEach((card) => {
      card.addEventListener('click', () => {
        const methodId = card.getAttribute('data-method-id');
        this.selectPaymentMethod(methodId);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const methodId = card.getAttribute('data-method-id');
          this.selectPaymentMethod(methodId);
        }
      });
    });

    this.renderPaymentAccountDetails();
  }

  /**
   * Select payment method
   * @param {string} methodId
   */
  selectPaymentMethod(methodId) {
    const methods = (window.SITE_CONFIG.payment && window.SITE_CONFIG.payment.methods) || [];
    const method = methods.find((m) => m.id === methodId);
    if (!method) return;

    this.paymentMethod = method;

    // Update selected class
    document.querySelectorAll('.payment-method-card').forEach((card) => {
      const match = card.getAttribute('data-method-id') === methodId;
      card.classList.toggle('selected', match);
    });

    this.renderPaymentAccountDetails();
  }

  /**
   * Render instructions and account details for currently selected method
   */
  renderPaymentAccountDetails() {
    const detailsContainer = document.getElementById('payment-account-details');
    if (!detailsContainer || !this.paymentMethod) return;

    const method = this.paymentMethod;
    const currency = (window.SITE_CONFIG.currency && window.SITE_CONFIG.currency.symbol) || 'Rs.';
    const amount = this.selectedPlan ? this.selectedPlan.price : 0;

    const instructionsHtml = (method.instructions || [])
      .map((step, idx) => `
        <li class="instruction-step">
          <span class="step-num">${idx + 1}</span>
          <span class="step-text">${step}</span>
        </li>
      `)
      .join('');

    detailsContainer.innerHTML = `
      <div class="glass-card payment-details-card">
        <div class="payment-details-header">
          <div class="payment-method-badge">
            <span class="wallet-icon">💳</span>
            <span>Send Payment to ${method.name}</span>
          </div>
          <div class="payable-amount-pill">
            <span>Pay: </span>
            <strong>${currency} ${amount.toLocaleString()}</strong>
          </div>
        </div>

        <div class="account-info-box">
          <div class="account-info-row">
            <span class="info-label">Account Title</span>
            <span class="info-value" id="account-title-val">${method.accountTitle || 'Your Brand Name'}</span>
          </div>
          <div class="account-info-row">
            <span class="info-label">Account Number</span>
            <div class="account-number-copy-wrap">
              <span class="info-value highlight" id="account-number-val">${method.accountNumber}</span>
              <button type="button" class="btn-copy-sm" id="btn-copy-account" aria-label="Copy account number">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                </svg>
                <span class="copy-text">Copy</span>
              </button>
            </div>
          </div>
        </div>

        <div class="instructions-section">
          <h4 class="instructions-title">Step-by-step Instructions:</h4>
          <ol class="instructions-list">
            ${instructionsHtml}
          </ol>
        </div>
      </div>
    `;

    // Bind copy button
    const copyBtn = document.getElementById('btn-copy-account');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyToClipboard(method.accountNumber, copyBtn);
      });
    }
  }

  /**
   * Render order summary sticky card
   */
  renderOrderSummary() {
    const summaryCard = document.getElementById('order-summary-sidebar');
    if (!summaryCard) return;

    const plan = this.selectedPlan || {
      name: 'No Plan Selected',
      duration: '—',
      price: 0,
    };

    const currencySymbol = (window.SITE_CONFIG.currency && window.SITE_CONFIG.currency.symbol) || 'Rs.';
    const deviceLabel = this.customerDetails.device ? (this.customerDetails.device === 'ios' ? 'iOS' : 'Android') : 'Not chosen yet';
    const activationTime = (window.SITE_CONFIG.payment && window.SITE_CONFIG.payment.activationTime) || 'within 30 minutes';

    summaryCard.innerHTML = `
      <div class="glass-card summary-inner-card">
        <div class="summary-header">
          <h3 class="summary-title">Order Summary</h3>
          <span class="summary-secure-badge">
            <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            Secure
          </span>
        </div>

        <div class="summary-plan-highlight">
          <div class="summary-plan-row">
            <div>
              <div class="summary-plan-name">${plan.name} Plan</div>
              <div class="summary-plan-duration">${plan.duration} Gaming DNS Access</div>
            </div>
            <div class="summary-plan-price-num">${currencySymbol} ${plan.price.toLocaleString()}</div>
          </div>
          ${plan.savings ? `<div class="summary-savings-pill">${plan.savings} applied</div>` : ''}
        </div>

        <div class="summary-details-list">
          <div class="summary-row">
            <span class="row-label">Platform / Device</span>
            <span class="row-val ${this.customerDetails.device ? 'active-device' : ''}">${deviceLabel}</span>
          </div>
          <div class="summary-row">
            <span class="row-label">Setup & Activation</span>
            <span class="row-val free-highlight">Instant (Free)</span>
          </div>
          <div class="summary-row">
            <span class="row-label">Expected Activation</span>
            <span class="row-val">${activationTime}</span>
          </div>
        </div>

        <div class="summary-divider"></div>

        <div class="summary-total-row">
          <span class="total-label">Total Amount</span>
          <span class="total-amount">${currencySymbol} ${plan.price.toLocaleString()}</span>
        </div>

        <div class="summary-guarantee-note">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          <span>3-day money back guarantee if credentials are unused</span>
        </div>
      </div>
    `;
  }

  /**
   * Update mobile bottom bar content and button state
   */
  updateMobileBar() {
    const bar = document.getElementById('mobile-checkout-bar');
    if (!bar) return;

    if (this.currentStep === 4) {
      bar.classList.add('hidden');
      return;
    }

    bar.classList.remove('hidden');

    const planNameEl = document.getElementById('mobile-bar-plan');
    const planPriceEl = document.getElementById('mobile-bar-price');
    const continueBtn = document.getElementById('mobile-bar-btn');

    const currencySymbol = (window.SITE_CONFIG.currency && window.SITE_CONFIG.currency.symbol) || 'Rs.';

    if (planNameEl) {
      planNameEl.textContent = this.selectedPlan ? this.selectedPlan.name : 'Select Plan';
    }
    if (planPriceEl) {
      planPriceEl.textContent = this.selectedPlan ? `${currencySymbol} ${this.selectedPlan.price.toLocaleString()}` : '—';
    }

    if (continueBtn) {
      if (this.currentStep === 1) {
        continueBtn.innerHTML = `Continue &rarr;`;
      } else if (this.currentStep === 2) {
        continueBtn.innerHTML = `To Payment &rarr;`;
      } else if (this.currentStep === 3) {
        continueBtn.innerHTML = `Submit Payment`;
      }
    }
  }

  /**
   * Update progress indicator steps
   */
  updateProgressBar() {
    const steps = document.querySelectorAll('.checkout-progress .progress-step');
    steps.forEach((stepEl) => {
      const stepNum = parseInt(stepEl.getAttribute('data-step'), 10);
      stepEl.classList.remove('active', 'completed');

      if (stepNum < this.currentStep) {
        stepEl.classList.add('completed');
      } else if (stepNum === this.currentStep) {
        stepEl.classList.add('active');
      }
    });

    const lines = document.querySelectorAll('.checkout-progress .progress-line');
    lines.forEach((lineEl, idx) => {
      lineEl.classList.toggle('completed', idx + 1 < this.currentStep);
    });
  }

  /**
   * Transition to specific step
   * @param {number} stepNumber
   */
  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;

    // When advancing forward, validate the current step first
    if (stepNumber > this.currentStep) {
      for (let s = this.currentStep; s < stepNumber; s++) {
        const isValid = this.validateStep(s);
        if (!isValid) {
          return false;
        }
      }
    }

    const currentSection = document.getElementById(`checkout-step-${this.currentStep}`);
    const nextSection = document.getElementById(`checkout-step-${stepNumber}`);

    if (currentSection && nextSection) {
      // Fade out current step
      currentSection.classList.remove('active');
      currentSection.style.display = 'none';

      // Fade in target step
      nextSection.style.display = 'block';
      // Force layout reflow for CSS animation
      void nextSection.offsetWidth;
      nextSection.classList.add('active');
    }

    this.currentStep = stepNumber;
    this.updateProgressBar();
    this.updateMobileBar();
    this.renderOrderSummary();

    // Scroll smoothly to checkout progress top
    const topAnchor = document.getElementById('checkout-progress') || document.querySelector('.checkout-container');
    if (topAnchor) {
      topAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Refresh animations if available
    if (typeof window.initAllAnimations === 'function') {
      window.initAllAnimations();
    }

    return true;
  }

  /**
   * Step validation logic
   * @param {number} step
   * @returns {boolean}
   */
  validateStep(step) {
    if (step === 1) {
      if (!this.selectedPlan) {
        this.showToast('Please select a DNS plan to continue.', 'error');
        this.showError('plan-error', 'Please choose a plan to proceed.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      let valid = true;

      // Customer Name
      const nameInput = document.getElementById('cust-name');
      const nameVal = nameInput ? nameInput.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        this.showError('error-name', 'Please enter your full name (at least 2 characters).');
        if (nameInput) nameInput.classList.add('input-invalid');
        valid = false;
      } else {
        this.clearError('error-name');
        if (nameInput) nameInput.classList.remove('input-invalid');
        this.customerDetails.name = nameVal;
      }

      // Customer Email
      const emailInput = document.getElementById('cust-email');
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        this.showError('error-email', 'Please enter a valid email address.');
        if (emailInput) emailInput.classList.add('input-invalid');
        valid = false;
      } else {
        this.clearError('error-email');
        if (emailInput) emailInput.classList.remove('input-invalid');
        this.customerDetails.email = emailVal;
      }

      // Customer Phone / WhatsApp (Pakistani format 03XX-XXXXXXX)
      const phoneInput = document.getElementById('cust-phone');
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const cleanedPhone = phoneVal.replace(/[^0-9]/g, '');
      // Expect 11 digits starting with 03 (or 12 digits starting with 923)
      const isPkPhone = /^03[0-9]{9}$/.test(cleanedPhone) || /^923[0-9]{9}$/.test(cleanedPhone);

      if (!isPkPhone) {
        this.showError('error-phone', 'Please enter a valid Pakistani mobile number (e.g., 0300-1234567).');
        if (phoneInput) phoneInput.classList.add('input-invalid');
        valid = false;
      } else {
        this.clearError('error-phone');
        if (phoneInput) phoneInput.classList.remove('input-invalid');
        this.customerDetails.phone = phoneVal;
      }

      // Device Selection (Radio iOS / Android)
      const deviceChecked = document.querySelector('input[name="device"]:checked');
      if (!deviceChecked) {
        this.showError('error-device', 'Please select your target device (iOS or Android).');
        valid = false;
      } else {
        this.clearError('error-device');
        this.customerDetails.device = deviceChecked.value;
      }

      if (!valid) {
        this.showToast('Please fix the highlighted errors before continuing.', 'error');
      } else {
        this.renderOrderSummary();
        this.renderPaymentAccountDetails();
      }

      return valid;
    }

    if (step === 3) {
      let valid = true;

      // Ensure payment method selected
      if (!this.paymentMethod) {
        this.showToast('Please choose a payment method.', 'error');
        valid = false;
      }

      // Transaction ID (TID)
      const tidInput = document.getElementById('payment-tid');
      const tidVal = tidInput ? tidInput.value.trim() : '';

      if (!tidVal || tidVal.length < 5) {
        this.showError('error-tid', 'Please enter a valid Transaction ID (TID) from your payment receipt.');
        if (tidInput) tidInput.classList.add('input-invalid');
        valid = false;
      } else {
        this.clearError('error-tid');
        if (tidInput) tidInput.classList.remove('input-invalid');
        this.transactionId = tidVal;
      }

      if (!valid) {
        this.showToast('Please provide your Transaction ID (TID).', 'error');
      }

      return valid;
    }

    return true;
  }

  /**
   * Phone input mask (03XX-XXXXXXX)
   */
  handlePhoneMask(e) {
    const input = e.target;
    let val = input.value.replace(/[^0-9]/g, '');

    if (val.length > 11) {
      val = val.substring(0, 11);
    }

    if (val.length > 4) {
      input.value = `${val.substring(0, 4)}-${val.substring(4)}`;
    } else {
      input.value = val;
    }
  }

  /**
   * Handle screenshot file upload
   */
  handleFileUpload(file) {
    if (!file) return;

    const errorEl = document.getElementById('error-screenshot');

    // Validate type (must be image)
    if (!file.type.startsWith('image/')) {
      this.showError('error-screenshot', 'Only image files (PNG, JPG, WEBP) are allowed.');
      return;
    }

    // Validate size (max 5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showError('error-screenshot', 'Screenshot file size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    this.clearError('error-screenshot');
    this.screenshotFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.screenshotData = e.target.result;
      this.renderScreenshotPreview(file.name, file.size, this.screenshotData);
      this.showToast('Screenshot uploaded successfully.', 'success');
    };
    reader.onerror = () => {
      this.showError('error-screenshot', 'Failed to read uploaded image. Please try again.');
    };
    reader.readAsDataURL(file);
  }

  /**
   * Render screenshot preview
   */
  renderScreenshotPreview(fileName, fileSize, dataUrl) {
    const previewContainer = document.getElementById('screenshot-preview-wrap');
    const uploadPrompt = document.getElementById('upload-prompt-wrap');

    if (!previewContainer) return;

    const sizeFormatted = (fileSize / (1024 * 1024)).toFixed(2) + ' MB';

    previewContainer.innerHTML = `
      <div class="screenshot-preview-card">
        <div class="preview-thumb-wrap">
          <img src="${dataUrl}" alt="Payment receipt preview" class="preview-thumb" />
        </div>
        <div class="preview-meta">
          <span class="preview-filename" title="${fileName}">${fileName}</span>
          <span class="preview-filesize">${sizeFormatted}</span>
        </div>
        <button type="button" class="btn-remove-preview" id="btn-remove-screenshot" title="Remove screenshot">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </button>
      </div>
    `;

    previewContainer.classList.remove('hidden');
    if (uploadPrompt) uploadPrompt.classList.add('hidden');

    const removeBtn = document.getElementById('btn-remove-screenshot');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.clearScreenshot());
    }
  }

  /**
   * Clear uploaded screenshot
   */
  clearScreenshot() {
    this.screenshotFile = null;
    this.screenshotData = null;

    const fileInput = document.getElementById('payment-screenshot');
    if (fileInput) fileInput.value = '';

    const previewContainer = document.getElementById('screenshot-preview-wrap');
    const uploadPrompt = document.getElementById('upload-prompt-wrap');

    if (previewContainer) {
      previewContainer.innerHTML = '';
      previewContainer.classList.add('hidden');
    }
    if (uploadPrompt) {
      uploadPrompt.classList.remove('hidden');
    }
  }

  /**
   * Submit payment handler
   */
  async handlePaymentSubmit() {
    if (!this.validateStep(3)) {
      return;
    }

    const submitBtn = document.getElementById('btn-submit-payment');
    const mobileBtn = document.getElementById('mobile-bar-btn');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      const textSpan = submitBtn.querySelector('.btn-text');
      if (textSpan) textSpan.textContent = 'Verifying Details...';
    }
    if (mobileBtn) {
      mobileBtn.disabled = true;
    }

    // Generate unique Order ID (format: YB-XXXXXX)
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderId = `YB-${randomHex}`;

    const orderPayload = {
      orderId: this.orderId,
      plan: this.selectedPlan.id,
      planName: this.selectedPlan.name,
      amount: this.selectedPlan.price,
      currency: (window.SITE_CONFIG.currency && window.SITE_CONFIG.currency.code) || 'PKR',
      customerName: this.customerDetails.name,
      email: this.customerDetails.email,
      phone: this.customerDetails.phone,
      device: this.customerDetails.device,
      paymentMethod: this.paymentMethod.id,
      paymentMethodName: this.paymentMethod.name,
      transactionId: this.transactionId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      screenshot: this.screenshotData || null,
    };

    console.log('[CheckoutFlow] Order Object Created (ready for API):', orderPayload);

    try {
      // Process submission via PaymentService
      let result;
      if (typeof window.PaymentService !== 'undefined' && typeof window.PaymentService.submitOrder === 'function') {
        result = await window.PaymentService.submitOrder(orderPayload);
      } else {
        // Fallback local persistence if service was missing
        const existing = JSON.parse(localStorage.getItem('dns_orders') || '[]');
        existing.unshift(orderPayload);
        localStorage.setItem('dns_orders', JSON.stringify(existing));
        result = { success: true, orderId: this.orderId, order: orderPayload };
      }

      this.orderRecord = result.order || orderPayload;

      // Show confirmation
      this.renderConfirmation();
      this.goToStep(4);
      this.showToast('Payment submitted successfully! Your order is pending verification.', 'success');
    } catch (err) {
      console.error('[CheckoutFlow] Payment submission failed:', err);
      this.showToast('Failed to submit order. Please check your network and retry.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        const textSpan = submitBtn.querySelector('.btn-text');
        if (textSpan) textSpan.textContent = 'Submit Payment';
      }
      if (mobileBtn) {
        mobileBtn.disabled = false;
      }
    }
  }

  /**
   * Render confirmation screen with complete order details & timeline
   */
  renderConfirmation() {
    const confContainer = document.getElementById('confirmation-details');
    if (!confContainer || !this.orderRecord) return;

    const order = this.orderRecord;
    const currency = (window.SITE_CONFIG.currency && window.SITE_CONFIG.currency.symbol) || 'Rs.';
    const activationTime = (window.SITE_CONFIG.payment && window.SITE_CONFIG.payment.activationTime) || 'within 30 minutes';
    const brandWhatsApp = (window.SITE_CONFIG.brand && window.SITE_CONFIG.brand.whatsappNumber) || '+923001234567';
    const cleanWaNumber = brandWhatsApp.replace(/[^0-9]/g, '');

    const waMessage = encodeURIComponent(
      `Hello! I just submitted my payment for Gaming DNS.\n\n` +
      `*Order ID:* ${order.orderId}\n` +
      `*Name:* ${order.customerName}\n` +
      `*Plan:* ${order.planName || order.plan}\n` +
      `*Amount:* ${currency} ${order.amount}\n` +
      `*TID:* ${order.transactionId}\n` +
      `*Device:* ${order.device.toUpperCase()}\n\n` +
      `Please verify and activate my DNS credentials. Thank you!`
    );

    const waLink = `https://wa.me/${cleanWaNumber}?text=${waMessage}`;

    const formattedDate = new Date(order.createdAt).toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    confContainer.innerHTML = `
      <div class="glass-card confirmation-card">
        <!-- Animated Success Checkmark -->
        <div class="success-animation-wrap">
          <div class="checkmark-circle">
            <svg class="checkmark-icon" viewBox="0 0 52 52">
              <circle class="checkmark-circle-stroke" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark-check-stroke" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h2 class="confirmation-title">Payment Submitted — Pending Verification</h2>
          <p class="confirmation-subtitle">
            Thank you, <strong class="user-highlight">${order.customerName}</strong>! We have received your payment submission.
            Our team will verify your transaction and send your DNS credentials to your WhatsApp <strong>${order.phone}</strong>.
          </p>
        </div>

        <!-- Order ID Pill with 1-click Copy -->
        <div class="order-id-badge-wrap">
          <div class="order-id-label">YOUR ORDER ID</div>
          <div class="order-id-pill">
            <span class="order-id-text" id="display-order-id">${order.orderId}</span>
            <button type="button" class="btn-copy-id" id="btn-copy-order-id" title="Copy Order ID">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
              </svg>
              <span>Copy</span>
            </button>
          </div>
        </div>

        <!-- Status Timeline -->
        <div class="status-timeline-wrap">
          <h4 class="timeline-title">Activation Progress</h4>
          <div class="timeline-steps">
            <div class="timeline-step completed">
              <div class="step-icon-wrap">
                <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              </div>
              <div class="step-meta">
                <span class="step-name">Submitted</span>
                <span class="step-desc">Received TID</span>
              </div>
            </div>
            <div class="timeline-line active-line"></div>
            <div class="timeline-step current-verifying">
              <div class="step-icon-wrap pulse-verifying">
                <span class="pulse-dot"></span>
              </div>
              <div class="step-meta">
                <span class="step-name">Verifying</span>
                <span class="step-desc">${activationTime}</span>
              </div>
            </div>
            <div class="timeline-line"></div>
            <div class="timeline-step upcoming">
              <div class="step-icon-wrap">
                <span>3</span>
              </div>
              <div class="step-meta">
                <span class="step-name">Activated</span>
                <span class="step-desc">Credentials Sent</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Table -->
        <div class="confirmation-summary-table">
          <div class="summary-table-row">
            <span class="label">Plan:</span>
            <span class="val font-rajdhani">${order.planName || order.plan}</span>
          </div>
          <div class="summary-table-row">
            <span class="label">Amount Paid:</span>
            <span class="val font-gold">${currency} ${order.amount.toLocaleString()}</span>
          </div>
          <div class="summary-table-row">
            <span class="label">Device:</span>
            <span class="val">${order.device === 'ios' ? 'Apple iOS' : 'Google Android'}</span>
          </div>
          <div class="summary-table-row">
            <span class="label">Payment Method:</span>
            <span class="val capitalize">${order.paymentMethod}</span>
          </div>
          <div class="summary-table-row">
            <span class="label">Transaction ID (TID):</span>
            <span class="val code-font">${order.transactionId}</span>
          </div>
          <div class="summary-table-row">
            <span class="label">Submission Date:</span>
            <span class="val">${formattedDate}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="confirmation-actions">
          <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-action">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Message Support on WhatsApp</span>
          </a>

          <div class="secondary-actions-row">
            <a href="order-tracking.html?order=${order.orderId}" class="btn-secondary track-btn">
              Track Your Order
            </a>
            <a href="index.html" class="btn-ghost home-btn">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    `;

    // Bind copy order ID button
    const copyOrderIdBtn = document.getElementById('btn-copy-order-id');
    if (copyOrderIdBtn) {
      copyOrderIdBtn.addEventListener('click', () => {
        this.copyToClipboard(order.orderId, copyOrderIdBtn);
      });
    }
  }

  /**
   * Bind DOM event listeners
   */
  bindEvents() {
    // Navigation: Step 1 -> Step 2
    const btnStep1Next = document.getElementById('btn-step-1-next');
    if (btnStep1Next) {
      btnStep1Next.addEventListener('click', () => this.goToStep(2));
    }

    // Navigation: Step 2 Back & Next
    const btnStep2Back = document.getElementById('btn-step-2-back');
    if (btnStep2Back) {
      btnStep2Back.addEventListener('click', () => this.goToStep(1));
    }

    const btnStep2Next = document.getElementById('btn-step-2-next');
    if (btnStep2Next) {
      btnStep2Next.addEventListener('click', () => this.goToStep(3));
    }

    // Navigation: Step 3 Back & Submit
    const btnStep3Back = document.getElementById('btn-step-3-back');
    if (btnStep3Back) {
      btnStep3Back.addEventListener('click', () => this.goToStep(2));
    }

    const btnSubmitPayment = document.getElementById('btn-submit-payment');
    if (btnSubmitPayment) {
      btnSubmitPayment.addEventListener('click', (e) => {
        e.preventDefault();
        this.handlePaymentSubmit();
      });
    }

    // Mobile bottom bar continue button
    const mobileBtn = document.getElementById('mobile-bar-btn');
    if (mobileBtn) {
      mobileBtn.addEventListener('click', () => {
        if (this.currentStep === 1) {
          this.goToStep(2);
        } else if (this.currentStep === 2) {
          this.goToStep(3);
        } else if (this.currentStep === 3) {
          this.handlePaymentSubmit();
        }
      });
    }

    // Progress bar step clicks (allow navigating back to completed steps)
    document.querySelectorAll('.checkout-progress .progress-step').forEach((stepEl) => {
      stepEl.addEventListener('click', () => {
        const stepNum = parseInt(stepEl.getAttribute('data-step'), 10);
        if (stepNum < this.currentStep) {
          this.goToStep(stepNum);
        }
      });
    });

    // Form input event listeners for real-time validation and masking
    const phoneInput = document.getElementById('cust-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        this.handlePhoneMask(e);
        this.clearError('error-phone');
      });
    }

    const nameInput = document.getElementById('cust-name');
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        this.clearError('error-name');
        nameInput.classList.remove('input-invalid');
      });
    }

    const emailInput = document.getElementById('cust-email');
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        this.clearError('error-email');
        emailInput.classList.remove('input-invalid');
      });
    }

    const tidInput = document.getElementById('payment-tid');
    if (tidInput) {
      tidInput.addEventListener('input', () => {
        this.clearError('error-tid');
        tidInput.classList.remove('input-invalid');
      });
    }

    // Device selection radio button changes
    const deviceRadios = document.querySelectorAll('input[name="device"]');
    deviceRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        this.clearError('error-device');
        this.customerDetails.device = radio.value;
        this.renderOrderSummary();

        // Update selected class on device cards
        document.querySelectorAll('.device-radio-card').forEach((card) => {
          const cardInput = card.querySelector('input[name="device"]');
          card.classList.toggle('selected', cardInput && cardInput.checked);
        });
      });
    });

    // Device card wrapper click
    document.querySelectorAll('.device-radio-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const radio = card.querySelector('input[name="device"]');
        if (radio && e.target !== radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change'));
        }
      });
    });

    // File upload (Screenshot) drag & drop + click
    const dropZone = document.getElementById('screenshot-dropzone');
    const fileInput = document.getElementById('payment-screenshot');

    if (dropZone && fileInput) {
      dropZone.addEventListener('click', (e) => {
        if (!e.target.closest('#btn-remove-screenshot')) {
          fileInput.click();
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleFileUpload(e.target.files[0]);
        }
      });

      ['dragenter', 'dragover'].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('drag-over');
        });
      });

      dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleFileUpload(e.dataTransfer.files[0]);
        }
      });
    }

    // Mobile navigation toggle (shared navbar support)
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
      });
    }
  }

  /**
   * Helper: Copy text to clipboard
   */
  async copyToClipboard(text, triggerEl) {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      this.showToast(`Copied to clipboard: ${text}`, 'success');

      if (triggerEl) {
        const originalText = triggerEl.innerHTML;
        triggerEl.classList.add('copied');
        triggerEl.setAttribute('data-copied', 'true');
        setTimeout(() => {
          triggerEl.classList.remove('copied');
          triggerEl.removeAttribute('data-copied');
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      this.showToast('Could not copy automatically. Please copy manually.', 'info');
    }
  }

  /**
   * Helper: Show form error message
   */
  showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }
  }

  /**
   * Helper: Clear form error message
   */
  clearError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.add('hidden');
    }
  }

  /**
   * Helper: Toast notifications
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) {
      alert(message);
      return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSvg =
      type === 'success'
        ? `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`
        : type === 'error'
        ? `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`
        : `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`;

    toast.innerHTML = `
      <span class="toast-icon">${iconSvg}</span>
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Auto remove after 3.8s
    setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 3800);
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  const checkout = new CheckoutFlow();
  window.checkoutFlow = checkout;
  checkout.init();

  if (typeof window.initAllAnimations === 'function') {
    window.initAllAnimations();
  }
});
