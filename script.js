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

qsa(".bar span[data-bar]").forEach(el => barIO.observe(el));

// ===== Replace LinkedIn link (set your real URL) =====
const linkedin = qs("#linkedinLink");
if (linkedin) linkedin.href = "https://www.linkedin.com/in/YOUR-LINK/";
