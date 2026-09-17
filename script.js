const state = {
  profile: null,
  lang: "es",
};

const get = (object, path) => path.split(".").reduce(
  (value, key) => value?.[key],
  object,
);

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function preferredLanguage() {
  const query = new URLSearchParams(window.location.search).get("lang");
  if (["es", "en"].includes(query)) return query;

  const saved = localStorage.getItem("portfolio-language");
  if (["es", "en"].includes(saved)) return saved;

  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function localized() {
  return state.profile.i18n[state.lang];
}

function formatDate(value) {
  if (!value) return localized().ui.present;
  if (/^\d{4}$/.test(value)) return value;

  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(state.lang === "es" ? "es-AR" : "en", {
    month: "short",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function dateRange(item) {
  return `${formatDate(item.start)} — ${formatDate(item.end)}`;
}

function applyStaticCopy() {
  const copy = localized();
  document.documentElement.lang = state.lang;
  document.title = copy.meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute(
    "content",
    copy.meta.description,
  );

  document.querySelectorAll("[data-copy]").forEach((element) => {
    const value = get(copy, element.dataset.copy);
    if (typeof value === "string") element.textContent = value;
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    const active = button.dataset.lang === state.lang;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderPortfolio() {
  const profile = state.profile;
  const copy = localized();

  document.querySelector("[data-cv-link]").href = `cv.html?lang=${state.lang}`;
  document.getElementById("stats").innerHTML = copy.stats.map((stat) => `
    <div class="stat">
      <strong>${escapeHtml(stat.value)}</strong>
      <span>${escapeHtml(stat.label)}</span>
    </div>
  `).join("");

  document.getElementById("principles").innerHTML = copy.about.principles
    .map((principle) => `
      <article class="principle">
        <strong>${escapeHtml(principle.title)}</strong>
        <p>${escapeHtml(principle.text)}</p>
      </article>
    `).join("");

  document.getElementById("projects-grid").innerHTML = profile.projects
    .map((project, index) => {
      const text = copy.projects[project.id];
      return `
        <article class="project-card reveal">
          <span class="project-number">0${index + 1} / 0${profile.projects.length}</span>
          <h3>${escapeHtml(project.name)}</h3>
          <span class="project-kicker">${escapeHtml(text.kicker)}</span>
          <p>${escapeHtml(text.description)}</p>
          <div class="tag-list">
            ${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <a class="text-link" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">
            ${escapeHtml(copy.ui.viewProject)} ↗
          </a>
        </article>
      `;
    }).join("");

  document.getElementById("experience-list").innerHTML = profile.experience
    .map((job) => {
      const text = copy.experience[job.id];
      return `
        <article class="timeline-item reveal">
          <div class="timeline-date">${escapeHtml(dateRange(job))}</div>
          <div>
            <h3>${escapeHtml(text.role)}</h3>
            <div class="timeline-org">${escapeHtml(job.organization)}</div>
            <p class="timeline-summary">${escapeHtml(text.summary)}</p>
          </div>
        </article>
      `;
    }).join("");

  document.getElementById("education-list").innerHTML = profile.education
    .map((item) => {
      const text = copy.education[item.id];
      return `
        <article class="education-card reveal">
          <span class="date">${escapeHtml(dateRange(item))}</span>
          <h3>${escapeHtml(text.degree)}</h3>
          <p class="institution">${escapeHtml(item.institution)}</p>
          <p>${escapeHtml(text.status)} ${escapeHtml(text.details)}</p>
        </article>
      `;
    }).join("");

  document.getElementById("skills-grid").innerHTML = profile.skills
    .map((group) => `
      <article class="skill-group reveal">
        <h3>${escapeHtml(copy.skillGroups[group.id])}</h3>
        <div class="skill-tags">
          ${group.items.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}
        </div>
      </article>
    `).join("");

  document.getElementById("year").textContent = String(new Date().getFullYear());
  document.getElementById("updated").textContent = new Intl.DateTimeFormat(
    state.lang === "es" ? "es-AR" : "en",
    {dateStyle: "long"},
  ).format(new Date(`${profile.updated}T12:00:00Z`));

  activateReveal();
}

function renderCv() {
  const profile = state.profile;
  const copy = localized();

  document.getElementById("cv-name").textContent = profile.person.name;
  document.getElementById("cv-headline").textContent = copy.cv.headline;
  document.getElementById("cv-contact").innerHTML = `
    <div>${escapeHtml(profile.person.location)}</div>
    <div>${escapeHtml(profile.person.phone)}</div>
    <div><a href="mailto:${escapeHtml(profile.person.email)}">${escapeHtml(profile.person.email)}</a></div>
    <div><a href="${escapeHtml(profile.person.links.linkedin)}">linkedin.com/in/facundomunho</a></div>
    <div><a href="${escapeHtml(profile.person.links.website)}">munhof.com.ar</a></div>
  `;

  document.getElementById("cv-skills").innerHTML = profile.skills.map((group) => `
    <div>
      <strong>${escapeHtml(copy.skillGroups[group.id])}</strong>
      <p>${group.items.map(escapeHtml).join(", ")}</p>
    </div>
  `).join("");

  document.getElementById("cv-experience").innerHTML = profile.experience
    .map((job) => {
      const text = copy.experience[job.id];
      return `
        <article class="cv-entry">
          <h3>${escapeHtml(text.role)}</h3>
          <span class="meta">${escapeHtml(dateRange(job))}</span>
          <span class="meta">${escapeHtml(job.organization)} · ${escapeHtml(job.location)}</span>
          <ul>${text.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
        </article>
      `;
    }).join("");

  document.getElementById("cv-education").innerHTML = profile.education
    .map((item) => {
      const text = copy.education[item.id];
      return `
        <article class="cv-entry">
          <h3>${escapeHtml(text.degree)}</h3>
          <span class="meta">${escapeHtml(dateRange(item))}</span>
          <span class="meta">${escapeHtml(item.institution)}</span>
          <p class="details">${escapeHtml(text.status)} ${escapeHtml(text.details)}</p>
        </article>
      `;
    }).join("");

  document.getElementById("cv-projects").innerHTML = copy.cv.projectBullets
    .map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("");
  document.getElementById("cv-languages").textContent = profile.languages
    .map((language) => copy.languages[language]).join(" · ");

  const fileName = state.lang === "es"
    ? "CV-Facundo-Munho-ES"
    : "CV-Facundo-Munho-EN";
  document.title = fileName;
}

function activateReveal() {
  const items = document.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  items.forEach((item) => observer.observe(item));
}

function render() {
  applyStaticCopy();
  if (document.body.dataset.page === "cv") renderCv();
  else renderPortfolio();
}

function setLanguage(lang) {
  if (!["es", "en"].includes(lang)) return;
  state.lang = lang;
  localStorage.setItem("portfolio-language", lang);

  const url = new URL(window.location.href);
  if (document.body.dataset.page === "cv") {
    url.searchParams.set("lang", lang);
    history.replaceState({}, "", url);
  }
  render();
}

function setupControls() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });

  document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

  const themeButton = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("portfolio-theme");
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
  const initialTheme = savedTheme || preferredTheme;
  if (document.body.dataset.page !== "cv") {
    document.documentElement.dataset.theme = initialTheme;
  }

  themeButton?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("portfolio-theme", next);
  });

  const menu = document.getElementById("main-nav");
  const menuButton = document.querySelector(".menu-toggle");
  menuButton?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    menu.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));
}

async function init() {
  try {
    const response = await fetch("data/profile.json");
    if (!response.ok) throw new Error(`Profile request failed: ${response.status}`);
    state.profile = await response.json();
    state.lang = preferredLanguage();
    setupControls();
    render();
  } catch (error) {
    console.error(error);
    document.body.classList.add("load-error");
  }
}

init();
