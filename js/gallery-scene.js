/* ============================================
   GALLERY PAGE - 3D Scene
   ============================================ */

(function() {
  if (typeof THREE === 'undefined') return;

  const container = document.getElementById('three-container');
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1, 8);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0x222244, 0.5);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffeedd, 1.0);
  dirLight.position.set(2, 4, 5);
  scene.add(dirLight);
  const rimLight = new THREE.DirectionalLight(0xc9a84c, 0.3);
  rimLight.position.set(-3, 1, -5);
  scene.add(rimLight);

  // Floating frames
  const frames = [];
  const frameMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: 0.15,
  });

  const innerMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a2e,
    roughness: 0.8,
    metalness: 0.1,
    transparent: true,
    opacity: 0.5,
  });

  const positions = [
    { x: -2.5, y: 0.5, z: -1, rotY: 0.2 },
    { x: 0, y: 0.8, z: -1.5, rotY: 0 },
    { x: 2.5, y: 0.3, z: -1, rotY: -0.2 },
    { x: -1.5, y: -0.3, z: -0.5, rotY: 0.3 },
    { x: 1.5, y: -0.1, z: -0.5, rotY: -0.3 },
  ];

  positions.forEach((pos) => {
    const g = new THREE.Group();

    // Outer frame
    const frameGeo = new THREE.BoxGeometry(0.8, 0.05, 0.6);
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 0;
    g.add(frame);

    // Inner panel
    const panelGeo = new THREE.PlaneGeometry(0.7, 0.5);
    const panel = new THREE.Mesh(panelGeo, innerMat);
    panel.position.z = 0.01;
    g.add(panel);

    g.position.set(pos.x, pos.y, pos.z);
    g.rotation.y = pos.rotY;
    g.userData = {
      baseY: pos.y,
      speed: 0.4 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    };
    scene.add(g);
    frames.push(g);
  });

  // Small floating dots (like photo corners)
  const dotMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.2,
    metalness: 0.8,
    roughness: 0.1,
  });

  for (let i = 0; i < 30; i++) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), dotMat);
    dot.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 8 - 2
    );
    dot.userData = {
      speed: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      baseX: dot.position.x,
      baseY: dot.position.y,
      baseZ: dot.position.z,
    };
    scene.add(dot);
    frames.push(dot);
  }

  // Particles
  const pCount = 150;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 14;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.015,
    transparent: true,
    opacity: 0.15,
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

    frames.forEach((obj) => {
      const data = obj.userData;
      if (data && data.baseY !== undefined) {
        obj.position.y = data.baseY + Math.sin(elapsed * data.speed + data.phase) * 0.1;
        obj.rotation.z = Math.sin(elapsed * data.speed * 0.5 + data.phase) * 0.02;
      }
    });

    particles.rotation.y += delta * 0.015;

    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 0.3 + 1 - camera.position.y) * 0.02;
    camera.lookAt(0, 0.3, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
