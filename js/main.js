document.addEventListener("DOMContentLoaded", () => {
  /* ---------------- altezza reale dell'header (per il menu mobile) ---------------- */
  const header = document.querySelector(".site-header");
  const setHeaderHeight = () => {
    if (header) {
      document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
    }
  };
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  /* ---------------- anno corrente nel footer ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- menu mobile ---------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      mainNav.setAttribute("data-open", String(!open));
    });
    mainNav.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        mainNav.setAttribute("data-open", "false");
      })
    );
  }

  /* ---------------- rivelazioni allo scroll ---------------- */
  const revealEls = document.querySelectorAll(".reveal, .whisker-divider");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------------- selettore lingua con bandiere ---------------- */
  const switcher = document.querySelector(".lang-switcher");
  const currentBtn = document.querySelector(".lang-current");
  const panel = document.querySelector(".lang-panel");
  const list = document.querySelector(".lang-list");
  const search = document.querySelector(".lang-search");
  const currentFlag = document.querySelector(".lang-current .flag");
  const currentCode = document.querySelector(".lang-current .code");

  if (switcher && list && typeof SITE_LANGUAGES !== "undefined") {
    const sorted = [...SITE_LANGUAGES].sort((a, b) =>
      a.name.localeCompare(b.name, "it")
    );
    let activeCode = localStorage.getItem("vc-lang") || "it";
    const savedLang = sorted.find((l) => l.code === activeCode) || sorted[0];
    currentFlag.textContent = savedLang.flag;
    currentCode.textContent = savedLang.code.toUpperCase();

    function renderList(filter = "") {
      list.innerHTML = "";
      const q = filter.trim().toLowerCase();
      const filtered = sorted.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.alt && l.alt.toLowerCase().includes(q))
      );
      if (!filtered.length) {
        const empty = document.createElement("p");
        empty.className = "lang-empty";
        empty.textContent = "Nessuna lingua trovata.";
        list.appendChild(empty);
        return;
      }
      filtered.forEach((lang) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.code = lang.code;
        if (lang.code === activeCode) btn.classList.add("active");
        btn.innerHTML = `<span class="flag">${lang.flag}</span><span>${lang.name}</span>`;
        btn.addEventListener("click", () => selectLanguage(lang));
        list.appendChild(btn);
      });
    }

    function selectLanguage(lang) {
      activeCode = lang.code;
      localStorage.setItem("vc-lang", lang.code);
      currentFlag.textContent = lang.flag;
      currentCode.textContent = lang.code.toUpperCase();
      switcher.setAttribute("data-open", "false");
      if (lang.code === "it") {
        resetTranslation();
      } else {
        applyTranslation(lang.code);
      }
    }

    renderList();

    currentBtn.addEventListener("click", () => {
      const open = switcher.getAttribute("data-open") === "true";
      switcher.setAttribute("data-open", String(!open));
      if (!open) search.focus();
    });

    search.addEventListener("input", (e) => renderList(e.target.value));

    document.addEventListener("click", (e) => {
      if (!switcher.contains(e.target)) switcher.setAttribute("data-open", "false");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") switcher.setAttribute("data-open", "false");
    });
  }

  /* ---------------- slider della galleria ---------------- */
  document.querySelectorAll(".gallery-wrap").forEach((gallery) => {
  const track = gallery.querySelector(".gallery-track");
  const prevBtn = gallery.querySelector('[data-gallery="prev"]');
  const nextBtn = gallery.querySelector('[data-gallery="next"]');

  if (!track || !prevBtn || !nextBtn) return;

  const scrollByCard = (dir) => {
    const card = track.querySelector(".gallery-slide");
    const gap = 20;
    const distance = card
      ? card.getBoundingClientRect().width + gap
      : 300;

    track.scrollBy({
      left: dir * distance,
      behavior: "smooth",
    });
  };

  prevBtn.addEventListener("click", () => scrollByCard(-1));
  nextBtn.addEventListener("click", () => scrollByCard(1));
});

  /* ---------------- copia IBAN / PayPal ---------------- */
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = "Copiato ✓";
        setTimeout(() => (btn.textContent = original), 1800);
      } catch (err) {
        console.warn("Copia non riuscita:", err);
      }
    });
  });
});
