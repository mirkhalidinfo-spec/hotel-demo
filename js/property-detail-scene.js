/* ============================================
   PROPERTY DETAIL PAGE - 3D Scene
   ============================================ */

(function() {
  if (typeof THREE === 'undefined') return;

  const container = document.getElementById('three-container');
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(5, 3, 8);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0x222244, 0.7);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffeedd, 1.8);
  sun.position.set(5, 10, 5);
  sun.castShadow = true;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x4488ff, 0.3);
  fill.position.set(-5, 0, 5);
  scene.add(fill);
  const rim = new THREE.PointLight(0xc9a84c, 0.3, 10);
  rim.position.set(0, -2, -5);
  scene.add(rim);

  // --- Luxury Villa Model ---
  const villa = new THREE.Group();

  // Main body
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a2e,
    metalness: 0.2,
    roughness: 0.4,
    clearcoat: 0.1,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 1.6), bodyMat);
  body.position.y = 0.4;
  body.castShadow = true;
  villa.add(body);

  // Second floor
  const secondMat = new THREE.MeshPhysicalMaterial({
    color: 0x222236,
    metalness: 0.2,
    roughness: 0.5,
  });
  const second = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 1.2), secondMat);
  second.position.set(0.3, 1.1, 0);
  second.castShadow = true;
  villa.add(second);

  // Roof
  const roofMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    metalness: 0.6,
    roughness: 0.3,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.05,
  });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.6, 4), roofMat);
  roof.position.set(0.3, 1.5, 0);
  roof.rotation.y = Math.PI / 4;
  villa.add(roof);

  // Left wing
  const wing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 1.0), bodyMat);
  wing.position.set(-1.7, 0.25, 0);
  wing.castShadow = true;
  villa.add(wing);

  // Right wing
  const wing2 = wing.clone();
  wing2.position.set(1.7, 0.25, 0);
  villa.add(wing2);

  // Windows - golden glow
  const winMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.5,
    metalness: 0.1,
    roughness: 0.2,
  });
  for (let i = 0; i < 4; i++) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.25), winMat);
    win.position.set(-0.5 + i * 0.5, 0.4, 0.81);
    villa.add(win);
    const win2 = win.clone();
    win2.position.z = -0.81;
    villa.add(win2);
  }

  // Upper windows
  for (let i = 0; i < 3; i++) {
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.2), winMat);
    win.position.set(-0.1 + i * 0.4, 1.1, 0.61);
    villa.add(win);
    const win2 = win.clone();
    win2.position.z = -0.61;
    villa.add(win2);
  }

  // Entrance
  const entMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a1a,
    metalness: 0.5,
    roughness: 0.2,
  });
  const ent = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.15), entMat);
  ent.position.set(0.3, 0.25, 0.88);
  villa.add(ent);

  // Pool
  const poolMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a2a4a,
    metalness: 0.1,
    roughness: 0.05,
    transparent: true,
    opacity: 0.7,
    envMapIntensity: 0.3,
  });
  const pool = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 0.4), poolMat);
  pool.position.set(-1.0, 0.0, 1.3);
  villa.add(pool);

  // Ground plane
  const groundMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a12,
    roughness: 0.9,
    metalness: 0.0,
  });
  const groundPlane = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), groundMat);
  groundPlane.rotation.x = -Math.PI / 2;
  groundPlane.position.y = -0.05;
  groundPlane.receiveShadow = true;
  villa.add(groundPlane);

  villa.position.y = 0;
  scene.add(villa);

  // Surrounding trees (simple cone + cylinder)
  function createTree(x, z) {
    const tree = new THREE.Group();
    const trunkMat = new THREE.MeshPhysicalMaterial({ color: 0x2a1a0a, roughness: 0.9 });
    const leafMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a2a0a,
      roughness: 0.8,
      emissive: 0x0a2a0a,
      emissiveIntensity: 0.05,
    });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.3), trunkMat);
    trunk.position.y = 0.15;
    tree.add(trunk);
    const leaves = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.3, 6), leafMat);
    leaves.position.y = 0.35;
    tree.add(leaves);
    tree.position.set(x, 0, z);
    return tree;
  }

  const positions = [
    [-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8],
    [-2.2, -1.2], [2.2, -1.2], [-2.0, 1.2], [2.0, 1.2]
  ];
  positions.forEach(([x, z]) => {
    const tree = createTree(x, z);
    tree.scale.setScalar(0.6 + Math.random() * 0.4);
    scene.add(tree);
  });

  // Floating particles
  const pCount = 150;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 12;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 4 + 2;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.02,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Resize
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', handleResize);

  // Mouse
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // Animation
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = performance.now() * 0.001;

    // Slow orbit
    villa.rotation.y += delta * 0.1;

    // Mouse parallax
    villa.position.x += (mouseX * 0.5 - villa.position.x) * 0.02;
    villa.position.y += (mouseY * 0.3 + 0 - villa.position.y) * 0.02;

    particles.rotation.y += delta * 0.03;

    renderer.render(scene, camera);
  }
  animate();
})();
