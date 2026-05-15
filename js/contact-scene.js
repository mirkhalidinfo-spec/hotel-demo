/* ============================================
   CONTACT PAGE - 3D Scene
   ============================================ */

(function() {
  if (typeof THREE === 'undefined') return;

  const container = document.getElementById('three-container');
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.5, 7);
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
  dirLight.position.set(3, 4, 5);
  scene.add(dirLight);
  const rimLight = new THREE.PointLight(0xc9a84c, 0.3, 10);
  rimLight.position.set(-3, 1, -3);
  scene.add(rimLight);

  // Concentric rings
  const rings = [];
  for (let i = 0; i < 5; i++) {
    const radius = 1.2 + i * 0.6;
    const ringGeo = new THREE.TorusGeometry(radius, 0.008, 16, 80);
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a84c,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.1,
      metalness: 0.7,
      roughness: 0.2,
      transparent: true,
      opacity: 0.2 + (i / 5) * 0.15,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + (i % 2 === 0 ? 0.1 : -0.1);
    ring.rotation.z = i * 0.5;
    ring.userData = {
      speed: 0.2 + i * 0.05,
      phase: i * 0.5,
    };
    scene.add(ring);
    rings.push(ring);
  }

  // Central glowing orb
  const orbGeo = new THREE.SphereGeometry(0.15, 16, 16);
  const orbMat = new THREE.MeshPhysicalMaterial({
    color: 0xc9a84c,
    emissive: 0xc9a84c,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.1,
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  scene.add(orb);

  // Orb glow
  const glowGeo = new THREE.SphereGeometry(0.25, 16, 16);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xc9a84c,
    transparent: true,
    opacity: 0.1,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);

  // Particles flowing outward
  const pCount = 400;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  const pVel = new Float32Array(pCount);

  for (let i = 0; i < pCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.5 + Math.random() * 4;
    pPos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    pPos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    pPos[i * 3 + 2] = Math.cos(phi) * r;
    pVel[i] = 0.2 + Math.random() * 0.3;
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

  const pMat = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.02,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Small stationary dots for starfield
  const starCount = 200;
  const sGeo = new THREE.BufferGeometry();
  const sPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    sPos[i * 3] = (Math.random() - 0.5) * 20;
    sPos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    sPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
  }
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const sMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.01,
    transparent: true,
    opacity: 0.3,
    sizeAttenuation: true,
  });
  const stars = new THREE.Points(sGeo, sMat);
  scene.add(stars);

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
  const initialPositions = pPos.slice();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsed = performance.now() * 0.001;

    rings.forEach((ring, i) => {
      ring.rotation.x += delta * (0.3 + i * 0.02);
      ring.rotation.y += delta * (0.2 + i * 0.03);
    });

    orb.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.1);
    glow.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.1);

    // Animate particles flowing outward and resetting
    const pos = particles.geometry.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      const i3 = i * 3;
      const dx = pos[i3];
      const dy = pos[i3 + 1];
      const dz = pos[i3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist > 5) {
        // Reset to center
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i3] = Math.sin(phi) * Math.cos(theta) * 0.5;
        pos[i3 + 1] = Math.sin(phi) * Math.sin(theta) * 0.5;
        pos[i3 + 2] = Math.cos(phi) * 0.5;
      } else {
        // Move outward
        const speed = 0.5 + pVel[i];
        pos[i3] += (dx / dist) * delta * speed;
        pos[i3 + 1] += (dy / dist) * delta * speed;
        pos[i3 + 2] += (dz / dist) * delta * speed;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 0.3 + 0.5 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
