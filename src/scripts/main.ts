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

type MockStepData = {
  id: string;
  label: string;
  rail: string;
  ask: string;
  count: string;
  voters: { name: string; channels: string }[];
  feed: { time: string; text: string }[];
  note: string;
};

let paletteLastFocus: HTMLElement | null = null;

function navigateSoft(href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.dataset.astroPrefetch = 'true';
  document.body.appendChild(a);
  a.click();
  a.remove();
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
      (el) => el.style.display !== 'none' && el.closest('[data-palette-group]')?.getAttribute('hidden') !== '',
    ).filter((el) => {
      const group = el.closest<HTMLElement>('[data-palette-group]');
      return !group || group.style.display !== 'none';
    });

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
    list.querySelectorAll<HTMLElement>('[data-palette-group]').forEach((group) => {
      const groupItems = [...group.querySelectorAll<HTMLElement>('[data-palette-item]')];
      let visibleCount = 0;
      groupItems.forEach((el) => {
        const s = scoreItem(el, q);
        el.style.display = s < 0 ? 'none' : '';
        el.dataset.score = String(s);
        if (s >= 0) visibleCount += 1;
      });
      group.style.display = visibleCount ? '' : 'none';
    });
    setActive(0);
  };

  const getFocusable = () =>
    [input, ...items()].filter(Boolean) as HTMLElement[];

  const trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || root.hidden) return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const open = () => {
    paletteLastFocus = document.activeElement as HTMLElement | null;
    root.hidden = false;
    document.body.classList.add('palette-open');
    input.value = '';
    filter();
    requestAnimationFrame(() => input.focus());
  };

  const close = () => {
    root.hidden = true;
    document.body.classList.remove('palette-open');
    paletteLastFocus?.focus?.();
    paletteLastFocus = null;
  };

  const go = () => {
    const visible = items();
    const target = visible[activeIndex];
    if (!target?.dataset.href) return;
    const href = target.dataset.href;
    close();
    navigateSoft(href);
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
      if (!el.dataset.href) return;
      close();
      navigateSoft(el.dataset.href);
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
        if (palette.hidden) open();
        else close();
        return;
      }
      if (palette.hidden) return;
      trapFocus(event);
      const visible = items();
      const selected = visible.findIndex((el) => el.getAttribute('aria-selected') === 'true');
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      } else if (event.key === 'ArrowDown' && visible.length) {
        event.preventDefault();
        setActive(selected + 1);
      } else if (event.key === 'ArrowUp' && visible.length) {
        event.preventDefault();
        setActive(selected - 1);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        go();
      }
    });
  }

  void (navIndex as PaletteItem[]);
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
  const root = document.querySelector<HTMLElement>('[data-product-mock]');
  if (!root || root.getAttribute('data-bound') === 'true') return;
  root.setAttribute('data-bound', 'true');

  const stepsEl = root.querySelector<HTMLScriptElement>('[data-mock-steps]');
  if (!stepsEl?.textContent) return;
  const steps = JSON.parse(stepsEl.textContent) as MockStepData[];

  const queryEl = root.querySelector<HTMLElement>('[data-ask-query]');
  const countEl = root.querySelector<HTMLElement>('[data-voter-count]');
  const voterList = root.querySelector<HTMLElement>('[data-voter-list]');
  const feed = root.querySelector<HTMLElement>('[data-activity-feed]');
  const noteEl = root.querySelector<HTMLElement>('[data-mock-note]');
  const panel = root.querySelector<HTMLElement>('#mock-panel');
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-mock-step]')];

  let index = 0;

  const render = (next: number) => {
    index = (next + steps.length) % steps.length;
    const step = steps[index];
    if (!step) return;

    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    root.querySelectorAll<HTMLElement>('[data-mock-rail]').forEach((rail) => {
      rail.classList.toggle('is-active', rail.dataset.mockRail === step.rail);
    });

    if (panel) panel.setAttribute('aria-labelledby', `mock-tab-${step.id}`);
    if (queryEl) queryEl.textContent = step.ask;
    if (countEl) countEl.textContent = step.count;
    if (noteEl) noteEl.textContent = step.note;
    if (voterList) {
      voterList.innerHTML = step.voters
        .map(
          (v) =>
            `<li><span class="dot"></span><span>${v.name}</span><em>${v.channels}</em></li>`,
        )
        .join('');
    }
    if (feed) {
      feed.innerHTML = step.feed
        .map((f) => `<li><time>${f.time}</time> ${f.text}</li>`)
        .join('');
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      render(Number(tab.dataset.stepIndex ?? 0));
    });
  });

  if (!prefersReducedMotion()) {
    mockTimers.push(window.setInterval(() => render(index + 1), 6500));
  }
}

function initTour() {
  const root = document.querySelector<HTMLElement>('[data-platform-tour]');
  if (!root || root.getAttribute('data-bound') === 'true') return;
  root.setAttribute('data-bound', 'true');
  const chapters = [...root.querySelectorAll<HTMLButtonElement>('[data-tour-chapter]')];
  chapters.forEach((btn) => {
    btn.addEventListener('click', () => {
      chapters.forEach((c) => {
        const on = c === btn;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
    });
  });
}

function boot() {
  initChrome();
  initReveals();
  initForm();
  initPalette();
  initRateCalc();
  initProductMock();
  initTour();
}

boot();
document.addEventListener('astro:page-load', boot);
