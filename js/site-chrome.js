(() => {
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase() || "index.html";

  const links = [
    { href: "index.html", label: "Home", keys: ["index.html", ""] },
    { href: "problem.html", label: "Problem", keys: ["problem.html"] },
    { href: "data.html", label: "L2 Data", keys: ["data.html"] },
    { href: "platform.html", label: "Electd", keys: ["platform.html"] },
    { href: "managed.html", label: "Managed", keys: ["managed.html"] },
    { href: "pricing.html", label: "Rates", keys: ["pricing.html"] },
    { href: "cooperative.html", label: "Cooperative", keys: ["cooperative.html"] },
    { href: "join.html", label: "Join", keys: ["join.html"], cta: true },
  ];

  const moreLinks = [
    { href: "van.html", label: "VAN & existing tools" },
    { href: "privacy.html", label: "Private contacts" },
    { href: "how-it-works.html", label: "How it works" },
  ];

  const isActive = (item) => item.keys.includes(path);

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
      <span class="logo-mark" aria-hidden="true"></span>
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
      { href: "data.html#attributes", label: "Attributes" },
      { href: "data.html#touchpoints", label: "Contact lists" },
      { href: "cooperative.html#tiers", label: "Tiers" },
      { href: "pricing.html", label: "Rates" },
    ]
      .map((l) => `<a href="${l.href}">${l.label}</a>`)
      .join("");
    subnav.innerHTML = `<div class="subnav-inner"><span class="subnav-label">More</span>${items}</div>`;
  }
})();
