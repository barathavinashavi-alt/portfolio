    // loading screen
  const siteLoader = document.getElementById('siteLoader');
  if (siteLoader) {
    document.body.classList.add('loading');
    let loaderHidden = false;
    const hideLoader = () => {
      if (loaderHidden) return;
      loaderHidden = true;
      siteLoader.classList.add('loaded');
      document.body.classList.remove('loading');
    };
    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 700);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 700));
    }
    // hard fallback — never let the loader block the page if 'load' is
    // slow or never fires (e.g. a stalled font/image request)
    setTimeout(hideLoader, 2500);
  }

  // tap glow — every tap/click anywhere on the site sparks a brief red flash
  document.addEventListener('pointerdown', (e) => {
    const glow = document.createElement('div');
    glow.className = 'tap-glow';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    document.body.appendChild(glow);
    setTimeout(() => glow.remove(), 550);
  }, {passive:true});

  // nav scroll state
  const siteNav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    siteNav.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    document.getElementById('traceFill').style.height = pct + '%';
  }, {passive:true});

  // mobile menu
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const closeMobileMenu = () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  };
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

  // cursor glow (desktop only)
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }

  // technology cloud — staggered reveal delay
  document.querySelectorAll('.tech-cloud .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 30, 480)}ms`;
  });

  // scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(el => io.observe(el));

  // technology chips — tap (or click) to reveal "used in".
  // Attached unconditionally: relying on matchMedia('hover:hover') to decide
  // whether to wire this up is unreliable across devices/browsers, so every
  // chip gets an explicit tap handler regardless of pointer type. Desktop
  // keeps its separate CSS :hover reveal untouched alongside this.
  const chipWraps = document.querySelectorAll('.tech-chip-wrap');
  const techCloud = document.querySelector('.tech-cloud');
  chipWraps.forEach(wrap => {
    const btn = wrap.querySelector('.tech-chip');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !wrap.classList.contains('open');
      chipWraps.forEach(w => w.classList.remove('open'));
      wrap.classList.toggle('open', willOpen);
    });
  });
  // tapping outside the tech cloud closes whichever chip is active
  document.addEventListener('click', (e) => {
    if (techCloud && !techCloud.contains(e.target)) {
      chipWraps.forEach(w => w.classList.remove('open'));
    }
  });

  // MediSync "View Project" — jump to the MediSync card in Connect With Me and flash it
  const viewMedisyncBtn = document.getElementById('viewMedisyncBtn');
  const medisyncChip = document.getElementById('medisyncChip');
  if (viewMedisyncBtn && medisyncChip) {
    viewMedisyncBtn.addEventListener('click', () => {
      setTimeout(() => {
        medisyncChip.classList.add('chip-highlight');
        setTimeout(() => medisyncChip.classList.remove('chip-highlight'), 1600);
      }, 650);
    });
  }

  // counters
  const counters = document.querySelectorAll('.count');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const decimals = parseInt(el.dataset.decimals || '0');
        const dur = 1400;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now-start)/dur, 1);
          const eased = 1 - Math.pow(1-p, 3);
          el.textContent = (target*eased).toFixed(decimals);
          if(p<1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      }
    });
  }, {threshold:0.5});
  counters.forEach(el => cio.observe(el));

  // project card tilt (desktop only — a bonus 3D effect, not essential)
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left)/r.width - 0.5;
        const y = (e.clientY - r.top)/r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x*4}deg) rotateX(${-y*4}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // project cards — tap to trigger the same red highlight hover gives,
  // attached unconditionally so it works regardless of pointer type
  const projCards = document.querySelectorAll('.proj-card');
  projCards.forEach(card => {
    card.addEventListener('click', () => {
      const willTouch = !card.classList.contains('touched');
      projCards.forEach(c => c.classList.remove('touched'));
      card.classList.toggle('touched', willTouch);
    });
  });
  document.addEventListener('click', (e) => {
    if (![...projCards].some(c => c.contains(e.target))) {
      projCards.forEach(c => c.classList.remove('touched'));
    }
  });

  // interactive business card — tap (or click) to flip.
  // Attached unconditionally for the same reason as the tech chips above —
  // desktop still gets its separate CSS :hover flip alongside this.
  const bizCard = document.getElementById('bizCard');
  if (bizCard) {
    const toggleFlip = () => bizCard.classList.toggle('flipped');
    bizCard.addEventListener('click', toggleFlip);
    bizCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFlip();
      }
    });
  }

  // design process tabs — Moodboard / Mindmap
  const designContent = {
    moodboard: {
      image: 'images/moodboard-preview.jpg',
      pdf: 'assets/moodboard.pdf',
      alt: 'Moodboard preview'
    },
    mindmap: {
      image: 'images/mindmap-preview.jpg',
      pdf: 'assets/mindmap.pdf',
      alt: 'Mindmap preview'
    }
  };

  const dpTabs = document.querySelectorAll('.dp-tab');
  const dpImage = document.getElementById('dpImage');
  const dpView = document.getElementById('dpView');
  const dpDownload = document.getElementById('dpDownload');

  if (dpTabs.length && dpImage) {
    dpTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.classList.contains('active')) return;

        dpTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const data = designContent[tab.dataset.target];
        if (!data) return;

        dpImage.classList.add('fade');
        setTimeout(() => {
          dpImage.src = data.image;
          dpImage.alt = data.alt;
          if (dpDownload) dpDownload.href = data.pdf;
          dpImage.classList.remove('fade');
        }, 220);
      });
    });
  }

  // design process lightbox — fullscreen preview for Moodboard / Mindmap
  const lightbox = document.getElementById('designLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxDownload = document.getElementById('lightboxDownload');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBack = document.getElementById('lightboxBack');

  const openLightbox = (imgSrc, imgAlt, pdfHref) => {
    if (!lightbox) return;
    lightboxImage.src = imgSrc;
    lightboxImage.alt = imgAlt;
    if (lightboxDownload) lightboxDownload.href = pdfHref;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  };

  if (dpView && dpImage) {
    dpView.addEventListener('click', () => {
      openLightbox(dpImage.src, dpImage.alt, dpDownload ? dpDownload.href : '#');
    });
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBack) lightboxBack.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeLightbox));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) closeLightbox();
  });
