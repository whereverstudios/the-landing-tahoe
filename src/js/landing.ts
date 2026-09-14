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
  syncHeroVideo();
  if (persist) {
    try {
      localStorage.setItem("landing-season", season);
    } catch {
      /* private mode */
    }
  }
}

let seasonChosen = false; // true once the visitor picked, or a saved choice was applied

function initSeason() {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem("landing-season");
  } catch {
    /* ignore */
  }
  const month = new Date().getMonth();
  const auto: Season = month >= 10 || month <= 2 ? "winter" : "summer";
  seasonChosen = saved === "winter" || saved === "summer";
  setSeason(seasonChosen ? (saved as Season) : auto, false);
  document.querySelectorAll<HTMLButtonElement>("[data-season-btn]").forEach((b) => {
    b.addEventListener("click", () => {
      seasonChosen = true;
      setSeason(b.getAttribute("data-season-btn") as Season, true);
    });
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

/**
 * Shoreline map of the south shore around The Landing, drawn to a rough scale
 * (map width ≈ 1.4 mi, north up). Water to the north, Lakeshore Blvd along the
 * shore, the CA/NV line and Heavenly Village to the east and south-east, the
 * Sierra rising to the south. Contours are illustrative, not survey data.
 */
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
  const tok = (n: string, fb: string) => cs.getPropertyValue(n).trim() || fb;
  const line = tok("--line-strong", "#9fb0aa"), cobalt = tok("--cobalt", "#1d5a8e");
  const surface = tok("--surface", "#fafbfa"), ink = tok("--ink", "#0b2437"), muted = tok("--muted-text", "#5b6e7c");
  const mono = `${cs.getPropertyValue("--font-mono").trim() || "IBM Plex Mono, monospace"}`;
  ctx.fillStyle = surface;
  ctx.fillRect(0, 0, W, H);

  // Scale: 1.4 miles across. The Landing sits at 45% across, on the shore.
  const MILE = W / 1.4;
  const PIN_X = W * 0.45;

  let seed = 1897;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const GN = 9, lat: number[] = [];
  for (let i = 0; i < GN * GN; i++) lat.push(rnd());
  const sm = (t: number) => t * t * (3 - 2 * t);
  const g = (a: number, b: number) => lat[(((a % GN) + GN) % GN) + (((b % GN) + GN) % GN) * GN];
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
    return (g(xi, yi) * (1 - xf) + g(xi + 1, yi) * xf) * (1 - yf) + (g(xi, yi + 1) * (1 - xf) + g(xi + 1, yi + 1) * xf) * yf;
  };
  // Shoreline runs east–west across the upper part of the map, bowing gently (south shore of the lake).
  const shoreY = (x: number) => H * 0.40 - Math.cos(((x / W) - 0.5) * Math.PI) * H * 0.06 + noise(x / 120, 3.3) * 10;
  const PIN_Y = shoreY(PIN_X) + 12;

  // Elevation field: below sea level of the lake north of the shore, rising to the south with texture.
  const cell = 8, nx = Math.ceil(W / cell) + 1, ny = Math.ceil(H / cell) + 1;
  const f = new Float32Array(nx * ny);
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
    const px = x * cell, py = y * cell;
    const d = (py - shoreY(px)) / H; // negative = water
    const n = noise(px / 160 + 7, py / 160 + 7) * 0.5 + noise(px / 70 + 2, py / 70 + 2) * 0.25;
    f[y * nx + x] = d < 0 ? d * 1.6 - n * 0.12 : d * 1.35 + n * 0.32 * Math.min(1, d * 4) + Math.max(0, d - 0.45) * 0.9;
  }
  const march = (lv: number) => {
    const T: Record<number, number[]> = { 1: [3, 2], 2: [2, 1], 3: [3, 1], 4: [0, 1], 5: [0, 3, 2, 1], 6: [0, 2], 7: [0, 3], 8: [0, 3], 9: [0, 2], 10: [0, 1, 2, 3], 11: [0, 1], 12: [3, 1], 13: [2, 1], 14: [3, 2] };
    ctx.beginPath();
    for (let y = 0; y < ny - 1; y++) for (let x = 0; x < nx - 1; x++) {
      const a = f[y * nx + x], b = f[y * nx + x + 1], c = f[(y + 1) * nx + x + 1], d = f[(y + 1) * nx + x];
      const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const X = x * cell, Y = y * cell;
      const L = (p: number, q: number, v0: number, v1: number) => p + (q - p) * ((lv - v0) / (v1 - v0));
      const pts = [[L(X, X + cell, a, b), Y], [X + cell, L(Y, Y + cell, b, c)], [L(X, X + cell, d, c), Y + cell], [X, L(Y, Y + cell, a, d)]];
      const sg = T[idx];
      for (let s = 0; s < sg.length; s += 2) { ctx.moveTo(pts[sg[s]][0], pts[sg[s]][1]); ctx.lineTo(pts[sg[s + 1]][0], pts[sg[s + 1]][1]); }
    }
    ctx.stroke();
  };

  // Water
  ctx.globalAlpha = 0.14; ctx.fillStyle = cobalt;
  for (let y = 0; y < ny - 1; y++) for (let x = 0; x < nx - 1; x++) if (f[y * nx + x] < 0) ctx.fillRect(x * cell, y * cell, cell, cell);
  ctx.globalAlpha = 1; ctx.lineWidth = 1; ctx.lineJoin = "round";
  // Bathymetry: Tahoe drops off fast, so a few tight lines just offshore.
  ctx.strokeStyle = cobalt;
  [-0.07, -0.16, -0.27, -0.4].forEach((lv, i) => { ctx.globalAlpha = i === 0 ? 0.5 : 0.28; march(lv); });
  // Shoreline
  ctx.globalAlpha = 0.9; ctx.strokeStyle = cobalt; ctx.lineWidth = 1.5; march(0);
  // Land contours
  ctx.lineWidth = 1; ctx.strokeStyle = line;
  for (let i = 1; i <= 26; i++) { ctx.globalAlpha = i % 5 === 0 ? 0.85 : 0.42; march(i * 0.045); }
  ctx.globalAlpha = 1;

  // Roads: Lakeshore Blvd hugs the shore; US-50 runs east–west further south.
  const road = (fn: (x: number) => number, dash: number[], alpha: number, w: number) => {
    ctx.save(); ctx.setLineDash(dash); ctx.strokeStyle = ink; ctx.globalAlpha = alpha; ctx.lineWidth = w; ctx.beginPath();
    for (let x = 0; x <= W; x += 6) { const y = fn(x); x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke(); ctx.restore();
  };
  road((x) => shoreY(x) + 26 + Math.sin(x / 140) * 4, [6, 5], 0.55, 1.2);
  road((x) => shoreY(x) + MILE * 0.28 + Math.sin(x / 220) * 6, [], 0.35, 2);
  // State line, half a mile east of the resort.
  const NV_X = PIN_X + MILE * 0.5;
  ctx.save(); ctx.setLineDash([2, 6]); ctx.strokeStyle = ink; ctx.globalAlpha = 0.6; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(NV_X, 0); ctx.lineTo(NV_X, H); ctx.stroke(); ctx.restore();

  // Labels
  const label = (t: string, x: number, y: number, align: CanvasTextAlign = "left", color = muted, size = 10) => {
    ctx.save(); ctx.font = `500 ${size}px ${mono}`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "middle";
    ctx.letterSpacing = "0.1em"; ctx.fillText(t.toUpperCase(), x, y); ctx.restore();
  };
  const dot = (x: number, y: number) => { ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); };
  label("Lake Tahoe", W * 0.5, H * 0.14, "center", cobalt, 11);
  label("CA", NV_X - 8, H * 0.93, "right"); label("NV", NV_X + 8, H * 0.93, "left");
  label("Lakeshore Blvd", W * 0.06, shoreY(W * 0.06) + 40);
  label("US-50", W * 0.06, shoreY(W * 0.06) + MILE * 0.28 + 14);
  const beachX = PIN_X - MILE * 0.16; dot(beachX, shoreY(beachX) + 6); label("Lakeside Beach & Marina", beachX - 8, shoreY(beachX) - 12, "right");
  const hvX = PIN_X + MILE * 0.36, hvY = shoreY(hvX) + MILE * 0.26; dot(hvX, hvY); label("Heavenly Village", hvX + 10, hvY);
  const gX = hvX + MILE * 0.08, gY = hvY + MILE * 0.11; dot(gX, gY); label("Gondola", gX + 10, gY);
  // North arrow + scale bar
  ctx.save(); ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.2;
  const ax = W - 28, ay = 22; ctx.beginPath(); ctx.moveTo(ax, ay + 22); ctx.lineTo(ax, ay); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ax, ay - 2); ctx.lineTo(ax - 4, ay + 6); ctx.lineTo(ax + 4, ay + 6); ctx.closePath(); ctx.fill();
  label("N", ax, ay + 34, "center", ink);
  const sx = W - 28 - MILE * 0.25, sy = H - 18; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + MILE * 0.25, sy); ctx.moveTo(sx, sy - 4); ctx.lineTo(sx, sy + 4); ctx.moveTo(sx + MILE * 0.25, sy - 4); ctx.lineTo(sx + MILE * 0.25, sy + 4); ctx.stroke();
  label("¼ mile", sx + MILE * 0.125, sy - 12, "center", ink);
  ctx.restore();

  // Place the HTML pin on the shoreline.
  const pin = canvas.parentElement!.querySelector<HTMLElement>(".pin");
  if (pin) { pin.style.left = `${(PIN_X / W) * 100}%`; pin.style.top = `${(PIN_Y / H) * 100}%`; }
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


/* ---------- Hero video ---------- */
function videoAllowed(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 768) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  return true;
}

let videoPaused = false;
function syncHeroVideo() {
  const media = document.querySelector<HTMLElement>(".hero-media");
  if (!media) return;
  const season = document.body.getAttribute("data-season");
  const toggle = document.querySelector<HTMLButtonElement>("[data-motion-toggle]");
  if (!videoAllowed()) {
    media.querySelectorAll("video").forEach((v) => v.pause());
    if (toggle) toggle.hidden = true;
    return;
  }
  if (toggle) toggle.hidden = false;
  media.classList.toggle("video-paused", videoPaused);
  media.querySelectorAll<HTMLVideoElement>("video[data-season-video], video[data-page-video]").forEach((v) => {
    const active = v.hasAttribute("data-page-video") || v.getAttribute("data-season-video") === season;
    v.classList.toggle("is-active", active);
    if (active && !videoPaused) {
      v.muted = true; // the property, not just the attribute: required for autoplay in every browser
      v.defaultMuted = true;
      if (!v.getAttribute("src")) {
        // 1080p on large screens, 720p elsewhere (5 MB vs 2.5 MB per loop)
        const hd = window.innerWidth >= 1400 && (window.devicePixelRatio || 1) >= 1;
        v.src = (hd ? v.getAttribute("data-src") : v.getAttribute("data-src-sd")) ?? "";
        v.addEventListener(
          "canplay",
          () => {
            v.classList.add("is-ready");
            if (v.classList.contains("is-active") && !videoPaused) v.play().catch(() => {});
          },
          { once: true },
        );
        v.load();
      }
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  });
}

function initHeroVideo() {
  const toggle = document.querySelector<HTMLButtonElement>("[data-motion-toggle]");
  if (toggle) {
    toggle.addEventListener("click", () => {
      videoPaused = !videoPaused;
      toggle.setAttribute("aria-pressed", String(!videoPaused));
      syncHeroVideo();
    });
  }
  window.addEventListener("resize", syncHeroVideo, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncHeroVideo();
  });
  syncHeroVideo();
}

/* ---------- Live conditions (Open-Meteo) ---------- */
const ICONS: Record<string, string> = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M7 18a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 8a4.5 4.5 0 0 1-.5 9z"/></svg>',
  rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M7 15a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 5a4.5 4.5 0 0 1-.5 9"/><path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3"/></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M12 3l-2 2M12 3l2 2M12 21l-2-2M12 21l2-2"/></svg>',
  fog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 9h16M4 13h12M4 17h16"/></svg>',
  storm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14a4 4 0 0 1-.6-7.95A6 6 0 0 1 18 4a4.5 4.5 0 0 1-.5 9"/><path d="M13 12l-2 4h3l-2 4"/></svg>',
};

function describe(code: number): { text: string; icon: string } {
  if (code === 0) return { text: "Clear sky", icon: "sun" };
  if (code === 1) return { text: "Mostly clear", icon: "sun" };
  if (code === 2) return { text: "Partly cloudy", icon: "cloud" };
  if (code === 3) return { text: "Overcast", icon: "cloud" };
  if (code === 45 || code === 48) return { text: "Fog on the lake", icon: "fog" };
  if (code >= 51 && code <= 57) return { text: "Drizzle", icon: "rain" };
  if (code >= 61 && code <= 67) return { text: "Rain", icon: "rain" };
  if (code >= 71 && code <= 77) return { text: "Snow", icon: "snow" };
  if (code >= 80 && code <= 82) return { text: "Rain showers", icon: "rain" };
  if (code === 85 || code === 86) return { text: "Snow showers", icon: "snow" };
  if (code >= 95) return { text: "Thunderstorms", icon: "storm" };
  return { text: "Changing skies", icon: "cloud" };
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Los_Angeles" });
}

function untilText(target: Date, now: Date) {
  const mins = Math.round((target.getTime() - now.getTime()) / 60000);
  if (mins <= 0) return null;
  const h = Math.floor(mins / 60), m = mins % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}

async function initConditions() {
  const root = document.getElementById("conditions");
  if (!root) return;
  const lat = root.getAttribute("data-lat"), lon = root.getAttribute("data-lon");
  const q = (k: string) => root.querySelector<HTMLElement>(`[data-cond="${k}"]`);
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,snow_depth` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,snowfall_sum` +
    `&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FLos_Angeles&forecast_days=4`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const c = data.current, d = data.daily;
    const now = describe(c.weather_code);
    q("temp")!.textContent = String(Math.round(c.temperature_2m));
    q("feels")!.textContent = String(Math.round(c.apparent_temperature));
    q("wind")!.textContent = String(Math.round(c.wind_speed_10m));
    q("desc")!.textContent = now.text;
    q("icon")!.innerHTML = ICONS[now.icon];
    const snowIn = (c.snow_depth ?? 0) * 39.37;
    q("snow")!.textContent = snowIn >= 0.5 ? `${Math.round(snowIn)} in` : "None";
    q("updated")!.textContent = `updated ${fmtTime(c.time)}`;

    const nowDate = new Date();
    const sunrise = new Date(d.sunrise[0]), sunset = new Date(d.sunset[0]);
    const toSunset = untilText(sunset, nowDate);
    const toSunrise = untilText(sunrise, nowDate);
    let sun = `Sunrise ${fmtTime(d.sunrise[0])} · Sunset ${fmtTime(d.sunset[0])}`;
    if (toSunset) sun += ` · Rooftop sunset in ${toSunset}`;
    else if (toSunrise) sun += ` · First light in ${toSunrise}`;
    else if (d.sunrise[1]) sun += ` · First light ${fmtTime(d.sunrise[1])} tomorrow`;
    q("sunline")!.textContent = sun;

    const days = q("days")!;
    days.innerHTML = "";
    for (let i = 1; i <= 3; i++) {
      const w = describe(d.weather_code[i]);
      const day = new Date(`${d.time[i]}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" });
      const snow = d.snowfall_sum[i] >= 0.5 ? `<span class="sn">+${Math.round(d.snowfall_sum[i])} in snow</span>` : "";
      days.insertAdjacentHTML(
        "beforeend",
        `<li><span class="d">${day}</span><span class="hi">${Math.round(d.temperature_2m_max[i])}°<small>/ ${Math.round(d.temperature_2m_min[i])}°</small></span><span class="w">${ICONS[w.icon]}${w.text}</span>${snow}</li>`,
      );
    }
    root.setAttribute("data-state", "ready");

    // Let real snow decide the default season when the visitor hasn't chosen one.
    if (!seasonChosen) {
      const snowyWeek = snowIn >= 1 || d.snowfall_sum.slice(0, 4).some((v: number) => v >= 1);
      const month = nowDate.getMonth();
      const shoulder = month >= 9 || month <= 3; // Oct–Apr can go either way
      if (snowyWeek && shoulder) setSeason("winter", false);
    }
  } catch {
    root.setAttribute("data-state", "error");
    q("updated")!.textContent = "live conditions unavailable right now";
  }
}

function init() {
  initSeason();
  initBooking();
  initMenu();
  initRail();
  initReveal();
  initTopo();
  initHeroVideo();
  initConditions();
}

document.addEventListener("astro:page-load", init);
