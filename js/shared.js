/* ===========================================
   SHARED JAVASCRIPT — Enhanced Animations
   ============================================ */

// --- Loading Screen ---
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingFill = document.getElementById('loading-fill');

  if (loadingFill) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (loadingScreen) loadingScreen.classList.add('hidden');
        }, 400);
      }
      loadingFill.style.width = progress + '%';
    }, 180);
  } else if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 1200);
  }
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.innerHTML = '<div class="scroll-progress-fill"></div>';
  document.body.prepend(bar);
  const fill = bar.querySelector('.scroll-progress-fill');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.width = percent + '%';
  }, { passive: true });
}

// ============================================
// BACK TO TOP
// ============================================
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>';
  document.body.appendChild(btn);

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
    lastScroll = scroll;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
  const header = document.querySelector('.nav-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (currentPage === '' || currentPage === 'index.html') {
      if (href === 'index.html') link.classList.add('active');
    }
  });
}

// ============================================
// MAGNETIC HOVER — subtle pull on elements
// ============================================
function initMagnetic() {
  document.querySelectorAll('.nav-links a, .btn, .social-link, [data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 6;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ============================================
// TILT EFFECT — 3D perspective on cards
// ============================================
function initTilt() {
  document.querySelectorAll('[data-tilt], .featured-card, .property-card, .service-card, .team-card, .amenity-item').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * -8;
      const tiltY = (x - 0.5) * 8;
      el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ============================================
// RIPPLE EFFECT — click ripple on buttons
// ============================================
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

// ============================================
// SCROLL REVEAL — multi-type animations
// ============================================
function initScrollReveal() {
  // Detect if reduced motion is preferred
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-zoom').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a subtle random delay for organic feel (0–80ms)
        const delay = Math.random() * 30;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal-type elements
  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-zoom'
  ).forEach(el => {
    observer.observe(el);
  });

  // AUTO STAGGER CHILDREN — detect .stagger-children parent
  document.querySelectorAll('.stagger-children').forEach(parent => {
    const children = parent.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    children.forEach((child, i) => {
      const baseDelay = 0.08;
      child.style.setProperty('--stagger-delay', `${i * baseDelay}s`);
    });
  });
}

// ============================================
// PARALLAX — smooth scrolling parallax
// ============================================
function initParallax() {
  const elements = document.querySelectorAll('[data-parallax-speed], .parallax');
  if (elements.length === 0) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
            const speed = parseFloat(el.dataset.parallaxSpeed) || 0.2;
            const offset = scrollY * speed;
            el.style.transform = `translateY(${offset * 0.5}px)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ============================================
// IMAGE PARALLAX — subtle movement on hero images
// ============================================
function initImageParallax() {
  const images = document.querySelectorAll('.detail-hero-img, .parallax-img');
  if (images.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.15;
        const offset = (scrollY - img.dataset.parallaxOrigin || 0) * speed;
        img.style.transform = `translateY(${offset}px) scale(1.05)`;
        if (!img.dataset.parallaxOrigin) img.dataset.parallaxOrigin = scrollY;
      }
    });
  }, { passive: true });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounters() {
  const counterElements = document.querySelectorAll('[data-count-to]');
  if (counterElements.length === 0) return;

  const observerOptions = { threshold: 0.4 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.countTo);
        const duration = parseInt(el.dataset.countDuration) || 2000;
        const suffix = el.dataset.countSuffix || '';
        const prefix = el.dataset.countPrefix || '';
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
        }, 16);
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => observer.observe(el));
}

// ============================================
// SMOOTH SCROLL for anchor links with offset
// ============================================
function initSmoothScroll() {
  const headerHeight = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ============================================
// FORM ENHANCEMENTS
// ============================================
function initFormEnhancements() {
  // Floating label effect on focus
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-group')?.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.closest('.form-group')?.classList.remove('focused');
      }
    });
    // Set initial state if has value
    if (input.value) {
      input.closest('.form-group')?.classList.add('focused');
    }
  });
}

// ============================================
// CUSTOM CURSOR — enhanced
// ============================================
function initCustomCursor() {
  const cursor = document.querySelector('.cursor-follower');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements — expanded selector
  document.querySelectorAll(
    'a, button, .card, .featured-card, .property-card, .service-card, .team-card, .gallery-item, .amenity-item, .contact-info-card, [data-cursor-hover]'
  ).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursor.style.opacity = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursor.style.width = '8px';
      cursor.style.height = '8px';
      cursor.style.opacity = '0.6';
    });
  });
}

// ============================================
// GALLERY LIGHTBOX ENHANCEMENTS
// ============================================
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!lightbox) return;

  // Close button
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Open on click
  document.querySelectorAll('.gallery-item img, .gallery-grid img').forEach(img => {
    if (img.closest('.gallery-item') || img.closest('.gallery-grid')) {
      img.addEventListener('click', () => {
        const src = img.src.replace(/w=\d+/, 'w=1200');
        lightboxImg.src = src;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }
  });
}

// ============================================
// PROPERTIES FILTER — with animation
// ============================================
function initPropertyFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const cards = document.querySelectorAll('.property-card');

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          // Force reflow
          void card.offsetWidth;
          card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initBackToTop();
  initNavigation();
  initMagnetic();
  initTilt();
  initRipple();
  initScrollReveal();
  initParallax();
  initImageParallax();
  initCounters();
  initSmoothScroll();
  initFormEnhancements();
  initCustomCursor();
  initGalleryLightbox();
  initPropertyFilter();
});
