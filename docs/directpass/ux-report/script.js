/* ============================================================
   PROGRESS BAR
   ============================================================ */
const progressBar = document.getElementById('progressBar');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}

/* ============================================================
   STICKY NAV
   ============================================================ */
const stickyNav = document.getElementById('stickyNav');
const navInner = stickyNav.querySelector('.nav-inner');
const navToggle = document.getElementById('navToggle');

function updateNav() {
  if (window.scrollY > window.innerHeight * 0.5) {
    stickyNav.classList.add('visible');
  } else {
    stickyNav.classList.remove('visible');
  }
}

navToggle.addEventListener('click', () => {
  navInner.classList.toggle('nav-open');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navInner.classList.remove('nav-open');
  });
});

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
const scrollTopBtn = document.getElementById('scrollTop');

function updateScrollTop() {
  if (window.scrollY > 600) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children reveals
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 60 * (Array.from(revealElements).indexOf(entry.target) % 4));
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ============================================================
   TABS
   ============================================================ */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) {
      panel.classList.add('active');

      // Re-trigger reveals inside newly shown panel
      panel.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 100);
      });
    }
  });
});

/* ============================================================
   SCROLL EVENTS
   ============================================================ */
window.addEventListener('scroll', () => {
  updateProgress();
  updateNav();
  updateScrollTop();
}, { passive: true });

/* ============================================================
   SMOOTH ANCHOR SCROLL (offset for sticky nav)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 64;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxCap   = document.getElementById('lightboxCaption');
const lightboxUrl   = document.getElementById('lightboxUrl');
const lightboxCtx   = document.getElementById('lightboxContext');
const lightboxCtr   = document.getElementById('lightboxCounter');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');

let allFigures = [];
let currentIndex = 0;

function buildFigureList() {
  allFigures = Array.from(document.querySelectorAll('.screenshot-scroll figure'));
  // Inject a small URL chip below each figcaption for figures that have data-url
  allFigures.forEach(fig => {
    const url = fig.dataset.url;
    if (url && !fig.querySelector('.fig-url')) {
      const chip = document.createElement('a');
      chip.className = 'fig-url';
      chip.href = url;
      chip.target = '_blank';
      chip.rel = 'noopener';
      chip.textContent = url.replace(/^https?:\/\//, '');
      chip.addEventListener('click', e => e.stopPropagation()); // don't open lightbox
      fig.appendChild(chip);
    }
  });
}

function openLightbox(index) {
  currentIndex = index;
  const fig = allFigures[currentIndex];
  const img = fig.querySelector('img');
  const cap = fig.querySelector('figcaption');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt || '';
  lightboxCap.textContent = cap ? cap.textContent : '';
  const url = fig.dataset.url || '';
  if (url) {
    lightboxUrl.href = url;
    lightboxUrl.textContent = url.replace(/^https?:\/\//, '');
    lightboxUrl.style.display = '';
  } else {
    lightboxUrl.style.display = 'none';
  }
  lightboxCtx.textContent = fig.dataset.context || '';
  lightboxCtr.textContent = `${currentIndex + 1} / ${allFigures.length}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + allFigures.length) % allFigures.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % allFigures.length;
  openLightbox(currentIndex);
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showPrev();
  if (e.key === 'ArrowRight') showNext();
});

/* ============================================================
   FINDINGS ACCORDION
   ============================================================ */
document.querySelectorAll('.finding-header').forEach(header => {
  header.addEventListener('click', () => {
    const card = header.closest('.finding-card');
    const isOpen = card.classList.contains('open');
    document.querySelectorAll('.finding-card').forEach(c => c.classList.remove('open'));
    if (!isOpen) card.classList.add('open');
  });
});

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Embedded views use a query parameter instead of a URL fragment. A fragment
  // can make the parent case-study panel jump when this iframe is mounted.
  // Setting the iframe document's own scrollTop keeps the parent page still.
  if (new URLSearchParams(window.location.search).get('embed') === 'summary') {
    const summary = document.getElementById('executive-summary');
    if (summary) {
      const summaryTop = summary.offsetTop;
      requestAnimationFrame(() => {
        const scrollRoot = document.scrollingElement || document.documentElement;
        scrollRoot.scrollTop = summaryTop;
      });
    }
  }

  updateProgress();
  updateNav();
  updateScrollTop();

  // Lightbox — build figure list and wire clicks
  buildFigureList();
  allFigures.forEach((fig, i) => {
    fig.addEventListener('click', () => openLightbox(i));
  });

  // Open first finding by default
  const firstFinding = document.querySelector('.finding-card');
  if (firstFinding) firstFinding.classList.add('open');
});
