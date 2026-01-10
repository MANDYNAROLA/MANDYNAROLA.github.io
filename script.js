// ===== Utilities =====
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

// ===== Year =====
const yearEl = qs("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Mobile menu =====
const menuBtn = qs("#menuBtn");
const mobileMenu = qs("#mobileMenu");

menuBtn?.addEventListener("click", () => {
  const isHidden = mobileMenu?.hasAttribute("hidden");
  if (!mobileMenu) return;
  if (isHidden) mobileMenu.removeAttribute("hidden");
  else mobileMenu.setAttribute("hidden", "");
});

qsa("#mobileMenu a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileMenu?.setAttribute("hidden", "");
  })
);

// ===== Theme toggle (persist) =====
const themeBtn = qs("#themeBtn");
const root = document.documentElement;

try {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light") root.classList.add("light");
} catch {}

themeBtn?.addEventListener("click", () => {
  root.classList.toggle("light");
  try {
    localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark");
  } catch {}
});

// ===== Reveal on scroll =====
const revealEls = qsa(".reveal");
const revealIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => revealIO.observe(el));

// ===== Animated counters (.count + data-to) =====
function animateCount(el, to) {
  const dur = 900;
  const start = performance.now();
  const from = 0;

  function tick(t) {
    const p = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    const v = Math.round(from + (to - from) * eased);
    el.textContent = String(v);
    if (p < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const countEls = qsa(".count");
countEls.forEach((el) => (el.textContent = "0"));

const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.dataset.done) return;
      el.dataset.done = "1";

      const to = Number(el.getAttribute("data-to") || "0");
      animateCount(el, to);
    });
  },
  { threshold: 0.5 }
);
countEls.forEach((el) => counterIO.observe(el));

// ===== Skill bars animate when visible =====
const barIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const span = e.target;
      const val = span.getAttribute("data-bar");
      if (!val || span.dataset.done) return;
      span.dataset.done = "1";
      span.style.width = `${val}%`;
    });
  },
  { threshold: 0.35 }
);
qsa(".bar span[data-bar]").forEach((el) => barIO.observe(el));

// ===============================
// Gallery: 3x3 + Load More + Slider
// ===============================
const galleryGrid = qs("#galleryGrid");
const loadMoreBtn = qs("#loadMoreBtn");

const lightbox = qs("#lightbox");
const lightboxImg = qs("#lightboxImg");
const lightboxTitle = qs("#lightboxTitle");
const lightboxTag = qs("#lightboxTag");
const lightboxClose = qs("#lightboxClose");
const lightboxPrev = qs("#lightboxPrev");
const lightboxNext = qs("#lightboxNext");
const lightboxCounter = qs("#lightboxCounter");

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
  { src: "gallery/WhatsApp%20Image%202026-01-04%20at%2011.21.40%20PM.jpeg", title: "Project Moment", tag: "Life" },
  { src: "gallery/WhatsApp%20Image%202026-01-04%20at%209.20.54%20PM.jpeg", title: "Discussion Session", tag: "People" },
  { src: "gallery/WhatsApp%20Image%202026-01-04%20at%209.20.57%20PM.jpeg", title: "Team Discussion", tag: "People" },
  { src: "gallery/WhatsApp%20Image%202026-01-08%20at%2011.40.48%20PM.jpeg", title: "Late Night Work", tag: "Work" },
];

const PAGE_SIZE = 9;
let visibleCount = PAGE_SIZE;
let currentFilter = "All";
let currentList = [];
let currentIndex = 0;

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function getFilteredList() {
  return galleryImages.filter((img) => (currentFilter === "All" ? true : img.tag === currentFilter));
}

function renderGallery() {
  if (!galleryGrid) return;

  currentList = getFilteredList();
  const slice = currentList.slice(0, visibleCount);

  galleryGrid.innerHTML = slice
    .map((img, idx) => `
      <div class="gitem" data-idx="${idx}">
        <img loading="lazy" src="${img.src}" alt="${escapeHtml(img.title)}">
        <div class="gmeta">
          <div class="gtitle">${escapeHtml(img.title)}</div>
          <div class="gtag">${escapeHtml(img.tag)}</div>
        </div>
      </div>
    `)
    .join("");

  qsa(".gitem", galleryGrid).forEach((el) => {
    el.addEventListener("click", () => {
      const idx = Number(el.getAttribute("data-idx"));
      openLightbox(idx);
    });
  });

  if (loadMoreBtn) {
    loadMoreBtn.style.display = visibleCount >= currentList.length ? "none" : "inline-block";
  }
}

function setupGalleryFilters() {
  qsa(".gbtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      qsa(".gbtn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter || "All";
      visibleCount = PAGE_SIZE;
      renderGallery();
    });
  });
}

function updateLightbox() {
  const img = currentList[currentIndex];
  if (!img || !lightboxImg) return;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.title || "Gallery image";
  if (lightboxTitle) lightboxTitle.textContent = img.title || "";
  if (lightboxTag) lightboxTag.textContent = img.tag || "";
  if (lightboxCounter) lightboxCounter.textContent = `${currentIndex + 1} / ${currentList.length}`;
}

function openLightbox(idx) {
  if (!lightbox) return;
  currentList = getFilteredList();
  currentIndex = idx;
  updateLightbox();
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  if (lightboxImg) lightboxImg.src = "";
}

function prevImage() {
  if (!currentList.length) return;
  currentIndex = (currentIndex - 1 + currentList.length) % currentList.length;
  updateLightbox();
}

function nextImage() {
  if (!currentList.length) return;
  currentIndex = (currentIndex + 1) % currentList.length;
  updateLightbox();
}

loadMoreBtn?.addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderGallery();
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", prevImage);
lightboxNext?.addEventListener("click", nextImage);

lightbox?.addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "1") closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox?.classList.contains("show")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});

if (galleryGrid) {
  renderGallery();
  setupGalleryFilters();
}

// ===== Copy Email =====
qs("#copyEmailBtn")?.addEventListener("click", async () => {
  const email = "nmanthan670@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    alert("Email copied.");
  } catch {
    prompt("Copy email:", email);
  }
});

// ===== Contact form (Formspree) =====
const form = qs("#contactForm");
const statusEl = qs("#contactStatus");
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID"; // replace

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (statusEl) statusEl.textContent = "Sending...";

  const fd = new FormData(form);
  if (fd.get("_gotcha")) return;

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
    });

    if (res.ok) {
      form.reset();
      if (statusEl) statusEl.textContent = "Sent. I’ll reply fast.";
    } else {
      if (statusEl) statusEl.textContent = "Failed to send. Use email above.";
    }
  } catch {
    if (statusEl) statusEl.textContent = "Network error. Use email above.";
  }
});
