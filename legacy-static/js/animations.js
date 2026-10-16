/**
 * ============================================================
 *  ANIMATIONS.JS — Micro-Interactions & Animation Controller
 *  Gaming DNS Store Design System
 * ============================================================
 */

(function (window, document) {
  'use strict';

  /* ── 1. Accessibility Check ─────────────────────────────── */
  /**
   * Checks whether the user has requested reduced motion.
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return Boolean(
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /**
   * Checks whether current viewport is desktop and non-touch.
   * @returns {boolean}
   */
  function isDesktopDevice() {
    const isTouch =
      'ontouchstart' in window ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    return window.innerWidth >= 1024 && !isTouch;
  }

  /* ── 2. Scroll Reveal using IntersectionObserver ─────────── */
  /**
   * Reveals elements smoothly as they enter the viewport.
   * Uses IntersectionObserver with threshold 0.1.
   */
  function initScrollReveal() {
    const revealSelectors = [
      '.reveal',
      '.reveal-up',
      '.reveal-fade',
      '.reveal-card',
      '[data-reveal]',
      '.glass-card',
      '.server-card',
      '.pricing-card',
      '.testimonial-card',
      '.faq-item',
      '.game-card',
      '.stat-card',
    ].join(', ');

    const elements = document.querySelectorAll(revealSelectors);
    if (!elements.length) return;

    if (prefersReducedMotion()) {
      elements.forEach((el) => el.classList.add('revealed'));
      return;
    }

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => {
      // Add base reveal class if not already present
      if (!el.classList.contains('reveal') && !el.classList.contains('revealed')) {
        el.classList.add('reveal');
      }
      observer.observe(el);
    });
  }

  /* ── 3. Animated Number Counters ─────────────────────────── */
  /**
   * Animates numbers counting up when entering viewport.
   */
  function initCounters() {
    const counterElements = document.querySelectorAll('[data-target], .counter, [data-counter]');
    if (!counterElements.length) return;

    const animateCounter = (el) => {
      const rawTarget = el.getAttribute('data-target') || el.textContent.trim();
      const cleanTarget = parseFloat(rawTarget.replace(/[^0-9.]/g, ''));
      if (isNaN(cleanTarget)) return;

      const isDecimal = rawTarget.includes('.');
      const decimalPlaces = isDecimal ? (rawTarget.split('.')[1] || '').length : 0;
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || (rawTarget.includes('%') ? '%' : rawTarget.includes('+') ? '+' : '');

      if (prefersReducedMotion()) {
        const formatted = isDecimal
          ? cleanTarget.toFixed(decimalPlaces)
          : cleanTarget.toLocaleString();
        el.textContent = `${prefix}${formatted}${suffix}`;
        return;
      }

      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic curve: 1 - (1 - t)^3
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeProgress * cleanTarget;

        let displayVal;
        if (isDecimal) {
          displayVal = currentVal.toFixed(decimalPlaces);
        } else {
          displayVal = Math.floor(currentVal).toLocaleString();
        }

        el.textContent = `${prefix}${displayVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          const finalVal = isDecimal
            ? cleanTarget.toFixed(decimalPlaces)
            : cleanTarget.toLocaleString();
          el.textContent = `${prefix}${finalVal}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    };

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      counterElements.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    counterElements.forEach((el) => observer.observe(el));
  }

  /* ── 4. Card 3D Tilt Effect on Hover (Desktop Only) ─────── */
  /**
   * Subtle 3D tilt effect on hover for glass cards.
   * Strictly limited to max 4 degrees on desktop only.
   */
  function initCardTilt() {
    if (prefersReducedMotion() || !isDesktopDevice()) return;

    const cards = document.querySelectorAll(
      '.tilt-card, .glass-card:not(.no-tilt), .pricing-card, .server-card, .testimonial-card'
    );
    if (!cards.length) return;

    cards.forEach((card) => {
      let isHovered = false;

      const onMouseMove = (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (mouseX - centerX) / centerX; // -1 to +1
        const deltaY = (mouseY - centerY) / centerY; // -1 to +1

        const maxTilt = 4; // Max 4 deg
        const tiltX = -deltaY * maxTilt;
        const tiltY = deltaX * maxTilt;

        requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-4px)`;
          card.style.transition = 'transform 100ms ease-out';
        });
      };

      const onMouseEnter = () => {
        isHovered = true;
      };

      const onMouseLeave = () => {
        isHovered = false;
        requestAnimationFrame(() => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
          card.style.transition = 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)';
        });
      };

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  /* ── 5. Magnetic Button Effect (Desktop Only) ────────────── */
  /**
   * Magnetic cursor-attraction effect on primary/gold buttons.
   * Strictly limited to max 8px offset.
   */
  function initMagneticButtons() {
    if (prefersReducedMotion() || !isDesktopDevice()) return;

    const buttons = document.querySelectorAll('.btn-magnetic, .btn-gold, .nav-cta');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      let isHovered = false;

      const onMouseMove = (e) => {
        if (!isHovered) return;
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const distanceX = e.clientX - btnCenterX;
        const distanceY = e.clientY - btnCenterY;

        const maxOffset = 8; // Max 8px offset
        const moveX = (distanceX / (rect.width / 2)) * maxOffset;
        const moveY = (distanceY / (rect.height / 2)) * maxOffset;

        requestAnimationFrame(() => {
          btn.style.transform = `translate(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px)`;
          btn.style.transition = 'transform 80ms ease-out';
        });
      };

      const onMouseEnter = () => {
        isHovered = true;
      };

      const onMouseLeave = () => {
        isHovered = false;
        requestAnimationFrame(() => {
          btn.style.transform = 'translate(0px, 0px)';
          btn.style.transition = 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)';
        });
      };

      btn.addEventListener('mouseenter', onMouseEnter, { passive: true });
      btn.addEventListener('mousemove', onMouseMove, { passive: true });
      btn.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  /* ── 6. Gold Button Shine / Sweep Effect ─────────────────── */
  /**
   * Dynamic gold shine highlight following mouse across gold CTA buttons.
   */
  function initButtonShine() {
    if (prefersReducedMotion()) return;

    const goldButtons = document.querySelectorAll('.btn-gold, .btn-shine');
    if (!goldButtons.length) return;

    goldButtons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--mouse-x', `${x}px`);
        btn.style.setProperty('--mouse-y', `${y}px`);
      }, { passive: true });
    });
  }

  /* ── 7. Ripple Effect on Click ───────────────────────────── */
  /**
   * Radial wave ripple expanding from the exact click coordinate.
   */
  function initRipple() {
    if (prefersReducedMotion()) return;

    const clickableElements = document.querySelectorAll(
      '.btn, .btn-gold, .btn-secondary, button.btn-ripple, .nav-link'
    );
    if (!clickableElements.length) return;

    clickableElements.forEach((el) => {
      el.addEventListener('click', function (e) {
        // Ensure relative positioning
        const style = window.getComputedStyle(el);
        if (style.position === 'static') {
          el.style.position = 'relative';
        }
        el.style.overflow = 'hidden';

        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';

        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        el.appendChild(ripple);

        setTimeout(() => {
          if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
          }
        }, 650);
      });
    });
  }

  /* ── 8. Navbar Scroll Behavior ───────────────────────────── */
  /**
   * Adds .scrolled class to navbar when page is scrolled down.
   */
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially to handle refreshed page state
    handleScroll();
  }

  /* ── 9. Smooth Scroll to Anchor ──────────────────────────── */
  /**
   * Smoothly scrolls to target anchor sections with header offset.
   */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const navEl = document.getElementById('navbar') || document.querySelector('.navbar');
      const navHeight = navEl ? navEl.offsetHeight : 70;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (navHeight + 20);

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });

      // Update URL hash without causing a page jump
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', targetId);
      }
    });
  }

  /* ── 10. FAQ Accordion Toggle ────────────────────────────── */
  /**
   * Accordion expand/collapse with smooth transitions and ARIA sync.
   */
  function initAccordion() {
    const accordionItems = document.querySelectorAll('.faq-item, .accordion-item');
    if (!accordionItems.length) return;

    accordionItems.forEach((item) => {
      const header = item.querySelector('.faq-question, .accordion-header, [data-accordion-toggle]');
      const answer = item.querySelector('.faq-answer, .accordion-content, [data-accordion-content]');
      if (!header || !answer) return;

      // Avoid double binding
      if (header.dataset.accordionBound === 'true') return;
      header.dataset.accordionBound = 'true';

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active') || item.classList.contains('open');

        // Close sibling items in the same container
        const parent = item.parentElement;
        if (parent) {
          const siblings = parent.querySelectorAll('.faq-item.active, .faq-item.open, .accordion-item.active, .accordion-item.open');
          siblings.forEach((sib) => {
            if (sib !== item) {
              sib.classList.remove('active', 'open');
              const sibHeader = sib.querySelector('.faq-question, .accordion-header');
              const sibAnswer = sib.querySelector('.faq-answer, .accordion-content');
              if (sibHeader) sibHeader.setAttribute('aria-expanded', 'false');
              if (sibAnswer) {
                sibAnswer.style.maxHeight = null;
                sibAnswer.style.opacity = '0';
              }
            }
          });
        }

        // Toggle current item
        if (isOpen) {
          item.classList.remove('active', 'open');
          header.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
          answer.style.opacity = '0';
        } else {
          item.classList.add('active', 'open');
          header.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = `${answer.scrollHeight + 32}px`;
          answer.style.opacity = '1';
        }
      });
    });
  }

  /* ── 11. Mobile Nav Toggle ───────────────────────────────── */
  /**
   * Controls mobile navigation hamburger menu and off-canvas drawer.
   */
  function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!navToggle || !navMenu) return;

    if (navToggle.dataset.navBound === 'true') return;
    navToggle.dataset.navBound = 'true';

    const toggleNav = (forceState) => {
      const willOpen = typeof forceState === 'boolean'
        ? forceState
        : !navMenu.classList.contains('active');

      if (willOpen) {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-mobile-open');
      } else {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-mobile-open');
      }
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNav();
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll('.nav-link, .nav-cta').forEach((link) => {
      link.addEventListener('click', () => {
        toggleNav(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        toggleNav(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleNav(false);
      }
    });
  }

  /* ── 12. Master Init Function ────────────────────────────── */
  /**
   * Initializes all animations and micro-interactions on the page.
   */
  function initAllAnimations() {
    initScrollReveal();
    initCounters();
    initCardTilt();
    initMagneticButtons();
    initButtonShine();
    initRipple();
    initNavbarScroll();
    initSmoothScroll();
    initAccordion();
    initMobileNav();
  }

  /* ── Export to window ────────────────────────────────────── */
  window.prefersReducedMotion = prefersReducedMotion;
  window.initScrollReveal = initScrollReveal;
  window.initCounters = initCounters;
  window.initCardTilt = initCardTilt;
  window.initMagneticButtons = initMagneticButtons;
  window.initButtonShine = initButtonShine;
  window.initRipple = initRipple;
  window.initNavbarScroll = initNavbarScroll;
  window.initSmoothScroll = initSmoothScroll;
  window.initAccordion = initAccordion;
  window.initMobileNav = initMobileNav;
  window.initAllAnimations = initAllAnimations;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      prefersReducedMotion,
      initScrollReveal,
      initCounters,
      initCardTilt,
      initMagneticButtons,
      initButtonShine,
      initRipple,
      initNavbarScroll,
      initSmoothScroll,
      initAccordion,
      initMobileNav,
      initAllAnimations,
    };
  }
})(typeof window !== 'undefined' ? window : this, typeof document !== 'undefined' ? document : {});
