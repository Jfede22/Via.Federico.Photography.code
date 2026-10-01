document.addEventListener('DOMContentLoaded', function () {
  const header = document.getElementById('siteHeader');
  const logo = document.getElementById('logoImage');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const burgerTop = document.getElementById('burgerTop');
  const burgerMiddle = document.getElementById('burgerMiddle');
  const burgerBottom = document.getElementById('burgerBottom');
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  const slideDots = document.getElementById('slideDots');
  const slides = Array.from(document.querySelectorAll('.slideshow-slide'));
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
  const tabButtons = Array.from(document.querySelectorAll('[data-tab]'));
  const pricingPanels = Array.from(document.querySelectorAll('.pricing-panel'));
  // Only the home page has a dark full-screen hero behind a transparent header
  const solidHeader = !document.querySelector('.hero-section');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  function updateHeader() {
    const scrolled = solidHeader || window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
    if (logo) {
      logo.style.filter = scrolled ? 'none' : 'brightness(0) invert(1)';
      logo.style.height = scrolled ? '44px' : '52px';
    }
  }

  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  function setActiveNavLink() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.endsWith(page) || (page === '' && href.endsWith('index.html'))) {
        link.classList.add('active');
      }
    });
  }

  if (header) {
    updateHeader();
    window.addEventListener('scroll', () => {
      updateHeader();
      revealOnScroll();
    }, { passive: true });
  }

  if (mobileMenu && menuToggle && burgerTop && burgerMiddle && burgerBottom) {
    function closeMenu() {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      burgerTop.style.transform = 'rotate(0deg) translate(0, 0)';
      burgerMiddle.style.opacity = '1';
      burgerMiddle.style.transform = 'translateX(0)';
      burgerBottom.style.transform = 'rotate(0deg) translate(0, 0)';
    }

    menuToggle.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('open');
      menuToggle.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      burgerTop.style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : 'rotate(0deg) translate(0, 0)';
      burgerMiddle.style.opacity = open ? '0' : '1';
      burgerMiddle.style.transform = open ? 'translateX(-10px)' : 'translateX(0)';
      burgerBottom.style.transform = open ? 'rotate(-45deg) translate(6px, -6px)' : 'rotate(0deg) translate(0, 0)';
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', function (e) {
        closeMenu();
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          setTimeout(() => {
            window.location.href = href;
          }, 200);
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (mobileMenu.classList.contains('open') && !header.contains(e.target)) {
        closeMenu();
      }
    });

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50 && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    }, { passive: true });
  }

  if (slides.length && slideDots) {
    let currentSlide = 0;
    function updateSlide(index) {
      slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === index);
      });
      slideDots.querySelectorAll('button').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === index);
      });
    }

    slides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.className = index === 0 ? 'slide-dot active' : 'slide-dot';
      button.setAttribute('aria-label', `Show slide ${index + 1}`);
      button.addEventListener('click', function () {
        currentSlide = index;
        updateSlide(index);
      });
      slideDots.appendChild(button);
    });

    if (!reduceMotion) {
      setInterval(function () {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide(currentSlide);
      }, 4500);
    }
  }

  const workTrack = document.getElementById('workTrack');
  const workDots = document.getElementById('workDots');
  if (workTrack && workDots) {
    const workSlides = Array.from(workTrack.children);
    const workCarousel = document.getElementById('workCarousel');
    let workIndex = 0;
    let workTimer = null;

    function showWork(index) {
      workIndex = (index + workSlides.length) % workSlides.length;
      workTrack.style.transform = `translateX(-${workIndex * 100}%)`;
      workDots.querySelectorAll('button').forEach((btn, idx) => {
        btn.classList.toggle('active', idx === workIndex);
      });
    }

    function startWork() {
      clearInterval(workTimer);
      if (reduceMotion) return;
      workTimer = setInterval(() => showWork(workIndex + 1), 4000);
    }

    workSlides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.setAttribute('aria-label', `Show photo ${index + 1}`);
      button.className = index === 0 ? 'active' : '';
      button.addEventListener('click', function () {
        showWork(index);
        startWork();
      });
      workDots.appendChild(button);
    });

    let touchStartX = null;
    workCarousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    workCarousel.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        showWork(workIndex + (deltaX < 0 ? 1 : -1));
        startWork();
      }
      touchStartX = null;
    });

    workCarousel.addEventListener('mouseenter', () => clearInterval(workTimer));
    workCarousel.addEventListener('mouseleave', startWork);
    startWork();
  }

  if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', function () {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.getAttribute('data-filter');
        portfolioItems.forEach((item) => {
          const category = item.getAttribute('data-category');
          item.classList.toggle('hidden', filter !== 'All' && category !== filter);
        });
      });
    });
  }

  if (tabButtons.length && pricingPanels.length) {
    tabButtons.forEach((button) => {
      button.addEventListener('click', function () {
        tabButtons.forEach((btn) => btn.classList.remove('active'));
        pricingPanels.forEach((panel) => panel.classList.remove('active'));
        button.classList.add('active');
        const tab = button.getAttribute('data-tab');
        const panel = document.querySelector(`.pricing-panel[data-tab='${tab}']`);
        if (panel) panel.classList.add('active');
      });
    });
  }



  revealOnScroll();
  setActiveNavLink();
});
