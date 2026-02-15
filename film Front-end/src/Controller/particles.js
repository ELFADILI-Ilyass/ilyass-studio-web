// src/Controller/particles.js
const canvas = document.getElementById("heroParticles");
if (!canvas) throw new Error("heroParticles canvas not found");

const ctx = canvas.getContext("2d");
let w, h, dpr;

function resize() {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

const rand = (min, max) => Math.random() * (max - min) + min;

// ✅ Particles only in top-right corner
const DOTS = [];
const DOT_COUNT = 60; // Reduced count for corner only

for (let i = 0; i < DOT_COUNT; i++) {
  DOTS.push({
    // Spawn only in top-right quarter of screen
    x: rand(w * 0.65, w),
    y: rand(0, h * 0.35),
    r: rand(0.8, 2.2),
    vx: rand(-0.12, 0.12),
    vy: rand(-0.3, -0.05),
    a: rand(0.3, 0.9),
    tw: rand(0.002, 0.012),
    t: rand(0, Math.PI * 2),
  });
}

function step() {
  ctx.clearRect(0, 0, w, h);

  // Subtle glow only in top-right
  const gx = w * 0.85;
  const gy = h * 0.15;
  const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.4);
  g.addColorStop(0, "rgba(120,190,255,0.08)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Draw particles
  for (const p of DOTS) {
    p.x += p.vx;
    p.y += p.vy;

    // Twinkle effect
    p.t += p.tw;
    const alpha = p.a * (0.6 + 0.4 * Math.sin(p.t));

    // Keep particles in top-right area
    if (p.y < -10) {
      p.y = h * 0.35 + 10;
      p.x = rand(w * 0.65, w);
    }
    if (p.x < w * 0.65 - 10) p.x = w + 10;
    if (p.x > w + 10) p.x = w * 0.65;
    if (p.y > h * 0.35) p.y = -10;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,230,255,${alpha})`;
    ctx.fill();
  }

  requestAnimationFrame(step);
}
step();
