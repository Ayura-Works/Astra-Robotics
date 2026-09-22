/**
 * Astra Robotics — Site Interactions
 * Vanilla JS, no dependencies.
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- NAVIGATION SCROLL STATE ---------- */
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrolled = window.scrollY > 24;
    nav.classList.toggle('nav--scrolled', scrolled);
    backToTop.classList.toggle('back-to-top--visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- MOBILE MENU ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  function openMenu() {
    navLinks.classList.add('nav__links--open');
    navToggle.classList.add('nav__toggle--open');
    navToggle.setAttribute('aria-label', 'Close menu');
    navToggle.setAttribute('aria-expanded', 'true');
    navBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('nav__links--open');
    navToggle.classList.remove('nav__toggle--open');
    navToggle.setAttribute('aria-label', 'Open menu');
    navToggle.setAttribute('aria-expanded', 'false');
    navBackdrop.hidden = true;
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    if (navLinks.classList.contains('nav__links--open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navBackdrop.addEventListener('click', closeMenu);

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('nav__links--open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------- ACTIVE SECTION HIGHLIGHT ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(function (link) {
            link.classList.toggle(
              'nav__link--active',
              link.getAttribute('href') === '#' + id
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion) {
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- SOLUTION CARD EXPAND ---------- */
  document.querySelectorAll('.solution-card__link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const detailId = btn.getAttribute('aria-controls');
      const detail = document.getElementById(detailId);
      if (!detail) return;
      const isOpen = detail.classList.toggle('solution-card__detail--open');
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.querySelector('.solution-card__arrow').textContent = isOpen ? '↑' : '→';
    });
  });

  /* ---------- TECH DIAGRAM SIGNAL ANIMATION (JS-driven) ---------- */
  // CSS animation of SVG cx attribute is unreliable across browsers,
  // so we animate via JS using requestAnimationFrame.
  if (!prefersReducedMotion) {
    const signals = [
      { el: document.getElementById('signal1'), startX: 90, endX: 250, delay: 0 },
      { el: document.getElementById('signal2'), startX: 330, endX: 490, delay: 1300 },
      { el: document.getElementById('signal3'), startX: 570, endX: 730, delay: 2600 },
    ];

    const cycleDuration = 4000;
    let startTime = null;

    function animateSignals(timestamp) {
      if (!startTime) startTime = timestamp;

      signals.forEach(function (s) {
        if (!s.el) return;
        const elapsed = (timestamp - startTime - s.delay) % cycleDuration;
        if (elapsed < 0) return;

        const progress = elapsed / cycleDuration;
        // Fade in during first 20%, travel during 20-50%, fade out during 50-80%, invisible 80-100%
        if (progress < 0.2) {
          const t = progress / 0.2;
          s.el.setAttribute('opacity', String(t));
          s.el.setAttribute('cx', String(s.startX));
        } else if (progress < 0.5) {
          const t = (progress - 0.2) / 0.3;
          s.el.setAttribute('opacity', '1');
          s.el.setAttribute('cx', String(s.startX + (s.endX - s.startX) * t));
        } else if (progress < 0.8) {
          const t = (progress - 0.5) / 0.3;
          s.el.setAttribute('opacity', String(1 - t * 0.7));
          s.el.setAttribute('cx', String(s.endX));
        } else {
          s.el.setAttribute('opacity', '0');
          s.el.setAttribute('cx', String(s.endX));
        }
      });

      requestAnimationFrame(animateSignals);
    }

    requestAnimationFrame(animateSignals);
  }

  /* ---------- PROJECT MODAL ---------- */
  const projectData = {
    orion: {
      num: 'PROJECT 01',
      category: 'Autonomous Systems',
      title: 'ORION — Autonomous Material Handling',
      subtitle:
        'An autonomous mobile robotic platform designed to transport components between manufacturing workstations.',
      problem:
        'Material transport between workstations relied on manual carts, causing bottlenecks, inconsistent delivery times, and operator distraction from higher-value tasks.',
      approach:
        'A mobile platform was designed with sensor fusion for navigation, obstacle detection, and fleet coordination. The system communicates with a central controller for task dispatching and route optimization.',
      architecture:
        'The platform combines a differential-drive base, LiDAR and ultrasonic sensing for obstacle detection, an onboard embedded controller for real-time navigation, and a fleet management interface for multi-unit coordination and automated docking.',
      technologies: [
        'LiDAR Navigation',
        'Sensor Fusion',
        'Fleet Communication',
        'Automated Docking',
        'Embedded Control',
        'Path Planning',
      ],
      specs: [
        { label: 'PRECISION', value: '±5 mm' },
        { label: 'CYCLE TIME', value: '2.8 s' },
        { label: 'AVAILABILITY', value: '99.2%' },
      ],
    },
    lumen: {
      num: 'PROJECT 02',
      category: 'Machine Vision',
      title: 'LUMEN — Vision Inspection System',
      subtitle:
        'A machine-vision platform for automated inspection of manufactured components.',
      problem:
        'Manual inspection of components was slow, inconsistent, and prone to human error, leading to variable quality outcomes and high rework rates.',
      approach:
        'A vision-based inspection system was developed using calibrated cameras, controlled lighting, and classification models to detect surface defects and dimensional deviations in real time.',
      architecture:
        'The system integrates industrial cameras with controlled illumination, an edge computing unit running computer vision models, and a production-line interface for real-time pass/fail decisions and defect classification.',
      technologies: [
        'Computer Vision',
        'Defect Detection',
        'Classification Models',
        'Controlled Illumination',
        'Edge Computing',
        'Production-Line Integration',
      ],
      specs: [
        { label: 'INSPECTION RATE', value: '120/min' },
        { label: 'DEFECT DETECTION', value: '99.5%' },
        { label: 'FALSE POSITIVE', value: '< 0.8%' },
      ],
    },
    atlas: {
      num: 'PROJECT 03',
      category: 'Precision Assembly',
      title: 'ATLAS — Precision Assembly Cell',
      subtitle:
        'A robotic assembly cell designed for repeatable high-precision component placement.',
      problem:
        'Manual assembly of precision components resulted in placement variability, operator fatigue, and inconsistent quality across production runs.',
      approach:
        'A robotic assembly cell was engineered with a multi-axis manipulator, precision fixtures, and sensor feedback for real-time position verification and automated quality checking.',
      architecture:
        'The cell integrates a 6-axis robotic arm, custom fixture positioning hardware, force/torque sensing for placement verification, and an automated quality verification station with vision-based confirmation.',
      technologies: [
        '6-Axis Manipulation',
        'Precision Fixtures',
        'Force/Torque Sensing',
        'Position Verification',
        'Automated Quality Check',
        'Sensor Feedback',
      ],
      specs: [
        { label: 'PRECISION', value: '±0.05 mm' },
        { label: 'CYCLE TIME', value: '4.2 s' },
        { label: 'AVAILABILITY', value: '99.5%' },
      ],
    },
  };

  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  let lastFocused = null;

  function openModal(projectKey) {
    const data = projectData[projectKey];
    if (!data) return;

    lastFocused = document.activeElement;

    // Build content with proper heading structure
    modalContent.innerHTML =
      '<span class="modal__eyebrow mono">' + data.num + '</span>' +
      '<h2 class="modal__title" id="modalTitle">' + data.title + '</h2>' +
      '<p class="modal__subtitle">' + data.subtitle + '</p>' +
      '<div class="modal__section">' +
        '<h3 class="modal__section-title">Problem</h3>' +
        '<p class="modal__section-text">' + data.problem + '</p>' +
      '</div>' +
      '<div class="modal__section">' +
        '<h3 class="modal__section-title">Engineering Approach</h3>' +
        '<p class="modal__section-text">' + data.approach + '</p>' +
      '</div>' +
      '<div class="modal__section">' +
        '<h3 class="modal__section-title">System Architecture</h3>' +
        '<p class="modal__section-text">' + data.architecture + '</p>' +
      '</div>' +
      '<div class="modal__section">' +
        '<h3 class="modal__section-title">Key Technologies</h3>' +
        '<ul class="modal__tags">' +
          data.technologies.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
        '</ul>' +
      '</div>' +
      '<div class="modal__specs">' +
        data.specs.map(function (s) {
          return '<div class="modal__spec">' +
            '<span class="modal__spec-label">' + s.label + '</span>' +
            '<span class="modal__spec-value">' + s.value + '</span>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<p class="modal__spec-note">Demo System Specification — Fictional metrics for portfolio demonstration</p>';

    // Set role after content is injected so aria-labelledby resolves
    modal.setAttribute('role', 'dialog');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus the close button for keyboard accessibility
    // Use rAF to ensure DOM is painted before focus
    requestAnimationFrame(function () {
      modalClose.focus();
    });

    // Trap focus within modal
    document.addEventListener('keydown', trapFocus);
  }

  function closeModal() {
    modal.hidden = true;
    modal.removeAttribute('role');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
    if (lastFocused) {
      lastFocused.focus();
    }
  }

  // Focus trap within modal dialog
  function trapFocus(e) {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key !== 'Tab') return;

    const dialog = modal.querySelector('.modal__dialog');
    var focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Open modal from project buttons
  document.querySelectorAll('[data-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.getAttribute('data-modal'));
    });
  });

  modalClose.addEventListener('click', closeModal);
  document.querySelector('[data-modal-close]').addEventListener('click', closeModal);

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('contact-success');
  const resetBtn = document.getElementById('contact-reset');

  function showError(fieldName, message) {
    const errorEl = document.querySelector('[data-error-for="' + fieldName + '"]');
    const input = form.querySelector('[name="' + fieldName + '"]');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('contact-form__error--show');
    }
    if (input) {
      input.classList.add('contact-form__input--error');
      input.setAttribute('aria-invalid', 'true');
    }
  }

  function clearError(fieldName) {
    const errorEl = document.querySelector('[data-error-for="' + fieldName + '"]');
    const input = form.querySelector('[name="' + fieldName + '"]');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('contact-form__error--show');
    }
    if (input) {
      input.classList.remove('contact-form__input--error');
      input.removeAttribute('aria-invalid');
    }
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const projectType = form.querySelector('[name="projectType"]').value;
    const description = form.querySelector('[name="description"]').value.trim();

    let valid = true;
    let firstErrorField = null;

    // Clear previous errors
    ['name', 'email', 'projectType', 'description'].forEach(clearError);

    if (!name) {
      showError('name', 'Please enter your name.');
      valid = false;
      if (!firstErrorField) firstErrorField = form.querySelector('[name="name"]');
    }

    if (!email) {
      showError('email', 'Please enter your email.');
      valid = false;
      if (!firstErrorField) firstErrorField = form.querySelector('[name="email"]');
    } else if (!validateEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
      if (!firstErrorField) firstErrorField = form.querySelector('[name="email"]');
    }

    if (!projectType) {
      showError('projectType', 'Please select a project type.');
      valid = false;
      if (!firstErrorField) firstErrorField = form.querySelector('[name="projectType"]');
    }

    if (!description) {
      showError('description', 'Please describe your project.');
      valid = false;
      if (!firstErrorField) firstErrorField = form.querySelector('[name="description"]');
    }

    if (valid) {
      form.hidden = true;
      successMsg.hidden = false;
    } else if (firstErrorField) {
      firstErrorField.focus();
    }
  });

  // Clear errors on input
  form.querySelectorAll('input, select, textarea').forEach(function (input) {
    input.addEventListener('input', function () {
      clearError(input.getAttribute('name'));
    });
  });

  resetBtn.addEventListener('click', function () {
    form.reset();
    form.hidden = false;
    successMsg.hidden = true;
  });

  /* ---------- BACK TO TOP ---------- */
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
})();
