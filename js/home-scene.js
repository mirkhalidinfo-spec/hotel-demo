/* ============================================
   HOME PAGE - 3D Scene
   ============================================ */

(function() {
  if (typeof THREE === 'undefined') return;

  const container = document.getElementById('three-container');
  if (!container) return;

  // --- Scene Setup ---
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2, 12);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  container.appendChild(renderer.domElement);

  // --- Lights ---
  const ambientLight = new THREE.AmbientLight(0x222244, 0.6);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffeedd, 1.5);
  mainLight.position.set(5, 10, 7);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x4488ff, 0.4);
  fillLight.position.set(-5, 0, 5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xc9a84c, 0.8);
  rimLight.position.set(0, -3, -8);
  scene.add(rimLight);

  const pointLight = new THREE.PointLight(0xc9a84c, 0.6, 15);
  pointLight.position.set(-3, 3, 3);
  scene.add(pointLight);

  // --- Main Building Geometry ---
  const buildingGroup = new THREE.Group();

  // Central tower
  const towerGeo = new THREE.BoxGeometry(1.8, 3.5, 1.8);
  const towerMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a2e,
    metalness: 0.3,
    roughness: 0.4,
    clearcoat: 0.1,
    envMapIntensity: 0.5,
  });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.y = 1.75;
  tower.castShadow = true;
  buildingGroup.add(tower);

  // Tower glass panels (windows)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.15,
    metalness: 0.1,
    roughness: 0.2,
    transparent: true,
    opacity: 0.6,
  });

  for (let i = 0; i < 8; i++) {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const glassGeo = new THREE.PlaneGeometry(0.35, 0.5);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(
      (col - 0.5) * 1.1,
      0.6 + row * 0.7,
      0.91
    );
    buildingGroup.add(glass);

    // Mirror on other sides
    const glass2 = glass.clone();
    glass2.position.z = -0.91;
    buildingGroup.add(glass2);

    const glass3 = glass.clone();
    glass3.position.set(0.91, 0.6 + row * 0.7, (col - 0.5) * 1.1);
    glass3.rotation.y = Math.PI / 2;
    buildingGroup.add(glass3);

    const glass4 = glass.clone();
    glass4.position.set(-0.91, 0.6 + row * 0.7, (col - 0.5) * 1.1);
    glass4.rotation.y = Math.PI / 2;
    buildingGroup.add(glass4);
  }

  // Building crown / top
  const crownGeo = new THREE.ConeGeometry(1.2, 0.6, 4);
  const crownMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.1,
  });
  const crown = new THREE.Mesh(crownGeo, crownMat);
  crown.position.y = 3.8;
  crown.rotation.y = Math.PI / 4;
  buildingGroup.add(crown);

  // Golden spire
  const spireGeo = new THREE.CylinderGeometry(0.05, 0.15, 0.8);
  const spireMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.3,
  });
  const spire = new THREE.Mesh(spireGeo, spireMat);
  spire.position.y = 4.2;
  buildingGroup.add(spire);

  // Building base / platform
  const baseGeo = new THREE.BoxGeometry(2.8, 0.2, 2.8);
  const baseMat = new THREE.MeshPhysicalMaterial({
    color: 0x222236,
    metalness: 0.5,
    roughness: 0.3,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.1;
  base.receiveShadow = true;
  buildingGroup.add(base);

  // Side wings
  for (let side = -1; side <= 1; side += 2) {
    const wingGeo = new THREE.BoxGeometry(1.0, 2.0, 1.0);
    const wing = new THREE.Mesh(wingGeo, towerMat);
    wing.position.set(side * 1.8, 1.0, 0);
    buildingGroup.add(wing);

    // Wing windows
    for (let j = 0; j < 4; j++) {
      const wGlass = new THREE.Mesh(
        new THREE.PlaneGeometry(0.25, 0.35),
        glassMat
      );
      wGlass.position.set(side * 2.3, 0.4 + j * 0.4, 0.51);
      buildingGroup.add(wGlass);

      const wGlassBack = wGlass.clone();
      wGlassBack.position.z = -0.51;
      buildingGroup.add(wGlassBack);
    }
  }

  // Entrance
  const entranceGeo = new THREE.BoxGeometry(0.6, 1.0, 0.3);
  const entranceMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a1a,
    metalness: 0.5,
    roughness: 0.2,
    envMapIntensity: 0.3,
  });
  const entrance = new THREE.Mesh(entranceGeo, entranceMat);
  entrance.position.set(0, 0.5, 1.05);
  buildingGroup.add(entrance);

  // Entrance glow
  const glowGeo = new THREE.PlaneGeometry(0.5, 0.9);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xc9a84c,
    transparent: true,
    opacity: 0.15,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.set(0, 0.5, 1.06);
  buildingGroup.add(glow);

  scene.add(buildingGroup);

  // --- Floating Particles ---
  const particlesCount = 800;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    sizes[i] = Math.random() * 3 + 1;
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particlesMat = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.04,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // --- Gold ring orbit ---
  const ringGeo = new THREE.TorusGeometry(2.8, 0.03, 16, 100);
  const ringMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.2,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.3,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.y = 1.5;
  ring.rotation.x = Math.PI / 3;
  scene.add(ring);

  const ring2 = ring.clone();
  ring2.material = ringMat.clone();
  ring2.material.opacity = 0.15;
  ring2.scale.set(1.3, 1.3, 1.3);
  ring2.rotation.x = -Math.PI / 4;
  scene.add(ring2);

  // --- Floating orbs ---
  const orbGroup = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const orbGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a84c,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.1,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    const angle = (i / 6) * Math.PI * 2;
    const radius = 3.5;
    orb.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 2) * 0.8 + 2,
      Math.sin(angle) * radius
    );
    orb.userData = { angle, radius, speed: 0.3 + Math.random() * 0.2, offset: Math.random() * Math.PI * 2 };
    orbGroup.add(orb);
  }
  scene.add(orbGroup);

  // --- Ground plane (invisible, casts shadows) ---
  const groundGeo = new THREE.PlaneGeometry(20, 20);
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.3 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.2;
  ground.receiveShadow = true;
  scene.add(ground);

  // --- Mouse interaction ---
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // --- Resize ---
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', handleResize);

  // --- Animation ---
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = performance.now() * 0.001;

    // Rotate building slowly
    buildingGroup.rotation.y += delta * 0.15;

    // Rotate rings
    ring.rotation.z += delta * 0.2;
    ring2.rotation.z -= delta * 0.15;

    // Orbit orbs
    orbGroup.children.forEach((orb, i) => {
      const data = orb.userData;
      const angle = data.angle + elapsed * 0.2;
      orb.position.x = Math.cos(angle) * data.radius;
      orb.position.z = Math.sin(angle) * data.radius;
      orb.position.y = Math.sin(angle * 2 + elapsed * 0.5) * 0.8 + 2;
    });

    // Particles gentle movement
    const pos = particles.geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3 + 1] += Math.sin(elapsed * 0.1 + i) * 0.0003;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Mouse parallax - smooth follow
    targetRotX += (mouseY * 0.3 - targetRotX) * 0.02;
    targetRotY += (mouseX * 0.3 - targetRotY) * 0.02;
    buildingGroup.rotation.x = targetRotX * 0.1;
    buildingGroup.rotation.z = -targetRotY * 0.1;

    // Camera slight orbit
    camera.position.x = Math.sin(elapsed * 0.05) * 0.5;
    camera.lookAt(0, 1.5, 0);

    renderer.render(scene, camera);
  }

  animate();
})();
