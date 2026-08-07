(() => {
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase() || "index.html";

  const links = [
    { href: "index.html", label: "Home", keys: ["index.html", ""] },
    { href: "problem.html", label: "Problem", keys: ["problem.html"] },
    { href: "data.html", label: "L2 Data", keys: ["data.html", "models.html"] },
    { href: "platform.html", label: "Electd", keys: ["platform.html"] },
    { href: "managed.html", label: "Managed", keys: ["managed.html"] },
    { href: "pricing.html", label: "Rates", keys: ["pricing.html"] },
    { href: "cooperative.html", label: "Cooperative", keys: ["cooperative.html"] },
    { href: "join.html", label: "Join", keys: ["join.html"], cta: true },
  ];

  const moreLinks = [
    { href: "models.html", label: "Haystaq models" },
    { href: "van.html", label: "VAN & existing tools" },
    { href: "privacy.html", label: "Private contacts" },
    { href: "how-it-works.html", label: "How it works" },
  ];

  const isActive = (item) => item.keys.includes(path);

  const logoMark = `
<svg class="logo-ar" viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M42 48 L78 38 L118 34 L148 36 L168 40 L178 48 L182 62 L186 88 L188 118 L186 142 L178 158 L162 168 L138 174 L108 178 L82 174 L58 164 L46 148 L40 122 L36 92 L38 68 Z" fill="none" stroke="currentColor" stroke-width="10" stroke-linejoin="round"/>
  <circle cx="108" cy="112" r="8" fill="#c45312"/>
  <circle cx="68" cy="58" r="5.5" fill="currentColor"/>
  <circle cx="52" cy="78" r="5" fill="currentColor"/>
  <circle cx="148" cy="72" r="5.5" fill="currentColor"/>
  <circle cx="118" cy="138" r="5" fill="currentColor"/>
  <circle cx="88" cy="118" r="5" fill="currentColor"/>
  <circle cx="58" cy="158" r="5" fill="currentColor"/>
  <circle cx="98" cy="158" r="5" fill="currentColor"/>
</svg>`;

  const headerEl = document.querySelector("[data-site-header]");
  if (headerEl) {
    const navItems = links
      .map((item) => {
        const active = isActive(item);
        if (item.cta) {
          return `<a href="${item.href}" class="nav-cta${active ? " is-active" : ""}"${active ? ' aria-current="page"' : ""}>${item.label}</a>`;
        }
        return `<a href="${item.href}"${active ? ' class="is-active" aria-current="page"' : ""}>${item.label}</a>`;
      })
      .join("");

    headerEl.outerHTML = `
<header class="site-header" data-header>
  <div class="header-inner">
    <a class="logo" href="index.html">
      ${logoMark}
      <span class="logo-text">Arkansas Campaign Data Cooperative</span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
      <span class="sr-only">Menu</span>
      <span></span><span></span>
    </button>
    <nav id="site-nav" class="site-nav" data-nav>${navItems}</nav>
  </div>
</header>`;
  }

  const footerEl = document.querySelector("[data-site-footer]");
  if (footerEl) {
    footerEl.outerHTML = `
<footer class="site-footer">
  <div class="footer-inner">
    <p class="footer-brand">Arkansas Campaign Data Cooperative</p>
    <p>Better Data. Better Organizing. Better Campaigns.</p>
    <p class="footer-powered">
      Platform: <a href="https://www.electd.io/" rel="noopener noreferrer" target="_blank">Electd</a>
      · Enhanced data: <a href="https://l2-data.com/" rel="noopener noreferrer" target="_blank">L2 Data</a>
    </p>
    <nav class="footer-nav" aria-label="Footer">
      ${links.map((l) => `<a href="${l.href}">${l.label}</a>`).join("")}
      ${moreLinks.map((l) => `<a href="${l.href}">${l.label}</a>`).join("")}
    </nav>
    <p class="footer-meta">&copy; <span data-year></span> Arkansas Campaign Data Cooperative</p>
  </div>
</footer>`;
  }

  const subnav = document.querySelector("[data-subnav]");
  if (subnav) {
    const items = [
      ...moreLinks,
      { href: "data.html#dictionary", label: "Field dictionary" },
      { href: "cooperative.html#minimums", label: "Contribution minimums" },
      { href: "pricing.html", label: "Rates" },
    ]
      .map((l) => `<a href="${l.href}">${l.label}</a>`)
      .join("");
    subnav.innerHTML = `<div class="subnav-inner"><span class="subnav-label">More</span>${items}</div>`;
  }
})();
