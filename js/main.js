/* ==========================================================================
   HBM4/HBM4E Interactive Presentation Showcase - Main Controller Script
   ========================================================================== */

let currentSlideIndex = 0;
let slides = [];

document.addEventListener('DOMContentLoaded', () => {
  slides = document.querySelectorAll('.slide');
  
  initParticles();
  initArchitectureSVG();
  initSlideNavigation();
});

/* Slide Navigation Framework */
function initSlideNavigation() {
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  if (!prevBtn || !nextBtn) return;

  // Fullscreen toggle logic
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });

    document.addEventListener('fullscreenchange', () => {
      const icon = fullscreenBtn.querySelector('i');
      if (document.fullscreenElement) {
        icon.className = 'fas fa-compress';
      } else {
        icon.className = 'fas fa-expand';
      }
    });
  }

  // Keyboard presentation shortcuts
  document.addEventListener('keydown', (e) => {
    // If typing inside some inputs, skip sliding triggers
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
    
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  });

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Initialize cover slide
  goToSlide(0);
}

function prevSlide() {
  if (currentSlideIndex > 0) {
    goToSlide(currentSlideIndex - 1);
  }
}

function nextSlide() {
  if (currentSlideIndex < slides.length - 1) {
    goToSlide(currentSlideIndex + 1);
  }
}

function goToSlide(index) {
  if (index < 0 || index >= slides.length) return;

  // Slide transition translation classes
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'prev');
    if (i < index) {
      slide.classList.add('prev');
    } else if (i === index) {
      slide.classList.add('active');
    }
  });

  currentSlideIndex = index;

  // Update indicators
  const slideIndicator = document.getElementById('slideIndicator');
  const slideProgressBar = document.getElementById('slideProgressBar');

  if (slideIndicator) {
    const formattedCurrent = (index + 1).toString().padStart(2, '0');
    const formattedTotal = slides.length.toString().padStart(2, '0');
    slideIndicator.innerText = `Slide ${formattedCurrent} of ${formattedTotal}`;
  }

  if (slideProgressBar) {
    const progressPercent = (index / (slides.length - 1)) * 100;
    slideProgressBar.style.width = progressPercent + '%';
  }

  // Update presenter overlay footer tag visibility (hide on cover and thank you slides)
  const controlsPresenterTag = document.querySelector('.controls-presenter-tag');
  if (controlsPresenterTag) {
    if (index === 0 || index === slides.length - 1) {
      controlsPresenterTag.style.opacity = '0';
      controlsPresenterTag.style.pointerEvents = 'none';
    } else {
      controlsPresenterTag.style.opacity = '0.8';
      controlsPresenterTag.style.pointerEvents = 'auto';
    }
  }

  // Update next/prev buttons status
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  
  if (prevBtn) prevBtn.disabled = (index === 0);
  if (nextBtn) nextBtn.disabled = (index === slides.length - 1);

  // Active slide entries triggers:
  // 1. Three.js: Pause WebGL rendering loop when not on Slide 5 (index 4)
  if (window.setThreeRenderState) {
    window.setThreeRenderState(index === 4);
  }

  // 2. Charts: Compile and render charts once Slide 6 (index 5) is active
  if (index === 5 && window.triggerChartsRender) {
    window.triggerChartsRender();
  }

  // 3. Trigger staggered GSAP reveals
  if (window.triggerSlideGSAPReveal) {
    window.triggerSlideGSAPReveal(index);
  }
}



/* Particles Background settings */
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      "particles": {
        "number": { "value": 35, "density": { "enable": true, "value_area": 900 } },
        "color": { "value": ["#4285F4", "#9B72CB", "#D96BBA"] },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.18, "random": true, "anim": { "enable": true, "speed": 0.4, "opacity_min": 0.05, "sync": false } },
        "size": { "value": 2.5, "random": true, "anim": { "enable": true, "speed": 1.2, "size_min": 0.5, "sync": false } },
        "line_linked": { "enable": true, "distance": 140, "color": "#9B72CB", "opacity": 0.08, "width": 1 },
        "move": { "enable": true, "speed": 0.8, "direction": "none", "random": true, "out_mode": "out" }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": false }, "resize": true },
        "modes": { "bubble": { "distance": 140, "size": 3.5, "duration": 2, "opacity": 0.25 } }
      },
      "retina_detect": true
    });
  }
}

/* SVG Blueprint detailed click inspector */
function initArchitectureSVG() {
  const defaultInfo = document.getElementById('arch-default-info');
  const detailContent = document.getElementById('arch-detail-content');
  const partTitle = document.getElementById('arch-part-title');
  const partDesc = document.getElementById('arch-part-desc');
  const partRole = document.getElementById('arch-part-role');
  const partTech = document.getElementById('arch-part-tech');
  const resetBtn = document.getElementById('archResetBtn');

  if (!defaultInfo || !detailContent) return;

  const componentData = {
    'part-interposer': {
      title: 'Drivers Frontend Client',
      desc: 'The passenger facing UI (web/mobile). Enables broken-down drivers to select service types, type urgency summaries, and broadcast GPS coordinates.',
      role: 'Breakdown Intake Interface',
      tech: 'HTML5, HSL CSS, Geolocation APIs'
    },
    'part-gpu': {
      title: 'Node.js / Express Server',
      desc: 'The central platform routing brain. Directs incoming driver coordinates, manages session authentications, coordinates matches, and broadcasts WebSockets.',
      role: 'Central Dispatch Scheduler & REST API',
      tech: 'Node.js, Express, WS, bcryptjs'
    },
    'part-base-die': {
      title: 'Mechanics Mobile Client',
      desc: 'The responder UI. Mechanics view incoming nearby roadside jobs, view distance metrics, toggle status availability, and route to breakdown targets.',
      role: 'Emergency Mechanic Dispatch Receiver',
      tech: 'Mobile Webapp, Leaflet Mapping'
    },
    'part-dram-dies': {
      title: 'Admins Operations Console',
      desc: 'Platform supervision dashboard. Admins monitor active job logs, view dispatcher maps, audit user roles, and verify mechanic licenses.',
      role: 'Platform Supervision & Operations Audit',
      tech: 'Administrative Dashboard Console'
    },
    'part-tsvs': {
      title: 'PostgreSQL Database Store',
      desc: 'The secure persistent data ledger. Stores hashed password accounts, active mechanic registrations, routing match tables, and completed services.',
      role: 'Secure Relational Storage Instance',
      tech: 'PostgreSQL Database Engine'
    }
  };

  const parts = document.querySelectorAll('.svg-part');

  parts.forEach(part => {
    part.addEventListener('click', () => {
      parts.forEach(p => p.style.filter = 'none');
      const id = part.getAttribute('id');
      const data = componentData[id];

      if (data) {
        part.style.filter = 'drop-shadow(0px 0px 8px rgba(66, 133, 244, 0.8)) saturate(1.5)';
        defaultInfo.classList.add('hidden');
        detailContent.classList.remove('hidden');

        partTitle.innerText = data.title;
        partDesc.innerText = data.desc;
        partRole.innerText = data.role;
        partTech.innerText = data.tech;
      }
    });
  });

  resetBtn.addEventListener('click', () => {
    parts.forEach(p => p.style.filter = 'none');
    detailContent.classList.add('hidden');
    defaultInfo.classList.remove('hidden');
  });
}

// -------------------------------------------------------------
<<<<<<< HEAD
// Interactive Keyboard MAGIC KEYS Visual Synthesizers
// -------------------------------------------------------------
=======
// Interactive Keyboard MAGIC KEYS Visual/Audio Synthesizers
// -------------------------------------------------------------
let audioCtx = null;
let masterGain = null;
let audioInitialized = false;

function initAudioContext() {
  if (audioInitialized) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // Master Dynamics Compressor to prevent clipping distortion on high boosts
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-10, audioCtx.currentTime);
    compressor.knee.setValueAtTime(25, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(10, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.06, audioCtx.currentTime);
    
    masterGain = audioCtx.createGain();
    masterGain.connect(compressor);
    compressor.connect(audioCtx.destination);
    
    masterGain.gain.setValueAtTime(2.5, audioCtx.currentTime); // 250% boosted volume
    audioInitialized = true;
  } catch (e) {}
}

document.addEventListener('click', initAudioContext, { once: true });
document.addEventListener('keydown', initAudioContext, { once: true });

>>>>>>> 17b1c741417d4d73f07e6ae400fd30cfa03222ad
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  switch (key) {
    case 's':
      triggerSonicSparkBoom();
      break;
    case 'm':
      triggerMatrixColorShift();
      break;
    case 'a':
      triggerAuroralRippleWave();
      break;
    case 'g':
      triggerGalaxyStarfall();
      break;
    case 'i':
      triggerImplosionOrbFlare();
      break;
  }
});

function triggerSonicSparkBoom() {
<<<<<<< HEAD
=======
  playSonicBoomAudio();
>>>>>>> 17b1c741417d4d73f07e6ae400fd30cfa03222ad
  const layer = document.getElementById('magic-effects-layer');
  if (!layer) return;

  const ripple = document.createElement('div');
  ripple.className = 'magic-ripple';
  layer.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1000);

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  for (let i = 0; i < 30; i++) {
    const spark = document.createElement('div');
    spark.className = 'magic-spark';
    
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    spark.style.left = `${cx}px`;
    spark.style.top = `${cy}px`;
    spark.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    spark.style.backgroundColor = 'currentColor';
    layer.appendChild(spark);
    
    let px = cx, py = cy, opacity = 1.0;
    function update() {
      px += vx;
      py += vy + 0.15;
      opacity -= 0.02;
      spark.style.left = `${px}px`;
      spark.style.top = `${py}px`;
      spark.style.opacity = opacity;
      
      if (opacity > 0) {
        requestAnimationFrame(update);
      } else {
        spark.remove();
      }
    }
    requestAnimationFrame(update);
  }
}

<<<<<<< HEAD
function triggerMatrixColorShift() {
=======
function playSonicBoomAudio() {
  if (!audioInitialized || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    
    const sub = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(150, now);
    sub.frequency.exponentialRampToValueAtTime(30, now + 0.8);
    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    sub.connect(subGain);
    subGain.connect(masterGain);
    sub.start(now);
    sub.stop(now + 0.85);

    const chime = audioCtx.createOscillator();
    const chimeGain = audioCtx.createGain();
    chime.type = 'triangle';
    chime.frequency.setValueAtTime(1200, now);
    chime.frequency.exponentialRampToValueAtTime(2800, now + 0.4);
    chimeGain.gain.setValueAtTime(0.3, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    chime.connect(chimeGain);
    chimeGain.connect(masterGain);
    chime.start(now);
    chime.stop(now + 0.55);
  } catch(e){}
}

function triggerMatrixColorShift() {
  playGlitchAudio();
>>>>>>> 17b1c741417d4d73f07e6ae400fd30cfa03222ad
  const app = document.getElementById('slidesContainer');
  if (app) {
    app.classList.add('matrix-glitch');
    setTimeout(() => app.classList.remove('matrix-glitch'), 1500);
  }

  const layer = document.getElementById('magic-effects-layer');
  if (!layer) return;

  for (let i = 0; i < 15; i++) {
    const col = document.createElement('div');
    col.className = 'matrix-column';
    col.style.left = `${Math.random() * 100}%`;
    col.style.animationDelay = `${Math.random() * 0.5}s`;
    col.style.animationDuration = `${1.2 + Math.random() * 1.5}s`;
    
    let text = "";
    for (let j = 0; j < 12; j++) {
      text += Math.random() > 0.5 ? "1<br>" : "0<br>";
    }
    col.innerHTML = text;
    layer.appendChild(col);
    setTimeout(() => col.remove(), 2000);
  }
}

<<<<<<< HEAD
function triggerAuroralRippleWave() {
=======
function playGlitchAudio() {
  if (!audioInitialized || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    for (let i = 0; i < 6; i++) {
      const time = now + (i * 0.06);
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100 + Math.random() * 1200, time);
      gainNode.gain.setValueAtTime(0.08, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      osc.connect(gainNode);
      gainNode.connect(masterGain);
      osc.start(time);
      osc.stop(time + 0.09);
    }
  } catch(e){}
}

function triggerAuroralRippleWave() {
  playAuroralAudio();
>>>>>>> 17b1c741417d4d73f07e6ae400fd30cfa03222ad
  const layer = document.getElementById('magic-effects-layer');
  if (!layer) return;

  const wave = document.createElement('div');
  wave.className = 'aurora-wave';
  layer.appendChild(wave);
  setTimeout(() => wave.remove(), 2000);

  let step = 0;
  function spawnTrail() {
    if (step > 40) return;
    const progress = step / 40;
    const x = progress * window.innerWidth;
    
    for (let i = 0; i < 3; i++) {
      const p = document.createElement('div');
      p.className = 'magic-spark';
      const y = (window.innerHeight * 0.35) + Math.random() * (window.innerHeight * 0.35);
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.color = '#00ffc8';
      p.style.backgroundColor = 'currentColor';
      layer.appendChild(p);
      
      let py = y, opacity = 1.0;
      let vy = -1 - Math.random() * 2;
      function updateP() {
        py += vy;
        opacity -= 0.03;
        p.style.top = `${py}px`;
        p.style.opacity = opacity;
        if (opacity > 0) {
          requestAnimationFrame(updateP);
        } else {
          p.remove();
        }
      }
      requestAnimationFrame(updateP);
    }
    step++;
    setTimeout(spawnTrail, 25);
  }
  spawnTrail();
}

<<<<<<< HEAD
function triggerGalaxyStarfall() {
=======
function playAuroralAudio() {
  if (!audioInitialized || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const freqs = [220.00, 277.18, 329.63, 440.00];
    freqs.forEach((f, idx) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      osc.connect(gainNode);
      gainNode.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.9);
    });
  } catch(e){}
}

function triggerGalaxyStarfall() {
  playStarfallAudio();
>>>>>>> 17b1c741417d4d73f07e6ae400fd30cfa03222ad
  const layer = document.getElementById('magic-effects-layer');
  if (!layer) return;

  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const star = document.createElement('div');
      star.className = 'magic-star-particle';
      const startX = Math.random() * window.innerWidth;
      star.style.left = `${startX}px`;
      star.style.top = `-10px`;
      layer.appendChild(star);

      let py = -10;
      let px = startX;
      const speedY = 3 + Math.random() * 4;
      const driftX = Math.sin(Math.random() * Math.PI) * 1.5;
      let opacity = 1.0;

      function update() {
        py += speedY;
        px += driftX;
        opacity -= 0.008;
        star.style.top = `${py}px`;
        star.style.left = `${px}px`;
        star.style.opacity = opacity;

        if (py < window.innerHeight && opacity > 0) {
          requestAnimationFrame(update);
        } else {
          star.remove();
        }
      }
      requestAnimationFrame(update);
    }, i * 30);
  }
}

<<<<<<< HEAD
function triggerImplosionOrbFlare() {
=======
function playStarfallAudio() {
  if (!audioInitialized || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    notes.forEach((f, idx) => {
      const time = now + (idx * 0.12);
      const osc = audioCtx.createOscillator();
      const panner = audioCtx.createStereoPanner();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);
      panner.pan.setValueAtTime(-0.8 + (idx * 0.32), time);
      
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.12, time + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.5);
      
      osc.connect(panner);
      panner.connect(gainNode);
      gainNode.connect(masterGain);
      
      osc.start(time);
      osc.stop(time + 0.6);
    });
  } catch(e){}
}

function triggerImplosionOrbFlare() {
  playImplosionAudio();
>>>>>>> 17b1c741417d4d73f07e6ae400fd30cfa03222ad
  const layer = document.getElementById('magic-effects-layer');
  if (!layer) return;

  const core = document.createElement('div');
  core.className = 'magic-blackhole';
  layer.appendChild(core);

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'magic-spark';
    
    const angle = Math.random() * Math.PI * 2;
    const radius = 300 + Math.random() * 200;
    const startX = cx + Math.cos(angle) * radius;
    const startY = cy + Math.sin(angle) * radius;
    
    p.style.left = `${startX}px`;
    p.style.top = `${startY}px`;
    p.style.color = '#e0aaff';
    p.style.backgroundColor = 'currentColor';
    layer.appendChild(p);

    let rad = radius;
    let ang = angle;
    function update() {
      rad -= 6;
      ang += 0.05;
      const px = cx + Math.cos(ang) * rad;
      const py = cy + Math.sin(ang) * rad;
      p.style.left = `${px}px`;
      p.style.top = `${py}px`;
      
      if (rad > 10) {
        requestAnimationFrame(update);
      } else {
        p.remove();
      }
    }
    requestAnimationFrame(update);
  }

  setTimeout(() => {
    core.remove();
    const flash = document.createElement('div');
    flash.className = 'magic-lensflash';
    layer.appendChild(flash);
    setTimeout(() => flash.remove(), 600);
  }, 800);
}
<<<<<<< HEAD
=======

// Global pop feedback click sound
function playUIClickSound() {
  if (!audioInitialized || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.04);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
    
    osc.connect(gainNode);
    gainNode.connect(masterGain);
    
    osc.start(0);
    osc.stop(audioCtx.currentTime + 0.1);
  } catch(e){}
}

document.querySelectorAll('.glass-card, .btn-neon, .btn-ctrl, .btn-op').forEach(el => {
  el.addEventListener('click', playUIClickSound);
});

function playImplosionAudio() {
  if (!audioInitialized || !audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.8);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.6);
    gainNode.gain.linearRampToValueAtTime(0.001, now + 0.8);
    osc.connect(gainNode);
    gainNode.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.82);

    setTimeout(() => {
      if (!audioInitialized || !audioCtx) return;
      const crash = audioCtx.createOscillator();
      const crashGain = audioCtx.createGain();
      crash.type = 'sawtooth';
      crash.frequency.setValueAtTime(120, audioCtx.currentTime);
      crash.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
      crashGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      crashGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      crash.connect(crashGain);
      crashGain.connect(masterGain);
      crash.start(audioCtx.currentTime);
      crash.stop(audioCtx.currentTime + 0.65);
    }, 800);
  } catch(e){}
}
>>>>>>> 17b1c741417d4d73f07e6ae400fd30cfa03222ad
