/**
 * Lightweight layered starfield for canvas backgrounds.
 * @param {HTMLCanvasElement} canvas
 * @param {{ density?: number; speed?: number }} [options]
 */
function createStarfield(canvas, options = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return { destroy() {} };

  const density = options.density ?? 0.00012;
  const speed = options.speed ?? 0.12;
  let stars = [];
  let raf = 0;
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const parent = canvas.parentElement;
    width = parent ? parent.clientWidth : window.innerWidth;
    height = parent ? parent.clientHeight : window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.floor(width * height * density);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.2 + Math.random() * 0.9,
      s: 0.4 + Math.random() * 1.6,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, width, height);

    const grad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.35,
      0,
      width * 0.5,
      height * 0.35,
      Math.max(width, height) * 0.55
    );
    grad.addColorStop(0, "rgba(80, 140, 255, 0.12)");
    grad.addColorStop(0.35, "rgba(20, 30, 60, 0.08)");
    grad.addColorStop(1, "rgba(5, 5, 8, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    for (const st of stars) {
      st.y += speed * st.z;
      if (st.y > height + 2) {
        st.y = -2;
        st.x = Math.random() * width;
      }
      const twinkle = 0.55 + 0.45 * Math.sin(t * 0.001 + st.tw);
      ctx.fillStyle = `rgba(230, 240, 255, ${0.15 + 0.55 * twinkle * st.z})`;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.s * st.z, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(() => resize());
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  resize();
  raf = requestAnimationFrame(draw);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
    },
  };
}

window.createStarfield = createStarfield;
