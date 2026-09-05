// Web Audio API Synth for Heavy Bass Tick Sound
let audioCtx;

function playBassTick() {
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    
    // Sub-oscillator (Sub-bass punch)
    const subOsc = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();

    // Main punch oscillator
    const mainOsc = audioCtx.createOscillator();
    const mainGain = audioCtx.createGain();

    // Master Volume Booster
    const masterGain = audioCtx.createGain();
    
    // Lowpass filter untuk memfokuskan frekuensi bass
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);

    // Dynamic Kick Envelope
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

    // Penguat volume (Master Gain)
    masterGain.gain.setValueAtTime(2.5, now);

    // Connect Node Network
    subOsc.connect(subGain);
    mainOsc.connect(mainGain);

    subGain.connect(filter);
    mainGain.connect(filter);

    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Start & Stop Oscillators
    subOsc.start(now);
    mainOsc.start(now);

    subOsc.stop(now + 0.13);
    mainOsc.stop(now + 0.13);
}

// Fungsi untuk Fullscreen & Landscape otomatis (khusus Mobile/HP)
function requestFullscreenAndLandscape() {
    const docElm = document.documentElement;

    // Request Fullscreen (Mendukung berbagai prefix browser)
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen().catch(err => console.log(err));
    } else if (docElm.webkitRequestFullscreen) { /* Safari / WebKit */
        docElm.webkitRequestFullscreen().catch(err => console.log(err));
    } else if (docElm.msRequestFullscreen) { /* IE/Edge */
        docElm.msRequestFullscreen().catch(err => console.log(err));
    }

    // Lock Screen Orientation ke Landscape (jika didukung perangkat & browser)
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(err => console.log(err));
    } else if (screen.lockOrientation) {
        screen.lockOrientation('landscape').catch(err => console.log(err));
    }
}

// Interactive Click to Reveal
const startScreen = document.getElementById('start-screen');
const mainContent = document.getElementById('main-content');
let isStarted = false;

document.body.addEventListener('click', () => {
    if (!isStarted) {
        isStarted = true;
        
        // Panggil fungsi Fullscreen & Landscape
        requestFullscreenAndLandscape();

        // Inisialisasi Audio Context setelah interaksi user
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        startScreen.classList.add('fade-out');
        mainContent.classList.remove('hidden');

        // Play tick langsung begitu terbuka
        playBassTick();
    }
});

// Countdown Timer Logic
// Tanggal target: 17 Desember 2026
const targetDate = new Date('2026-12-17T00:00:00').getTime();

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

    // Bunyikan suara bass setiap detik berganti
    if (isStarted && lastSecond !== seconds) {
        playBassTick();
        lastSecond = seconds;
    }
}

// Jalankan per detik
setInterval(updateCountdown, 1000);
updateCountdown();
