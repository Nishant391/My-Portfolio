/**
 * Amber Gold Executive / Luxury Dark Tech Portfolio
 * Brand: Nishant | Full Stack Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initNavigation();
  initDashboardInteractions();
  initModals();
  initContactForm();
  initHeadingScrollAnimations();
  initButtonClickEffects();
});

/* ==========================================================================
   1. INTERACTIVE CANVAS BACKGROUND: AMBER GOLD PARTICLE WAVE / SINE MESH
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = {
    x: width * 0.5,
    y: height * 0.5,
    targetX: width * 0.5,
    targetY: height * 0.35,
    radius: 150
  };

  let scrollY = window.scrollY;
  let time = 0;

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track mouse coordinates with damping
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  // Track scroll position
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  // Grid points for sine wave mesh
  const rows = 26;
  const cols = 42;

  function render() {
    time += 0.016;

    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // Dynamic wave parameters influenced by scroll & mouse
    const scrollFactor = scrollY * 0.001;
    const spacingX = width / (cols - 1);
    const spacingY = height / (rows - 1);

    // Compute point coordinates
    const points = [];
    for (let r = 0; r < rows; r++) {
      points[r] = [];
      const baseY = r * spacingY;
      for (let c = 0; c < cols; c++) {
        const baseX = c * spacingX;

        // Wave elevation formula
        const angle1 = (c * 0.22) + time * 0.9 + scrollFactor;
        const angle2 = (r * 0.26) + time * 0.7;
        const wave = Math.sin(angle1) * 16 + Math.cos(angle2) * 12;

        // Mouse proximity repulsion/attraction ripple
        const dx = baseX - mouse.x;
        const dy = baseY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let mouseInfluence = 0;

        if (dist < mouse.radius) {
          const power = (1 - dist / mouse.radius);
          mouseInfluence = Math.sin(power * Math.PI) * 26;
        }

        const px = baseX;
        const py = baseY + wave + mouseInfluence;

        points[r][c] = { x: px, y: py, dist: dist };
      }
    }

    // Draw mesh connection lines with gold luminescence
    ctx.lineWidth = 0.8;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pt = points[r][c];

        // Horizontal links
        if (c < cols - 1) {
          const nextPt = points[r][c + 1];
          const distToMouse = Math.min(pt.dist, nextPt.dist);
          const alpha = distToMouse < mouse.radius
            ? 0.28
            : 0.08 + Math.sin((r + c) * 0.1 + time) * 0.03;

          ctx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0.04, alpha)})`;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(nextPt.x, nextPt.y);
          ctx.stroke();
        }

        // Vertical links
        if (r < rows - 1) {
          const downPt = points[r + 1][c];
          const distToMouse = Math.min(pt.dist, downPt.dist);
          const alpha = distToMouse < mouse.radius
            ? 0.22
            : 0.06;

          ctx.strokeStyle = `rgba(217, 119, 6, ${Math.max(0.02, alpha)})`;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(downPt.x, downPt.y);
          ctx.stroke();
        }

        // Glowing nodes at intersections
        if (r % 2 === 0 && c % 2 === 0) {
          const isNearMouse = pt.dist < mouse.radius;
          const nodeRadius = isNearMouse ? 2.5 : 1.2;
          const nodeAlpha = isNearMouse ? 0.8 : 0.35;

          ctx.fillStyle = isNearMouse ? '#fcd34d' : 'rgba(245, 158, 11, 0.4)';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
          ctx.fill();

          if (isNearMouse) {
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 8;
          } else {
            ctx.shadowBlur = 0;
          }
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   2. NAVIGATION & SMOOTH SCROLL OBSERVER
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar-wrapper');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll styling for navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section spy
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   3. FEATURED PROJECT DASHBOARD INTERACTIVITY (TILT & CHART SIMULATION)
   ========================================================================== */
function initDashboardInteractions() {
  const mockupWrapper = document.getElementById('dashboardMockup');
  const dashboardWindow = mockupWrapper?.querySelector('.dashboard-window');

  // 3D Tilt Effect on mousemove over dashboard
  if (mockupWrapper && dashboardWindow) {
    mockupWrapper.addEventListener('mousemove', (e) => {
      const rect = mockupWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = (y / (rect.height / 2)) * -6; // max 6 deg
      const rotY = (x / (rect.width / 2)) * 6;

      dashboardWindow.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    mockupWrapper.addEventListener('mouseleave', () => {
      dashboardWindow.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // Interactive time-range pills (Daily, Weekly, Monthly)
  const chartPills = document.querySelectorAll('.chart-pills span');
  const chartLine = document.querySelector('.chart-line');
  const chartPoints = document.querySelectorAll('.chart-point');
  const membersMetric = document.querySelector('[data-metric="members"] .metric-value');
  const checkinsMetric = document.querySelector('[data-metric="checkins"] .metric-value');

  const chartData = {
    daily: {
      lineD: 'M 0,140 Q 60,110 120,125 T 240,65 T 360,45 T 500,20',
      members: '1,420',
      checkins: '584',
      coords: [[120, 125], [240, 65], [360, 45], [500, 20]]
    },
    weekly: {
      lineD: 'M 0,130 Q 70,80 140,95 T 260,50 T 380,30 T 500,15',
      members: '1,438',
      checkins: '3,890',
      coords: [[140, 95], [260, 50], [380, 30], [500, 15]]
    },
    monthly: {
      lineD: 'M 0,145 Q 50,130 110,110 T 230,75 T 350,40 T 500,10',
      members: '1,510',
      checkins: '16,420',
      coords: [[110, 110], [230, 75], [350, 40], [500, 10]]
    }
  };

  chartPills.forEach(pill => {
    pill.addEventListener('click', () => {
      chartPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const mode = pill.textContent.trim().toLowerCase();
      const dataset = chartData[mode] || chartData.daily;

      // Animate line & metrics
      if (chartLine) {
        chartLine.setAttribute('d', dataset.lineD);
      }
      if (membersMetric) membersMetric.textContent = dataset.members;
      if (checkinsMetric) checkinsMetric.textContent = dataset.checkins;

      // Update node positions
      chartPoints.forEach((pt, index) => {
        if (dataset.coords[index]) {
          pt.setAttribute('cx', dataset.coords[index][0]);
          pt.setAttribute('cy', dataset.coords[index][1]);
        }
      });
    });
  });

  // Interactive sidebar nav items in dashboard mockup
  const dashNavItems = document.querySelectorAll('.dash-nav-item');
  dashNavItems.forEach(item => {
    item.addEventListener('click', () => {
      dashNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Interactive metric cards ripple
  const metricCards = document.querySelectorAll('.dash-metric-card');
  metricCards.forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(0.97)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });
}

/* ==========================================================================
   4. MODALS (RESUME & PROJECT DETAILS)
   ========================================================================== */
function initModals() {
  const resumeModal = document.getElementById('resumeModal');
  const projectModal = document.getElementById('projectModal');

  const openResumeBtn = document.getElementById('openResumeBtn');
  const closeResumeBtn = document.getElementById('closeResumeBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');

  const viewFeaturedProjectBtn = document.getElementById('view-featured-project');
  const closeProjectBtn = document.getElementById('closeProjectBtn');
  const modalDismissProjectBtn = document.getElementById('modalDismissProjectBtn');

  // Resume Modal toggles
  const openResume = (e) => {
    if (e) e.preventDefault();
    resumeModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeResume = () => {
    resumeModal?.classList.remove('active');
    document.body.style.overflow = '';
  };

  openResumeBtn?.addEventListener('click', openResume);
  closeResumeBtn?.addEventListener('click', closeResume);
  modalDismissBtn?.addEventListener('click', closeResume);

  // Project Modal toggles
  const openProject = (e) => {
    if (e) e.preventDefault();
    projectModal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    projectModal?.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Open modal on clicking any project title or view button targeted to #projectModal
  const modalTriggers = document.querySelectorAll('[data-modal-target="#projectModal"]');
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openProject(e);
    });
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProject(e);
      }
    });
  });

  closeProjectBtn?.addEventListener('click', closeProject);
  modalDismissProjectBtn?.addEventListener('click', closeProject);

  // Copy Project Link
  const copyProjectLinkBtn = document.getElementById('copyProjectLinkBtn');
  const copyBtnStatus = document.getElementById('copyBtnStatus');
  const projectUrl = 'https://gymnishant.vercel.app/';

  copyProjectLinkBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(projectUrl).then(() => {
        if (copyBtnStatus) {
          const originalText = copyBtnStatus.textContent;
          copyBtnStatus.textContent = '✓ Link Copied to Clipboard!';
          copyBtnStatus.style.color = '#10b981';
          setTimeout(() => {
            copyBtnStatus.textContent = originalText;
            copyBtnStatus.style.color = '';
          }, 2500);
        }
      }).catch(() => {
        prompt('Copy project URL:', projectUrl);
      });
    } else {
      prompt('Copy project URL:', projectUrl);
    }
  });

  // Click outside to close
  [resumeModal, projectModal].forEach(modal => {
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resumeModal?.classList.remove('active');
      projectModal?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   5. CONTACT FORM INTERACTION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitContactBtn');
  const feedback = document.getElementById('formFeedback');

  if (!form || !submitBtn || !feedback) return;

  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const messageInput = document.getElementById('senderMessage');

  const popupName = document.getElementById('popupName');
  const popupEmail = document.getElementById('popupEmail');
  const popupMessage = document.getElementById('popupMessage');

  // Trigger individual bounce pop-up animation on an input
  const triggerFieldPop = (inputEl) => {
    inputEl.classList.remove('is-popping');
    void inputEl.offsetWidth; // Force CSS reflow to re-trigger keyframe
    inputEl.classList.add('is-popping');
  };

  // 1. Name Input: Pop-up animation whenever details are filled
  nameInput?.addEventListener('input', () => {
    const val = nameInput.value.trim();
    const parentGroup = nameInput.closest('.form-group');
    triggerFieldPop(nameInput);

    if (val.length > 0) {
      parentGroup?.classList.add('field-filled');
      if (popupName) {
        popupName.innerHTML = `<span class="popup-check">&check;</span> <span class="popup-text">Name Added</span>`;
        popupName.classList.remove('popup-amber');
        popupName.classList.add('popup-visible');
      }
    } else {
      parentGroup?.classList.remove('field-filled');
      popupName?.classList.remove('popup-visible');
    }
  });

  // 2. Email Input: Pop-up animation with live format validation
  emailInput?.addEventListener('input', () => {
    const val = emailInput.value.trim();
    const parentGroup = emailInput.closest('.form-group');
    triggerFieldPop(emailInput);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.length > 0) {
      if (emailRegex.test(val)) {
        parentGroup?.classList.add('field-filled');
        if (popupEmail) {
          popupEmail.innerHTML = `<span class="popup-check">&check;</span> <span class="popup-text">Valid Email</span>`;
          popupEmail.classList.remove('popup-amber');
          popupEmail.classList.add('popup-visible');
        }
      } else {
        parentGroup?.classList.remove('field-filled');
        if (popupEmail) {
          popupEmail.innerHTML = `<span class="popup-check">&bull;</span> <span class="popup-text">Typing Email...</span>`;
          popupEmail.classList.add('popup-amber', 'popup-visible');
        }
      }
    } else {
      parentGroup?.classList.remove('field-filled');
      popupEmail?.classList.remove('popup-visible');
    }
  });

  // 3. Message Input: Pop-up animation on overview details
  messageInput?.addEventListener('input', () => {
    const val = messageInput.value.trim();
    const parentGroup = messageInput.closest('.form-group');
    triggerFieldPop(messageInput);

    if (val.length > 0) {
      parentGroup?.classList.add('field-filled');
      if (popupMessage) {
        popupMessage.innerHTML = `<span class="popup-check">&check;</span> <span class="popup-text">${val.length > 15 ? 'Details Ready' : 'Details Added'}</span>`;
        popupMessage.classList.add('popup-visible');
      }
    } else {
      parentGroup?.classList.remove('field-filled');
      popupMessage?.classList.remove('popup-visible');
    }
  });

  // Reset popups on form clear
  const resetFieldPopups = () => {
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('field-filled'));
    [popupName, popupEmail, popupMessage].forEach(p => p?.classList.remove('popup-visible', 'popup-amber'));
  };

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = nameInput?.value.trim();
    const email = emailInput?.value.trim();
    const message = messageInput?.value.trim();

    if (!name || !email || !message) {
      feedback.className = 'form-feedback error';
      feedback.style.color = '#f59e0b';
      feedback.textContent = 'Please fill out all fields before sending.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.className = 'form-feedback error';
      feedback.style.color = '#f59e0b';
      feedback.textContent = 'Please enter a valid email address.';
      return;
    }

    // Loading State
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg class="spin-amber" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#08090c"></path>
      </svg>
      <span>Transmitting...</span>
    `;
    submitBtn.style.pointerEvents = 'none';
    feedback.textContent = '';
    feedback.style.color = '';

    // If page is viewed directly as a local file (file:///), AJAX is blocked by FormSubmit
    if (window.location.protocol === 'file:') {
      feedback.className = 'form-feedback';
      feedback.style.color = '#f59e0b';
      feedback.textContent = 'Redirecting to secure submission...';
      form.submit();
      return;
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/nishantbisht709@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true)) {
        feedback.className = 'form-feedback success';
        feedback.textContent = 'Thank you! Your message has been sent directly to my inbox.';
        form.reset();
        resetFieldPopups();
      } else {
        const errorMsg = data.message || 'Submission error';
        if (errorMsg.toLowerCase().includes('activation') || errorMsg.toLowerCase().includes('activate')) {
          feedback.className = 'form-feedback error';
          feedback.textContent = 'Action Required: Check nishantbisht709@gmail.com (and Spam folder) to click "Activate Form" once.';
        } else {
          feedback.className = 'form-feedback error';
          feedback.textContent = errorMsg;
        }
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Could not transmit message. Please send an email directly to nishantbisht709@gmail.com.';
    } finally {
      submitBtn.innerHTML = originalContent;
      submitBtn.style.pointerEvents = '';
      setTimeout(() => {
        feedback.textContent = '';
      }, 9000);
    }
  });
}

/* ==========================================================================
   6. SCROLL REVEAL ANIMATIONS ON HEADINGS (EVERY SECTION / NEXT PAGE)
   ========================================================================== */
function initHeadingScrollAnimations() {
  const headingElements = document.querySelectorAll(
    '.hero-title, .section-header, .contact-title, .contact-info .section-badge'
  );

  if (!('IntersectionObserver' in window)) {
    headingElements.forEach(el => el.classList.add('heading-revealed'));
    return;
  }

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('heading-revealed');
      } else {
        // Re-triggers each time user scrolls to section
        entry.target.classList.remove('heading-revealed');
      }
    });
  }, observerOptions);

  headingElements.forEach(el => {
    el.classList.add('heading-anim-target');
    observer.observe(el);
  });
}

/* ==========================================================================
   7. INTERACTIVE BUTTON CLICK EFFECTS (TACTILE PRESS & RIPPLE WAVE)
   ========================================================================== */
function initButtonClickEffects() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest(
      '.btn, .btn-resume-pill, .btn-item-view, .option-action-btn, .modal-close, .back-to-top, .social-link, button'
    );
    if (!btn) return;

    // 1. Tactile Pop Animation
    btn.classList.remove('btn-clicked-pop');
    void btn.offsetWidth; // Force reflow
    btn.classList.add('btn-clicked-pop');
    setTimeout(() => {
      btn.classList.remove('btn-clicked-pop');
    }, 380);

    // 2. Radiant Cursor-Centered Ripple
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.className = 'btn-click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}
