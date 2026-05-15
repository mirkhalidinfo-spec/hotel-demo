/* ============================================
   ABOUT PAGE - 3D Scene
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
  const ambient = new THREE.AmbientLight(0x222244, 0.6);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2);
  dirLight.position.set(3, 5, 5);
  scene.add(dirLight);
  const goldLight = new THREE.PointLight(0xc9a84c, 0.5, 15);
  goldLight.position.set(-2, 3, 2);
  scene.add(goldLight);

  // Central floating geometry - Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(1.2, 1);
  const icoMat = new THREE.MeshPhysicalMaterial({
    color: 0x1a1a2e,
    metalness: 0.4,
    roughness: 0.3,
    wireframe: false,
    transparent: true,
    opacity: 0.7,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.05,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.y = 0.5;
  scene.add(ico);

  // Wireframe overlay
  const wireMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  });
  const wireIco = new THREE.Mesh(icoGeo.clone(), wireMat);
  wireIco.position.y = 0.5;
  wireIco.scale.set(1.02, 1.02, 1.02);
  scene.add(wireIco);

  // Floating golden rings around icosahedron
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(1.8 + i * 0.3, 0.015, 16, 60);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a84c,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.15,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.2 + i * 0.1,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.5;
    ring.rotation.x = Math.PI / 2 + i * 0.5;
    ring.rotation.y = i * 0.8;
    scene.add(ring);
    rings.push(ring);
  }

  // Small orbiting particles
  const particleCount = 300;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  const pSizes = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    const radius = 2 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pPos[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    pPos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius + 0.5;
    pPos[i * 3 + 2] = Math.cos(phi) * radius;
    pSizes[i] = Math.random() * 2 + 1;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.03,
    transparent: true,
    opacity: 0.3,
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

  // Animation
  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = performance.now() * 0.001;

    ico.rotation.x += delta * 0.2;
    ico.rotation.y += delta * 0.3;
    wireIco.rotation.x = ico.rotation.x;
    wireIco.rotation.y = ico.rotation.y;

    rings.forEach((ring, i) => {
      ring.rotation.x += delta * (0.15 + i * 0.05);
      ring.rotation.z += delta * (0.1 + i * 0.03);
    });

    particles.rotation.y += delta * 0.05;

    renderer.render(scene, camera);
  }
  animate();
})();
