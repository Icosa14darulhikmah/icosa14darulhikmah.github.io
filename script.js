let audioCtx;

function playBassTick() {
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();

    const mainOsc = audioCtx.createOscillator();
    const mainGain = audioCtx.createGain();

    const masterGain = audioCtx.createGain();
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

    subGain.gain.setValueAtTime(1.0, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    mainOsc.type = 'triangle';
    mainOsc.frequency.setValueAtTime(90, now);
    mainOsc.frequency.exponentialRampToValueAtTime(25, now + 0.1);

    mainGain.gain.setValueAtTime(0.7, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    masterGain.gain.setValueAtTime(2.5, now);

    subOsc.connect(subGain);
    mainOsc.connect(mainGain);

    subGain.connect(filter);
    mainGain.connect(filter);

    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    subOsc.start(now);
    mainOsc.start(now);

    subOsc.stop(now + 0.13);
    mainOsc.stop(now + 0.13);
}

// Fullscreen helper
function requestFullscreenMode() {
    const el = document.documentElement;
    const fn = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    try {
        const result = fn && fn.call(el);
        if (result && result.catch) result.catch(() => {});
    } catch (err) { /* browser tidak mendukung fullscreen */ }
}

// REALTIME SKY THEME SWITCHER & STAR GENERATOR
function updateSkyTheme() {
    const hour = new Date().getHours();
    const body = document.body;

    body.classList.remove('sky-day', 'sky-sunset', 'sky-night');

    if (hour >= 6 && hour < 16) {
        body.classList.add('sky-day');
    } else if (hour >= 16 && hour < 18) {
        body.classList.add('sky-sunset');
    } else {
        body.classList.add('sky-night');
    }
}

function generateStars() {
    const starsContainer = document.getElementById('stars-container');
    if (!starsContainer) return;
    
    starsContainer.innerHTML = '';
    const starCount = 70;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        const duration = Math.random() * 3 + 1.5;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
}

// Interactive Click to Reveal
const startScreen = document.getElementById('start-screen');
const mainContent = document.getElementById('main-content');
let isStarted = false;

function startExperience() {
    if (isStarted) return;
    isStarted = true;

    startScreen.classList.add('fade-out');
    startScreen.setAttribute('aria-hidden', 'true');
    mainContent.classList.remove('hidden');

    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.resume) audioCtx.resume();
    } catch (err) { audioCtx = null; }

    requestFullscreenMode();
    updateCountdown(); // tick pertama + sinkron lastSecond (tidak dobel)
}

startScreen.addEventListener('click', startExperience);
startScreen.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startExperience();
    }
});
startScreen.focus({ preventScroll: true });

// Target Date Countdown: 16 Desember 2026
const targetDate = new Date('2026-12-16T00:00:00+07:00').getTime();
let lastSecond = -1;
let countdownTimer = null;

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        const cs = document.getElementById('comingSoon');
        if (cs) cs.textContent = "HARI-H TELAH TIBA";
        clearInterval(countdownTimer);
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days < 10 ? `0${days}` : days;
    document.getElementById('hours').innerText = hours < 10 ? `0${hours}` : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? `0${minutes}` : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? `0${seconds}` : seconds;

    if (isStarted && lastSecond !== seconds) {
        if (!document.hidden) playBassTick();
        lastSecond = seconds;
    }
}

// Inisialisasi awal
updateSkyTheme();
generateStars();
setInterval(updateSkyTheme, 60000); // Perbarui status langit tiap menit
countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

// ========================================================
// TOMBOL "WHAT'S ON THE LIST?" + HIGHLIGHT STORY VIEWER
// ========================================================
(() => {
  "use strict";

  /* ============================================================
     EDIT BAGIAN INI
     ASSETS_DIR  : lokasi folder foto, dilihat dari localhost.
                   "/assets/"  -> folder assets ada di root server
                   "../assets/" -> kalau html/css/js ada di subfolder
     PHOTO_FILES : nama file foto, urutan = urutan story.
                   Kosongin ([]) kalau mau otomatis baca isi folder
                   (jalan di server yang nampilin directory listing,
                   mis. `python -m http.server`).
     ============================================================ */
  const ASSETS_DIR = "assets/";
  const PHOTO_FILES = [
  "foto1.jpg",
  "foto2.jpg",
  "foto3.jpg",
  "foto4.jpg",
  "foto5.jpg",
  "foto6.jpg",
  "foto7.jpg",
  "foto8.jpg",
  ];

  const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
  let PHOTOS = [];

  /* ---------- Load photo list ---------- */
  async function loadPhotos() {
    if (PHOTO_FILES.length) return PHOTO_FILES.map((n) => ASSETS_DIR + encodeURIComponent(n));
    try {
      const res = await fetch(ASSETS_DIR);
      const type = res.headers.get("content-type") || "";
      if (res.ok && type.includes("text/html")) {
        const doc = new DOMParser().parseFromString(await res.text(), "text/html");
        const names = [...doc.querySelectorAll("a[href]")]
          .map((a) => decodeURIComponent(a.getAttribute("href").split("?")[0]).split("/").pop())
          .filter((n) => IMAGE_EXT.test(n));
        const unique = [...new Set(names)].sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true })
        );
        return unique.map((n) => ASSETS_DIR + encodeURIComponent(n));
      }
    } catch (err) {
      console.warn("Gagal baca folder:", err);
    }
    return [];
  }

  /* ---------- Elements & state ---------- */
  const $ = (id) => document.getElementById(id);
  const els = {
    openBtn: $("openBtn"), viewer: $("viewer"), bg: $("viewerBg"),
    stage: $("stage"), track: $("track"), dots: $("dots"), error: $("cfError"),
    zoom: $("zoom"), zoomImg: $("zoomImg"), closeBtn: $("closeBtn"),
    prev: $("navPrev"), next: $("navNext"),
  };

  let index = 0, f = 0;
  let isOpen = false, built = false, zoomOpen = false;
  let cards = [], dotEls = [];

  const clamp = (v) => Math.max(0, Math.min(PHOTOS.length - 1, v));
  const step = () => els.track.offsetWidth * 0.45; // jarak drag (px) per poster

  /* ---------- Coverflow layout ----------
     pos = posisi (boleh pecahan saat drag). d = jarak tiap poster ke tengah. */
  function place(pos) {
    cards.forEach((c, i) => {
      const d = i - pos, a = Math.abs(d), s = Math.sign(d), t = Math.min(a, 1);
      const x = s * (a < 1 ? t * 58 : 58 + (a - 1) * 20);
      c.style.transform =
        "translateX(" + x + "%) translateZ(" + -Math.min(a, 3) * 90 + "px) rotateY(" +
        -s * t * 52 + "deg) scale(" + (1 - t * 0.12) + ")";
      c.style.zIndex = Math.round(1000 - a * 10);
      c.style.opacity = a > 3.2 ? 0 : 1 - Math.max(0, a - 1) * 0.28;
      c.style.filter = "brightness(" + (1 - t * 0.45) + ")";
      c.style.pointerEvents = a > 3 ? "none" : "auto";
    });
  }

  function go(i) {
    index = clamp(i);
    f = index;
    place(f);
    dotEls.forEach((d, k) => d.classList.toggle("on", k === index));
    cards.forEach((c, k) => c.classList.toggle("active", k === index));
    els.bg.style.backgroundImage = 'url("' + PHOTOS[index] + '")';
    els.prev.disabled = index === 0;
    els.next.disabled = index === PHOTOS.length - 1;
  }

  function build() {
    els.track.innerHTML = "";
    els.dots.innerHTML = "";
    cards = PHOTOS.map((src, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cf-card";
      b.dataset.i = i;
      b.setAttribute("aria-label", "Poster " + (i + 1) + " dari " + PHOTOS.length);
      const im = new Image();
      im.src = src; im.alt = ""; im.draggable = false;
      b.appendChild(im);
      els.track.appendChild(b);
      return b;
    });
    dotEls = PHOTOS.map((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.setAttribute("aria-label", "Poster " + (i + 1));
      d.addEventListener("click", () => go(i));
      els.dots.appendChild(d);
      return d;
    });
    built = true;
  }

  /* ---------- Zoom ---------- */
  function openZoom() {
    els.zoomImg.src = PHOTOS[index];
    els.zoom.hidden = false;
    zoomOpen = true;
  }
  function closeZoom() {
    els.zoom.hidden = true;
    zoomOpen = false;
  }
  els.zoom.addEventListener("click", closeZoom);

  /* ---------- Open / close ---------- */
  async function open() {
    if (isOpen) return;
    isOpen = true;
    els.error.hidden = true;
    els.viewer.classList.add("open");
    els.viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
    els.viewer.focus({ preventScroll: true });

    if (!PHOTOS.length) PHOTOS = await loadPhotos();
    if (!isOpen) return;

    if (!PHOTOS.length) {
      els.stage.hidden = true;
      els.error.textContent = "Belum ada poster.\nIsi PHOTO_FILES di script.js, atau pastikan folder " + ASSETS_DIR + " bisa diakses.";
      els.error.hidden = false;
      return;
    }
    els.stage.hidden = false;
    if (!built) build();
    go(0);
  }

  function close() {
    closeZoom();
    isOpen = false;
    els.viewer.classList.remove("open");
    els.viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
    els.openBtn.focus({ preventScroll: true });
  }

  /* ---------- Drag / swipe / tap ---------- */
  let sx = 0, sf = 0, lx = 0, lt = 0, vx = 0, moved = false;

  function onMove(e) {
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 6) moved = true;
    if (!moved) return;
    const dt = e.timeStamp - lt || 1;
    vx = (e.clientX - lx) / dt;
    lx = e.clientX; lt = e.timeStamp;
    f = Math.max(0, Math.min(PHOTOS.length - 1, sf - dx / step()));
    place(f);
  }

  function onUp(e) {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    els.stage.classList.remove("dragging");
    if (moved) { go(Math.round(f - (vx * 160) / step())); return; } // lepas = snap, ada momentum
    if (e.type === "pointercancel") return;
    const c = e.target.closest && e.target.closest(".cf-card");
    if (c) { const i = +c.dataset.i; i === index ? openZoom() : go(i); }
  }

  els.stage.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    moved = false; vx = 0;
    sx = lx = e.clientX; sf = f; lt = e.timeStamp;
    els.stage.classList.add("dragging");
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  });

  // Enter / Space pada poster (keyboard) -> event click dengan detail 0
  els.track.addEventListener("click", (e) => {
    if (e.detail !== 0) return;
    const c = e.target.closest(".cf-card");
    if (!c) return;
    const i = +c.dataset.i;
    i === index ? openZoom() : go(i);
  });

  // trackpad / scroll wheel
  let wheelLock = 0;
  els.stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const now = Date.now();
    if (Math.abs(d) < 8 || now - wheelLock < 250) return;
    wheelLock = now;
    go(index + (d > 0 ? 1 : -1));
  }, { passive: false });

  /* ---------- Buttons & keyboard ---------- */
  els.openBtn.addEventListener("click", open);
  els.closeBtn.addEventListener("click", close);
  els.prev.addEventListener("click", () => go(index - 1));
  els.next.addEventListener("click", () => go(index + 1));
  els.viewer.addEventListener("click", (e) => {
    if (e.target === els.viewer || e.target === els.bg) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") zoomOpen ? closeZoom() : close();
    else if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
  });
})();
