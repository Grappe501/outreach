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
    '.section h2, .section-cinema h2, .section-tools h2, .callout, .pull-quote, .tier, .math-block, .price-hero, .join-form, .better-list li, .problem-list li, .offer-item, .rate-table-wrap, .coop-aside, .product-figure, .feature-blocks, .topic-card, .stat-block, .drill-card, .taxonomy-card, .policy-callout, .exec-panel, .flow-step, .cinema-points li, .steps li, .partner-band, .rate-calc, .funding-meter, .compare-wrap, .metrics-strip__item',
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

function money(n: number) {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function initRateCalc() {
  const form = document.querySelector<HTMLFormElement>('[data-rate-calc]');
  if (!form || form.getAttribute('data-bound') === 'true') return;
  form.setAttribute('data-bound', 'true');

  const configRaw = form.dataset.rateConfig;
  if (!configRaw) return;

  const config = JSON.parse(configRaw) as {
    platform: number;
    usage: { email: number; sms: number; voice: number; mail: number };
    managed: { email: number; sms: number };
  };

  const usageEl = form.querySelector('[data-calc-usage]');
  const totalEl = form.querySelector('[data-calc-total]');
  const managedEl = form.querySelector('[data-calc-managed]');

  const read = (name: string) => {
    const input = form.elements.namedItem(name);
    if (!(input instanceof HTMLInputElement)) return 0;
    return Math.max(0, Number(input.value) || 0);
  };

  const update = () => {
    const emails = read('emails');
    const sms = read('sms');
    const voice = read('voice');
    const mail = read('mail');
    const usage =
      emails * config.usage.email +
      sms * config.usage.sms +
      voice * config.usage.voice +
      mail * config.usage.mail;
    const managed = emails * config.managed.email + sms * config.managed.sms;
    if (usageEl) usageEl.textContent = money(usage);
    if (totalEl) totalEl.textContent = money(usage + config.platform);
    if (managedEl) managedEl.textContent = money(managed);
  };

  form.addEventListener('input', update);
  update();
}

const mockTimers: number[] = [];

function initProductMock() {
  mockTimers.splice(0).forEach((id) => window.clearInterval(id));
  if (prefersReducedMotion()) return;
  const root = document.querySelector('.product-mock');
  if (!root) return;
  root.removeAttribute('data-bound');
  root.setAttribute('data-bound', 'true');

  const queries = [
    'Show persuadable Democrats in Pulaski with mobile numbers…',
    'Build a weekend canvass turf in Ward 2 with high turnout scores…',
    'Queue an SMS wave to undecideds who opened last email…',
    'List donors who haven’t been thanked in 30 days…',
  ];
  const activities = [
    ['now', 'SMS wave queued · 2,400'],
    ['1m', 'Ask Electd refreshed · Pulaski'],
    ['3m', 'Canvass turf synced · Ward 2'],
    ['7m', 'Email open rate · 41%'],
    ['11m', 'New volunteer shift · 8'],
    ['18m', 'Voice bank complete · 312 dials'],
  ];

  const queryEl = root.querySelector<HTMLElement>('[data-ask-query]');
  const countEl = root.querySelector<HTMLElement>('[data-voter-count]');
  const feed = root.querySelector<HTMLElement>('[data-activity-feed]');
  let q = 0;
  let a = 0;
  let count = 12480;

  if (queryEl) {
    queryEl.style.transition = 'opacity 220ms ease';
  }

  mockTimers.push(
    window.setInterval(() => {
      q = (q + 1) % queries.length;
      if (queryEl) {
        queryEl.style.opacity = '0';
        window.setTimeout(() => {
          queryEl.textContent = queries[q] ?? queries[0] ?? '';
          queryEl.style.opacity = '1';
        }, 220);
      }
      count += Math.floor(Math.random() * 40) + 12;
      if (countEl) countEl.textContent = count.toLocaleString('en-US');
    }, 4200),
  );

  mockTimers.push(
    window.setInterval(() => {
      if (!feed) return;
      a = (a + 1) % activities.length;
      const item = activities[a];
      if (!item) return;
      const li = document.createElement('li');
      li.innerHTML = `<time>${item[0]}</time> ${item[1]}`;
      feed.prepend(li);
      while (feed.children.length > 4) {
        feed.lastElementChild?.remove();
      }
    }, 3200),
  );
}

function boot() {
  initChrome();
  initReveals();
  initForm();
  initPalette();
  initRateCalc();
  initProductMock();
}

boot();
document.addEventListener('astro:page-load', boot);
