// Global Presentation State
let currentSlide = 1;
const totalSlides = 11;

// Slide 1 Canvas Visualizer State
let heroVisualizerId = null;
const canvas = document.getElementById('canvas-hero-visualizer');
const ctx = canvas ? canvas.getContext('2d') : null;

// Slide 2 Demo State
let sweepActive = false;
let sweepInterval = null;

// Slide 5 Atmos Drag State
let isDraggingAtmos = false;

// Slide 8 Binaural Orbit State
let orbitActive = false;
let orbitAngle = 0;
let orbitInterval = null;

// Slide 7 Dispatch Radar State
let radarActive = false;
let radarInterval = null;
let radarAngle = 0;

// -------------------------------------------------------------
// Initialization
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupFullscreen();
  setupInteractiveDemos();
  adjustScale(); // Force fit projector scaling immediately

  // Resize canvas initially
  resizeHeroCanvas();
  window.addEventListener('resize', () => {
    resizeHeroCanvas();
    adjustScale();
  });
});

// -------------------------------------------------------------
// Slide Navigation Engine
// -------------------------------------------------------------
function setupNavigation() {
  const btnPrev = document.getElementById('btn-prev-slide');
  const btnNext = document.getElementById('btn-next-slide');
  const indicatorsContainer = document.querySelector('.slide-indicators');

  // Populate indicator dots
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `indicator-dot ${i === 1 ? 'active' : ''}`;
      dot.addEventListener('click', () => showSlide(i));
      indicatorsContainer.appendChild(dot);
    }
  }

  btnPrev.addEventListener('click', () => showSlide(currentSlide - 1));
  btnNext.addEventListener('click', () => showSlide(currentSlide + 1));

  // Keyboard navigation arrows
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      showSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      showSlide(currentSlide - 1);
    }
  });

  updateSlideVisibility();
}

function showSlide(index) {
  if (index < 1 || index > totalSlides) return;

  // Flash slide transition
  const flash = document.getElementById('slide-transition-flash');
  if (flash) {
    flash.style.opacity = '1';
    setTimeout(() => {
      flash.style.opacity = '0';
    }, 250);
  }

  currentSlide = index;
  updateSlideVisibility();
}

function updateSlideVisibility() {
  const slides = document.querySelectorAll('.slide');
  slides.forEach((slide, idx) => {
    slide.classList.remove('active');
    if (idx + 1 === currentSlide) {
      slide.classList.add('active');
    }
  });

  // Update nav controls
  const btnPrev = document.getElementById('btn-prev-slide');
  const btnNext = document.getElementById('btn-next-slide');
  if (btnPrev) btnPrev.disabled = (currentSlide === 1);
  if (btnNext) btnNext.disabled = (currentSlide === totalSlides);

  // Update dot indicators
  const dots = document.querySelectorAll('.indicator-dot');
  dots.forEach((dot, idx) => {
    dot.classList.remove('active');
    if (idx + 1 === currentSlide) {
      dot.classList.add('active');
    }
  });

  // Manage loops based on active slide
  manageSlideLoops();
}

function manageSlideLoops() {
  // Stop all active intervals first
  stopAllLoops();

  if (currentSlide === 1) {
    startHeroVisualizer();
  } else if (currentSlide === 5) {
    resetDragObject();
  } else if (currentSlide === 7) {
    if (radarActive) startRadarLoop();
  } else if (currentSlide === 8) {
    if (orbitActive) startOrbitLoop();
  }
}

function stopAllLoops() {
  // Stop Hero visualizer
  if (heroVisualizerId) {
    cancelAnimationFrame(heroVisualizerId);
    heroVisualizerId = null;
  }
  // Stop Slide 2 sweep
  if (sweepInterval) {
    clearInterval(sweepInterval);
    sweepInterval = null;
  }
  sweepActive = false;
  const btnPlayStereo = document.getElementById('btn-play-stereo');
  if (btnPlayStereo) btnPlayStereo.innerText = "Run Dispatch Sweep";

  // Stop Slide 7 radar
  if (radarInterval) {
    clearInterval(radarInterval);
    radarInterval = null;
  }
  const radarBtn = document.getElementById('btn-trigger-elevation');
  if (radarBtn) radarBtn.innerText = "Start Dispatch Radar";

  // Stop Slide 8 orbit
  if (orbitInterval) {
    clearInterval(orbitInterval);
    orbitInterval = null;
  }
  const orbitBtn = document.getElementById('btn-trigger-binaural');
  if (orbitBtn) orbitBtn.innerText = "Start Dispatch Orbit";
}

// -------------------------------------------------------------
// Slide 1 Hero Visualizer Canvas
// -------------------------------------------------------------
function resizeHeroCanvas() {
  if (canvas) {
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }
}

function startHeroVisualizer() {
  if (!canvas || !ctx) return;
  if (heroVisualizerId) cancelAnimationFrame(heroVisualizerId);

  let phase = 0;

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(66, 133, 244, 0.4)'; // Blue dispatch wave
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * 0.008 + phase) * 35 * Math.sin(x * 0.002);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(217, 107, 186, 0.35)'; // Pink responder wave
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.cos(x * 0.01 + phase * 1.2) * 20 * Math.sin(x * 0.001);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Node dots along the wave
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const px = (canvas.width * 0.2) + (i * canvas.width * 0.2);
      const py = canvas.height / 2 + Math.sin(px * 0.008 + phase) * 35 * Math.sin(px * 0.002);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    phase += 0.035;
    heroVisualizerId = requestAnimationFrame(render);
  }
  render();
}

// -------------------------------------------------------------
// Interactive Slides Logic & Stages
// -------------------------------------------------------------
function setupInteractiveDemos() {
  // Slide 2 sweep toggle
  const btnPlayStereo = document.getElementById('btn-play-stereo');
  if (btnPlayStereo) {
    btnPlayStereo.addEventListener('click', () => {
      sweepActive = !sweepActive;
      if (sweepActive) {
        btnPlayStereo.innerText = "Stop Sweep";
        runSlide2Sweep();
      } else {
        btnPlayStereo.innerText = "Run Dispatch Sweep";
        if (sweepInterval) clearInterval(sweepInterval);
      }
    });
  }

  // Slide 3 Surround click pings
  document.querySelectorAll('.surround-stage .speaker-source').forEach(spk => {
    spk.addEventListener('click', () => {
      spk.classList.add('active');
      setTimeout(() => spk.classList.remove('active'), 800);
    });
  });

  const btnSurroundAll = document.getElementById('btn-trigger-all-surround');
  if (btnSurroundAll) {
    btnSurroundAll.addEventListener('click', () => {
      document.querySelectorAll('.surround-stage .speaker-source').forEach((spk, idx) => {
        setTimeout(() => {
          spk.classList.add('active');
          setTimeout(() => spk.classList.remove('active'), 800);
        }, idx * 100);
      });
    });
  }

  // Slide 5 Drag Object
  const draggableObj = document.getElementById('atmos-sound-object');
  const objectStage = document.getElementById('object-stage-container');

  if (draggableObj && objectStage) {
    draggableObj.addEventListener('mousedown', (e) => {
      isDraggingAtmos = true;
      draggableObj.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDraggingAtmos) return;

      const rect = objectStage.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // Restrict boundaries
      x = Math.max(15, Math.min(rect.width - 15, x));
      y = Math.max(15, Math.min(rect.height - 15, y));

      draggableObj.style.left = `${x}px`;
      draggableObj.style.top = `${y}px`;

      // Update metadata values
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;

      const scaleX = (dx / cx).toFixed(2);
      const scaleY = (-dy / cy).toFixed(2);
      const angle = Math.round(Math.atan2(dx, -dy) * (180 / Math.PI));

      document.getElementById('val-atmos-x').innerText = `${(scaleX * 10).toFixed(1)}m`;
      document.getElementById('val-atmos-y').innerText = `${(scaleY * 10).toFixed(1)}m`;
      document.getElementById('val-atmos-angle').innerText = `${angle < 0 ? angle + 360 : angle}°`;
    });

    document.addEventListener('mouseup', () => {
      if (isDraggingAtmos) {
        isDraggingAtmos = false;
        draggableObj.style.cursor = 'grab';
      }
    });
  }

  // Slide 6 Layer selector
  document.querySelectorAll('.layer-bar').forEach(bar => {
    bar.addEventListener('click', () => {
      document.querySelectorAll('.layer-bar').forEach(b => b.classList.remove('active'));
      bar.classList.add('active');

      const layer = bar.getAttribute('data-layer');
      const titleEl = document.getElementById('layer-title');
      const descEl = document.getElementById('layer-desc');

      if (layer === 'bed') {
        titleEl.innerText = "Client Front-End View";
        descEl.innerText = "The passenger-facing UI. Takes user breakdown details, fetches geolocation coordinates via browser APIs, and posts requests to dispatcher.";
      } else if (layer === 'height') {
        titleEl.innerText = "Node.js / Express Backend";
        descEl.innerText = "The operations scheduling gateway. Authenticates mechanic sessions via headers, matches coordinates to nearby responders, and broadcasts dispatch routes via WebSockets.";
      } else if (layer === 'db') {
        titleEl.innerText = "PostgreSQL Database Store";
        descEl.innerText = "The secure persistent layer database ledger. Stores hashed password accounts, active mechanic registrations, routing match tables, and completed services.";
      }
    });
  });

  // Slide 7 Proximity Radar selector
  const btnRadar = document.getElementById('btn-trigger-elevation');
  if (btnRadar) {
    btnRadar.addEventListener('click', () => {
      radarActive = !radarActive;
      if (radarActive) {
        btnRadar.innerText = "Stop Dispatch Radar";
        startRadarLoop();
      } else {
        btnRadar.innerText = "Start Dispatch Radar";
        if (radarInterval) clearInterval(radarInterval);
      }
    });
  }

  // Slide 8 Dispatch Orbit
  const btnBinaural = document.getElementById('btn-trigger-binaural');
  if (btnBinaural) {
    btnBinaural.addEventListener('click', () => {
      orbitActive = !orbitActive;
      if (orbitActive) {
        btnBinaural.innerText = "Stop Dispatch Orbit";
        startOrbitLoop();
      } else {
        btnBinaural.innerText = "Start Dispatch Orbit";
        if (orbitInterval) clearInterval(orbitInterval);
      }
    });
  }
}

// Slide 2 sweep animation loop
function runSlide2Sweep() {
  const node = document.getElementById('sound-node-stereo');
  if (!node) return;

  if (sweepInterval) clearInterval(sweepInterval);
  let sweepStep = 0;

  sweepInterval = setInterval(() => {
    sweepStep += 0.05;
    const x = Math.sin(sweepStep);
    const pct = ((x + 1) / 2) * 100;
    node.style.left = `${pct}%`;
  }, 35);
}

function resetDragObject() {
  const draggableObj = document.getElementById('atmos-sound-object');
  if (draggableObj) {
    draggableObj.style.left = '50%';
    draggableObj.style.top = '15%';
    document.getElementById('val-atmos-x').innerText = '0.0m';
    document.getElementById('val-atmos-y').innerText = '7.5m';
    document.getElementById('val-atmos-angle').innerText = '0°';
  }
}

function startRadarLoop() {
  const node = document.getElementById('elevation-sound-node');
  if (!node) return;

  if (radarInterval) clearInterval(radarInterval);

  radarInterval = setInterval(() => {
    radarAngle += 0.05;
    const yVal = Math.sin(radarAngle);
    const radius = 60;
    const offset = (yVal * radius);
    node.style.transform = `translate(-50%, calc(-50% + ${offset}px))`;
  }, 40);
}

function startOrbitLoop() {
  const node = document.getElementById('binaural-orbit-node');
  const stage = document.getElementById('binaural-stage-container');
  if (!node || !stage) return;

  if (orbitInterval) clearInterval(orbitInterval);

  orbitInterval = setInterval(() => {
    orbitAngle += 0.035;
    const r = Math.min(stage.clientWidth, stage.clientHeight) * 0.35;
    const x = Math.cos(orbitAngle) * r;
    const y = Math.sin(orbitAngle) * r;

    node.style.left = `calc(50% + ${x}px)`;
    node.style.top = `calc(50% + ${y}px)`;
  }, 35);
}

// -------------------------------------------------------------
// Projector Screen Scale Force Fitting Utility
// -------------------------------------------------------------
function adjustScale() {
  const container = document.querySelector('.app-container');
  if (!container) return;

  const targetWidth = 1280;
  const targetHeight = 720;
  
  const w = window.innerWidth;
  const h = window.innerHeight;

  const scale = Math.min(w / targetWidth, h / targetHeight);
  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = 'center center';
}

function setupFullscreen() {
  const btn = document.getElementById('btn-fullscreen');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      btn.innerText = "Exit Full";
    } else {
      document.exitFullscreen();
      btn.innerText = "Fullscreen";
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      btn.innerText = "Fullscreen";
    } else {
      btn.innerText = "Exit Full";
    }
    adjustScale();
  });
}

// -------------------------------------------------------------
// Silent Tactile MAGIC KEYS Visual Effects (S, M, A, G, I keys)
// -------------------------------------------------------------
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

function triggerMatrixColorShift() {
  const app = document.querySelector('.app-container');
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

function triggerAuroralRippleWave() {
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

function triggerGalaxyStarfall() {
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

function triggerImplosionOrbFlare() {
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
