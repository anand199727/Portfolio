const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function initPreloader() {
  const root = document.getElementById("preloader");
  const pctEl = document.getElementById("preloader-pct");
  if (!root || !pctEl || prefersReducedMotion) {
    root?.classList.add("is-done");
    return;
  }

  let p = 1;
  const start = performance.now();
  const duration = 900;

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    p = Math.round(1 + t * 99);
    pctEl.textContent = `${p}%`;
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      requestAnimationFrame(() => root.classList.add("is-done"));
    }
  }

  requestAnimationFrame(tick);
}

function initStarfields() {
  if (prefersReducedMotion) return () => {};

  const configs = [
    { id: "starfield-hero", density: 0.00014, speed: 0.14 },
    { id: "starfield-embed", density: 0.00018, speed: 0.1 },
    { id: "starfield-footer", density: 0.0001, speed: 0.09 },
  ];

  const instances = configs
    .map(({ id, density, speed }) => {
      const el = document.getElementById(id);
      if (!(el instanceof HTMLCanvasElement)) return null;
      return window.createStarfield(el, { density, speed });
    })
    .filter(Boolean);

  return () => instances.forEach((i) => i.destroy());
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
  );

  els.forEach((el) => io.observe(el));
}

function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
}

initPreloader();
const destroyStars = initStarfields();
initReveal();
initYear();

window.addEventListener(
  "pagehide",
  () => {
    destroyStars?.();
  },
  { once: true }
);
