// ===== Utilities =====
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

// ===== Year =====
qs("#year").textContent = new Date().getFullYear();

// ===== Mobile menu =====
const menuBtn = qs("#menuBtn");
const mobileMenu = qs("#mobileMenu");
menuBtn?.addEventListener("click", () => {
  const isHidden = mobileMenu.hasAttribute("hidden");
  if (isHidden) mobileMenu.removeAttribute("hidden");
  else mobileMenu.setAttribute("hidden", "");
});

// Close menu on click
qsa("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.setAttribute("hidden", "");
}));

// ===== Theme toggle (persist) =====
const themeBtn = qs("#themeBtn");
const root = document.documentElement;
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "light") root.classList.add("light");

themeBtn?.addEventListener("click", () => {
  root.classList.toggle("light");
  localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark");
});

// ===== Reveal on scroll =====
const revealEls = qsa(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ===== Animated counters =====
function animateCount(el, to) {
  const dur = 900;
  const start = performance.now();
  const from = 0;

  function tick(t){
    const p = Math.min(1, (t - start) / dur);
    const v = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const to = Number(el.getAttribute("data-to") || "0");
    if (el.dataset.done) return;
    el.dataset.done = "1";
    animateCount(el, to);
  });
}, { threshold: 0.5 });

qsa(".count").forEach(el => counterIO.observe(el));

// ===== Skill bars animate when visible =====
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const span = e.target;
    const val = span.getAttribute("data-bar");
    if (!val || span.dataset.done) return;
    span.dataset.done = "1";
    span.style.width = `${val}%`;
  });
}, { threshold: 0.35 });

// ===============================
// FIXED IMAGE GALLERY (NO RENAME)
// ===============================

const galleryGrid = document.getElementById("galleryGrid");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxTag = document.getElementById("lightboxTag");
const lightboxClose = document.getElementById("lightboxClose");

// 👉 YOUR REAL IMAGES (AS-IS)
const galleryImages = [
  { src: "gallery/Ba5.jpeg", title: "Business Analysis Work", tag: "Work" },
  { src: "gallery/ba3.jpeg", title: "Data Analysis Snapshot", tag: "Data" },
  { src: "gallery/ba4.jpeg", title: "Dashboard View", tag: "Data" },
  { src: "gallery/ba6.jpeg", title: "Analytics Output", tag: "Data" },

  { src: "gallery/ba_team.jpeg", title: "Team Collaboration", tag: "People" },

  { src: "gallery/manhattan1.jpeg", title: "Manhattan Competition", tag: "Work" },
  { src: "gallery/manhattan2.jpeg", title: "Manhattan Presentation", tag: "Work" },

  { src: "gallery/pre1.jpeg", title: "Project Presentation", tag: "Work" },
  { src: "gallery/pvalue.jpeg", title: "Statistical Analysis", tag: "Data" },

  { src: "gallery/work_ny.jpeg", title: "Professional Moment", tag: "Life" },
  { src: "gallery/work_ny2.jpeg", title: "Work in Progress", tag: "Life" },

  // WhatsApp images (kept as-is)
  { src: "gallery/WhatsApp Image 2026-01-04 at 11.21.40 PM.jpeg", title: "Project Moment", tag: "Life" },
  { src: "gallery/WhatsApp Image 2026-01-04 at 9.20.54 PM.jpeg", title: "Discussion Session", tag: "People" },
  { src: "gallery/WhatsApp Image 2026-01-04 at 9.20.57 PM.jpeg", title: "Team Discussion", tag: "People" },
  { src: "gallery/WhatsApp Image 2026-01-08 at 11.40.48 PM.jpeg", title: "Late Night Work", tag: "Work" }
];

let currentFilter = "All";

function renderGallery() {
  if (!galleryGrid) return;

  const items = galleryImages.filter(img =>
    currentFilter === "All" ? true : img.tag === currentFilter
  );

  galleryGrid.innerHTML = items.map((img, index) => `
    <div class="gitem" data-index="${index}">
      <img src="${img.src}" alt="${img.title}">
      <div class="gmeta">
        <div class="gtitle">${img.title}</div>
        <div class="gtag">${img.tag}</div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".gitem").forEach(el => {
    el.addEventListener("click", () => {
      const img = items[el.dataset.index];
      openLightbox(img);
    });
  });
}

function setupGalleryFilters() {
  document.querySelectorAll(".gbtn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".gbtn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderGallery();
    });
  });
}

function openLightbox(img) {
  lightboxImg.src = img.src;
  lightboxTitle.textContent = img.title;
  lightboxTag.textContent = img.tag;
  lightbox.classList.add("show");
}

function closeLightbox() {
  lightbox.classList.remove("show");
  lightboxImg.src = "";
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", e => {
  if (e.target.classList.contains("lightbox-backdrop")) closeLightbox();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});

// INIT
renderGallery();
setupGalleryFilters();

qsa(".bar span[data-bar]").forEach(el => barIO.observe(el));

// ===== Replace LinkedIn link (set your real URL) =====
const linkedin = qs("#linkedinLink");
if (linkedin) linkedin.href = "https://www.linkedin.com/in/YOUR-LINK/";

