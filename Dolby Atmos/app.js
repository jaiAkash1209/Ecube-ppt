// Global Presentation State
let currentSlide = 1;
const totalSlides = 10;

// Web Audio API State
let audioCtx = null;
let masterGain = null;
let isMuted = false;
let audioInitialized = false;

// Slide 1 Canvas Visualizer State
let heroVisualizerId = null;
const canvas = document.getElementById('canvas-hero-visualizer');
const ctx = canvas ? canvas.getContext('2d') : null;

// Slide 2 Demo State
let monoStereoOsc = null;
let monoStereoGain = null;
let monoStereoPanner = null;
let sweepInterval = null;
let sweepActive = false;

// Slide 5 Atmos Drag State
let atmosOsc = null;
let atmosLfo = null;
let atmosGain = null;
let atmosPanner = null;
let isDraggingAtmos = false;

// Slide 8 Binaural Orbit State
let binauralOsc = null;
let binauralPanner = null;
let orbitActive = false;
let orbitAngle = 0;
let orbitInterval = null;
let binauralSpatialMode = false; // toggles HRTF vs basic stereo panning

// -------------------------------------------------------------
// Initialization & Consent Modal
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupConsentModal();
  setupStaticDemos();
  
  // Resize canvas initially
  resizeHeroCanvas();
  window.addEventListener('resize', resizeHeroCanvas);
});

function setupConsentModal() {
  const modal = document.getElementById('audio-consent-modal');
  const btnEnable = document.getElementById('btn-enable-audio');
  const btnSkip = document.getElementById('btn-skip-audio');
  const btnToggleSound = document.getElementById('btn-toggle-sound');

  btnEnable.addEventListener('click', () => {
    initAudio(true);
    modal.classList.add('hidden');
  });

  btnSkip.addEventListener('click', () => {
    initAudio(false);
    modal.classList.add('hidden');
  });

  // Sound toggle button in header
  btnToggleSound.addEventListener('click', () => {
    toggleMute();
  });
}

function initAudio(enableSound) {
  if (audioInitialized) return;

  try {
    // Create AudioContext (fallback for older browsers)
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    // Create Master Gain for muting/volume control
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    
    const btnToggleSound = document.getElementById('btn-toggle-sound');
    btnToggleSound.disabled = false;
    btnToggleSound.classList.remove('btn-muted');

    if (!enableSound) {
      isMuted = true;
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      updateSoundIcon(true);
    } else {
      isMuted = false;
      masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
      updateSoundIcon(false);
    }

    audioInitialized = true;
    console.log("Web Audio API initialized successfully.");
  } catch (e) {
    console.error("Web Audio API is not supported in this browser:", e);
  }
}

function toggleMute() {
  if (!audioCtx || !masterGain) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  isMuted = !isMuted;
  if (isMuted) {
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    updateSoundIcon(true);
  } else {
    masterGain.gain.setValueAtTime(0.8, audioCtx.currentTime);
    updateSoundIcon(false);
  }
}

function updateSoundIcon(muted) {
  const iconOn = document.getElementById('icon-sound-on');
  const iconOff = document.getElementById('icon-sound-off');
  if (muted) {
    iconOn.classList.add('hidden');
    iconOff.classList.remove('hidden');
  } else {
    iconOn.classList.remove('hidden');
    iconOff.classList.add('hidden');
  }
}

// -------------------------------------------------------------
// Slide Navigation Engine
// -------------------------------------------------------------
function setupNavigation() {
  const btnPrev = document.getElementById('btn-prev-slide');
  const btnNext = document.getElementById('btn-next-slide');
  const progressContainer = document.getElementById('progress-container');

  btnPrev.addEventListener('click', () => navigateSlide(-1));
  btnNext.addEventListener('click', () => navigateSlide(1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      navigateSlide(-1);
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault(); // prevent scrolling spacebar
      navigateSlide(1);
    }
  });

  // Progress Bar click navigation
  progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const targetSlide = Math.min(totalSlides, Math.max(1, Math.round(percentage * totalSlides)));
    goToSlide(targetSlide);
  });

  // Initial indicator setup
  updateSlideIndicator();
}

function navigateSlide(direction) {
  let target = currentSlide + direction;
  if (target < 1) target = 1;
  if (target > totalSlides) target = totalSlides;
  goToSlide(target);
}

function goToSlide(slideIndex) {
  if (slideIndex === currentSlide) return;

  // Cleanup active slide animations/audio
  cleanupSlideFeatures(currentSlide);

  // Set new index
  const previousSlide = currentSlide;
  currentSlide = slideIndex;

  // Update DOM classes
  for (let i = 1; i <= totalSlides; i++) {
    const slideEl = document.getElementById(`slide-${i}`);
    if (i === currentSlide) {
      slideEl.className = 'slide active';
    } else if (i < currentSlide) {
      slideEl.className = 'slide prev-slide';
    } else {
      slideEl.className = 'slide';
    }
  }

  // Update indicators
  updateSlideIndicator();

  // Initialize new slide features
  initSlideFeatures(currentSlide);
}

function updateSlideIndicator() {
  document.getElementById('current-slide-num').textContent = currentSlide;
  const progress = document.getElementById('deck-progress');
  const percentage = ((currentSlide - 1) / (totalSlides - 1)) * 100;
  progress.style.width = `${percentage}%`;
}

// Trigger animations/handlers when slides become active
function initSlideFeatures(index) {
  // Ensure AudioContext resumes if active slide requires it
  if (audioCtx && audioCtx.state === 'suspended' && [2, 3, 5, 8].includes(index)) {
    audioCtx.resume();
  }

  switch (index) {
    case 1:
      startHeroVisualizer();
      break;
    case 2:
      // Mono vs Stereo
      resetMonoStereoDemo();
      break;
    case 3:
      // Surround Setup
      resetSurroundDemo();
      break;
    case 5:
      // Atmos Drag Demo
      startAtmosDemo();
      break;
    case 8:
      // Binaural Headphones Demo
      initBinauralDemo();
      break;
  }
}

// Stop tasks when slide loses focus
function cleanupSlideFeatures(index) {
  switch (index) {
    case 1:
      stopHeroVisualizer();
      break;
    case 2:
      stopMonoStereoDemo();
      break;
    case 3:
      // No permanent loop in slide 3
      break;
    case 5:
      stopAtmosDemo();
      break;
    case 8:
      stopBinauralDemo();
      break;
  }
}

// -------------------------------------------------------------
// Slide 1: Procedural Wave Canvas Visualizer
// -------------------------------------------------------------
function resizeHeroCanvas() {
  if (!canvas) return;
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

function startHeroVisualizer() {
  if (!ctx) return;
  let offset = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Wave styling details
    const waveCount = 3;
    const colors = [
      'rgba(0, 240, 255, 0.45)', // Cyan
      'rgba(157, 78, 221, 0.35)', // Purple
      'rgba(255, 255, 255, 0.15)'  // White/Muted
    ];
    
    const waveSpeeds = [0.03, 0.018, 0.01];
    const waveAmplitudes = [30, 45, 20];
    const waveFrequencies = [0.008, 0.005, 0.012];

    for (let i = 0; i < waveCount; i++) {
      ctx.beginPath();
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = i === 0 ? 3 : 2;
      
      if (i === 0) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
      } else {
        ctx.shadowBlur = 0;
      }

      for (let x = 0; x < canvas.width; x++) {
        // Compose a sine wave with secondary noise harmonics
        const y = canvas.height / 2 + 
                  Math.sin(x * waveFrequencies[i] + offset * waveSpeeds[i]) * waveAmplitudes[i] + 
                  Math.cos(x * 0.02 + offset * 0.05) * 5;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    offset++;
    heroVisualizerId = requestAnimationFrame(draw);
  }

  draw();
}

function stopHeroVisualizer() {
  if (heroVisualizerId) {
    cancelAnimationFrame(heroVisualizerId);
    heroVisualizerId = null;
  }
}

// -------------------------------------------------------------
// Slide 2: Mono vs. Stereo Sweep Synthesizer
// -------------------------------------------------------------
function resetMonoStereoDemo() {
  stopMonoStereoDemo();
  
  const visualNode = document.getElementById('sound-node-stereo');
  if (visualNode) {
    visualNode.style.left = '50%';
    visualNode.classList.remove('animate-sweep');
  }
  
  const playBtn = document.getElementById('btn-mono-stereo-play');
  if (playBtn) {
    playBtn.querySelector('span').textContent = 'Start Sweep Demo';
  }
}

function stopMonoStereoDemo() {
  sweepActive = false;
  if (sweepInterval) {
    clearInterval(sweepInterval);
    sweepInterval = null;
  }
  
  if (monoStereoOsc) {
    try {
      monoStereoOsc.stop();
    } catch(e){}
    monoStereoOsc = null;
  }
  
  const visualNode = document.getElementById('sound-node-stereo');
  if (visualNode) {
    visualNode.style.left = '50%';
  }
}

function startMonoStereoSweep() {
  if (!audioInitialized) {
    alert("Audio is not enabled. Please click the speaker button in the header first.");
    return;
  }
  
  const playBtn = document.getElementById('btn-mono-stereo-play');
  const isMono = document.getElementById('mode-mono').checked;
  const visualNode = document.getElementById('sound-node-stereo');
  
  if (sweepActive) {
    stopMonoStereoDemo();
    playBtn.querySelector('span').textContent = 'Start Sweep Demo';
    return;
  }
  
  sweepActive = true;
  playBtn.querySelector('span').textContent = 'Stop Sweep';

  // Build audio routing
  monoStereoGain = audioCtx.createGain();
  monoStereoGain.gain.setValueAtTime(0, audioCtx.currentTime);
  monoStereoGain.connect(masterGain);

  monoStereoPanner = audioCtx.createStereoPanner();
  monoStereoPanner.connect(monoStereoGain);

  // oscillator for synthetic audio sweeps
  monoStereoOsc = audioCtx.createOscillator();
  monoStereoOsc.type = 'triangle';
  monoStereoOsc.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4 middle node
  monoStereoOsc.connect(monoStereoPanner);
  
  monoStereoOsc.start(0);

  // Fade in
  monoStereoGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.1);

  // Panning Sweep parameters
  let time = 0;
  const sweepDuration = 3000; // 3 seconds loop
  const intervalTime = 30; // 30ms updates
  
  sweepInterval = setInterval(() => {
    time += intervalTime;
    const progress = (time % sweepDuration) / sweepDuration;
    
    // Map wave progress to visual coordinate (-1 to 1)
    // using sine wave oscillation for left-to-right bouncing
    const panVal = Math.sin(progress * Math.PI * 2);
    
    if (isMono) {
      // Mono keeps panner dead center
      monoStereoPanner.pan.setValueAtTime(0, audioCtx.currentTime);
      if (visualNode) {
        visualNode.style.left = '50%';
      }
    } else {
      // Stereo moves it from left (-1) to right (1)
      monoStereoPanner.pan.setValueAtTime(panVal, audioCtx.currentTime);
      if (visualNode) {
        // Map panVal [-1, 1] to CSS left [20%, 80%]
        const leftPercent = 50 + (panVal * 30);
        visualNode.style.left = `${leftPercent}%`;
      }
    }
    
    // Dynamically modulate frequency slightly to represent motion pitch shift
    const baseFreq = 261.63; // C4
    const pitchOffset = isMono ? 0 : panVal * 25; // pitch changes with pan side
    monoStereoOsc.frequency.setValueAtTime(baseFreq + pitchOffset, audioCtx.currentTime);

  }, intervalTime);
}

// Attach event listeners for Slide 2
function setupStaticDemos() {
  const playBtn = document.getElementById('btn-mono-stereo-play');
  if (playBtn) {
    playBtn.addEventListener('click', startMonoStereoSweep);
  }

  // Radio toggles trigger reset to keep state clean
  document.getElementById('mode-mono').addEventListener('change', resetMonoStereoDemo);
  document.getElementById('mode-stereo').addEventListener('change', resetMonoStereoDemo);
  
  // Height mode selector Slide 6
  const btnHeight = document.getElementById('btn-toggle-height-mode');
  if (btnHeight) {
    btnHeight.addEventListener('click', toggleHeightSpeakerMode);
  }

  // Decoder channels slider Slide 7
  const chSlider = document.getElementById('slider-decoder-channels');
  if (chSlider) {
    chSlider.addEventListener('input', updateDecoderSimulator);
  }
}

// -------------------------------------------------------------
// Slide 3: Multi-Channel Surround 5.1 & 7.1 Speaker Layout
// -------------------------------------------------------------
function resetSurroundDemo() {
  const speakers = document.querySelectorAll('.surround-speaker');
  speakers.forEach(spk => {
    spk.className = spk.className.replace('speaking', '').replace('speaking-sub', '').trim();
    if (spk.id === 'spk-lb' || spk.id === 'spk-rb') {
      const mode7 = document.getElementById('btn-surround-7').classList.contains('btn-active');
      if (mode7) {
        spk.classList.remove('hidden');
      } else {
        spk.classList.add('hidden');
      }
    }
  });
  
  document.getElementById('active-spk-name').textContent = "None (Click a speaker)";
}

// Toggle between 5.1 and 7.1 channels
const btnSurround5 = document.getElementById('btn-surround-5');
const btnSurround7 = document.getElementById('btn-surround-7');
const surroundStage = document.querySelector('.surround-stage');

if (btnSurround5 && btnSurround7) {
  btnSurround5.addEventListener('click', () => {
    btnSurround5.classList.add('btn-active');
    btnSurround7.classList.remove('btn-active');
    surroundStage.className = 'soundstage surround-stage layout-5-1';
    resetSurroundDemo();
  });
  btnSurround7.addEventListener('click', () => {
    btnSurround7.classList.add('btn-active');
    btnSurround5.classList.remove('btn-active');
    surroundStage.className = 'soundstage surround-stage layout-7-1';
    resetSurroundDemo();
  });
}

// Bind individual speaker click beeps
const surroundSpeakers = document.querySelectorAll('.surround-speaker');
surroundSpeakers.forEach(speaker => {
  speaker.addEventListener('click', () => {
    fireSpeakerSignal(speaker);
  });
});

function fireSpeakerSignal(speakerEl) {
  const speakerName = speakerEl.getAttribute('data-speaker');
  const panVal = parseFloat(speakerEl.getAttribute('data-pan') || '0');
  const isSub = speakerEl.getAttribute('data-sub') === 'true';
  
  // Update indicator text
  document.getElementById('active-spk-name').textContent = speakerName;
  
  // Highlight visually
  surroundSpeakers.forEach(s => s.classList.remove('speaking', 'speaking-sub'));
  if (isSub) {
    speakerEl.classList.add('speaking-sub');
  } else {
    speakerEl.classList.add('speaking');
  }
  
  // Play sound if Audio initialized
  if (!audioInitialized) return;
  
  // Synthesize beep or sub rumble
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const panner = audioCtx.createStereoPanner();
  
  panner.pan.setValueAtTime(panVal, audioCtx.currentTime);
  osc.connect(panner);
  panner.connect(gain);
  gain.connect(masterGain);
  
  if (isSub) {
    // Low frequency effects rumble (LFE)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, audioCtx.currentTime); // 60Hz
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.start(0);
    osc.stop(audioCtx.currentTime + 0.6);
  } else {
    // Spatial directional beep
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); // 440Hz A4
    
    // Add brief chime modulation for premium sound feel
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    osc.start(0);
    osc.stop(audioCtx.currentTime + 0.35);
  }
}

// -------------------------------------------------------------
// Slide 5: Dolby Atmos Object Positioner Drag-and-Drop
// -------------------------------------------------------------
function startAtmosDemo() {
  const dragArea = document.getElementById('atmos-drag-area');
  const objectNode = document.getElementById('atmos-sound-object');
  
  if (!dragArea || !objectNode) return;
  
  // Set up drag event bindings
  objectNode.addEventListener('pointerdown', startDraggingAtmos);
  document.addEventListener('pointermove', dragAtmosObject);
  document.addEventListener('pointerup', stopDraggingAtmos);

  // Play looping helicopter synth
  if (audioInitialized) {
    playAtmosSoundLoop();
  }
}

function stopAtmosDemo() {
  const objectNode = document.getElementById('atmos-sound-object');
  if (objectNode) {
    objectNode.removeEventListener('pointerdown', startDraggingAtmos);
  }
  document.removeEventListener('pointermove', dragAtmosObject);
  document.removeEventListener('pointerup', stopDraggingAtmos);
  
  stopAtmosSoundLoop();
}

function playAtmosSoundLoop() {
  if (atmosOsc) return;

  // Dynamic synthesizer to create helicopter propeller noise
  atmosOsc = audioCtx.createOscillator();
  atmosOsc.type = 'sawtooth';
  atmosOsc.frequency.setValueAtTime(60, audioCtx.currentTime); // low pitch base

  // Modulator LFO to create rapid amplitude beats (chopper sound)
  atmosLfo = audioCtx.createOscillator();
  atmosLfo.type = 'sine';
  atmosLfo.frequency.setValueAtTime(15, audioCtx.currentTime); // 15 thumps per sec

  const lfoGain = audioCtx.createGain();
  lfoGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  
  atmosGain = audioCtx.createGain();
  atmosGain.gain.setValueAtTime(0.25, audioCtx.currentTime);

  // Dolby Atmos 3D panner node
  // Maps X, Y, Z coordinates dynamically
  try {
    atmosPanner = audioCtx.createPanner();
    atmosPanner.panningModel = 'HRTF';
    atmosPanner.distanceModel = 'inverse';
    atmosPanner.refDistance = 1;
    atmosPanner.maxDistance = 10000;
    atmosPanner.coneOuterGain = 0.5;
    
    // Set initial position
    atmosPanner.positionX.setValueAtTime(0, audioCtx.currentTime);
    atmosPanner.positionY.setValueAtTime(0, audioCtx.currentTime);
    atmosPanner.positionZ.setValueAtTime(0.5, audioCtx.currentTime);
    
    // Modulate amplitude using the LFO
    atmosLfo.connect(lfoGain);
    lfoGain.connect(atmosGain.gain); // modulate gain directly
    
    // Connect audio signal chain
    atmosOsc.connect(atmosPanner);
    atmosPanner.connect(atmosGain);
    atmosGain.connect(masterGain);
    
    atmosLfo.start(0);
    atmosOsc.start(0);
  } catch(e) {
    // Fallback if HRTF Panner fails or is unsupported
    console.error("3D Panner failed, falling back to stereo:", e);
    const stereoPanner = audioCtx.createStereoPanner();
    atmosOsc.connect(stereoPanner);
    stereoPanner.connect(atmosGain);
    atmosGain.connect(masterGain);
  }
}

function stopAtmosSoundLoop() {
  if (atmosOsc) {
    try {
      atmosOsc.stop();
      atmosLfo.stop();
    } catch(e){}
    atmosOsc = null;
    atmosLfo = null;
  }
}

function startDraggingAtmos(e) {
  isDraggingAtmos = true;
  e.target.setPointerCapture(e.pointerId);
}

function dragAtmosObject(e) {
  if (!isDraggingAtmos) return;

  const dragArea = document.getElementById('atmos-drag-area');
  const objectNode = document.getElementById('atmos-sound-object');
  if (!dragArea || !objectNode) return;

  const rect = dragArea.getBoundingClientRect();
  
  // Calculate relative coordinates in pixels
  let clickX = e.clientX - rect.left;
  let clickY = e.clientY - rect.top;

  // Constrain coordinates to grid dimensions
  clickX = Math.max(14, Math.min(rect.width - 14, clickX));
  clickY = Math.max(14, Math.min(rect.height - 14, clickY));

  // Position DOM node visually
  objectNode.style.left = `${clickX}px`;
  objectNode.style.top = `${clickY}px`;

  // Normalise coordinates relative to listener at center (0, 0)
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Normalise values to scale range [-1.0, 1.0]
  const normX = (clickX - centerX) / centerX;
  const normY = -(clickY - centerY) / centerY; // invert Y axis for traditional cartesian coordinates

  // Update UI Labels
  document.getElementById('meta-x').textContent = normX.toFixed(2);
  document.getElementById('meta-y').textContent = normY.toFixed(2);

  // Update Web Audio Panner Coordinates
  if (atmosPanner) {
    // positionX: Left/Right, positionY: Up/Down, positionZ: Front/Back
    // We map normalized X to positionX, normalized Y to positionZ
    atmosPanner.positionX.setValueAtTime(normX * 5, audioCtx.currentTime);
    atmosPanner.positionZ.setValueAtTime(-normY * 5, audioCtx.currentTime); 
    
    // Simulate circular helicopter height mapping: 
    // Closer to center = slightly higher overhead (Y)
    const distance = Math.sqrt(normX * normX + normY * normY);
    const heightVal = Math.max(0.5, 3 - distance * 2);
    atmosPanner.positionY.setValueAtTime(heightVal, audioCtx.currentTime);
  }
}

function stopDraggingAtmos(e) {
  if (!isDraggingAtmos) return;
  isDraggingAtmos = false;
}

// -------------------------------------------------------------
// Slide 6: Overhead Height Reflection Toggles
// -------------------------------------------------------------
function toggleHeightSpeakerMode() {
  const upSpk = document.querySelector('.up-firing-spk');
  const ceilSpk = document.querySelector('.ceiling-spk');
  const btn = document.getElementById('btn-toggle-height-mode');
  const stage = document.querySelector('.side-view-stage');
  
  if (upSpk.classList.contains('hidden-spk')) {
    // Upward Firing Mode
    upSpk.classList.remove('hidden-spk');
    upSpk.classList.add('active-beam');
    ceilSpk.classList.add('hidden-spk');
    ceilSpk.classList.remove('active-beam');
    stage.classList.add('active-bounce');
    btn.textContent = "Switch to Ceiling Mounted";
  } else {
    // Ceiling Mounted Mode
    upSpk.classList.add('hidden-spk');
    upSpk.classList.remove('active-beam');
    ceilSpk.classList.remove('hidden-spk');
    ceilSpk.classList.add('active-beam');
    stage.classList.remove('active-bounce');
    btn.textContent = "Switch to Upward Firing";
  }
}

// -------------------------------------------------------------
// Slide 7: Dolby Atmos Decoder Simulation
// -------------------------------------------------------------
function updateDecoderSimulator() {
  const slider = document.getElementById('slider-decoder-channels');
  const label = document.getElementById('decoder-channels-val');
  const desc = document.getElementById('decoder-channels-desc');
  const count = parseInt(slider.value);
  
  const outA = document.querySelector('.option-a');
  const outB = document.querySelector('.option-b');

  if (count <= 2) {
    label.textContent = `${count} Channels (Stereo)`;
    desc.textContent = "Decoder downmixes all 128 channels into basic Left and Right signals, bypassing all height data.";
    outA.classList.remove('active-render');
    outB.classList.add('active-render');
  } else if (count > 2 && count <= 6) {
    label.textContent = `${count} Channels (5.1 Surround)`;
    desc.textContent = "Decoder maps audio objects onto 5 floor-level surround speakers and routing LFE low-end base to the Subwoofer.";
    outA.classList.remove('active-render');
    outB.classList.add('active-render');
  } else if (count > 6 && count <= 12) {
    label.textContent = `${count} Channels (7.1.4 Atmos)`;
    desc.textContent = "Ideal home theatre. Decoder resolves discrete coordinate objects to 7 horizontal ear-level speakers, 1 sub, and 4 height/ceiling emitters.";
    outA.classList.add('active-render');
    outB.classList.remove('active-render');
  } else {
    label.textContent = `${count} Channels (Premium Theater)`;
    desc.textContent = "Scaling to maximum limits! Audio objects move smoothly across dense side arrays and overhead cinema grids of up to 64 discrete outputs.";
    outA.classList.add('active-render');
    outB.classList.remove('active-render');
  }
}

// -------------------------------------------------------------
// Slide 8: Binaural Head HRTF Sound Orbit
// -------------------------------------------------------------
function initBinauralDemo() {
  const btnBinaural = document.getElementById('btn-toggle-binaural-mode');
  const btnOrbit = document.getElementById('btn-start-orbit');
  
  if (btnBinaural) {
    btnBinaural.addEventListener('click', toggleBinauralMode);
  }
  if (btnOrbit) {
    btnOrbit.addEventListener('click', toggleBinauralOrbit);
  }

  // Set initial position of orbit dot to top of path (0 angle)
  updateOrbitDotPosition(0);
}

function stopBinauralDemo() {
  stopBinauralOrbit();
  
  const btnBinaural = document.getElementById('btn-toggle-binaural-mode');
  if (btnBinaural) {
    btnBinaural.removeEventListener('click', toggleBinauralMode);
  }
  
  const btnOrbit = document.getElementById('btn-start-orbit');
  if (btnOrbit) {
    btnOrbit.removeEventListener('click', toggleBinauralOrbit);
  }
}

function toggleBinauralMode() {
  binauralSpatialMode = !binauralSpatialMode;
  const btn = document.getElementById('btn-toggle-binaural-mode');
  
  if (binauralSpatialMode) {
    btn.textContent = "Spatial Mode: ON (HRTF)";
    btn.classList.add('btn-active');
  } else {
    btn.textContent = "Spatial Mode: OFF";
    btn.classList.remove('btn-active');
  }
}

function toggleBinauralOrbit() {
  const btn = document.getElementById('btn-start-orbit');
  
  if (orbitActive) {
    stopBinauralOrbit();
    btn.textContent = "Start Orbit";
  } else {
    if (!audioInitialized) {
      alert("Audio is not enabled. Please click the speaker button in the header first.");
      return;
    }
    
    orbitActive = true;
    btn.textContent = "Stop Orbit";
    startBinauralOscillator();
    
    // Cycle updates
    const intervalMs = 25;
    orbitInterval = setInterval(() => {
      orbitAngle += 0.035; // speed of orbit rotation
      updateOrbitDotPosition(orbitAngle);
      updateBinauralPanning(orbitAngle);
    }, intervalMs);
  }
}

function stopBinauralOrbit() {
  orbitActive = false;
  if (orbitInterval) {
    clearInterval(orbitInterval);
    orbitInterval = null;
  }
  
  if (binauralOsc) {
    try {
      binauralOsc.stop();
    } catch(e){}
    binauralOsc = null;
  }
  
  updateOrbitDotPosition(0);
}

function startBinauralOscillator() {
  if (binauralOsc) return;

  binauralOsc = audioCtx.createOscillator();
  binauralOsc.type = 'sine';
  binauralOsc.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4 notes (pleasant frequency)

  // Subtly modulate pitch to mimic rotor drone
  const modulator = audioCtx.createOscillator();
  modulator.frequency.setValueAtTime(200, audioCtx.currentTime);
  
  const modGain = audioCtx.createGain();
  modGain.gain.setValueAtTime(0.015, audioCtx.currentTime);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, audioCtx.currentTime);

  // Binaural HRTF Panner
  try {
    binauralPanner = audioCtx.createPanner();
    binauralPanner.panningModel = 'HRTF';
    binauralPanner.distanceModel = 'inverse';
    binauralPanner.refDistance = 1;
    
    // Connect nodes
    binauralOsc.connect(filter);
    filter.connect(binauralPanner);
    binauralPanner.connect(masterGain);
    
    binauralOsc.start(0);
  } catch(e) {
    // Fallback basic gain node connections
    console.error("HRTF panner failed for binaural sweep, using fallback gain splitter:", e);
    binauralOsc.connect(masterGain);
    binauralOsc.start(0);
  }
}

function updateOrbitDotPosition(angle) {
  const dot = document.getElementById('binaural-sound-source');
  if (!dot) return;
  
  // Orbit radius mapping to pixels (relative to stage center)
  const radius = 95; // half of orbit-path size 190px
  
  const x = Math.sin(angle) * radius;
  const y = -Math.cos(angle) * radius; // negative to start at top of circle (12 o'clock)
  
  dot.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

function updateBinauralPanning(angle) {
  if (!binauralPanner) return;
  
  // Calculate spatial vectors
  // Sound moves in a circular path on X-Z plane around listener
  const panX = Math.sin(angle);
  const panZ = -Math.cos(angle);
  
  if (binauralSpatialMode) {
    // HRTF Spatial Mode
    // Update true 3D spatial coordinates in receiver coordinate system
    binauralPanner.panningModel = 'HRTF';
    binauralPanner.positionX.setValueAtTime(panX * 3, audioCtx.currentTime);
    binauralPanner.positionZ.setValueAtTime(panZ * 3, audioCtx.currentTime);
    binauralPanner.positionY.setValueAtTime(0, audioCtx.currentTime); // on ear-level plane
  } else {
    // Standard Panning (bypassing HRTF filters, simulating basic level panning)
    binauralPanner.panningModel = 'equalpower';
    binauralPanner.positionX.setValueAtTime(panX * 3, audioCtx.currentTime);
    binauralPanner.positionZ.setValueAtTime(0, audioCtx.currentTime); // flatten depth cue
    binauralPanner.positionY.setValueAtTime(0, audioCtx.currentTime);
  }
}
