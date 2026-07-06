/* ==========================================================================
   HBM4/HBM4E Interactive Presentation Showcase - GSAP Reveals & Loops
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initEntranceAnimation();
  initTypingLoop();
  initGSAPRevealRegistry();
});

/* Immediate Slide 1 Entrance Animation */
function initEntranceAnimation() {
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline();
    tl.from('#slide-hero .hero-badge', { opacity: 0, y: 15, duration: 0.4 })
      .from('#slide-hero h1', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
      .from('#slide-hero p', { opacity: 0, y: 15, duration: 0.5 }, '-=0.3')
      .from('#slide-hero .hero-actions', { opacity: 0, y: 10, duration: 0.4 }, '-=0.3')
      .from('#slide-hero .hero-slide-chip', { opacity: 0, scale: 0.9, duration: 0.7, ease: 'power2.out' }, '-=0.5');
  }
}

/* Typing Carousel loop in Cover Slide */
function initTypingLoop() {
  const typingText = document.getElementById('typingText');
  if (!typingText) return;

  const words = [
    "High Bandwidth Memory",
    "HBM4 Architecture",
    "HBM4E Specifications",
    "Powering AI accelerators"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typingText.innerText = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingText.innerText = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Brief delay before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 800);
}

/* Slide Entry Stagger reveals and count ticks */
function initGSAPRevealRegistry() {
  window.triggerSlideGSAPReveal = function(index) {
    if (typeof gsap === 'undefined') return;

    const activeSlide = slides[index];
    if (!activeSlide) return;

    // 1. Generic card reveals
    const cards = activeSlide.querySelectorAll('.glass-card:not(.quiz-deck-card):not(.arch-detail-card), .accel-slide-card, .eco-slide-card, .chart-slide-card, .table-slide-card');
    if (cards.length > 0) {
      gsap.killTweensOf(cards);
      gsap.fromTo(cards,
        { opacity: 0, y: 25, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.7, ease: 'power2.out', clearProps: 'all' }
      );
    }

    // 2. Timeline cards (Slide 3) - Elastic spring pops
    const timelineCards = activeSlide.querySelectorAll('.timeline-deck-card');
    if (timelineCards.length > 0) {
      gsap.killTweensOf(timelineCards);
      gsap.fromTo(timelineCards,
        { opacity: 0, y: (i, el) => el.closest('.timeline-deck-item').matches(':nth-child(odd)') ? -50 : 60, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.5)', clearProps: 'all' }
      );
      // Timeline nodes popping circles
      const nodes = activeSlide.querySelectorAll('.timeline-deck-node');
      gsap.fromTo(nodes, { scale: 0 }, { scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' });
    }

    // 3. TSV tech cards (Slide 5) - Glide-in tilt
    const tsvCards = activeSlide.querySelectorAll('.tsv-tech-card');
    if (tsvCards.length > 0) {
      gsap.killTweensOf(tsvCards);
      gsap.fromTo(tsvCards,
        { opacity: 0, y: 40, rotation: 1.5, scale: 0.96 },
        { opacity: 1, y: 0, rotation: 0, scale: 1, stagger: 0.12, duration: 0.75, ease: 'power2.out', clearProps: 'all' }
      );
    }

    // 4. Manufacturing cards (Slide 8) - float-up
    const mfgSteps = activeSlide.querySelectorAll('.mfg-step-card');
    if (mfgSteps.length > 0) {
      gsap.killTweensOf(mfgSteps);
      gsap.fromTo(mfgSteps,
        { opacity: 0, y: 50, rotation: -1.5, scale: 0.95 },
        { opacity: 1, y: 0, rotation: 0, scale: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out', clearProps: 'all' }
      );
    }

    // 5. Thermal heatmap loading bars (Slide 10) - Expand left to right
    const thermalBars = activeSlide.querySelectorAll('.thermal-die-layer');
    if (thermalBars.length > 0) {
      gsap.killTweensOf(thermalBars);
      gsap.fromTo(thermalBars,
        { opacity: 0, x: -60, scaleX: 0 },
        { opacity: 1, x: 0, scaleX: 1, transformOrigin: 'left', stagger: 0.12, duration: 0.85, ease: 'power2.out', clearProps: 'all' }
      );
    }

    // 6. Roadmap steps (Slide 13) - Slide in horizontally
    const roadmapSteps = activeSlide.querySelectorAll('.roadmap-deck-step');
    if (roadmapSteps.length > 0) {
      gsap.killTweensOf(roadmapSteps);
      gsap.fromTo(roadmapSteps,
        { opacity: 0, x: 60, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, stagger: 0.15, duration: 0.7, ease: 'power2.out', clearProps: 'all' }
      );
    }

    // 2. Statistics Counter Tick Ups
    const counters = activeSlide.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const scoreObj = { val: 0 };

      gsap.killTweensOf(scoreObj);
      gsap.to(scoreObj, {
        val: target,
        duration: 1.5,
        ease: 'power3.out',
        onUpdate: () => {
          if (target < 10) {
            counter.innerText = scoreObj.val.toFixed(1);
          } else {
            counter.innerText = Math.floor(scoreObj.val);
          }
        }
      });
    });
  };
}
