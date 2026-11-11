/* ========================================
   AI in Genomics Workshop — Interactive JS
   ======================================== */

// ========================================
// Theme Management
// ========================================
const ThemeManager = {
  init() {
    this.theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.apply(this.theme);
    this.bindEvents();
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.theme = theme;
  },

  toggle() {
    this.apply(this.theme === 'dark' ? 'light' : 'dark');
  },

  bindEvents() {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
};

// ========================================
// Mobile Navigation
// ========================================
const MobileNav = {
  init() {
    this.nav = document.querySelector('.mobile-nav');
    this.overlay = document.querySelector('.mobile-nav-overlay');
    this.btn = document.querySelector('.mobile-menu-btn');
    this.bindEvents();
  },

  open() {
    this.nav.classList.add('open');
    this.overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.nav.classList.remove('open');
    this.overlay.classList.remove('visible');
    document.body.style.overflow = '';
  },

  toggle() {
    this.nav.classList.contains('open') ? this.close() : this.open();
  },

  bindEvents() {
    if (this.btn) this.btn.addEventListener('click', () => this.toggle());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => this.close());
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }
};

// ========================================
// Scroll Reveal (IntersectionObserver)
// ========================================
const ScrollReveal = {
  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal, .reveal-stagger > *').forEach(el => el.style.opacity = '1');
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => this.observer.observe(el));
  }
};

// ========================================
// Header Scroll Effect
// ========================================
const HeaderScroll = {
  init() {
    this.header = document.querySelector('.site-header');
    this.lastScroll = 0;
    this.bindEvents();
  },

  bindEvents() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  },

  onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 20) this.header.classList.add('scrolled');
    else this.header.classList.remove('scrolled');
    this.lastScroll = scrollY;
  }
};

// ========================================
// Progress Indicator (Active Step)
// ========================================
const ProgressIndicator = {
  init() {
    this.steps = document.querySelectorAll('.progress-step');
    this.connectors = document.querySelectorAll('.progress-connector');
    this.update();
  },

  update() {
    const path = window.location.pathname;
    let currentIndex = 0;

    if (path.includes('quick-start')) currentIndex = 0;
    else if (path.includes('index')) currentIndex = 1;
    else if (path.includes('ml-fundamentals')) currentIndex = 2;
    else if (path.includes('applications')) currentIndex = 3;

    this.steps.forEach((step, i) => {
      step.classList.remove('active', 'completed');
      if (i < currentIndex) step.classList.add('completed');
      else if (i === currentIndex) step.classList.add('active');
    });

    this.connectors.forEach((conn, i) => {
      conn.classList.toggle('completed', i < currentIndex);
    });
  }
};

// ========================================
// Tabs
// ========================================
const Tabs = {
  init() {
    document.querySelectorAll('.tab-list').forEach(list => {
      list.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;

        const panelId = btn.dataset.tab;
        const container = btn.closest('.tabs');

        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = container.querySelector(`#${panelId}`);
        if (panel) panel.classList.add('active');
      });
    });
  }
};

// ========================================
// Accordions
// ========================================
const Accordions = {
  init() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        const isOpen = item.classList.contains('open');

        // Close all in same accordion
        item.closest('.accordion').querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));

        if (!isOpen) item.classList.add('open');
      });
    });
  }
};

// ========================================
// Copy Code Button
// ========================================
const CopyCode = {
  init() {
    document.querySelectorAll('.code-block').forEach(block => {
      const btn = block.querySelector('.copy-btn');
      if (!btn) return;

      btn.addEventListener('click', async () => {
        const code = block.querySelector('code').textContent;
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        } catch (err) {
          btn.textContent = 'Failed';
          setTimeout(() => btn.textContent = 'Copy', 2000);
        }
      });
    });
  }
};

// ========================================
// Socratic Questions (Interactive)
// ========================================
const SocraticQuestions = {
  init() {
    document.querySelectorAll('.socratic-question').forEach(card => {
      const toggle = card.querySelector('.socratic-toggle');
      const answer = card.querySelector('.socratic-answer');

      if (toggle && answer) {
        toggle.addEventListener('click', () => {
          const isVisible = answer.classList.toggle('visible');
          toggle.textContent = isVisible ? 'Hide Answer' : 'Show Answer';
          toggle.setAttribute('aria-expanded', isVisible);
        });
      }
    });
  }
};

// ========================================
// Flashcards (3D Flip)
// ========================================
const Flashcards = {
  init() {
    document.querySelectorAll('.flashcard').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Flip flashcard');
    });
  }
};

// ========================================
// Diagram Tabs
// ========================================
const DiagramTabs = {
  init() {
    document.querySelectorAll('.diagram-tabs').forEach(tabs => {
      tabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.diagram-tab');
        if (!btn) return;

        const panelId = btn.dataset.panel;
        const container = btn.closest('.diagram-container');

        container.querySelectorAll('.diagram-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        container.querySelectorAll('.diagram-panel').forEach(p => p.classList.remove('active'));
        const panel = container.querySelector(`#${panelId}`);
        if (panel) panel.classList.add('active');
      });
    });
  }
};

// ========================================
// Pipeline Steps (Hover Animation)
// ========================================
const Pipeline = {
  init() {
    // Stagger reveal for pipeline steps
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.style.opacity = '1', i * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.pipeline-step').forEach((step, i) => {
      step.style.opacity = '0';
      step.style.transform = 'translateX(-20px)';
      step.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(step);
    });
  }
};

// ========================================
// Stats Counter Animation
// ========================================
const StatsCounter = {
  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateValue(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-value[data-target]').forEach(el => observer.observe(el));
  },

  animateValue(el) {
    const target = parseFloat(el.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.round(target * eased);

      if (el.dataset.target.includes('.')) {
        el.textContent = (target * eased).toFixed(1);
      } else if (el.dataset.target.includes('k') || el.dataset.target.includes('M') || el.dataset.target.includes('B')) {
        // Handle suffixes
        const suffix = el.dataset.target.replace(/[\d.]/g, '');
        const num = parseFloat(el.dataset.target);
        el.textContent = Math.round(num * eased).toLocaleString() + suffix;
      } else {
        el.textContent = current.toLocaleString();
      }

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
};

// ========================================
// Keyboard Navigation Enhancement
// ========================================
const KeyboardNav = {
  init() {
    document.addEventListener('keydown', (e) => {
      // Arrow keys for tabs
      if (e.target.classList.contains('tab-btn')) {
        const tabs = Array.from(e.target.closest('.tab-list').querySelectorAll('.tab-btn'));
        const idx = tabs.indexOf(e.target);
        let newIdx = idx;

        if (e.key === 'ArrowRight') newIdx = (idx + 1) % tabs.length;
        if (e.key === 'ArrowLeft') newIdx = (idx - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') newIdx = 0;
        if (e.key === 'End') newIdx = tabs.length - 1;

        if (newIdx !== idx) {
          e.preventDefault();
          tabs[newIdx].focus();
          tabs[newIdx].click();
        }
      }

      // Space/Enter for accordion headers
      if (e.target.classList.contains('accordion-header') && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        e.target.click();
      }
    });
  }
};

// ========================================
// Particle Background (Optional Enhancement)
// ========================================
const ParticleBackground = {
  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return; // Skip on mobile for performance

    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-3;opacity:0.3;';
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createParticles() {
    const count = Math.min(60, Math.floor(window.innerWidth * window.innerHeight / 15000));
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        color: ['#22d3ee', '#a855f7', '#f472b6'][Math.floor(Math.random() * 3)]
      });
    }
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(34,211,238,${0.15 * (1 - dist / 120)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    // Draw particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
};

// ========================================
// Initialize All
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  MobileNav.init();
  ScrollReveal.init();
  HeaderScroll.init();
  ProgressIndicator.init();
  Tabs.init();
  Accordions.init();
  CopyCode.init();
  SocraticQuestions.init();
  Flashcards.init();
  DiagramTabs.init();
  Pipeline.init();
  StatsCounter.init();
  KeyboardNav.init();
  ParticleBackground.init();

  // Add reveal classes to existing cards
  document.querySelectorAll('.card').forEach((card, i) => {
    card.classList.add('reveal');
    card.style.transitionDelay = `${i * 0.05}s`;
  });

  document.querySelectorAll('.stat-card').forEach(card => card.classList.add('reveal'));
  document.querySelectorAll('.pipeline-step').forEach(step => step.classList.add('reveal'));
  document.querySelectorAll('.flashcard').forEach(card => card.classList.add('reveal'));
  document.querySelectorAll('.socratic-question').forEach(card => card.classList.add('reveal'));

  console.log('🧬 AI in Genomics Workshop — Interactive mode active');
});

// ========================================
// Export for debugging
// ========================================
window.WorkshopApp = {
  ThemeManager,
  MobileNav,
  ScrollReveal,
  HeaderScroll,
  ProgressIndicator,
  Tabs,
  Accordions,
  CopyCode,
  SocraticQuestions,
  Flashcards,
  DiagramTabs,
  Pipeline,
  StatsCounter,
  KeyboardNav,
  ParticleBackground
};