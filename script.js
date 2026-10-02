// Web Audio API Synth for Heavy Bass Tick Sound
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
