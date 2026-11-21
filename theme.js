/* ============================================================
   theme.js
   - reads localStorage on load, otherwise falls back to OS preference
   - toggles <html data-theme="light|dark">
   - persists choice
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "portfolio-theme";
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  /* Decide initial theme BEFORE first paint to avoid a flash */
  function applyInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      root.setAttribute("data-theme", saved);
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }

  /* Update the toggle button visuals */
  function updateToggleUI() {
    if (!toggle) return;
    const current = root.getAttribute("data-theme");
    const isDark = current === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    const icon = toggle.querySelector(".theme-icon");
    const label = toggle.querySelector(".theme-label");
    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (label) label.textContent = isDark ? "Light" : "Dark";
  }

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleUI();
  }

  /* Boot */
  applyInitialTheme();
  updateToggleUI();

  /* Toggle click */
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  /* Follow OS if the user has never chosen a theme */
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    root.setAttribute("data-theme", e.matches ? "dark" : "light");
    updateToggleUI();
  });
})();