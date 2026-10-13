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
    const docElm = document.documentElement;

    if (docElm.requestFullscreen) {
        docElm.requestFullscreen().catch(err => console.log(err));
    } else if (docElm.webkitRequestFullscreen) {
        docElm.webkitRequestFullscreen().catch(err => console.log(err));
    } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen().catch(err => console.log(err));
    }
}

// REALTIME SKY THEME SWITCHER & STAR GENERATOR
function updateSkyTheme() {
    const hour = new Date().getHours();
    const body = document.body;

    body.classList.remove('sky-day', 'sky-sunset', 'sky-night');

    if (hour >= 6 && hour < 15) {
        body.classList.add('sky-day');
    } else if (hour >= 15 && hour < 18) {
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

document.body.addEventListener('click', () => {
    if (!isStarted) {
        isStarted = true;
        
        requestFullscreenMode();
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        startScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');

        playBassTick();
    }
});

// Target Date Countdown: 16 Desember 2026
const targetDate = new Date('2026-12-16T00:00:00').getTime();
let lastSecond = -1;

function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
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
        playBassTick();
        lastSecond = seconds;
    }
}

// Inisialisasi awal
updateSkyTheme();
generateStars();
setInterval(updateSkyTheme, 60000); // Perbarui status langit tiap menit
setInterval(updateCountdown, 1000);
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
  "foto2.png",
  "foto3.jpg",
  "foto4.jpg",
  "foto5.jpg",
  "foto6.jpg",
  "foto7.jpg",
  "foto8.jpg",
  ];

  const FADE_MS = 250;     // lama fade out / fade in antar story (ms)
  const MAX_ZOOM = 4;      // zoom maksimal saat pinch
  const DURATION = 5000;   // lama tiap story (ms)
  const HOLD_DELAY = 200;  // tahan berapa lama dianggap "hold" (ms)

  const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;
  let PHOTOS = [];

  /* ---------- Elements ---------- */
  const $ = (id) => document.getElementById(id);
  const els = {
    openBtn: $("openBtn"),
    viewer: $("viewer"),
    viewerBg: $("viewerBg"),
    story: $("story"),
    media: $("media"),
    bg: $("storyBg"),
    img: $("storyImg"),
    bars: $("bars"),
    avatar: $("avatar"),
    pauseBtn: $("pauseBtn"),
    closeBtn: $("closeBtn"),
    zonePrev: $("zonePrev"),
    zoneNext: $("zoneNext"),
    error: $("storyError"),
    navPrev: $("navPrev"),
    navNext: $("navNext"),
  };

  const ICON_PAUSE =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  const ICON_PLAY =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

  document.documentElement.style.setProperty("--fade", FADE_MS + "ms");

  /* ---------- State ---------- */
  let index = 0;
  let elapsed = 0;
  let last = null;
  let raf = null;
  let loaded = false;
  let isOpen = false;
  let manualPaused = false;
  let holding = false;
  let loadToken = 0;
  let holdTimer = null;
  let fills = [];
  let anyLoaded = false;
  let hasImage = false;
  let zooming = false;
  let suppressTap = false;
  let wheelTimer = null;
  const pointers = new Map();
  let firstFailed = "";

  /* ---------- Load photo list ---------- */
  async function loadPhotos() {
    if (PHOTO_FILES.length) return PHOTO_FILES.map((n) => ASSETS_DIR + n);
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

  function showError(msg) {
    els.error.textContent = msg;
    els.error.hidden = false;
    els.media.style.visibility = "hidden";
  }

  function hideError() {
    els.error.hidden = true;
    els.media.style.visibility = "";
  }

  /* ---------- Progress bars ---------- */
  function buildBars() {
    els.bars.innerHTML = "";
    fills = PHOTOS.map(() => {
      const bar = document.createElement("div");
      bar.className = "bar";
      const fill = document.createElement("i");
      bar.appendChild(fill);
      els.bars.appendChild(bar);
      return fill;
    });
  }

  function setProgress(p) {
    fills.forEach((fill, i) => {
      const v = i < index ? 1 : i === index ? Math.min(p, 1) : 0;
      fill.style.transform = "scaleX(" + v + ")";
    });
  }

  /* ---------- Showing a story ---------- */
  function show(i) {
    index = i;
    elapsed = 0;
    loaded = false;
    const token = ++loadToken;
    const src = PHOTOS[i];

    resetZoom();
    setProgress(0);
    els.navPrev.classList.toggle("is-hidden", i === 0);
    els.navNext.classList.toggle("is-hidden", i === PHOTOS.length - 1);

    // 1) story sebelumnya fade out
    els.media.classList.remove("ready");
    const fadeOut = new Promise((r) => setTimeout(r, hasImage ? FADE_MS : 0));

    // 2) sambil nunggu, foto berikutnya di-load
    const probe = new Image();
    const imageReady = new Promise((resolve, reject) => {
      probe.onload = resolve;
      probe.onerror = reject;
    });
    probe.src = src;

    // 3) setelah dua-duanya selesai, ganti foto lalu fade in
    Promise.all([imageReady, fadeOut])
      .then(() => {
        if (token !== loadToken) return;
        const cover = probe.naturalWidth / probe.naturalHeight < 0.6; // foto tinggi -> penuhi layar
        els.media.classList.toggle("is-cover", cover);
        els.img.classList.toggle("cover", cover);
        els.img.src = src;
        els.bg.src = src;
        els.viewerBg.style.backgroundImage = 'url("' + src + '")';
        hasImage = true;
        anyLoaded = true;
        requestAnimationFrame(() => els.media.classList.add("ready"));
        loaded = true; // timer baru jalan setelah foto siap
      })
      .catch(() => {
        if (token !== loadToken) return;
        console.warn("Foto tidak ditemukan:", src);
        if (!firstFailed) firstFailed = src;
        if (!anyLoaded && index === PHOTOS.length - 1) {
          showError("Foto nggak bisa dimuat.\nCoba buka langsung di browser:\n" + firstFailed);
          return;
        }
        next();
      });

    if (PHOTOS[i + 1]) new Image().src = PHOTOS[i + 1]; // preload berikutnya
  }

  function next() {
    if (index < PHOTOS.length - 1) show(index + 1);
    else close();
  }

  function prev() {
    show(index > 0 ? index - 1 : 0);
  }

  /* ---------- Playback loop ---------- */
  function isRunning() {
    return isOpen && loaded && !manualPaused && !holding && !zooming;
  }

  function loop(ts) {
    raf = requestAnimationFrame(loop);
    if (last === null) { last = ts; return; }
    const dt = Math.min(ts - last, 100);
    last = ts;
    if (!isRunning()) return;
    elapsed += dt;
    setProgress(elapsed / DURATION);
    if (elapsed >= DURATION) next();
  }

  /* ---------- Open / close ---------- */
  async function open() {
    if (isOpen) return;
    isOpen = true;
    manualPaused = false;
    holding = false;
    anyLoaded = false;
    hasImage = false;
    firstFailed = "";
    els.media.classList.remove("ready");
    resetZoom();
    hideError();
    els.story.classList.remove("holding");
    els.pauseBtn.innerHTML = ICON_PAUSE;
    els.pauseBtn.setAttribute("aria-label", "Pause");
    els.viewer.classList.add("open");
    els.viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    els.closeBtn.focus({ preventScroll: true });

    if (!PHOTOS.length) PHOTOS = await loadPhotos();
    if (!isOpen) return; // ditutup selagi loading

    if (!PHOTOS.length) {
      buildBars();
      showError(
        "Belum ada foto.\nIsi PHOTO_FILES di script.js, atau pastikan " +
          ASSETS_DIR + " bisa diakses."
      );
      return;
    }

    buildBars();
    show(0);
    last = null;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }

  function close() {
    isOpen = false;
    loadToken++;
    resetZoom();
    pointers.clear();
    suppressTap = false;
    cancelAnimationFrame(raf);
    clearTimeout(holdTimer);
    els.viewer.classList.remove("open");
    els.viewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    els.openBtn.focus({ preventScroll: true });
  }

  function togglePause() {
    manualPaused = !manualPaused;
    els.pauseBtn.innerHTML = manualPaused ? ICON_PLAY : ICON_PAUSE;
    els.pauseBtn.setAttribute("aria-label", manualPaused ? "Putar" : "Pause");
  }

  /* ---------- Tap + hold on the screen ---------- */
  function bindZone(zone, onTap) {
    let down = false;

    const release = () => {
      clearTimeout(holdTimer);
      holding = false;
      els.story.classList.remove("holding");
    };

    zone.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (suppressTap || pointers.size >= 2) return; // lagi pinch
      down = true;
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        holding = true;
        els.story.classList.add("holding");
      }, HOLD_DELAY);
    });

    zone.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      const wasHolding = holding;
      release();
      if (!wasHolding && !suppressTap) onTap(); // tap singkat = pindah story
    });

    ["pointerleave", "pointercancel"].forEach((ev) =>
      zone.addEventListener(ev, () => {
        if (!down) return;
        down = false;
        release();
      })
    );
  }

  bindZone(els.zonePrev, prev);
  bindZone(els.zoneNext, next);

  // cegah menu long-press (simpan gambar) di mobile
  els.story.addEventListener("contextmenu", (e) => e.preventDefault());
  
  // Mencegah getar / scroll bawaan layar handphone pada story
  els.story.addEventListener("touchmove", (e) => {
    e.preventDefault();
  }, { passive: false });

  /* ---------- Pinch to zoom ---------- */
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) || 1;
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  let pinchStart = null;

  function beginZoom(originX, originY) {
    const r = els.media.getBoundingClientRect();
    els.media.style.transformOrigin = originX - r.left + "px " + (originY - r.top) + "px";
    zooming = true;
    els.story.classList.add("zooming");
  }

  function applyZoom(scale, dx, dy) {
    els.media.style.transform = "translate(" + dx + "px," + dy + "px) scale(" + scale + ")";
  }

  // lepas jari = balik ke ukuran normal (kayak Instagram)
  function resetZoom() {
    clearTimeout(wheelTimer);
    pinchStart = null;
    zooming = false;
    els.story.classList.remove("zooming");
    els.media.style.transform = "";
  }

  // capture phase: harus jalan sebelum handler tap di zone
  els.story.addEventListener(
    "pointerdown",
    (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        suppressTap = true;
        clearTimeout(holdTimer);
        const [a, b] = [...pointers.values()];
        const m = mid(a, b);
        pinchStart = { dist: dist(a, b), mid: m };
        beginZoom(m.x, m.y);
      }
    },
    true
  );

  els.story.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (!pinchStart || pointers.size < 2) return;
    const [a, b] = [...pointers.values()];
    const m = mid(a, b);
    const scale = Math.min(MAX_ZOOM, Math.max(1, dist(a, b) / pinchStart.dist));
    applyZoom(scale, m.x - pinchStart.mid.x, m.y - pinchStart.mid.y);
  });

  function endPointer(e) {
    if (!pointers.delete(e.pointerId)) return;
    if (pinchStart && pointers.size < 2) resetZoom();
    if (pointers.size === 0) suppressTap = false;
  }
  els.story.addEventListener("pointerup", endPointer);
  els.story.addEventListener("pointercancel", endPointer);

  // trackpad pinch / Ctrl + scroll di desktop
  let wheelScale = 1;
  els.story.addEventListener(
    "wheel",
    (e) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (!zooming) {
        wheelScale = 1;
        beginZoom(e.clientX, e.clientY);
      }
      wheelScale = Math.min(MAX_ZOOM, Math.max(1, wheelScale * Math.exp(-e.deltaY * 0.01)));
      applyZoom(wheelScale, 0, 0);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(resetZoom, 400);
    },
    { passive: false }
  );

  /* ---------- Buttons ---------- */
  els.openBtn.addEventListener("click", open);
  els.closeBtn.addEventListener("click", close);
  els.pauseBtn.addEventListener("click", togglePause);
  els.navPrev.addEventListener("click", prev);
  els.navNext.addEventListener("click", next);

  // klik area gelap di luar story = tutup (desktop)
  els.viewer.addEventListener("click", (e) => {
    if (e.target === els.viewer || e.target === els.viewerBg) close();
  });

  /* ---------- Keyboard ---------- */
  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else if (e.code === "Space" && !e.target.closest("button")) {
      e.preventDefault();
      togglePause();
    }
  });
})();
