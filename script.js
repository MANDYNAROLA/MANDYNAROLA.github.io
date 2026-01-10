// ===== Utilities =====
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

// ===== Stat counter animation =====
const counters = document.querySelectorAll(".count").forEach((el) => {
  const to = Number(el.getAttribute("data-to") || "0");
  el.textContent = "0";
});

const animateCounter = (el) => {
  const target = Number(el.dataset.count);
  const duration = 900;
  const start = performance.now();

  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(p * target).toString();
    if (p < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = "1";
        animateCounter(e.target);
      }
    });
  },
  { threshold: 0.4 }
);

counters.forEach((c) => io.observe(c));


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
qsa("#mobileMenu a").forEach(a =>
  a.addEventListener("click", () => {
    mobileMenu.setAttribute("hidden", "");
  })
);

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
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// ===== Animated counters =====

qsa(".count").forEach((el) => counterIO.observe(el));

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

const galleryGrid = document.getElementById("galleryGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxTag = document.getElementById("lightboxTag");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxCounter = document.getElementById("lightboxCounter");

// your images (no rename) — WhatsApp ones encoded for spaces
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
  { src: "gallery/WhatsApp%20Image%202026-01-08%20at%2011.40.48%20PM.jpeg", title: "Late Night Work", tag: "Work" }
];

// paging and state
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
    "'": "&#039;"
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
    .map(
      (img, idx) => `
      <div class="gitem" data-idx="${idx}">
        <img loading="lazy" src="${img.src}" alt="${escapeHtml(img.title)}">
        <div class="gmeta">
          <div class="gtitle">${escapeHtml(img.title)}</div>
          <div class="gtag">${escapeHtml(img.tag)}</div>
        </div>
      </div>
    `
    )
    .join("");

  // click open
  qsa(".gitem", galleryGrid).forEach((el) => {
    el.addEventListener("click", () => {
      const idx = Number(el.getAttribute("data-idx"));
      openLightbox(idx);
    });
  });

  // load more button show/hide
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
      visibleCount = PAGE_SIZE; // reset when filter changes
      renderGallery();
    });
  });
}

function openLightbox(idx) {
  if (!lightbox) return;
  currentList = getFilteredList();
  currentIndex = idx;

  updateLightbox();
  lightbox.classList.add("show");
  lightbox.setAttribute("aria-hidden", "false");
}

function updateLightbox() {
  const img = currentList[currentIndex];
  if (!img) return;

  lightboxImg.src = img.src;
  lightboxImg.alt = img.title || "Gallery image";
  lightboxTitle.textContent = img.title || "";
  lightboxTag.textContent = img.tag || "";

  if (lightboxCounter) {
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentList.length}`;
  }
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
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

// events
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

// init gallery if section exists
if (galleryGrid) {
  renderGallery();
  setupGalleryFilters();
}

// ===== Replace LinkedIn link (set your real URL) =====
const linkedin = qs("#linkedinLink");
if (linkedin) {
  linkedin.href = "https://www.linkedin.com/in/manthan-narola/";
  linkedin.target = "_blank";
}

// ===== Copy Email =====
document.getElementById("copyEmailBtn")?.addEventListener("click", async () => {
  const email = "nmanthan670@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    alert("Email copied.");
  } catch {
    prompt("Copy email:", email);
  }
});
// ===== Contact form (Formspree) =====
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("contactStatus");

// Put your real Formspree URL here (not YOUR_FORM_ID)
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (statusEl) statusEl.textContent = "Sending...";

    const fd = new FormData(form);

    // Honeypot filled -> treat as spam
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
}


