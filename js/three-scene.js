/* ==========================================================================
   PitCrew Connect - 3D Operations Dispatch Network Simulator (Three.js WebGL)
   ========================================================================== */

let setOpState; // Global function pointer
let setThreeRenderState;

document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
});

function initThreeScene() {
  const container = document.getElementById('three-container');
  const loaderEl = document.getElementById('threeLoader');
  if (!container) return;

  let scene, camera, renderer, controls;
  let serverHubMesh, dbCylinderMesh;
  let driverNodes = [];
  let mechanicNodes = [];
  let signalPackets = [];
  let connectionLines = [];
  
  let currentOp = 'FETCH'; // Active platform state: FETCH, READ, WRITE, REFRESH
  let shouldRender = false;
  let timeVal = 0;

  const colors = {
    server: 0x9B72CB,      // Gemini Purple
    db: 0xF4B400,          // Gemini Amber
    driver: 0x4285F4,      // Gemini Blue
    mechanic: 0xD96BBA,    // Gemini Pink
    packetIntake: 0x4285F4,// Blue for intake
    packetQuery: 0xF4B400, // Amber for query
    packetConfirm: 0xD96BBA,// Pink for confirm
    packetDone: 0x00FF66   // Green for completed
  };

  function init() {
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 15);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x9B72CB, 1.2);
    dirLight1.position.set(5, 10, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4285F4, 1.0);
    dirLight2.position.set(-5, 10, -5);
    scene.add(dirLight2);

    // Build the 3D Dispatch Network nodes
    buildDispatchNetwork();

    if (loaderEl) loaderEl.style.display = 'none';

    window.addEventListener('resize', onWindowResize);

    // Start render loop
    animate();
  }

  function buildDispatchNetwork() {
    // 1. Central platform server hub (spinning double octahedron)
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 1.5, 0);

    const outerGeom = new THREE.OctahedronGeometry(1.2, 0);
    const outerMat = new THREE.MeshPhongMaterial({
      color: colors.server,
      emissive: 0x2d1b4e,
      shininess: 100,
      flatShading: true,
      transparent: true,
      opacity: 0.85
    });
    serverHubMesh = new THREE.Mesh(outerGeom, outerMat);
    hubGroup.add(serverHubMesh);

    // Inner glowing core
    const innerGeom = new THREE.SphereGeometry(0.5, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const innerMesh = new THREE.Mesh(innerGeom, innerMat);
    hubGroup.add(innerMesh);

    scene.add(hubGroup);

    // 2. Database Server Cylindrical plate (directly below the server hub)
    const dbGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.4, 32);
    const dbMat = new THREE.MeshPhongMaterial({
      color: colors.db,
      emissive: 0x3d2b00,
      shininess: 80,
      transparent: true,
      opacity: 0.9
    });
    dbCylinderMesh = new THREE.Mesh(dbGeom, dbMat);
    dbCylinderMesh.position.set(0, -1.5, 0);
    scene.add(dbCylinderMesh);

    // 3. Cluster of Driver Nodes (Left Side)
    const driverCoords = [
      { x: -7, y: 1.5, z: -2 },
      { x: -6, y: 0.5, z: 2 },
      { x: -8, y: -0.5, z: 0 }
    ];

    driverCoords.forEach((coord, idx) => {
      const g = new THREE.SphereGeometry(0.5, 16, 16);
      const m = new THREE.MeshPhongMaterial({
        color: colors.driver,
        emissive: 0x0f2244,
        shininess: 60
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(coord.x, coord.y, coord.z);
      scene.add(mesh);
      driverNodes.push(mesh);

      // Draw connection lines to central server
      drawConnectionPath(mesh.position, hubGroup.position, colors.driver);
    });

    // 4. Cluster of Mechanic Nodes (Right Side)
    const mechanicCoords = [
      { x: 7, y: 1.8, z: 2 },
      { x: 6, y: 0.2, z: -2 },
      { x: 8, y: -1.0, z: 1 }
    ];

    mechanicCoords.forEach((coord, idx) => {
      const g = new THREE.ConeGeometry(0.4, 1.0, 16);
      const m = new THREE.MeshPhongMaterial({
        color: colors.mechanic,
        emissive: 0x3a1b32,
        shininess: 60
      });
      const mesh = new THREE.Mesh(g, m);
      mesh.rotation.x = Math.PI / 6;
      mesh.position.set(coord.x, coord.y, coord.z);
      scene.add(mesh);
      mechanicNodes.push(mesh);

      // Draw connection lines to central server
      drawConnectionPath(mesh.position, hubGroup.position, colors.mechanic);
    });

    // Draw connection lines between Hub and DB plate
    drawConnectionPath(hubGroup.position, dbCylinderMesh.position, colors.db);
  }

  function drawConnectionPath(start, end, colorHex) {
    const points = [];
    points.push(start);
    points.push(end);

    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.25
    });
    const line = new THREE.Line(lineGeom, lineMat);
    scene.add(line);
    connectionLines.push(line);
  }

  function spawnPacket(start, end, type) {
    let colorHex = colors.packetIntake;
    if (type === 'QUERY') colorHex = colors.packetQuery;
    else if (type === 'CONFIRM') colorHex = colors.packetConfirm;
    else if (type === 'DONE') colorHex = colors.packetDone;

    const pGeom = new THREE.SphereGeometry(0.18, 8, 8);
    const pMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const mesh = new THREE.Mesh(pGeom, pMat);
    mesh.position.copy(start);
    scene.add(mesh);

    signalPackets.push({
      mesh: mesh,
      start: start.clone(),
      end: end.clone(),
      progress: 0.0,
      speed: 0.02 + Math.random() * 0.015
    });
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!shouldRender) return;

    timeVal += 0.01;

    // Spin Server hub
    if (serverHubMesh) {
      serverHubMesh.rotation.y += 0.015;
      serverHubMesh.rotation.x += 0.008;
    }

    // Spin database plate
    if (dbCylinderMesh) {
      dbCylinderMesh.rotation.y -= 0.005;
    }

    // Periodic packet spawners based on active operation state
    if (Math.random() < 0.04) {
      const serverPos = new THREE.Vector3(0, 1.5, 0);
      const dbPos = new THREE.Vector3(0, -1.5, 0);

      if (currentOp === 'FETCH' && driverNodes.length > 0) {
        // Intake: Packets travel from Drivers to Hub
        const randomDriver = driverNodes[Math.floor(Math.random() * driverNodes.length)];
        spawnPacket(randomDriver.position, serverPos, 'INTAKE');
      } else if (currentOp === 'READ') {
        // Query: Packets cycle down to Database and back up
        if (Math.random() > 0.5) {
          spawnPacket(serverPos, dbPos, 'QUERY');
        } else {
          spawnPacket(dbPos, serverPos, 'QUERY');
        }
      } else if (currentOp === 'WRITE' && mechanicNodes.length > 0) {
        // Dispatch: Packets travel from Server Hub to Mechanics
        const randomMech = mechanicNodes[Math.floor(Math.random() * mechanicNodes.length)];
        spawnPacket(serverPos, randomMech.position, 'CONFIRM');
      } else if (currentOp === 'REFRESH') {
        // Complete: Green confirmation packets sweep the entire grid
        if (Math.random() > 0.5 && driverNodes.length > 0) {
          const randomDriver = driverNodes[Math.floor(Math.random() * driverNodes.length)];
          spawnPacket(serverPos, randomDriver.position, 'DONE');
        } else if (mechanicNodes.length > 0) {
          const randomMech = mechanicNodes[Math.floor(Math.random() * mechanicNodes.length)];
          spawnPacket(serverPos, randomMech.position, 'DONE');
        }
      }
    }

    // Move packets along vectors
    for (let i = signalPackets.length - 1; i >= 0; i--) {
      const p = signalPackets[i];
      p.progress += p.speed;
      
      p.mesh.position.lerpVectors(p.start, p.end, p.progress);

      if (p.progress >= 1.0) {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        signalPackets.splice(i, 1);
      }
    }

    // Glow connection lines
    connectionLines.forEach(line => {
      line.material.opacity = 0.2 + Math.sin(timeVal * 5) * 0.1;
    });

    controls.update();
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  // Export functions to window
  window.setThreeRenderState = function(state) {
    shouldRender = state;
    if (state && !scene) {
      init();
    }
  };

  window.setOpState = function(op) {
    currentOp = op;
    
    // Toggle active button CSS class
    document.querySelectorAll('.btn-op').forEach(btn => btn.classList.remove('active'));
    
    const activeBtnMap = {
      'FETCH': 'btn-op-fetch',
      'READ': 'btn-op-read',
      'WRITE': 'btn-op-write',
      'REFRESH': 'btn-op-refresh'
    };
    
    const activeBtn = document.getElementById(activeBtnMap[op]);
    if (activeBtn) activeBtn.classList.add('active');
  };

  // Bind global pointers
  setOpState = window.setOpState;
  setThreeRenderState = window.setThreeRenderState;
}
