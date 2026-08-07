import { navIndex, type PaletteItem } from '@/data/nav-index';

const docState = {
  keydownBound: false,
  scrollBound: false,
};

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initChrome() {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const year = document.querySelector('[data-year]');

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  if (!docState.scrollBound) {
    docState.scrollBound = true;
    const onScroll = () => {
      const h = document.querySelector('[data-header]');
      if (!h) return;
      h.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  } else {
    document
      .querySelector('[data-header]')
      ?.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  if (toggle && nav && toggle.getAttribute('data-bound') !== 'true') {
    toggle.setAttribute('data-bound', 'true');
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  void header;
}

function initReveals() {
  if (prefersReducedMotion()) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const revealTargets = document.querySelectorAll(
    '.section h2, .section-cinema h2, .callout, .pull-quote, .tier, .math-block, .price-hero, .join-form, .better-list li, .problem-list li, .offer-item, .rate-table-wrap, .coop-aside, .product-figure, .feature-blocks, .topic-card, .stat-block, .drill-card, .taxonomy-card, .policy-callout, .exec-panel, .flow-step, .cinema-points li, .steps li, .partner-band',
  );
  revealTargets.forEach((node, index) => {
    const el = node as HTMLElement;
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
    const parent = el.parentElement;
    if (parent?.classList.contains('stagger') && !el.style.getPropertyValue('--stagger')) {
      const siblings = [...parent.children].filter((child) =>
        child.classList.contains('reveal') || child === el,
      ) as HTMLElement[];
      const pos = siblings.indexOf(el);
      el.style.setProperty('--stagger', String(pos >= 0 ? pos : index % 8));
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    revealTargets.forEach((el) => {
      if (!el.classList.contains('is-visible')) observer.observe(el);
    });
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }
}

function initForm() {
  const form = document.querySelector('.join-form');
  if (!form || form.getAttribute('data-bound') === 'true') return;
  form.setAttribute('data-bound', 'true');

  const setIntent = (intent: string | null) => {
    if (!intent) return;
    const radio = document.querySelector<HTMLInputElement>(
      `input[name="intent"][value="${intent}"]`,
    );
    if (radio) radio.checked = true;
  };

  const params = new URLSearchParams(window.location.search);
  setIntent(params.get('intent'));

  document.querySelectorAll('[data-intent]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setIntent(btn.getAttribute('data-intent'));
    });
  });

  form.addEventListener('submit', () => {
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }
  });
}

function scoreItem(item: HTMLElement, query: string) {
  if (!query) return 1;
  const hay = `${item.dataset.title ?? ''} ${item.dataset.keywords ?? ''}`.toLowerCase();
  const parts = query.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  for (const part of parts) {
    if (!hay.includes(part)) return -1;
    score += hay.startsWith(part) ? 3 : 1;
  }
  return score;
}

function initPalette() {
  const root = document.querySelector<HTMLElement>('[data-command-palette]');
  if (!root) return;

  const input = root.querySelector<HTMLInputElement>('[data-palette-input]');
  const list = root.querySelector<HTMLElement>('[data-palette-list]');
  if (!input || !list) return;

  let activeIndex = 0;

  const items = () =>
    [...list.querySelectorAll<HTMLElement>('[data-palette-item]')].filter(
      (el) => el.style.display !== 'none',
    );

  const setActive = (index: number) => {
    const visible = items();
    if (!visible.length) return;
    activeIndex = (index + visible.length) % visible.length;
    visible.forEach((el, i) => {
      el.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
      if (i === activeIndex) el.scrollIntoView({ block: 'nearest' });
    });
  };

  const filter = () => {
    const q = input.value.trim();
    const all = [...list.querySelectorAll<HTMLElement>('[data-palette-item]')];
    all.forEach((el) => {
      const s = scoreItem(el, q);
      el.style.display = s < 0 ? 'none' : '';
      el.dataset.score = String(s);
    });
    all
      .filter((el) => el.style.display !== 'none')
      .sort((a, b) => Number(b.dataset.score) - Number(a.dataset.score))
      .forEach((el) => list.appendChild(el));
    setActive(0);
  };

  const open = () => {
    root.hidden = false;
    root.setAttribute('aria-expanded', 'true');
    document.body.classList.add('palette-open');
    input.value = '';
    filter();
    requestAnimationFrame(() => input.focus());
  };

  const close = () => {
    root.hidden = true;
    root.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('palette-open');
  };

  const go = () => {
    const visible = items();
    const target = visible[activeIndex];
    if (!target?.dataset.href) return;
    close();
    window.location.assign(target.dataset.href);
  };

  document.querySelectorAll('[data-palette-open]').forEach((btn) => {
    if (btn.getAttribute('data-bound') === 'true') return;
    btn.setAttribute('data-bound', 'true');
    btn.addEventListener('click', open);
  });

  root.querySelectorAll('[data-palette-close]').forEach((el) => {
    if (el.getAttribute('data-bound') === 'true') return;
    el.setAttribute('data-bound', 'true');
    el.addEventListener('click', close);
  });

  list.querySelectorAll<HTMLElement>('[data-palette-item]').forEach((el) => {
    if (el.getAttribute('data-bound') === 'true') return;
    el.setAttribute('data-bound', 'true');
    el.addEventListener('mouseenter', () => {
      const visible = items();
      setActive(visible.indexOf(el));
    });
    el.addEventListener('click', () => {
      if (el.dataset.href) {
        close();
        window.location.assign(el.dataset.href);
      }
    });
  });

  if (input.getAttribute('data-bound') !== 'true') {
    input.setAttribute('data-bound', 'true');
    input.addEventListener('input', filter);
  }

  if (!docState.keydownBound) {
    docState.keydownBound = true;
    document.addEventListener('keydown', (event) => {
      const palette = document.querySelector<HTMLElement>('[data-command-palette]');
      if (!palette) return;
      const metaK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (metaK) {
        event.preventDefault();
        if (palette.hidden) {
          document.querySelector<HTMLButtonElement>('[data-palette-open]')?.click();
        } else {
          palette.hidden = true;
          palette.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('palette-open');
        }
        return;
      }
      if (palette.hidden) return;
      const listEl = palette.querySelector<HTMLElement>('[data-palette-list]');
      const visible = listEl
        ? [...listEl.querySelectorAll<HTMLElement>('[data-palette-item]')].filter(
            (el) => el.style.display !== 'none',
          )
        : [];
      const selected = visible.findIndex((el) => el.getAttribute('aria-selected') === 'true');
      if (event.key === 'Escape') {
        event.preventDefault();
        palette.hidden = true;
        palette.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('palette-open');
      } else if (event.key === 'ArrowDown' && visible.length) {
        event.preventDefault();
        const next = (selected + 1) % visible.length;
        visible.forEach((el, i) => el.setAttribute('aria-selected', i === next ? 'true' : 'false'));
        visible[next]?.scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'ArrowUp' && visible.length) {
        event.preventDefault();
        const next = (selected - 1 + visible.length) % visible.length;
        visible.forEach((el, i) => el.setAttribute('aria-selected', i === next ? 'true' : 'false'));
        visible[next]?.scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const target = visible[Math.max(selected, 0)];
        if (target?.dataset.href) {
          palette.hidden = true;
          document.body.classList.remove('palette-open');
          window.location.assign(target.dataset.href);
        }
      }
    });
  }

  void (navIndex as PaletteItem[]);
  void open;
  void close;
  void go;
}

function boot() {
  initChrome();
  initReveals();
  initForm();
  initPalette();
}

boot();
document.addEventListener('astro:page-load', boot);
