* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    overscroll-behavior: none;
}

/* dikunci total saat story viewer terbuka (mencegah halaman ikut geser / pull-to-refresh di mobile) */
html.no-scroll,
body.no-scroll {
    overflow: hidden;
    overscroll-behavior: none;
}

body {
    color: #FFFFFF;
    font-family: 'Rajdhani', sans-serif;
    height: 100vh;
    height: 100dvh;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    transition: background 1.5s ease;
}

/* ========================================================
   ADAPTIVE SKY BACKGROUNDS (DISESUAIKAN DENGAN SCRIPT JS)
   ======================================================== */
body.sky-day {
    background: linear-gradient(180deg, #2b70d3 0%, #5294e2 40%, #87ceeb 100%);
}

body.sky-sunset {
    background: linear-gradient(180deg, #233044 0%, #e85d04 55%, #ffba08 100%);
}

body.sky-night {
    background: linear-gradient(180deg, #030712 0%, #0b1528 50%, #152238 100%);
}

/* ========================================================
   CELESTIAL BODIES (MATAHARI & BULAN)
   ======================================================== */
.sun,
.moon {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    z-index: 1;
    transition: all 1.2s ease-in-out;
}

/* Matahari Pagi/Siang */
body.sky-day .sun {
    top: 10%;
    right: 12%;
    width: 140px;
    height: 140px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(255, 235, 150, 0.6) 45%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    box-shadow: 0 0 60px rgba(255, 240, 180, 0.8);
    opacity: 0.85;
}

/* Matahari Sore (Terbenam) */
body.sky-sunset .sun {
    top: 40%;
    right: 15%;
    width: 150px;
    height: 150px;
    background: radial-gradient(circle, rgba(255, 220, 150, 0.9) 0%, rgba(255, 120, 60, 0.6) 50%, rgba(255, 80, 40, 0) 75%);
    border-radius: 50%;
    box-shadow: 0 0 70px rgba(255, 100, 50, 0.8);
    opacity: 0.9;
}

/* Bulan Sabit Malam */
body.sky-night .moon {
    top: 12%;
    right: 14%;
    width: 85px;
    height: 85px;
    background: transparent;
    border-radius: 50%;
    box-shadow: 16px 10px 0 0 #fbf8cc;
    filter: drop-shadow(0 0 20px rgba(251, 248, 204, 0.9));
    opacity: 0.95;
}

/* ========================================================
   BINTANG-BINTANG MALAM (STARS)
   ======================================================== */
.stars-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    opacity: 0;
    transition: opacity 1.2s ease;
}

body.sky-night .stars-container {
    opacity: 1;
}

.star {
    position: absolute;
    background-color: #ffffff;
    border-radius: 50%;
    animation: twinkle var(--duration) infinite ease-in-out;
    animation-play-state: paused;
}

body.sky-night .star {
    animation-play-state: running;
}

@keyframes twinkle {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.3); }
}

/* ========================================================
   AWAN REALISTIK & BANYAK (REALISTIC CLOUDS)
   ======================================================== */
.clouds-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2;
    overflow: hidden;
}

.cloud {
    position: absolute;
    background: rgba(255, 255, 255, 0.45);
    border-radius: 100px;
    filter: blur(4px);
    z-index: 2;
    animation: moveCloud var(--speed) linear infinite;
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05);
}

.cloud::before, .cloud::after {
    content: '';
    position: absolute;
    background: inherit;
    border-radius: 50%;
}

.cloud::before {
    width: 45%;
    height: 140%;
    top: -50%;
    left: 15%;
}

.cloud::after {
    width: 35%;
    height: 110%;
    top: -35%;
    right: 15%;
}

/* Variasi Ukuran & Kecepatan Awan */
.cloud-1 { width: 320px; height: 90px; top: 12%; left: -350px; --speed: 38s; }
.cloud-2 { width: 480px; height: 130px; top: 38%; left: -520px; --speed: 55s; opacity: 0.35; }
.cloud-3 { width: 260px; height: 75px; top: 62%; left: -300px; --speed: 32s; }
.cloud-4 { width: 380px; height: 110px; top: 22%; left: -420px; --speed: 46s; }
.cloud-5 { width: 420px; height: 120px; top: 75%; left: -460px; --speed: 50s; opacity: 0.25; }

/* Warna Awan Sesuai Tema Waktu */
body.sky-sunset .cloud {
    background: rgba(255, 190, 160, 0.5);
}

body.sky-night .cloud {
    background: rgba(18, 28, 48, 0.6);
    filter: blur(8px);
    box-shadow: none;
}

@keyframes moveCloud {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(100vw + 600px)); }
}

/* ========================================================
   START OVERLAY SCREEN
   ======================================================== */
.start-screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000000;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: opacity 0.8s ease, visibility 0.8s ease;
}

.start-text {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 1.5rem;
    font-weight: 600;
    color: #f1e6c8;
    letter-spacing: 0.06em;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    animation: pulseText 2.4s infinite alternate;
}

@keyframes pulseText {
    0% { opacity: 0.45; transform: scale(0.99); }
    100% { opacity: 1; transform: scale(1.01); }
}

.start-screen.fade-out {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    cursor: default;
}

/* ========================================================
   MAIN CONTENT & GAMBAR BACK.JPG
   ======================================================== */
.container.hidden {
    opacity: 0;
    transform: scale(0.95);
    pointer-events: none;
}

.container {
    position: relative;
    z-index: 10;
    text-align: center;
    padding: 30px;
    max-width: 900px;
    width: 100%;
    transition: opacity 1s ease, transform 1s ease;
    opacity: 1;
    transform: scale(1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.container::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 600px;
    max-width: 90vw;
    height: 600px;
    max-height: 80vh;
    transform: translate(-50%, -50%);
    background-image: url("back.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.65;
    z-index: 0;
    pointer-events: none;
    transition: opacity 0.5s ease;
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}

body.sky-night .container::before {
    opacity: 0.45;
    filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.2));
}

.container > * {
    position: relative;
    z-index: 1;
}

.coming-soon {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: 0.55em;
    color: #e2e8f0;
    margin-bottom: 8px;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
}

.event-title {
    font-family: 'Cinzel', serif;
    font-size: 4.2rem;
    font-weight: 900;
    letter-spacing: 0.14em;
    color: #ffffff;
    margin-bottom: 6px;
    text-shadow: 
        0 0 15px rgba(255, 255, 255, 0.8),
        0 0 30px rgba(0, 0, 0, 0.6);
}

.event-theme {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 600;
    font-style: italic;
    color: #f7fafc;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
}

.event-date {
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: #e0f2fe;
    margin-bottom: 25px;
    text-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
}

.event-date::after {
    content: "";
    display: block;
    width: 80px;
    height: 2px;
    margin: 12px auto 0;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8), transparent);
}

.countdown-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    flex-wrap: nowrap;
    margin-bottom: 30px;
    margin-top: 15px;
}

.time-box {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 12px;
    padding: 16px 22px;
    min-width: 105px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(8px);
    transition: transform 0.3s ease, background 0.3s ease;
}

body.sky-night .time-box {
    background: rgba(10, 17, 40, 0.6);
    border-color: rgba(255, 255, 255, 0.2);
}

.time-box:hover {
    transform: translateY(-4px);
    background: rgba(0, 0, 0, 0.5);
}

.number {
    display: block;
    font-family: 'Rajdhani', sans-serif;
    font-size: 3.2rem;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    margin-bottom: 5px;
}

.label {
    display: block;
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.22em;
    color: #f1f5f9;
}

.button-group {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    backdrop-filter: blur(6px);
}

.btn-instagram {
    color: #ffffff;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-instagram:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-2px);
}

.btn-register {
    color: #0f172a;
    background: #ffffff;
    border: 1px solid #ffffff;
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.4);
}

.btn-register:hover {
    background: #f8fafc;
    box-shadow: 0 6px 24px rgba(255, 255, 255, 0.6);
    transform: translateY(-3px);
}

/* Mobile Responsive */
@media screen and (max-height: 500px) and (orientation: landscape) {
    .container { padding: 5px 10px; }
    .container::before { width: 350px; height: 350px; }
    .coming-soon { font-size: 0.75rem; margin-bottom: 2px; }
    .event-title { font-size: 2.2rem; margin-bottom: 0px; }
    .event-theme { font-size: 0.95rem; margin-bottom: 2px; }
    .event-date { font-size: 0.8rem; margin-bottom: 8px; }
    .event-date::after { margin: 4px auto 0; }
    .countdown-container { gap: 10px; margin-bottom: 10px; margin-top: 6px; }
    .time-box { padding: 6px 12px; min-width: 65px; border-radius: 8px; }
    .number { font-size: 1.7rem; margin-bottom: 2px; }
    .label { font-size: 0.6rem; }
    .btn { padding: 6px 16px; font-size: 0.8rem; }
}

/* Portrait Responsive */
@media screen and (orientation: portrait) {
    .container { padding: 20px 14px; }
    .container::before { width: 92vw; height: 92vw; }
    .coming-soon { font-size: 1rem; letter-spacing: 0.4em; }
    .event-title { font-size: clamp(2.6rem, 14vw, 4.2rem); }
    .event-theme { font-size: 1.3rem; }
    .event-date { font-size: 1rem; letter-spacing: 0.1em; }
    .countdown-container { width: 100%; gap: 8px; }
    .time-box { flex: 1 1 0; min-width: 0; padding: 12px 4px; }
    .number { font-size: clamp(1.7rem, 9vw, 3.2rem); }
    .label { font-size: 0.65rem; letter-spacing: 0.12em; }
    .button-group { flex-direction: column; width: 100%; }
    .btn { width: 100%; max-width: 320px; }
    .start-text { font-size: 1.25rem; }
}

/* ========================================================
   TOMBOL "WHAT'S ON THE LIST?" + COVERFLOW 3D POSTER
   ======================================================== */
button.btn { cursor: pointer; }

.viewer {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #050b18;
    overflow: hidden;
    overscroll-behavior: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity .25s ease, visibility 0s linear .25s;
}
.viewer.open { opacity: 1; visibility: visible; transition: opacity .25s ease; }
.viewer:focus { outline: none; }

.viewer-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: blur(60px) brightness(.4) saturate(1.3);
    transform: scale(1.25);
    transition: background-image .4s ease;
}

.cf-title {
    position: relative;
    z-index: 2;
    margin: 0 16px 2.5vh;
    font-family: 'Cinzel', serif;
    font-size: clamp(1.3rem, 4.5vw, 2rem);
    font-weight: 700;
    letter-spacing: .1em;
    text-align: center;
    text-shadow: 0 0 14px rgba(0, 0, 0, .6);
}

.cf-close {
    position: absolute;
    z-index: 6;
    top: calc(env(safe-area-inset-top, 0px) + 14px);
    right: 14px;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, .35);
    border-radius: 50%;
    background: rgba(255, 255, 255, .12);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    color: #fff;
    cursor: pointer;
    transition: background .2s ease;
}
.cf-close:hover { background: rgba(255, 255, 255, .28); }

/* ---------- Stage ---------- */
.cf-stage {
    position: relative;
    z-index: 1;
    width: 100%;
    height: min(62dvh, 600px, 96vw);
    perspective: 1400px;
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: none;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
}
.cf-stage[hidden] { display: none; }
.cf-stage.dragging { cursor: grabbing; }

.cf-track {
    position: relative;
    height: 100%;
    aspect-ratio: 3 / 4;
    transform-style: preserve-3d;
}

.cf-card {
    position: absolute;
    inset: 0;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, .3);
    border-radius: 14px;
    overflow: hidden;
    background: rgba(255, 255, 255, .08);
    box-shadow: 0 24px 50px rgba(0, 0, 0, .5);
    cursor: pointer;
    transition: transform .55s cubic-bezier(.22, .8, .25, 1), opacity .4s ease, filter .4s ease, box-shadow .4s ease;
    will-change: transform;
}
.cf-card img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    -webkit-user-drag: none;
}
.cf-card.active {
    border-color: rgba(255, 255, 255, .75);
    box-shadow: 0 24px 60px rgba(0, 0, 0, .55), 0 0 40px rgba(255, 255, 255, .22);
}
.cf-card:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.cf-stage.dragging .cf-card { transition: none; }

/* ---------- Footer ---------- */
.cf-foot {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 3vh;
}
.cf-nav {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, .35);
    border-radius: 50%;
    background: rgba(255, 255, 255, .12);
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    color: #fff;
    cursor: pointer;
    transition: background .2s ease, opacity .2s ease;
}
.cf-nav:hover:not(:disabled) { background: rgba(255, 255, 255, .28); }
.cf-nav:disabled { opacity: .3; cursor: default; }
.cf-nav:focus-visible, .cf-close:focus-visible, .cf-dots button:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }

.cf-dots { display: flex; align-items: center; gap: 8px; }
.cf-dots button {
    position: relative;
    width: 8px;
    height: 8px;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: rgba(255, 255, 255, .35);
    cursor: pointer;
    transition: width .3s ease, background .3s ease;
}
.cf-dots button::after { content: ""; position: absolute; inset: -12px -4px; }
.cf-dots button.on { width: 24px; background: #fff; }

.cf-hint {
    position: relative;
    z-index: 2;
    margin-top: 1.5vh;
    padding: 0 16px;
    font-size: .95rem;
    font-weight: 600;
    text-align: center;
    color: rgba(255, 255, 255, .7);
}

.cf-error {
    position: relative;
    z-index: 2;
    max-width: 420px;
    padding: 0 20px;
    text-align: center;
    white-space: pre-line;
    line-height: 1.5;
    color: rgba(255, 255, 255, .85);
}
.cf-error[hidden], .cf-zoom[hidden] { display: none; }

/* ---------- Zoom (tap poster tengah) ---------- */
.cf-zoom {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: grid;
    place-items: center;
    padding: 12px;
    background: rgba(0, 0, 0, .9);
    overflow: auto;
    touch-action: pan-x pan-y pinch-zoom;
    cursor: zoom-out;
}
.cf-zoom img { max-width: 100%; max-height: 100%; object-fit: contain; }

@media (max-height: 500px) {
    .cf-title { margin-bottom: 1vh; font-size: 1.1rem; }
    .cf-stage { height: min(60dvh, 96vw); }
    .cf-hint { display: none; }
    .cf-foot { margin-top: 1.5vh; }
}

@media (prefers-reduced-motion: reduce) {
    .viewer, .cf-card, .viewer-bg, .cf-dots button { transition: none; }
}

/* ========================================================
   POPUP DOWNLOAD JUKLAK JUKNIS (GLASSMORPHISM)
   ======================================================== */
.modal {
    position: fixed;
    inset: 0;
    z-index: 150;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: rgba(0, 0, 0, 0.35);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    cursor: default;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.25s ease, visibility 0s linear 0.25s;
}

.modal.open {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.25s ease;
}

.modal-card {
    position: relative;
    width: 100%;
    max-width: 460px;
    max-height: calc(100vh - 32px);
    max-height: calc(100dvh - 32px);
    overflow-y: auto;
    padding: 30px 22px 22px;
    text-align: center;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.35);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    backdrop-filter: blur(18px) saturate(140%);
    transform: translateY(14px) scale(0.97);
    transition: transform 0.25s ease;
}

.modal.open .modal-card {
    transform: none;
}

.modal-title {
    font-family: 'Cinzel', serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #ffffff;
    text-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
}

.modal-sub {
    margin: 6px 0 20px;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 600;
    font-size: 1.15rem;
    color: #f7fafc;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}

.modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s ease;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.28);
}

.download-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.download-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.28);
    color: #ffffff;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-decoration: none;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
}

.download-item span {
    flex: 1;
}

.download-item:hover {
    background: rgba(0, 0, 0, 0.45);
    transform: translateY(-2px);
}

.download-item:focus-visible,
.modal-close:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
}

@media (max-width: 420px) {
    .download-list { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
    .cloud, .star, .start-text { animation: none; }
    .modal, .modal-card { transition: none; }
}
