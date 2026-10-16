/**
 * ============================================================
 *  COMPONENTS.JS — Reusable UI Component Functions
 *  Gaming DNS Store Design System
 * ============================================================
 */

(function (window, document) {
  'use strict';

  /* ── 1. Toast Notification System ───────────────────────── */
  /**
   * Displays a toast notification in the bottom-right corner.
   * Auto-creates the container if it doesn't exist.
   *
   * @param {string} message - Toast message text or HTML
   * @param {'success'|'error'|'warning'|'info'} [type='success'] - Notification style
   * @param {number} [duration=3000] - Duration in ms before auto-dismiss
   */
  function showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} glass-card`;
    toast.setAttribute('role', 'alert');

    // Choose icon based on notification type
    const icons = {
      success: `
        <svg class="toast-icon text-success" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>`,
      error: `
        <svg class="toast-icon text-danger" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>`,
      warning: `
        <svg class="toast-icon text-warning" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>`,
      info: `
        <svg class="toast-icon text-info" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>`,
    };

    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon-wrap">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
      </div>
      <button type="button" class="toast-close" aria-label="Dismiss notification">
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>
    `;

    container.appendChild(toast);

    // Trigger enter animation on next frame
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    let dismissTimer = null;

    const dismiss = () => {
      if (dismissTimer) clearTimeout(dismissTimer);
      toast.classList.remove('toast-visible');
      toast.classList.add('toast-hiding');
      toast.addEventListener('transitionend', () => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, { once: true });
      // Fallback in case transitionend does not fire
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 500);
    };

    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', dismiss);
    }

    if (duration > 0) {
      dismissTimer = setTimeout(dismiss, duration);
    }

    return toast;
  }

  /* ── 2. Copy to Clipboard ────────────────────────────────── */
  /**
   * Copies text to clipboard and provides visual feedback on button.
   *
   * @param {string} text - Text to copy
   * @param {HTMLElement} [buttonEl] - Optional button element to show feedback
   * @returns {Promise<boolean>}
   */
  async function copyToClipboard(text, buttonEl) {
    let success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        success = true;
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
      success = false;
    }

    if (buttonEl) {
      if (!buttonEl.dataset.originalHtml) {
        buttonEl.dataset.originalHtml = buttonEl.innerHTML;
      }
      buttonEl.classList.add('copied');
      buttonEl.innerHTML = `
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style="display:inline;vertical-align:-2px;margin-right:4px;">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg>Copied ✓
      `;

      setTimeout(() => {
        buttonEl.classList.remove('copied');
        buttonEl.innerHTML = buttonEl.dataset.originalHtml;
      }, 2000);
    }

    if (success) {
      showToast('Copied to clipboard!', 'success', 2500);
    } else {
      showToast('Failed to copy. Please copy manually.', 'error', 3000);
    }

    return success;
  }

  /* ── 3. Loading Skeleton Generator ───────────────────────── */
  /**
   * Generates loading skeleton HTML for placeholder states.
   *
   * @param {'card'|'server'|'text'|'pricing'} [type='card'] - Skeleton type
   * @returns {string} HTML markup
   */
  function createSkeleton(type = 'card') {
    switch (type) {
      case 'server':
        return `
          <div class="skeleton-card glass-card skeleton-pulse">
            <div class="skeleton-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <div class="skeleton-line" style="width:140px;height:24px;border-radius:6px;"></div>
              <div class="skeleton-line" style="width:70px;height:22px;border-radius:12px;"></div>
            </div>
            <div class="skeleton-body" style="display:flex;flex-direction:column;gap:12px;">
              <div class="skeleton-line" style="width:100%;height:44px;border-radius:10px;"></div>
              <div class="skeleton-line" style="width:100%;height:44px;border-radius:10px;"></div>
              <div class="skeleton-line" style="width:80%;height:38px;border-radius:10px;"></div>
            </div>
          </div>
        `;
      case 'pricing':
        return `
          <div class="skeleton-card glass-card skeleton-pulse" style="padding:32px;display:flex;flex-direction:column;gap:16px;">
            <div class="skeleton-line" style="width:90px;height:28px;border-radius:8px;"></div>
            <div class="skeleton-line" style="width:140px;height:42px;border-radius:8px;"></div>
            <div class="skeleton-line" style="width:100%;height:16px;border-radius:4px;margin-top:10px;"></div>
            <div class="skeleton-line" style="width:90%;height:16px;border-radius:4px;"></div>
            <div class="skeleton-line" style="width:85%;height:16px;border-radius:4px;"></div>
            <div class="skeleton-line" style="width:100%;height:48px;border-radius:12px;margin-top:20px;"></div>
          </div>
        `;
      case 'text':
        return `
          <div class="skeleton-line skeleton-pulse" style="width:100%;height:18px;border-radius:4px;"></div>
        `;
      case 'card':
      default:
        return `
          <div class="skeleton-card glass-card skeleton-pulse" style="padding:24px;display:flex;flex-direction:column;gap:14px;">
            <div class="skeleton-line" style="width:50%;height:24px;border-radius:6px;"></div>
            <div class="skeleton-line" style="width:100%;height:16px;border-radius:4px;"></div>
            <div class="skeleton-line" style="width:80%;height:16px;border-radius:4px;"></div>
            <div class="skeleton-line" style="width:40%;height:36px;border-radius:10px;margin-top:8px;"></div>
          </div>
        `;
    }
  }

  /* ── 4. Modal Open / Close ───────────────────────────────── */
  let activeModalBackdrop = null;
  let lastFocusedElement = null;

  /**
   * Closes the currently active modal.
   */
  function closeModal() {
    if (!activeModalBackdrop) return;

    const backdrop = activeModalBackdrop;
    const modalContent = backdrop.querySelector('.modal-container');

    backdrop.classList.remove('modal-open');
    if (modalContent) modalContent.classList.remove('modal-content-open');

    const finishClose = () => {
      if (backdrop.parentNode) {
        backdrop.parentNode.removeChild(backdrop);
      }
      document.body.classList.remove('modal-scroll-lock');
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
      activeModalBackdrop = null;
      document.removeEventListener('keydown', handleModalKeyDown);
    };

    setTimeout(finishClose, 300);
  }

  function handleModalKeyDown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  /**
   * Opens a glass-styled modal with custom HTML content.
   *
   * @param {string} contentHtml - HTML markup to insert into the modal
   * @returns {HTMLElement} Modal backdrop element
   */
  function openModal(contentHtml) {
    if (activeModalBackdrop) {
      closeModal();
    }

    lastFocusedElement = document.activeElement;

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.id = 'modal-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    backdrop.innerHTML = `
      <div class="modal-container glass-card" tabindex="-1">
        <button type="button" class="modal-close" aria-label="Close modal">
          <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
        <div class="modal-body">
          ${contentHtml}
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.body.classList.add('modal-scroll-lock');
    activeModalBackdrop = backdrop;

    // Click outside modal container to close
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    const closeBtn = backdrop.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', handleModalKeyDown);

    requestAnimationFrame(() => {
      backdrop.classList.add('modal-open');
      const container = backdrop.querySelector('.modal-container');
      if (container) {
        container.classList.add('modal-content-open');
        container.focus();
      }
    });

    return backdrop;
  }

  /* ── 5. Form Validation Helpers ──────────────────────────── */
  /**
   * Validates email address format.
   * @param {string} email
   * @returns {boolean}
   */
  function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email.trim());
  }

  /**
   * Validates Pakistani mobile phone format (03XX-XXXXXXX or +923XXXXXXXXX).
   * @param {string} phone
   * @returns {boolean}
   */
  function validatePhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const clean = phone.trim().replace(/[-\s()]/g, '');
    // Matches 03001234567, 923001234567, +923001234567, 00923001234567
    const re = /^((\+92)|(0092)|(92)|0)?3[0-9]{9}$/;
    return re.test(clean);
  }

  /**
   * Validates that a string or value is not empty.
   * @param {*} value
   * @returns {boolean}
   */
  function validateRequired(value) {
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
  }

  /**
   * Displays an inline error message beneath an input element.
   *
   * @param {HTMLElement} inputEl
   * @param {string} message
   */
  function showFieldError(inputEl, message) {
    if (!inputEl) return;
    inputEl.classList.add('input-error');
    inputEl.setAttribute('aria-invalid', 'true');

    let parentGroup = inputEl.closest('.form-group') || inputEl.parentElement;
    let errorMsgEl = parentGroup.querySelector('.field-error-msg');

    if (!errorMsgEl) {
      errorMsgEl = document.createElement('div');
      errorMsgEl.className = 'field-error-msg';
      errorMsgEl.setAttribute('role', 'alert');
      // Insert right after the input or at the bottom of the group
      if (inputEl.nextSibling) {
        parentGroup.insertBefore(errorMsgEl, inputEl.nextSibling);
      } else {
        parentGroup.appendChild(errorMsgEl);
      }
    }

    errorMsgEl.textContent = message;
    errorMsgEl.style.display = 'block';
  }

  /**
   * Clears inline error message for an input element.
   *
   * @param {HTMLElement} inputEl
   */
  function clearFieldError(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('input-error');
    inputEl.removeAttribute('aria-invalid');

    const parentGroup = inputEl.closest('.form-group') || inputEl.parentElement;
    if (parentGroup) {
      const errorMsgEl = parentGroup.querySelector('.field-error-msg');
      if (errorMsgEl) {
        errorMsgEl.textContent = '';
        errorMsgEl.style.display = 'none';
      }
    }
  }

  /* ── 6. Button States ────────────────────────────────────── */
  /**
   * Toggles button loading state with a spinner.
   *
   * @param {HTMLElement} btn
   * @param {boolean} [loading=true]
   */
  function setButtonLoading(btn, loading = true) {
    if (!btn) return;
    if (loading) {
      if (!btn.dataset.originalHtml) {
        btn.dataset.originalHtml = btn.innerHTML;
      }
      btn.disabled = true;
      btn.classList.add('is-loading');
      btn.innerHTML = `
        <span class="btn-spinner" aria-hidden="true"></span>
        <span>Processing...</span>
      `;
    } else {
      btn.disabled = false;
      btn.classList.remove('is-loading');
      if (btn.dataset.originalHtml) {
        btn.innerHTML = btn.dataset.originalHtml;
      }
    }
  }

  /**
   * Sets button to a temporary success state.
   *
   * @param {HTMLElement} btn
   * @param {string} [text='Done!']
   */
  function setButtonSuccess(btn, text = 'Done!') {
    if (!btn) return;
    if (!btn.dataset.originalHtml) {
      btn.dataset.originalHtml = btn.innerHTML;
    }
    btn.classList.add('is-success');
    btn.innerHTML = `
      <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18" style="display:inline;vertical-align:-3px;margin-right:6px;">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>${text}
    `;

    setTimeout(() => {
      btn.classList.remove('is-success');
      if (btn.dataset.originalHtml) {
        btn.innerHTML = btn.dataset.originalHtml;
      }
    }, 2500);
  }

  /* ── 7. Render Star Rating HTML ──────────────────────────── */
  /**
   * Generates gold star rating HTML string out of 5 stars.
   *
   * @param {number} rating - Score between 1 and 5
   * @returns {string} HTML markup
   */
  function renderStars(rating = 5) {
    const num = Math.max(0, Math.min(5, Number(rating) || 5));
    let starsHtml = '';

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(num)) {
        // Full star
        starsHtml += `
          <svg class="star-icon star-full" viewBox="0 0 20 20" fill="#E8C987" width="18" height="18" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>`;
      } else if (i === Math.ceil(num) && num % 1 >= 0.3) {
        // Half star
        starsHtml += `
          <svg class="star-icon star-half" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <defs>
              <linearGradient id="half-star-${i}">
                <stop offset="50%" stop-color="#E8C987"/>
                <stop offset="50%" stop-color="rgba(255,255,255,0.2)"/>
              </linearGradient>
            </defs>
            <path fill="url(#half-star-${i})" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>`;
      } else {
        // Empty star
        starsHtml += `
          <svg class="star-icon star-empty" viewBox="0 0 20 20" fill="rgba(255,255,255,0.2)" width="18" height="18" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>`;
      }
    }

    return `<div class="star-rating" aria-label="${num} out of 5 stars">${starsHtml}</div>`;
  }

  /* ── 8. Generate Unique Order ID ─────────────────────────── */
  /**
   * Generates a unique human-friendly order identifier.
   * Example: DNS-9K42-781A
   *
   * @returns {string}
   */
  function generateOrderId() {
    const timeSegment = Date.now().toString(36).toUpperCase().slice(-4);
    const randSegment = Math.floor(1000 + Math.random() * 9000).toString(36).toUpperCase();
    return `DNS-${timeSegment}-${randSegment}`;
  }

  /* ── 9. Format Price in PKR ──────────────────────────────── */
  /**
   * Formats numeric price into currency format based on SITE_CONFIG.
   *
   * @param {number} amount
   * @returns {string}
   */
  function formatPrice(amount) {
    const config = window.SITE_CONFIG || {};
    const symbol = (config.currency && config.currency.symbol) || 'Rs.';

    const num = Number(amount);
    if (isNaN(num) || num === 0) {
      return 'Free';
    }
    return `${symbol} ${num.toLocaleString()}`;
  }

  /* ── 10. Render Navbar Brand from Config ─────────────────── */
  /**
   * Updates brand name, logo, and taglines in the header/nav.
   */
  function initNavbarBrand() {
    const config = window.SITE_CONFIG || {};
    const brand = config.brand || { name: 'YourBrand' };

    const navLogoEl = document.getElementById('nav-logo');
    if (navLogoEl) {
      if (brand.logo) {
        navLogoEl.innerHTML = `<img src="${brand.logo}" alt="${brand.name}" class="nav-logo-img">`;
      } else {
        navLogoEl.innerHTML = `
          <span class="brand-text">
            <span class="brand-glow">${brand.name}</span><span class="logo-accent">DNS</span>
          </span>
        `;
      }
    }

    // Update any elements with data-brand-name
    document.querySelectorAll('[data-brand-name]').forEach((el) => {
      el.textContent = brand.name;
    });

    // Update any elements with data-brand-tagline
    if (brand.tagline) {
      document.querySelectorAll('[data-brand-tagline]').forEach((el) => {
        el.textContent = brand.tagline;
      });
    }
  }

  /* ── 11. WhatsApp Link Generator ─────────────────────────── */
  /**
   * Generates a direct WhatsApp click-to-chat URL using configured number.
   *
   * @param {string} [message='']
   * @returns {string}
   */
  function getWhatsAppLink(message = '') {
    const config = window.SITE_CONFIG || {};
    const rawNumber = (config.brand && config.brand.whatsappNumber) || '+923001234567';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

    const baseUrl = `https://wa.me/${cleanNumber}`;
    if (!message) return baseUrl;
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }

  /* ── 12. Render Footer from Config ───────────────────────── */
  /**
   * Renders footer content dynamically according to the design system.
   */
  function initFooter() {
    const footerContainer = document.getElementById('footer') || document.querySelector('.site-footer') || document.querySelector('footer');
    if (!footerContainer) return;

    const config = window.SITE_CONFIG || {};
    const brand = config.brand || {
      name: 'YourBrand',
      description: 'Premium gaming-optimized DNS service for mobile gamers.',
      copyrightYear: new Date().getFullYear().toString(),
      supportEmail: 'support@yourbrand.com',
      supportHours: 'Mon – Sun, 10 AM – 12 AM (PKT)',
      whatsappDisplay: '0300-1234567',
      socialLinks: {},
    };

    const waLink = getWhatsAppLink('Hi! I need support with Gaming DNS.');

    footerContainer.innerHTML = `
      <div class="footer-glow-bg" aria-hidden="true"></div>
      <div class="container footer-inner">
        <div class="footer-grid">
          <!-- Col 1: Brand Info -->
          <div class="footer-col footer-col-brand">
            <a href="index.html" class="nav-logo footer-logo">
              <span class="brand-glow">${brand.name}</span>
              <span class="brand-tag">DNS</span>
            </a>
            <p class="footer-desc text-muted">${brand.description || 'Premium low-latency DNS engineered for competitive mobile gaming.'}</p>
            
            <div class="footer-payment-methods">
              <span class="payment-badge">Easypaisa</span>
              <span class="payment-badge">JazzCash</span>
              <span class="payment-badge">Instant Activation</span>
            </div>
          </div>

          <!-- Col 2: Navigation Links -->
          <div class="footer-col">
            <h4 class="footer-title">Navigation</h4>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="index.html#dns-servers">DNS Servers</a></li>
              <li><a href="ios-guide.html">iOS Setup Guide</a></li>
              <li><a href="android-guide.html">Android Setup Guide</a></li>
              <li><a href="index.html#pricing">Pricing Plans</a></li>
              <li><a href="index.html#faq">Frequently Asked</a></li>
            </ul>
          </div>

          <!-- Col 3: Customer Support -->
          <div class="footer-col">
            <h4 class="footer-title">Support & Orders</h4>
            <ul class="footer-links">
              <li><a href="checkout.html">Get Premium</a></li>
              <li><a href="order-tracking.html">Track Order Status</a></li>
              <li><a href="contact.html">Contact Support</a></li>
              <li><a href="${waLink}" target="_blank" rel="noopener noreferrer">WhatsApp Help</a></li>
              <li class="support-hours-item">
                <span class="text-muted">Hours:</span>
                <span class="text-primary">${brand.supportHours || '10 AM – 12 AM PKT'}</span>
              </li>
            </ul>
          </div>

          <!-- Col 4: Legal & Policies -->
          <div class="footer-col">
            <h4 class="footer-title">Legal & Security</h4>
            <ul class="footer-links">
              <li><a href="terms.html">Terms of Service</a></li>
              <li><a href="privacy.html">Privacy Policy</a></li>
              <li><a href="refund.html">Refund Policy</a></li>
            </ul>
            <div class="footer-social-links">
              ${brand.socialLinks?.discord ? `<a href="${brand.socialLinks.discord}" target="_blank" rel="noopener noreferrer" aria-label="Discord"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg></a>` : ''}
              ${brand.socialLinks?.instagram ? `<a href="${brand.socialLinks.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>` : ''}
              ${brand.socialLinks?.youtube ? `<a href="${brand.socialLinks.youtube}" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>` : ''}
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-copy text-muted">
            &copy; ${brand.copyrightYear || '2026'} ${brand.name}. All rights reserved. Gaming DNS service.
          </div>
          <div class="footer-bottom-badge">
            <span class="status-dot status-dot-live"></span> 100% Zero-Log Network
          </div>
        </div>
      </div>
    `;
  }

  /* ── Export to window ────────────────────────────────────── */
  window.showToast = showToast;
  window.copyToClipboard = copyToClipboard;
  window.createSkeleton = createSkeleton;
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.validateEmail = validateEmail;
  window.validatePhone = validatePhone;
  window.validateRequired = validateRequired;
  window.showFieldError = showFieldError;
  window.clearFieldError = clearFieldError;
  window.setButtonLoading = setButtonLoading;
  window.setButtonSuccess = setButtonSuccess;
  window.renderStars = renderStars;
  window.generateOrderId = generateOrderId;
  window.formatPrice = formatPrice;
  window.initNavbarBrand = initNavbarBrand;
  window.initFooter = initFooter;
  window.getWhatsAppLink = getWhatsAppLink;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      showToast,
      copyToClipboard,
      createSkeleton,
      openModal,
      closeModal,
      validateEmail,
      validatePhone,
      validateRequired,
      showFieldError,
      clearFieldError,
      setButtonLoading,
      setButtonSuccess,
      renderStars,
      generateOrderId,
      formatPrice,
      initNavbarBrand,
      initFooter,
      getWhatsAppLink,
    };
  }
})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
