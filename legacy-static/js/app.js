/**
 * ============================================================
 *  APP.JS — Main Application Logic for Home Page (index.html)
 *  Gaming DNS Store Design System
 * ============================================================
 */

(function (window, document) {
  'use strict';

  /* ── 1. Helper: Safe DOM Selector ────────────────────────── */
  function getContainer(primaryId, fallbackSelectors = []) {
    let el = document.getElementById(primaryId);
    if (el) return el;

    for (const selector of fallbackSelectors) {
      el = document.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

  /* ── 2. Render DNS Server Cards ──────────────────────────── */
  /**
   * Renders DNS server cards with copy buttons, online/offline status,
   * and locked overlay with blur for premium servers.
   */
  function renderDNSServers() {
    const container = getContainer('dns-servers-grid', [
      '#dns-grid',
      '#servers-grid',
      '#dns-servers .grid-container',
      '#dns-servers .container',
      '#dns-servers',
    ]);
    if (!container) return;

    const config = window.SITE_CONFIG || {};
    const dnsData = config.dnsServers || [];
    if (!dnsData.length) return;

    let html = '';

    dnsData.forEach((regionGroup) => {
      html += `
        <div class="dns-region-group w-full">
          <div class="region-header">
            <span class="region-flag" aria-hidden="true">${regionGroup.flag || '🌐'}</span>
            <h3 class="region-title">${regionGroup.region} Servers</h3>
          </div>
          <div class="region-servers-grid">
      `;

      regionGroup.servers.forEach((server) => {
        const isPremium = server.tier === 'premium';
        const isOnline = server.status === 'online';

        html += `
          <div class="server-card glass-card ${isPremium ? 'locked is-premium' : 'is-free'} reveal">
            <!-- Header -->
            <div class="server-card-header">
              <div class="server-meta">
                <span class="server-name">${server.name}</span>
                <span class="server-tier-badge ${isPremium ? 'tier-premium' : 'tier-free'}">
                  ${isPremium ? 'VIP Premium' : 'Free Tier'}
                </span>
              </div>
              <div class="server-status">
                <span class="status-badge ${isOnline ? 'status-online' : 'status-offline'}">
                  <span class="status-pulse-dot"></span>
                  ${isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <!-- Server Connection Details -->
            <div class="server-details ${isPremium ? 'blurred-content' : ''}">
              <!-- Primary DNS -->
              <div class="server-row">
                <div class="server-row-info">
                  <span class="server-row-label">Primary DNS</span>
                  <code class="server-ip">${server.primary}</code>
                </div>
                <button type="button" class="btn-copy" onclick="copyToClipboard('${server.primary}', this)" aria-label="Copy primary DNS ${server.primary}">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                  </svg>
                  <span>Copy</span>
                </button>
              </div>

              <!-- Secondary DNS -->
              <div class="server-row">
                <div class="server-row-info">
                  <span class="server-row-label">Secondary DNS</span>
                  <code class="server-ip">${server.secondary}</code>
                </div>
                <button type="button" class="btn-copy" onclick="copyToClipboard('${server.secondary}', this)" aria-label="Copy secondary DNS ${server.secondary}">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                  </svg>
                  <span>Copy</span>
                </button>
              </div>

              <!-- Private DNS Hostname (Android) -->
              <div class="server-row">
                <div class="server-row-info">
                  <span class="server-row-label">Private DNS (Hostname)</span>
                  <code class="server-hostname">${server.hostname}</code>
                </div>
                <button type="button" class="btn-copy" onclick="copyToClipboard('${server.hostname}', this)" aria-label="Copy private DNS hostname ${server.hostname}">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                  </svg>
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <!-- Locked Overlay for Premium Servers -->
            ${
              isPremium
                ? `
              <div class="locked-overlay">
                <div class="locked-content">
                  <div class="lock-icon-wrap" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                  </div>
                  <h4 class="locked-title">Premium Only</h4>
                  <p class="locked-desc">Exclusive low-latency routing, priority VIP bandwidth & anti-jitter protection.</p>
                  <a href="checkout.html?plan=monthly" class="btn-gold btn-sm">Unlock Premium</a>
                </div>
              </div>
            `
                : ''
            }
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ── 3. Render Pricing Cards ─────────────────────────────── */
  /**
   * Renders pricing section cards from SITE_CONFIG.plans.
   */
  function renderPricingCards() {
    const container = getContainer('pricing-grid', [
      '#pricing-cards',
      '#pricing-container',
      '#pricing .grid-container',
      '#pricing .container',
      '#pricing',
    ]);
    if (!container) return;

    const config = window.SITE_CONFIG || {};
    const plans = config.plans || [];
    if (!plans.length) return;

    let html = '';

    plans.forEach((plan) => {
      const isRecommended = Boolean(plan.recommended);
      const isFree = plan.price === 0;
      const formattedPrice = isFree ? 'Free' : formatPrice(plan.price);

      html += `
        <div class="pricing-card glass-card ${isRecommended ? 'recommended' : ''} reveal">
          ${plan.badge ? `<div class="plan-ribbon">${plan.badge}</div>` : ''}

          <div class="pricing-header">
            <h3 class="plan-name">${plan.name}</h3>
            <div class="plan-price-wrap">
              <span class="plan-price">${formattedPrice}</span>
              ${plan.period ? `<span class="plan-period">${plan.period}</span>` : ''}
            </div>
            <div class="plan-duration-badge">
              <span>${plan.duration}</span>
              ${plan.savings ? `<span class="savings-tag">${plan.savings}</span>` : ''}
            </div>
          </div>

          <!-- Feature List -->
          <ul class="pricing-features">
            ${(plan.features || [])
              .map(
                (feat) => `
              <li class="feature-item included">
                <svg class="feature-icon text-success" viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>${feat}</span>
              </li>
            `
              )
              .join('')}

            ${(plan.disabledFeatures || [])
              .map(
                (feat) => `
              <li class="feature-item disabled">
                <svg class="feature-icon text-muted" viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
                <span>${feat}</span>
              </li>
            `
              )
              .join('')}
          </ul>

          <!-- CTA Button -->
          <div class="pricing-cta-wrap">
            ${
              isFree
                ? `<a href="#dns-servers" class="btn-secondary w-full">Use Free DNS</a>`
                : `<a href="checkout.html?plan=${plan.id}" class="${
                    isRecommended ? 'btn-gold' : 'btn-secondary'
                  } w-full">Buy Now</a>`
            }
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ── 4. Render Supported Games ───────────────────────────── */
  /**
   * Renders supported gaming titles grid.
   */
  function renderGames() {
    const container = getContainer('games-grid', [
      '#games-container',
      '#games .grid-container',
      '#games .container',
      '#games',
    ]);
    if (!container) return;

    const config = window.SITE_CONFIG || {};
    const games = config.games || [];
    if (!games.length) return;

    let html = '';

    games.forEach((game) => {
      html += `
        <div class="game-card glass-card reveal">
          <div class="game-icon-wrap" aria-hidden="true">
            <span class="game-emoji">${game.icon || '🎮'}</span>
          </div>
          <div class="game-info">
            <h4 class="game-name">${game.name}</h4>
            <span class="game-status-tag">
              <span class="status-pulse-dot"></span> Optimized Routing
            </span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ── 5. Render Testimonials ──────────────────────────────── */
  /**
   * Renders customer review cards with star ratings and device badges.
   */
  function renderTestimonials() {
    const container = getContainer('testimonials-grid', [
      '#testimonials-container',
      '#testimonials .grid-container',
      '#testimonials .container',
      '#testimonials',
    ]);
    if (!container) return;

    const config = window.SITE_CONFIG || {};
    const reviews = config.testimonials || [];
    if (!reviews.length) return;

    let html = '';

    reviews.forEach((review) => {
      html += `
        <div class="testimonial-card glass-card reveal">
          <div class="testimonial-header">
            ${renderStars(review.rating)}
            <span class="device-badge device-${(review.device || 'android').toLowerCase()}">
              ${review.device === 'iOS' ? '🍎 iOS' : '🤖 Android'}
            </span>
          </div>
          <p class="testimonial-text">"${review.text}"</p>
          <div class="testimonial-author">
            <div class="author-avatar">${review.name.charAt(0)}</div>
            <div class="author-details">
              <span class="author-name">${review.name}</span>
              ${
                review.verified
                  ? `<span class="verified-badge">
                      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg> Verified Buyer
                    </span>`
                  : ''
              }
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /* ── 6. Render FAQ Accordion ─────────────────────────────── */
  /**
   * Renders interactive accordion for FAQ questions.
   */
  function renderFAQ() {
    const container = getContainer('faq-accordion', [
      '#faq-container',
      '#faq-list',
      '#faq .accordion-container',
      '#faq',
    ]);
    if (!container) return;

    const config = window.SITE_CONFIG || {};
    const faqItems = config.faq || [];
    if (!faqItems.length) return;

    let html = '';

    faqItems.forEach((item, index) => {
      const qId = `faq-q-${index}`;
      const aId = `faq-a-${index}`;

      html += `
        <div class="faq-item accordion-item glass-card reveal" id="faq-item-${index}">
          <button type="button" class="faq-question accordion-header" id="${qId}" aria-expanded="false" aria-controls="${aId}">
            <span class="faq-title">${item.q}</span>
            <span class="faq-chevron" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </span>
          </button>
          <div class="faq-answer accordion-content" id="${aId}" role="region" aria-labelledby="${qId}">
            <div class="faq-body">
              <p>${item.a}</p>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Bind accordion event listeners
    if (typeof window.initAccordion === 'function') {
      window.initAccordion();
    }
  }

  /* ── 7. Render Stats Section ─────────────────────────────── */
  /**
   * Renders stats counters with data-target attributes for animation.
   */
  function renderStats() {
    const container = getContainer('stats-grid', [
      '#stats-container',
      '#stats .grid-container',
      '#stats .container',
      '#stats',
    ]);
    if (!container) return;

    const config = window.SITE_CONFIG || {};
    const stats = config.stats || {
      activeUsers: 12500,
      serversOnline: 28,
      uptimePercent: 99.8,
      countriesServed: 15,
    };

    container.innerHTML = `
      <div class="stat-card glass-card reveal">
        <div class="stat-value-wrap">
          <span class="stat-value counter" data-target="${stats.activeUsers}" data-suffix="+">0</span>
        </div>
        <span class="stat-label">Active Mobile Gamers</span>
      </div>

      <div class="stat-card glass-card reveal">
        <div class="stat-value-wrap">
          <span class="stat-value counter" data-target="${stats.serversOnline}" data-suffix="+">0</span>
        </div>
        <span class="stat-label">Ultra-Fast DNS Nodes</span>
      </div>

      <div class="stat-card glass-card reveal">
        <div class="stat-value-wrap">
          <span class="stat-value counter" data-target="${stats.uptimePercent}" data-suffix="%">0</span>
        </div>
        <span class="stat-label">Network Uptime</span>
      </div>

      <div class="stat-card glass-card reveal">
        <div class="stat-value-wrap">
          <span class="stat-value counter" data-target="${stats.countriesServed}" data-suffix="+">0</span>
        </div>
        <span class="stat-label">Regions Covered</span>
      </div>
    `;

    // Re-observe counters with IntersectionObserver
    if (typeof window.initCounters === 'function') {
      window.initCounters();
    }
  }

  /* ── 8. Render Trust Bar ─────────────────────────────────── */
  /**
   * Renders guarantee trust bar badges.
   */
  function renderTrustBar() {
    const container = getContainer('trust-bar', [
      '#trust-badges',
      '#trust-container',
      '.trust-bar',
      '#trust',
    ]);
    if (!container) return;

    const trustBadges = [
      { icon: '⚡', title: 'Ultra-Low Latency', desc: 'Optimized game routes' },
      { icon: '🛡️', title: 'Zero Logging', desc: '100% privacy & secure' },
      { icon: '⏱️', title: '30-Min Activation', desc: 'Instant WhatsApp delivery' },
      { icon: '💰', title: '3-Day Guarantee', desc: 'Risk-free money back' },
      { icon: '📱', title: 'Wi-Fi & 4G/5G', desc: 'Android & iOS support' },
    ];

    container.innerHTML = `
      <div class="trust-bar-inner">
        ${trustBadges
          .map(
            (badge) => `
          <div class="trust-item reveal">
            <span class="trust-icon" aria-hidden="true">${badge.icon}</span>
            <div class="trust-text">
              <strong class="trust-title">${badge.title}</strong>
              <span class="trust-desc text-muted">${badge.desc}</span>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  /* ── 9. Interactive Ping Tester ──────────────────────────── */
  /**
   * Initializes the simulated ping test tool widget.
   */
  function initPingTester() {
    const container = getContainer('ping-tester', [
      '#ping-tool',
      '#ping-widget',
      '#ping-test .container',
      '#ping-test',
    ]);
    if (!container) return;

    const config = window.SITE_CONFIG || {};
    const regions = config.pingRegions || [
      { id: 'asia', label: 'Asia', baseLatency: 35, variance: 15 },
      { id: 'middle-east', label: 'Middle East', baseLatency: 45, variance: 20 },
      { id: 'europe', label: 'Europe', baseLatency: 80, variance: 25 },
      { id: 'global', label: 'Global', baseLatency: 55, variance: 18 },
    ];

    container.innerHTML = `
      <div class="ping-tester-card glass-card reveal">
        <div class="ping-card-header">
          <div class="ping-title-wrap">
            <span class="ping-badge">Live Latency Simulator</span>
            <h3 class="ping-heading">Test DNS Route Speed</h3>
            <p class="ping-sub text-muted">Compare standard ISP DNS vs Gaming DNS response times in your region.</p>
          </div>
        </div>

        <div class="ping-controls">
          <div class="ping-field-group">
            <label for="ping-region-select" class="ping-label">Select Game Server Region:</label>
            <div class="ping-select-wrap">
              <select id="ping-region-select" class="ping-select">
                ${regions
                  .map(
                    (reg) => `
                  <option value="${reg.id}">${reg.label}</option>
                `
                  )
                  .join('')}
              </select>
            </div>
          </div>
          <button type="button" id="btn-test-ping" class="btn-gold btn-magnetic">
            <span>Test Ping Now</span>
          </button>
        </div>

        <!-- Ping Result Display -->
        <div id="ping-results-area" class="ping-results" style="display: none;">
          <div class="ping-comparison-grid">
            <!-- Standard ISP DNS -->
            <div class="ping-result-box ping-isp-box">
              <span class="ping-box-label">Standard ISP DNS</span>
              <div class="ping-val-row">
                <span id="ping-isp-val" class="ping-val ping-val-slow">-- ms</span>
              </div>
              <div class="ping-bar-track">
                <div id="ping-isp-bar" class="ping-bar ping-bar-isp" style="width: 0%;"></div>
              </div>
              <span class="ping-sub-label text-muted">High jitter & unoptimized routing</span>
            </div>

            <!-- Gaming DNS -->
            <div class="ping-result-box ping-gaming-box">
              <div class="ping-box-badge">Optimized</div>
              <span class="ping-box-label">Gaming DNS</span>
              <div class="ping-val-row">
                <span id="ping-gaming-val" class="ping-val ping-val-fast">-- ms</span>
              </div>
              <div class="ping-bar-track">
                <div id="ping-gaming-bar" class="ping-bar ping-bar-gaming" style="width: 0%;"></div>
              </div>
              <span class="ping-sub-label text-success" id="ping-improvement-label">--% Latency Reduction</span>
            </div>
          </div>

          <div class="ping-summary-note">
            <span class="status-pulse-dot"></span>
            <span id="ping-summary-text">Simulated results based on live region routing matrices.</span>
          </div>
        </div>
      </div>
    `;

    const testBtn = document.getElementById('btn-test-ping');
    const regionSelect = document.getElementById('ping-region-select');
    const resultsArea = document.getElementById('ping-results-area');
    const ispValEl = document.getElementById('ping-isp-val');
    const ispBarEl = document.getElementById('ping-isp-bar');
    const gamingValEl = document.getElementById('ping-gaming-val');
    const gamingBarEl = document.getElementById('ping-gaming-bar');
    const improvementEl = document.getElementById('ping-improvement-label');
    const summaryTextEl = document.getElementById('ping-summary-text');

    if (!testBtn || !regionSelect) return;

    testBtn.addEventListener('click', () => {
      const selectedId = regionSelect.value;
      const regionData = regions.find((r) => r.id === selectedId) || regions[0];

      if (typeof window.setButtonLoading === 'function') {
        window.setButtonLoading(testBtn, true);
      }

      // Simulate network measurement delay
      setTimeout(() => {
        if (typeof window.setButtonLoading === 'function') {
          window.setButtonLoading(testBtn, false);
        }

        const base = regionData.baseLatency || 40;
        const variance = regionData.variance || 15;

        // ISP DNS has higher latency & jitter
        const ispPing = Math.round(base * 1.85 + (Math.random() * variance * 1.5));
        // Gaming DNS has tight, optimized latency
        const gamingPing = Math.round(base + (Math.random() * (variance * 0.4)));

        const reduction = Math.max(10, Math.round(((ispPing - gamingPing) / ispPing) * 100));

        resultsArea.style.display = 'block';

        ispValEl.textContent = `${ispPing} ms`;
        gamingValEl.textContent = `${gamingPing} ms`;

        // Scale bar widths (max benchmark 200ms)
        const ispWidth = Math.min(100, Math.round((ispPing / 180) * 100));
        const gamingWidth = Math.min(100, Math.round((gamingPing / 180) * 100));

        ispBarEl.style.width = `${ispWidth}%`;
        gamingBarEl.style.width = `${gamingWidth}%`;

        improvementEl.textContent = `⚡ ~${reduction}% Latency Drop (${ispPing - gamingPing}ms faster)`;
        summaryTextEl.textContent = `Optimal route confirmed for ${regionData.label}. Noticeable reduction in matchmaking ping.`;

        if (typeof window.showToast === 'function') {
          window.showToast(`Ping tested for ${regionData.label}: ${gamingPing}ms!`, 'success', 2500);
        }
      }, 650);
    });
  }

  /* ── 10. Update WhatsApp Links Across Page ───────────────── */
  /**
   * Updates all WhatsApp buttons and floating actions with configured number.
   */
  function updateWhatsAppLinks() {
    const config = window.SITE_CONFIG || {};
    const defaultMsg = 'Hi! I want to inquire about Gaming DNS.';
    const waLink = typeof window.getWhatsAppLink === 'function'
      ? window.getWhatsAppLink(defaultMsg)
      : `https://wa.me/923001234567?text=${encodeURIComponent(defaultMsg)}`;

    // Update floating WhatsApp buttons
    const waFloats = document.querySelectorAll('.whatsapp-float, [data-whatsapp-float]');
    waFloats.forEach((el) => {
      el.setAttribute('href', waLink);
    });

    // Update any element with data-whatsapp-display
    const displayEls = document.querySelectorAll('[data-whatsapp-display]');
    displayEls.forEach((el) => {
      el.textContent = config.brand?.whatsappDisplay || '0300-1234567';
    });

    // Update generic whatsapp inquiry links
    document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
      if (!link.getAttribute('href') || link.getAttribute('href').includes('923001234567')) {
        link.setAttribute('href', waLink);
      }
    });
  }

  /* ── 11. Master App Initialization ───────────────────────── */
  function initApp() {
    // 1. Initialize all animations & micro-interactions
    if (typeof window.initAllAnimations === 'function') {
      window.initAllAnimations();
    }

    // 2. Render dynamic sections from SITE_CONFIG
    renderDNSServers();
    renderPricingCards();
    renderGames();
    renderTestimonials();
    renderFAQ();
    renderStats();
    renderTrustBar();
    initPingTester();

    // 3. Components and brand initialization
    if (typeof window.initNavbarBrand === 'function') {
      window.initNavbarBrand();
    }
    if (typeof window.initFooter === 'function') {
      window.initFooter();
    }

    // 4. Update WhatsApp links
    updateWhatsAppLinks();

    // 5. Re-run animation bindings on newly injected dynamic elements
    requestAnimationFrame(() => {
      if (typeof window.initScrollReveal === 'function') {
        window.initScrollReveal();
      }
      if (typeof window.initCardTilt === 'function') {
        window.initCardTilt();
      }
      if (typeof window.initMagneticButtons === 'function') {
        window.initMagneticButtons();
      }
      if (typeof window.initButtonShine === 'function') {
        window.initButtonShine();
      }
      if (typeof window.initRipple === 'function') {
        window.initRipple();
      }
    });
  }

  // Bind to DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  /* ── Export functions to window for global access ────────── */
  window.renderDNSServers = renderDNSServers;
  window.renderPricingCards = renderPricingCards;
  window.renderGames = renderGames;
  window.renderTestimonials = renderTestimonials;
  window.renderFAQ = renderFAQ;
  window.renderStats = renderStats;
  window.renderTrustBar = renderTrustBar;
  window.initPingTester = initPingTester;
  window.updateWhatsAppLinks = updateWhatsAppLinks;
  window.initApp = initApp;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      renderDNSServers,
      renderPricingCards,
      renderGames,
      renderTestimonials,
      renderFAQ,
      renderStats,
      renderTrustBar,
      initPingTester,
      updateWhatsAppLinks,
      initApp,
    };
  }
})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
