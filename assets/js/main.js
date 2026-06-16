/**
 * SlimSync - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRtlToggle();
  initMobileMenu();
  initStickyNav();
  initAnimations();
  initFaqAccordion();
});

/* ==========================================
   FAQ Accordion
   ========================================== */
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('active');
    });
  });
}

/* ==========================================
   Theme Toggle
========================================== */
function initThemeToggle() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('slimsync-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  updateToggleIcons();

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('slimsync-theme', newTheme);
      
      updateToggleIcons();
    });
  });
}

function updateToggleIcons() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.innerHTML = isDark 
      ? '<i class="ph ph-sun"></i>' 
      : '<i class="ph ph-moon"></i>';
  });
}

/* ==========================================
   RTL Toggle
========================================== */
function initRtlToggle() {
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  
  const savedDir = localStorage.getItem('slimsync-dir');
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir');
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('slimsync-dir', newDir);
    });
  });
}

/* ==========================================
   Mobile Menu (Drawer)
========================================== */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.nav-drawer');
  const closeBtn = document.querySelector('.drawer-close');
  const backdrop = document.querySelector('.backdrop');

  if (!hamburger || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openDrawer);
  if(closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if(backdrop) backdrop.addEventListener('click', closeDrawer);
}

/* ==========================================
   Sticky Nav
========================================== */
function initStickyNav() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================
   Scroll Animations (Intersection Observer)
========================================== */
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-fade-up').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}
