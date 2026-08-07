(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector(".join-form");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const setIntent = (intent) => {
    if (!intent) return;
    const radio = document.querySelector(`input[name="intent"][value="${intent}"]`);
    if (radio) radio.checked = true;
  };

  const params = new URLSearchParams(window.location.search);
  setIntent(params.get("intent"));

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-intent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const intent = btn.getAttribute("data-intent");
      setIntent(intent);
    });
  });

  const revealTargets = document.querySelectorAll(
    ".section h2, .callout, .pull-quote, .tier, .math-block, .price-hero, .join-form, .better-list li, .offer-item, .rate-table-wrap, .coop-aside, .product-figure, .feature-blocks, .topic-card, .stat-block, .drill-card, .taxonomy-card, .policy-callout, .exec-panel"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  if (form) {
    form.addEventListener("submit", () => {
      const submit = form.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }
    });
  }
})();
