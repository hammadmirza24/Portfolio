/* ============================================================
   projects.js
   - data array
   - safe DOM rendering (createElement + textContent)
   - combined search + tech filter
   - live result count
   - empty state
   - bonus: project detail <dialog>
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Data ---------- */
  const projects = [
    {
      id: "p1",
      title: "CampusMart (static prototype)",
      description: "Marketplace UI for university students — semantic HTML and a fully accessible form.",
      tech: ["HTML", "CSS", "JavaScript"],
      year: 2026,
      link: "https://github.com/",
    },
    {
      id: "p2",
      title: "Weather Dashboard",
      description: "Current weather and forecast for any city, with automatic geolocation and offline caching.",
      tech: ["JavaScript", "API", "CSS"],
      year: 2025,
      link: "https://github.com/",
    },
    {
      id: "p3",
      title: "Accessible Form Library",
      description: "A small library of forms (login, signup, checkout) — all WCAG 2.2 AA compliant.",
      tech: ["HTML", "CSS", "Accessibility"],
      year: 2026,
      link: "https://github.com/",
    },
    {
      id: "p4",
      title: "Portfolio v1",
      description: "My first portfolio — built end-to-end with plain HTML and CSS, hosted on GitHub Pages.",
      tech: ["HTML", "CSS"],
      year: 2024,
      link: "https://github.com/",
    },
    {
      id: "p5",
      title: "Todo PWA",
      description: "An installable, offline-first todo list — service worker, web app manifest and IndexedDB.",
      tech: ["JavaScript", "PWA", "CSS"],
      year: 2025,
      link: "https://github.com/",
    },
    {
      id: "p6",
      title: "CSS Grid Playground",
      description: "An interactive playground that teaches CSS Grid to beginners with live code preview.",
      tech: ["HTML", "CSS", "JavaScript"],
      year: 2024,
      link: "https://github.com/",
    },
    {
      id: "p7",
      title: "DevNotes",
      description: "A markdown-based note-thiming app with keyboard-first navigation.",
      tech: ["JavaScript", "CSS", "Accessibility"],
      year: 2026,
      link: "https://github.com/",
    },
  ];

  /* ---------- 2. DOM refs ---------- */
  const grid    = document.getElementById("project-grid");
  const search  = document.getElementById("search");
  const select  = document.getElementById("tech-filter");
  const count   = document.getElementById("result-count");
  const empty   = document.getElementById("empty-state");
  const dialog  = document.getElementById("project-dialog");

  if (!grid || !search || !select || !count || !empty) return;

  /* ---------- 3. Populate tech <select> from data ---------- */
  const allTech = [...new Set(projects.flatMap((p) => p.tech))].sort();
  for (const tech of allTech) {
    const opt = document.createElement("option");
    opt.value = tech;
    opt.textContent = tech;
    select.appendChild(opt);
  }

  /* ---------- 4. Build a card safely (no innerHTML with data) ---------- */
  function buildCard(project) {
    const card = document.createElement("article");
    card.className = "project-card";

    const title = document.createElement("h3");
    title.textContent = project.title;
    card.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = project.description;
    card.appendChild(desc);

    const tags = document.createElement("ul");
    tags.className = "tech-tags";
    for (const t of project.tech) {
      const li = document.createElement("li");
      li.textContent = t;
      tags.appendChild(li);
    }
    card.appendChild(tags);

    /* Detail button → opens bonus <dialog> */
    const detailBtn = document.createElement("button");
    detailBtn.type = "button";
    detailBtn.className = "card-link";
    detailBtn.style.background = "none";
    detailBtn.style.border = "none";
    detailBtn.style.padding = "0";
    detailBtn.style.cursor = "pointer";
    detailBtn.textContent = "View details →";
    detailBtn.addEventListener("click", () => openDialog(project));
    card.appendChild(detailBtn);

    return card;
  }

  /* ---------- 5. Filter + render ---------- */
  function filterProjects(list, query, techFilter) {
    const q = query.trim().toLowerCase();
    return list.filter((p) => {
      const matchTech =
        !techFilter || p.tech.some((t) => t.toLowerCase() === techFilter.toLowerCase());

      if (!q) return matchTech;

      const inTitle = p.title.toLowerCase().includes(q);
      const inTech  = p.tech.some((t) => t.toLowerCase().includes(q));
      return matchTech && (inTitle || inTech);
    });
  }

  function render(list) {
    grid.replaceChildren();               // safe + modern replacement for innerHTML=""
    for (const p of list) grid.appendChild(buildCard(p));

    /* Empty state */
    const isEmpty = list.length === 0;
    empty.hidden = !isEmpty;

    /* Live count */
    count.textContent =
      isEmpty ? "No projects found."
              : `Showing ${list.length} of ${projects.length} project${projects.length === 1 ? "" : "s"}.`;
  }

  /* ---------- 6. Wire up the controls ---------- */
  function update() {
    const results = filterProjects(projects, search.value, select.value);
    render(results);
  }

  search.addEventListener("input", update);
  select.addEventListener("change", update);

  /* Debounce a tiny bit for smoother typing on slow devices */
  let t;
  search.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(update, 100);
  });

  /* ---------- 7. Bonus: detail dialog ---------- */
  function openDialog(project) {
    if (!dialog || typeof dialog.showModal !== "function") return;
    document.getElementById("dialog-title").textContent = project.title;
    document.getElementById("dialog-desc").textContent  = project.description;
    document.getElementById("dialog-year").textContent  = project.year;
    document.getElementById("dialog-tech").textContent  = project.tech.join(", ");
    const link = document.getElementById("dialog-link");
    link.href = project.link;
    dialog.showModal();
  }

  /* Close with Escape, or click on backdrop */
  if (dialog) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  /* ---------- 8. First render ---------- */
  update();
})();