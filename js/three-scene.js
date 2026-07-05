/* ==========================================================================
   HBM4/HBM4E Interactive Presentation Showcase - Processor Operations Scene
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
});

function initThreeScene() {
  const container = document.getElementById('three-container');
  const loaderEl = document.getElementById('threeLoader');
  if (!container) return;

  let scene, camera, renderer, controls;
  let packageGroup;       // Main container holding the entire package
  let stackGroup;         // Memory stack container
  let layers = [];        // All meshes for explode transitions
  let dramLayers = [];    // ONLY main DRAM/Base die meshes for coordinate lookups
  let gpuCores = [];      // GPU internal core blocks
  let signalParticles = []; // Dynamic path-following data packets
  let isExploded = false;
  let autoRotate = true;
  let shouldRender = false; // Toggled by main.js slide entry logic
  let timeVal = 0;
  let currentOp = 'FETCH'; // Active processor operation: FETCH, READ, WRITE, REFRESH

  const colors = {
    interposer: 0x181a26,
    gpu: 0x2d1754,
    baseDie: 0x9B72CB,       // Gemini Purple
    dramDie: 0x4285F4,       // Gemini Blue
    tsv: 0xFF5722,           // Copper Red
    microbump: 0xF4B400,     // Gemini Amber
    spreader: 0x8E9FB6,
    signal: 0x00E5FF,        // Default Cyan signal packet
    capacitor: 0x6e6e73
  };

  function init() {
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(13, 9, 15);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera going below interposer
    controls.minDistance = 5;
    controls.maxDistance = 22;

    // Main packaging group
    packageGroup = new THREE.Group();
    scene.add(packageGroup);

    // Memory stack subgroup (needed for explode transitions)
    stackGroup = new THREE.Group();
    stackGroup.position.set(2.5, 0, 0); // Shifted right to make room for GPU
    packageGroup.add(stackGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x4285F4, 1.4); // Gemini Blue light
    dirLight1.position.set(6, 12, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x9B72CB, 1.1); // Gemini Purple light
    dirLight2.position.set(-6, 6, -8);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xD96BBA, 1.5, 25);  // Gemini Pink light
    pointLight.position.set(0, 3, 3);
    scene.add(pointLight);

    // Build the 2.5D silicon package components
    buildSiliconPackage();

    if (loaderEl) loaderEl.style.display = 'none';

    window.addEventListener('resize', onWindowResize);
    setupControls();

    // Start rendering loops
    animate();
  }

  function buildSiliconPackage() {
    // 1. Silicon Interposer Base Plate
    const intWidth = 11.5;
    const intDepth = 9.0;
    const intHeight = 0.25;
    const intGeom = new THREE.BoxGeometry(intWidth, intHeight, intDepth);
    const intMaterial = new THREE.MeshStandardMaterial({
      color: colors.interposer,
      roughness: 0.5,
      metalness: 0.7
    });
    const interposerMesh = new THREE.Mesh(intGeom, intMaterial);
    interposerMesh.position.y = -2.25;
    packageGroup.add(interposerMesh);

    // Add gold grid routing tracks on the interposer surface
    const gridHelper = new THREE.GridHelper(9, 18, 0x9B72CB, 0x4285F4);
    gridHelper.position.set(0, -2.12, 0);
    gridHelper.material.opacity = 0.15;
    gridHelper.material.transparent = true;
    packageGroup.add(gridHelper);

    // Mount detailed micro-capacitors on the interposer surface (passive components)
    const capGeom = new THREE.BoxGeometry(0.3, 0.25, 0.4);
    const capMaterial = new THREE.MeshStandardMaterial({ color: colors.capacitor, roughness: 0.2, metalness: 0.9 });
    const goldTermMat = new THREE.MeshStandardMaterial({ color: 0xF4B400, metalness: 0.9 });

    const capPositions = [
      {x: 0, z: -2.5}, {x: 0, z: 2.5},
      {x: -0.2, z: -1.5}, {x: -0.2, z: 1.5},
      {x: 0.2, z: -3.5}, {x: 0.2, z: 3.5}
    ];

    capPositions.forEach(pos => {
      const capMesh = new THREE.Group();
      capMesh.position.set(pos.x, -2.1, pos.z);
      
      const body = new THREE.Mesh(capGeom, capMaterial);
      capMesh.add(body);

      // Add gold terminals at the ends of capacitors to make them look highly detailed
      const termGeom = new THREE.BoxGeometry(0.08, 0.26, 0.42);
      for (let xOff of [-0.12, 0.12]) {
        const term = new THREE.Mesh(termGeom, goldTermMat);
        term.position.x = xOff;
        capMesh.add(term);
      }
      packageGroup.add(capMesh);
    });

    // 2. Compute Die (GPU) next to the Memory Stack
    const gpuWidth = 4.2;
    const gpuDepth = 6.2;
    const gpuHeight = 0.8;
    const gpuGeom = new THREE.BoxGeometry(gpuWidth, gpuHeight, gpuDepth);
    
    // Transparent GPU shell with internal cores visible
    const gpuMaterial = new THREE.MeshPhysicalMaterial({
      color: colors.gpu,
      roughness: 0.15,
      metalness: 0.25,
      transparent: true,
      opacity: 0.72,
      transmission: 0.45,
      thickness: 0.8,
      emissive: colors.gpu,
      emissiveIntensity: 0.2
    });
    const gpuMesh = new THREE.Mesh(gpuGeom, gpuMaterial);
    gpuMesh.position.set(-2.6, -1.725, 0); // Left side
    packageGroup.add(gpuMesh);

    // Add metallic GPU core blocks inside the GPU
    const coreGeom = new THREE.BoxGeometry(1.6, 0.4, 2.4);
    for (let xOffset of [-0.9, 0.9]) {
      for (let zOffset of [-1.3, 1.3]) {
        // Individual material per core for async pulsing
        const coreMat = new THREE.MeshStandardMaterial({ 
          color: 0x121226, 
          roughness: 0.2, 
          metalness: 0.8,
          emissive: colors.signal,
          emissiveIntensity: 0.1
        });
        const core = new THREE.Mesh(coreGeom, coreMat);
        core.position.set(xOffset, 0, zOffset);
        gpuMesh.add(core);
        gpuCores.push(core);

        // Core glowing frames
        const coreEdges = new THREE.EdgesGeometry(coreGeom);
        const coreLine = new THREE.LineSegments(coreEdges, new THREE.LineBasicMaterial({ color: colors.signal, linewidth: 1 }));
        core.add(coreLine);
      }
    }

    // 3. Memory Stack (Base Die, DRAM Layers, Spreader)
    const dieWidth = 4.4;
    const dieDepth = 5.2;
    const baseHeight = 0.45;
    const dramHeight = 0.22;
    const gap = 0.13;
    const dramCount = 8; // Visualization count

    // Base Logic Die
    const baseGeom = new THREE.BoxGeometry(dieWidth, baseHeight, dieDepth);
    const baseMaterial = new THREE.MeshPhysicalMaterial({
      color: colors.baseDie,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.8,
      transmission: 0.6,
      thickness: 1.0,
      emissive: colors.baseDie,
      emissiveIntensity: 0.25
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMaterial);
    baseMesh.position.y = -1.9;
    stackGroup.add(baseMesh);
    
    layers.push({ mesh: baseMesh, defaultY: -1.9, factor: 0 });
    dramLayers.push(baseMesh); // Index 0 is base logic die

    // Base Die internal structures (Memory Controllers)
    const mcGeom = new THREE.BoxGeometry(1.6, 0.2, 1.8);
    const mcMaterial = new THREE.MeshStandardMaterial({ color: 0x221133, roughness: 0.2, metalness: 0.8 });
    for (let zOffset of [-1.2, 1.2]) {
      const mc = new THREE.Mesh(mcGeom, mcMaterial);
      mc.position.set(0, 0, zOffset);
      baseMesh.add(mc);
      
      const mcEdges = new THREE.EdgesGeometry(mcGeom);
      const mcLine = new THREE.LineSegments(mcEdges, new THREE.LineBasicMaterial({ color: colors.baseDie, linewidth: 1 }));
      mc.add(mcLine);
    }

    // DRAM Stacks
    let currentY = baseMesh.position.y + baseHeight/2 + dramHeight/2 + gap;
    const dramMaterial = new THREE.MeshPhysicalMaterial({
      color: colors.dramDie,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
      transmission: 0.75,
      thickness: 0.5,
      emissive: colors.dramDie,
      emissiveIntensity: 0.12
    });

    const tsvMaterial = new THREE.MeshStandardMaterial({
      color: colors.tsv,
      roughness: 0.3,
      metalness: 0.9
    });

    const bumpMaterial = new THREE.MeshStandardMaterial({
      color: colors.microbump,
      roughness: 0.1,
      metalness: 0.9
    });

    for (let i = 0; i < dramCount; i++) {
      // DRAM Die
      const dramGeom = new THREE.BoxGeometry(dieWidth - 0.2, dramHeight, dieDepth - 0.2);
      const dramMesh = new THREE.Mesh(dramGeom, dramMaterial);
      dramMesh.position.y = currentY;
      stackGroup.add(dramMesh);
      
      layers.push({ mesh: dramMesh, defaultY: currentY, factor: i + 1 });
      dramLayers.push(dramMesh); // Index 1 to 8 are the DRAM dies

      // Add high-tech glowing wireframe edges to each DRAM layer
      const dramEdges = new THREE.EdgesGeometry(dramGeom);
      const dramLine = new THREE.LineSegments(dramEdges, new THREE.LineBasicMaterial({ color: colors.dramDie, linewidth: 1 }));
      dramMesh.add(dramLine);

      // TSV internal vertical pillars (4x4 dense grid representation)
      const tsvGeom = new THREE.CylinderGeometry(0.05, 0.05, dramHeight + gap, 8);
      const tsvX = [-1.5, -0.5, 0.5, 1.5];
      const tsvZ = [-1.8, -0.6, 0.6, 1.8];
      tsvX.forEach(x => {
        tsvZ.forEach(z => {
          const tsvMesh = new THREE.Mesh(tsvGeom, tsvMaterial);
          tsvMesh.position.set(x, currentY, z);
          stackGroup.add(tsvMesh);
          layers.push({ mesh: tsvMesh, defaultY: currentY, factor: i + 1 });
        });
      });

      // Microbumps grids between layers (6x6 grid representation)
      const bumpGeom = new THREE.SphereGeometry(0.04, 8, 8);
      const bumpX = [-1.6, -0.96, -0.32, 0.32, 0.96, 1.6];
      const bumpZ = [-2.0, -1.2, -0.4, 0.4, 1.2, 2.0];

      if (i > 0) {
        bumpX.forEach(bx => {
          bumpZ.forEach(bz => {
            const bumpMesh = new THREE.Mesh(bumpGeom, bumpMaterial);
            bumpMesh.position.set(bx, currentY - dramHeight/2 - gap/2, bz);
            stackGroup.add(bumpMesh);
            layers.push({ mesh: bumpMesh, defaultY: currentY - dramHeight/2 - gap/2, factor: i + 0.5 });
          });
        });
      }

      currentY += dramHeight + gap;
    }

    // 4. Spreader Cap
    const spreaderHeight = 0.5;
    const spreaderGeom = new THREE.BoxGeometry(dieWidth + 0.2, spreaderHeight, dieDepth + 0.2);
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: colors.spreader,
      roughness: 0.2,
      metalness: 0.9
    });
    const spreaderMesh = new THREE.Mesh(spreaderGeom, metalMaterial);
    spreaderMesh.position.y = currentY - gap + dramHeight/2 + spreaderHeight/2 + 0.08;
    stackGroup.add(spreaderMesh);
    layers.push({ mesh: spreaderMesh, defaultY: spreaderMesh.position.y, factor: dramCount + 1 });

    // Spreader cap details (panel engravings)
    const capEdges = new THREE.EdgesGeometry(spreaderGeom);
    const capLine = new THREE.LineSegments(capEdges, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5, transparent: true }));
    spreaderMesh.add(capLine);

    // 5. Build Dynamic Data Flow Pipeline Particles
    const particlesCount = 30; // Increased count for dense data flow
    const particleGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    
    // Use individual materials per particle to allow individual color swaps dynamically
    for (let i = 0; i < particlesCount; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: colors.signal,
        transparent: true,
        opacity: 0.95
      });
      const particle = new THREE.Mesh(particleGeometry, pMat);
      packageGroup.add(particle);

      const pData = {
        mesh: particle,
        speed: 0.035
      };
      
      resetParticlePath(pData);
      
      // Fast-forward initial particles to random segments so they are distributed along the loop on load
      pData.currentIndex = Math.floor(Math.random() * 5);
      signalParticles.push(pData);
    }
  }

  function resetParticlePath(p) {
    // Pick random GPU core position (Absolute coordinates)
    const coreX = Math.random() > 0.5 ? -3.5 : -1.7;
    const coreZ = Math.random() > 0.5 ? -1.3 : 1.3;
    const coreY = -1.7 + Math.random() * 0.25;
    
    // Choose random TSV column offsets
    const tsvXOff = [-1.5, -0.5, 0.5, 1.5][Math.floor(Math.random() * 4)];
    const tsvZOff = [-1.8, -0.6, 0.6, 1.8][Math.floor(Math.random() * 4)];
    
    // Choose random target DRAM layer index (1 to 8)
    const layerIdx = 1 + Math.floor(Math.random() * 8); // index 0 is base logic die
    
    // Target cell coordinate (outer boundary of DRAM die)
    const cellX = 2.5 + tsvXOff + (Math.random() > 0.5 ? 0.7 : -0.7);
    const cellZ = tsvZOff + (Math.random() > 0.5 ? 0.7 : -0.7);

    // Adjust flow direction based on the current operation
    let forcedDir = 0;
    if (currentOp === 'FETCH' || currentOp === 'READ') {
      forcedDir = -1; // Read direction (HBM to GPU)
    } else if (currentOp === 'WRITE') {
      forcedDir = 1;  // Write direction (GPU to HBM)
    } else {
      forcedDir = Math.random() > 0.5 ? 1 : -1; // REFRESH: mixed pathways
    }

    p.dirType = forcedDir;
    p.coreX = coreX;
    p.coreY = coreY;
    p.coreZ = coreZ;
    p.tsvX = 2.5 + tsvXOff;
    p.tsvZ = tsvZOff;
    p.layerIdx = layerIdx;
    p.cellX = cellX;
    p.cellZ = cellZ;
    
    p.currentIndex = 0;
    
    // Adjust colors and speed based on the operation
    if (currentOp === 'FETCH') {
      p.mesh.material.color.setHex(0x00FF66); // Green
      p.speed = 0.08 + Math.random() * 0.045;  // Rapid flow
    } else if (currentOp === 'READ') {
      p.mesh.material.color.setHex(0x00E5FF); // Cyan
      p.speed = 0.04 + Math.random() * 0.03;   // Normal
    } else if (currentOp === 'WRITE') {
      p.mesh.material.color.setHex(0xFF007F); // Pink/Magenta
      p.speed = 0.04 + Math.random() * 0.03;   // Normal
    } else {
      p.mesh.material.color.setHex(0xFFB300); // Amber/Gold
      p.speed = 0.012 + Math.random() * 0.01;  // Slow refresh hold
    }
    
    // Set initial position
    if (p.dirType === 1) {
      p.mesh.position.set(coreX, coreY, coreZ);
    } else {
      // Get target DRAM die position
      const targetY = dramLayers[layerIdx] ? dramLayers[layerIdx].position.y : -1.5;
      p.mesh.position.set(cellX, targetY, cellZ);
    }
  }

  function toggleExplode() {
    isExploded = !isExploded;
    const explodeDist = 0.55;
    const explodeBtn = document.getElementById('threeExplodeBtn');

    if (explodeBtn) {
      explodeBtn.innerText = isExploded ? 'Collapse Stack' : 'Explode Stack';
    }

    layers.forEach(item => {
      const targetY = isExploded 
        ? item.defaultY + (item.factor * explodeDist) 
        : item.defaultY;

      if (typeof gsap !== 'undefined') {
        gsap.to(item.mesh.position, {
          y: targetY,
          duration: 1.2,
          ease: 'power3.out'
        });
      } else {
        item.mesh.position.y = targetY;
      }
    });
  }

  function setupControls() {
    const rotateBtn = document.getElementById('threeRotateBtn');
    const explodeBtn = document.getElementById('threeExplodeBtn');

    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        autoRotate = !autoRotate;
        rotateBtn.classList.toggle('btn-neon-pink');
      });
    }

    if (explodeBtn) {
      explodeBtn.addEventListener('click', toggleExplode);
    }

    // Processor Access Operations Controls
    function selectOperation(op, activeBtnId) {
      currentOp = op;
      
      // Reset formatting on all buttons in the stack ops grid
      const buttons = document.querySelectorAll('.stack-ops-grid button');
      buttons.forEach(btn => {
        btn.style.border = '1px solid rgba(255,255,255,0.15)';
        btn.style.background = 'rgba(255,255,255,0.02)';
        btn.classList.remove('active-op');
      });

      // Highlight the selected button
      const activeBtn = document.getElementById(activeBtnId);
      if (activeBtn) {
        activeBtn.classList.add('active-op');
        let color = '#00FF66';
        if (op === 'READ') color = '#00E5FF';
        if (op === 'WRITE') color = '#FF007F';
        if (op === 'REFRESH') color = '#FFB300';
        activeBtn.style.border = `1px solid ${color}`;
        activeBtn.style.background = `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.08)`;
      }

      // Re-initialize all particles instantly to apply new speeds, colors, and directions
      signalParticles.forEach(resetParticlePath);
    }

    const fetchBtn = document.getElementById('opFetchBtn');
    const readBtn = document.getElementById('opReadBtn');
    const writeBtn = document.getElementById('opWriteBtn');
    const refreshBtn = document.getElementById('opRefreshBtn');

    if (fetchBtn) fetchBtn.addEventListener('click', () => selectOperation('FETCH', 'opFetchBtn'));
    if (readBtn) readBtn.addEventListener('click', () => selectOperation('READ', 'opReadBtn'));
    if (writeBtn) writeBtn.addEventListener('click', () => selectOperation('WRITE', 'opWriteBtn'));
    if (refreshBtn) refreshBtn.addEventListener('click', () => selectOperation('REFRESH', 'opRefreshBtn'));
  }

  function onWindowResize() {
    if (!renderer || !camera) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    // Pause WebGL rendering cycles when off-slide to save CPU
    if (!shouldRender) return;

    timeVal += 0.04;

    // Rotate main package group
    if (autoRotate) {
      packageGroup.rotation.y += 0.0035;
    }

    // 1. Animate DRAM layers dynamic colors (flashing gold on REFRESH)
    if (currentOp === 'REFRESH') {
      dramLayers.forEach((layer, idx) => {
        if (idx > 0) { // Skip base logic die
          const wave = Math.sin(timeVal * 2.5 - idx * 0.85);
          if (wave > 0.25) {
            layer.material.emissive.setHex(0xFFB300); // Gold glow
            layer.material.emissiveIntensity = wave * 0.45;
          } else {
            layer.material.emissive.setHex(colors.dramDie); // Default Blue glow
            layer.material.emissiveIntensity = 0.12;
          }
        }
      });
    } else {
      // Restore default blue logic base & DRAM layer glowing states
      dramLayers.forEach((layer, idx) => {
        if (idx > 0) {
          layer.material.emissive.setHex(colors.dramDie);
          layer.material.emissiveIntensity = 0.12;
        }
      });
    }

    // 2. Animate GPU Cores computational pulsing
    gpuCores.forEach((core, idx) => {
      // Pulsing glows faster during Instruction Fetch
      const pulseSpeed = currentOp === 'FETCH' ? timeVal * 2.0 : timeVal;
      core.material.emissiveIntensity = 0.15 + Math.sin(pulseSpeed + idx * 1.5) * 0.12;
    });

    // 3. Animate signal packets along their dynamic data pathways
    signalParticles.forEach(p => {
      // Resolve dynamic checkpoints based on current layer positions
      const baseDieY = dramLayers[0].position.y;
      const targetY = dramLayers[p.layerIdx] ? dramLayers[p.layerIdx].position.y : -1.5;
      
      const checkpoints = [];
      if (p.dirType === 1) {
        // Write path: GPU core -> Interposer -> Base Die -> TSV -> DRAM cell
        checkpoints.push(new THREE.Vector3(p.coreX, p.coreY, p.coreZ));             // 0: GPU core
        checkpoints.push(new THREE.Vector3(p.coreX, -2.1, p.coreZ));               // 1: Drop to interposer
        checkpoints.push(new THREE.Vector3(p.tsvX, -2.1, p.tsvZ));                 // 2: Across interposer
        checkpoints.push(new THREE.Vector3(p.tsvX, baseDieY, p.tsvZ));             // 3: Up to Base Logic Die
        checkpoints.push(new THREE.Vector3(p.tsvX, targetY, p.tsvZ));              // 4: Up the TSV pillar
        checkpoints.push(new THREE.Vector3(p.cellX, targetY, p.cellZ));            // 5: Spread to DRAM cell
      } else {
        // Read path: DRAM cell -> TSV -> Base Die -> Interposer -> GPU core
        checkpoints.push(new THREE.Vector3(p.cellX, targetY, p.cellZ));            // 0: DRAM cell
        checkpoints.push(new THREE.Vector3(p.tsvX, targetY, p.tsvZ));              // 1: Inward to TSV
        checkpoints.push(new THREE.Vector3(p.tsvX, baseDieY, p.tsvZ));             // 2: Down TSV to Base Logic Die
        checkpoints.push(new THREE.Vector3(p.tsvX, -2.1, p.tsvZ));                 // 3: Down to interposer
        checkpoints.push(new THREE.Vector3(p.coreX, -2.1, p.coreZ));               // 4: Across interposer
        checkpoints.push(new THREE.Vector3(p.coreX, p.coreY, p.coreZ));             // 5: Rise to GPU core
      }

      const target = checkpoints[p.currentIndex];
      if (!target) {
        resetParticlePath(p);
        return;
      }

      const dx = target.x - p.mesh.position.x;
      const dy = target.y - p.mesh.position.y;
      const dz = target.z - p.mesh.position.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

      if (dist < 0.12) {
        p.currentIndex++;
      } else {
        const speed = p.speed;
        p.mesh.position.x += (dx / dist) * speed;
        p.mesh.position.y += (dy / dist) * speed;
        p.mesh.position.z += (dz / dist) * speed;
      }
    });

    controls.update();
    renderer.render(scene, camera);
  }

  // Register global rendering hook
  window.setThreeRenderState = function(isActive) {
    shouldRender = isActive;
    if (isActive) {
      setTimeout(onWindowResize, 100);
    }
  };

  init();
}
