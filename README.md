# High Bandwidth Memory (HBM4/HBM4E) Interactive Showcase

A premium, production-quality, single-page interactive showcase website presenting the architectural engineering, manufacturing processes, and technological breakthrough of High Bandwidth Memory (HBM4 and HBM4E). Designed with a sci-fi semiconductor engineering aesthetic reminiscent of high-end NVIDIA or Apple product launches.

## Features

1. **System Boot Loader**: Glowing animated HBM chip loader that displays loading percentage.
2. **Hero Showcase**: Particle backgrounds, typography cycling typing banner, and scroll triggers.
3. **Advanced Interconnect Matrix Table**: Comprehensive overview of DDR5 vs. GDDR7 vs. HBM4 metrics.
4. **Horizontal Interactive Evolution Timeline**: Scrollable timeline mapping memory specifications from HBM1 up to HBM4E.
5. **Interactive System Architecture Blueprint**: Inline SVG mapping components (GPU, Base Die, DRAM Stack, TSVs). Click to inspect details.
6. **Animated Signal Flow Diagram**: SVG demonstrating vertical data conduction and copper-filled Through-Silicon Vias.
7. **Rotatable 3D Memory Stack**: Interactive 3D model (Three.js) demonstrating layers. Includes OrbitControls and a GSAP-driven "Explode Stack" transition.
8. **Responsive Benchmark Charts**: Chart.js integration showing bandwidth gains and efficiency radar parameters.
9. **Manufacturing Flow**: 8-stage interactive semiconductor packaging checklist.
10. **AI Accelerator Configurations**: Integration details for NVIDIA Blackwell, AMD Instinct, Google TPU, Intel Gaudi, and AWS Trainium.
11. **Thermodynamic Heatmap**: Simulated heat dissipation mapping core layers to top cooling plate chambers.
12. **Comparison Matrix**: Complete side-by-side analysis of HBM4 versus HBM4E properties.
13. **Semiconductor Ecosystem Players**: Cards showing foundry and design roles for Samsung, SK hynix, Micron, TSMC, NVIDIA, and AMD.
14. **Strategic Industry Roadmap**: Future steps tracing HBM5 and speed-of-light Optical Silicon Computing.
15. **Gamified Engineering Quiz**: 5-question multiple choice test with score counters, progress indicators, and canvas confetti.

## Folder Structure

```
/
├── index.html
├── css/
│   ├── style.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── charts.js
│   ├── animations.js
│   ├── three-scene.js
│   └── quiz.js
├── assets/
│   ├── images/
│   │   └── hbm_chip_glow.png
│   ├── icons/
│   ├── svg/
│   ├── lottie/
│   └── models/
└── README.md
```

## Technologies & Libraries Used

* **GSAP & ScrollTrigger** - Cinematic timelines and viewport-triggered animations.
* **Three.js & OrbitControls** - 3D chip visualization and explosive layer kinematics.
* **Chart.js** - Dynamic data rendering for speed benchmarks.
* **AOS (Animate on Scroll)** - Scroll-dependent fade-in reveals.
* **Particles.js** - Floating network-node background.
* **Canvas Confetti** - Score celebration triggers.
* **Google Fonts** - Orbitron, Space Grotesk, Inter.

## How to Run Locally

Due to standard browser security restrictions regarding WebGL (Three.js) textures, it is highly recommended to run this project through a local web server:

### Option 1: Using Node.js (npx)
```bash
npx serve .
```

### Option 2: Using Python
```bash
# Python 3
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.
