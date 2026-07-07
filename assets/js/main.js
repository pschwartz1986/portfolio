(function () {
  const loginScreen = document.getElementById('login-screen');
  const portfolioContent = document.getElementById('portfolio-content');
  const keyInput = document.getElementById('key-input');
  const unlockBtn = document.getElementById('unlock-btn');
  const errorMsg = document.getElementById('error-msg');
  const themeToggle = document.getElementById('theme-toggle-bottom');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');

  const THEME_KEY = 'portfolio-theme';
  const SECTIONS = ['anschreiben', 'profil', 'lebenslauf', 'portfolio'];

  const REVEAL_CLASSES = [
    'reveal-section',
    'reveal-fade',
    'reveal-zoom',
    'reveal-left',
    'reveal-right'
  ];

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(saved);
    updateThemeIcon(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-bs-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'bi bi-moon-stars';
    } else {
      icon.className = 'bi bi-sun';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  const VALID_CODES = new Set(['bewerbung2026', '1212']);

  function unlock() {
    const code = keyInput.value.trim();
    if (VALID_CODES.has(code)) {
      loginScreen.style.display = 'none';
      portfolioContent.style.display = 'block';
      portfolioContent.style.opacity = '0';
      portfolioContent.style.transform = 'translateY(15px)';
      portfolioContent.style.transition = 'none';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          portfolioContent.style.transition = 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)';
          portfolioContent.style.opacity = '1';
          portfolioContent.style.transform = 'translateY(0)';
        });
      });
      localStorage.setItem('bewerbung-unlocked', 'true');
    } else {
      errorMsg.textContent = 'Falscher Zugangscode.';
      keyInput.value = '';
      keyInput.focus();
    }
  }

  if (unlockBtn) {
    unlockBtn.addEventListener('click', unlock);
  }

  if (keyInput) {
    keyInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') unlock();
    });
  }

  if (localStorage.getItem('bewerbung-unlocked') === 'true') {
    loginScreen.style.display = 'none';
    portfolioContent.style.display = 'block';
    portfolioContent.style.opacity = '1';
    portfolioContent.style.transform = 'translateY(0)';
  }

  initTheme();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active nav link on scroll
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    SECTIONS.forEach(function (id) {
      const section = document.getElementById(id);
      if (!section) return;
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const link = document.querySelector('a[href="#' + id + '"]');
      if (!link) return;
      if (scrollPos >= top && scrollPos < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Navbar show/hide on scroll
  const navbar = document.getElementById('top-nav');

  function handleNavScroll() {
    if (!navbar) return;
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  if (navbar) {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  // Prev/Next buttons as section scrollers for one-pager
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () {
      const sectionIds = Array.from(document.querySelectorAll('section[id]')).map(function (s) { return s.id; });
      const currentIndex = sectionIds.findIndex(function (id) {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= 200;
      });
      const prevIndex = Math.max(0, currentIndex - 1);
      const prevSection = document.getElementById(sectionIds[prevIndex]);
      if (prevSection) {
        prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    nextBtn.addEventListener('click', function () {
      const sectionIds = Array.from(document.querySelectorAll('section[id]')).map(function (s) { return s.id; });
      const currentIndex = sectionIds.findIndex(function (id) {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top <= 200;
      });
      const nextIndex = Math.min(sectionIds.length - 1, currentIndex + 1);
      const nextSection = document.getElementById(sectionIds[nextIndex]);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Section and element reveal on scroll
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal-section, .reveal-fade, .reveal-zoom, .reveal-left, .reveal-right')
      .forEach(function (el) {
        sectionObserver.observe(el);
      });

    const elementObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          elementObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.motivation-card, .cv-timeline-item, .cv-timeline-item, .feature-card, .tl-item, .tl-card, .project-card').forEach(function (el) {
      elementObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-section, .reveal-fade, .reveal-zoom, .reveal-left, .reveal-right')
      .forEach(function (el) {
        el.classList.add('visible');
      });
    document.querySelectorAll('.motivation-card, .cv-timeline-item, .tl-item, .tl-card, .feature-card, .project-card').forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();