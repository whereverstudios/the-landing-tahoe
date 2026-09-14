/**
 * Client behaviour for The Landing. Everything re-initialises on `astro:page-load`
 * so it survives view-transition navigation.
 */

type Season = "summer" | "winter";

function setSeason(season: Season, persist: boolean) {
  document.body.setAttribute("data-season", season);
  document.querySelectorAll<HTMLButtonElement>("[data-season-btn]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.getAttribute("data-season-btn") === season));
  });
  document.querySelectorAll<HTMLElement>(".season-word").forEach((el) => {
    el.textContent = el.getAttribute(`data-${season}`) ?? el.textContent;
  });
  if (persist) {
    try {
      localStorage.setItem("landing-season", season);
    } catch {
      /* private mode */
    }
  }
}

function initSeason() {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem("landing-season");
  } catch {
    /* ignore */
  }
  const month = new Date().getMonth();
  const auto: Season = month >= 10 || month <= 2 ? "winter" : "summer";
  setSeason(saved === "winter" || saved === "summer" ? saved : auto, false);
  document.querySelectorAll<HTMLButtonElement>("[data-season-btn]").forEach((b) => {
    b.addEventListener("click", () => setSeason(b.getAttribute("data-season-btn") as Season, true));
  });
}

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function initBooking() {
  const si = document.getElementById("startDate") as HTMLInputElement | null;
  const ei = document.getElementById("endDate") as HTMLInputElement | null;
  if (!si || !ei) return;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const start = new Date(today);
  const add = (5 - start.getDay() + 7) % 7 || 7; // next Friday
  start.setDate(start.getDate() + add);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);
  si.min = iso(today);
  si.value = iso(start);
  ei.min = iso(start);
  ei.value = iso(end);
  si.addEventListener("change", () => {
    const s = new Date(`${si.value}T12:00:00`);
    if (isNaN(s.getTime())) return;
    const e = new Date(s);
    e.setDate(e.getDate() + 1);
    ei.min = iso(e);
    if (!ei.value || new Date(`${ei.value}T12:00:00`) <= s) ei.value = iso(e);
  });
}

function initMenu() {
  const mb = document.querySelector<HTMLButtonElement>(".menu-btn");
  const mm = document.getElementById("mobile-menu");
  if (!mb || !mm) return;
  mb.addEventListener("click", () => {
    const open = mm.getAttribute("data-open") !== "true";
    mm.setAttribute("data-open", String(open));
    mb.setAttribute("aria-expanded", String(open));
  });
  mm.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).tagName === "A") {
      mm.setAttribute("data-open", "false");
      mb.setAttribute("aria-expanded", "false");
    }
  });
}

function initRail() {
  const rail = document.getElementById("rail");
  if (!rail) return;
  document.querySelectorAll<HTMLButtonElement>("[data-rail]").forEach((b) => {
    b.addEventListener("click", () => {
      const card = rail.querySelector<HTMLElement>(".room");
      const step = card ? card.getBoundingClientRect().width + 20 : 400;
      rail.scrollBy({ left: step * Number(b.getAttribute("data-rail")), behavior: "smooth" });
    });
  });
}

function initReveal() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.remove("pre");
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  const pending = new Set<HTMLElement>();
  document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add("pre");
      pending.add(el);
      io.observe(el);
    }
  });
  // Safety net: anything scrolled past between frames (fast wheel, keyboard End) is revealed too.
  let raf = 0;
  const sweep = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.remove("pre");
          io.unobserve(el);
          pending.delete(el);
        }
      });
      if (pending.size === 0) window.removeEventListener("scroll", sweep);
    });
  };
  window.addEventListener("scroll", sweep, { passive: true });
}

/** Topographic contours: marching squares over seeded lattice noise. */
function drawTopo(canvas: HTMLCanvasElement) {
  const box = canvas.parentElement!.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = Math.max(1, Math.floor(box.width));
  const H = Math.max(1, Math.floor(box.height));
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cs = getComputedStyle(document.documentElement);
  const line = cs.getPropertyValue("--line-strong").trim() || "#9fb0aa";
  const cobalt = cs.getPropertyValue("--cobalt").trim() || "#1d5a8e";
  const surface = cs.getPropertyValue("--surface").trim() || "#fafbfa";
  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, W, H);

  let seed = 1897;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const GN = 9;
  const lat: number[] = [];
  for (let i = 0; i < GN * GN; i++) lat.push(rnd());
  const sm = (t: number) => t * t * (3 - 2 * t);
  const g = (a: number, b: number) => lat[(((a % GN) + GN) % GN) + (((b % GN) + GN) % GN) * GN];
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
    const v00 = g(xi, yi), v10 = g(xi + 1, yi), v01 = g(xi, yi + 1), v11 = g(xi + 1, yi + 1);
    return (v00 * (1 - xf) + v10 * xf) * (1 - yf) + (v01 * (1 - xf) + v11 * xf) * yf;
  };
  const cell = 8;
  const nx = Math.ceil(W / cell) + 1, ny = Math.ceil(H / cell) + 1;
  const f = new Float32Array(nx * ny);
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const px = x / nx, py = y / ny;
      const n = noise(px * 3.2, py * 3.2) * 0.6 + noise(px * 7 + 3, py * 7 + 3) * 0.28 + noise(px * 15 + 9, py * 15 + 9) * 0.12;
      const basin = Math.exp(-(((px - 0.78) * (px - 0.78)) / 0.06 + ((py - 0.52) * (py - 0.52)) / 0.11));
      f[y * nx + x] = n * 0.75 + (1 - px) * 0.3 - basin * 0.55;
    }
  }
  ctx.lineWidth = 1;
  ctx.lineJoin = "round";
  const levels: number[] = [];
  for (let L = -0.1; L <= 0.95; L += 0.045) levels.push(L);
  const segTable: Record<number, number[]> = {
    1: [3, 2], 2: [2, 1], 3: [3, 1], 4: [0, 1], 5: [0, 3, 2, 1], 6: [0, 2], 7: [0, 3],
    8: [0, 3], 9: [0, 2], 10: [0, 1, 2, 3], 11: [0, 1], 12: [3, 1], 13: [2, 1], 14: [3, 2],
  };
  levels.forEach((lv, li) => {
    ctx.strokeStyle = line;
    ctx.globalAlpha = li % 5 === 0 ? 0.9 : 0.45;
    ctx.beginPath();
    for (let y = 0; y < ny - 1; y++) {
      for (let x = 0; x < nx - 1; x++) {
        const a = f[y * nx + x], b = f[y * nx + x + 1], c = f[(y + 1) * nx + x + 1], d = f[(y + 1) * nx + x];
        const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const X = x * cell, Y = y * cell;
        const lerp = (p: number, q: number, v0: number, v1: number) => p + (q - p) * ((lv - v0) / (v1 - v0));
        const pts = [
          [lerp(X, X + cell, a, b), Y],
          [X + cell, lerp(Y, Y + cell, b, c)],
          [lerp(X, X + cell, d, c), Y + cell],
          [X, lerp(Y, Y + cell, a, d)],
        ];
        const segs = segTable[idx];
        for (let s = 0; s < segs.length; s += 2) {
          ctx.moveTo(pts[segs[s]][0], pts[segs[s]][1]);
          ctx.lineTo(pts[segs[s + 1]][0], pts[segs[s + 1]][1]);
        }
      }
    }
    ctx.stroke();
  });
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = cobalt;
  for (let y = 0; y < ny - 1; y++) {
    for (let x = 0; x < nx - 1; x++) {
      if (f[y * nx + x] < -0.02) ctx.fillRect(x * cell, y * cell, cell, cell);
    }
  }
  ctx.globalAlpha = 1;
}

let topoCleanup: (() => void) | null = null;
function initTopo() {
  topoCleanup?.();
  const canvas = document.getElementById("topo") as HTMLCanvasElement | null;
  if (!canvas) return;
  let raf = 0;
  const queue = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => drawTopo(canvas));
  };
  queue();
  window.addEventListener("resize", queue);
  const mo = new MutationObserver(queue);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  topoCleanup = () => {
    window.removeEventListener("resize", queue);
    mo.disconnect();
  };
}

function init() {
  initSeason();
  initBooking();
  initMenu();
  initRail();
  initReveal();
  initTopo();
}

document.addEventListener("astro:page-load", init);
