(function () {
  const loginScreen = document.getElementById('login-screen');
  const portfolioContent = document.getElementById('portfolio-content');
  const keyInput = document.getElementById('key-input');
  const unlockBtn = document.getElementById('unlock-btn');
  const errorMsg = document.getElementById('error-msg');
  const themeToggle = document.getElementById('theme-toggle-bottom');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');

  let slideNavigate = null;

  const THEME_KEY = 'portfolio-theme';
  const PAGES = [
    'index.html',
    'kurzprofil.html',
    'anschreiben.html',
    'lebenslauf.html',
    'portfolio.html'
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

  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  if (page !== 'lebenslauf.html' && page !== 'index.html') {
    const container = document.querySelector('.section > .container');
    if (container) {
      container.classList.add('checkpoint-enter');
    }
  }

  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    const idx = PAGES.indexOf(page);
    return idx >= 0 ? idx : 0;
  }

  function goToPage(index) {
    const target = PAGES[index];
    if (!target) return;
    const content = document.getElementById('portfolio-content');
    if (content) {
      content.classList.add('page-leaving');
      setTimeout(function () {
        window.location.href = target;
      }, 460);
    } else {
      window.location.href = target;
    }
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () {
      if (slideNavigate) {
        slideNavigate('prev');
        return;
      }
      const current = getCurrentPage();
      const prev = (current - 1 + PAGES.length) % PAGES.length;
      goToPage(prev);
    });

    nextBtn.addEventListener('click', function () {
      if (slideNavigate) {
        slideNavigate('next');
        return;
      }
      const current = getCurrentPage();
      const next = (current + 1) % PAGES.length;
      goToPage(next);
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.tl-item, .motivation-card').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.tl-item, .motivation-card').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    if (page === 'lebenslauf.html') {
      const slides = document.querySelectorAll('.cv-slide');
      const dots = document.querySelectorAll('.cv-dot');
      let current = 0;
      const total = slides.length;

      function updateSlides(index) {
        slides.forEach((s, i) => {
          s.classList.toggle('active', i === index);
        });
        if (dots.length) {
          dots.forEach((d, i) => {
            d.classList.toggle('active', i === index);
          });
        }
      }

      function getLebenslaufPageIndex() {
        return PAGES.indexOf('lebenslauf.html');
      }

      function navigatePageFromCV(direction) {
        const idx = getLebenslaufPageIndex();
        if (idx < 0) return;
        if (direction === 'prev') {
          goToPage((idx - 1 + PAGES.length) % PAGES.length);
        } else {
          goToPage((idx + 1) % PAGES.length);
        }
      }

      slideNavigate = function (direction) {
        if (direction === 'prev' && current === 0) {
          navigatePageFromCV('prev');
          return;
        }
        if (direction === 'next' && current === total - 1) {
          navigatePageFromCV('next');
          return;
        }
        if (direction === 'prev') {
          current = current - 1;
        } else {
          current = current + 1;
        }
        updateSlides(current);
      };

      dots.forEach((dot, i) => {
        dot.addEventListener('click', function () {
          current = i;
          updateSlides(current);
        });
      });

      updateSlides(0);
    }
  }
})();