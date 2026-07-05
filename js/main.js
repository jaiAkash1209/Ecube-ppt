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

  // Update next/prev buttons status
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  
  if (prevBtn) prevBtn.disabled = (index === 0);
  if (nextBtn) nextBtn.disabled = (index === slides.length - 1);

  // Active slide entries triggers:
  // 1. Three.js: Pause WebGL rendering loop when not on Slide 5
  if (window.setThreeRenderState) {
    window.setThreeRenderState(index === 5);
  }

  // 2. Charts: Compile and render charts once Slide 6 is active
  if (index === 6 && window.triggerChartsRender) {
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
      title: 'Silicon Interposer',
      desc: 'The fine silicon routing backing of 2.5D integration. Connects memory stacks directly next to the GPU processor, bypassing standard board trace limits.',
      role: 'High-Density Interconnection Plane',
      tech: 'Fine-Pitch Sub-Micron Copper Routing Lines'
    },
    'part-gpu': {
      title: 'GPU / AI Accelerator Die',
      desc: 'The compute silicon engine (e.g. NVIDIA Blackwell, AMD Instinct). Accesses nearby stacked memory via wide buses to avoid off-chip bandwidth delays.',
      role: 'Primary Computing Core Processor',
      tech: 'Advanced 3nm Foundry Lithography'
    },
    'part-microbumps': {
      title: 'Package Microbumps',
      desc: 'Micro-spheres of lead-free solder establishing dense physical connections between the GPU chip and interposer backing.',
      role: 'Die-to-Interposer Electrical Junctions',
      tech: 'Controlled Collapse Chip Connection (C4)'
    },
    'part-base-die': {
      title: 'Logic Base Die (Buffer Die)',
      desc: 'The logic scheduling hub at the bottom of the memory stack. HBM4 base dies transition to custom logic foundries (TSMC N5 node process) to improve co-design controls.',
      role: 'Custom Memory Scheduler & Signal Router',
      tech: 'TSMC Node N5/N12C Packaging Process'
    },
    'part-dram-dies': {
      title: 'Stacked DRAM Layers',
      desc: '12-High and 16-High stacked DRAM memory layers thinned down to sub-30μm profiles. Stacks share data lines via vertical vias.',
      role: 'High-Capacity Dynamic Memory Cells',
      tech: 'Wafers Thinned 3D Monolithic DRAM Dies'
    },
    'part-tsvs': {
      title: 'Through-Silicon Vias (TSVs)',
      desc: 'Microscopic vertical copper wires drilled directly through silicon dies, constructing vertical electrical conduits across all stack layers.',
      role: 'Vertical Inter-layer Connection Pathways',
      tech: 'Deep Reactive-Ion Etched Copper Vias'
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
