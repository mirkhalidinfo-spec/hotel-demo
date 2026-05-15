/* ============================================
   PROPERTIES PAGE - 3D Scene
   ============================================ */

(function() {
  if (typeof THREE === 'undefined') return;

  const container = document.getElementById('three-container');
  if (!container) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2, 7);
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
  dirLight.position.set(3, 5, 5);
  scene.add(dirLight);
  const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
  fillLight.position.set(-3, 1, 3);
  scene.add(fillLight);

  // Building block grid
  const blocks = [];
  const gridSize = 5;
  const spacing = 0.8;

  for (let x = -gridSize; x <= gridSize; x++) {
    for (let z = -gridSize; z <= gridSize; z++) {
      const dist = Math.sqrt(x * x + z * z);
      if (dist > 5 || dist < 1) continue;

      const height = 0.3 + Math.random() * 1.2;
      const w = 0.2 + Math.random() * 0.3;
      const d = 0.2 + Math.random() * 0.3;

      const geo = new THREE.BoxGeometry(w, height, d);
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(0.1, 0.3, 0.1 + height * 0.15),
        metalness: 0.3,
        roughness: 0.5,
        emissive: 0xc9a84c,
        emissiveIntensity: height * 0.02,
      });
      const block = new THREE.Mesh(geo, mat);
      block.position.set(x * spacing, height / 2 - 0.2, z * spacing);
      block.castShadow = true;
      block.receiveShadow = true;
      block.userData = {
        baseY: height / 2 - 0.2,
        height: height,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      };
      scene.add(block);
      blocks.push(block);
    }
  }

  // Ground plane
  const groundGeo = new THREE.PlaneGeometry(12, 12);
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.15 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Gold lines on ground
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xc9a84c,
    transparent: true,
    opacity: 0.1,
  });
  for (let i = -6; i <= 6; i += 1) {
    const points = [];
    points.push(new THREE.Vector3(i, -0.15, -6));
    points.push(new THREE.Vector3(i, -0.15, 6));
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, lineMat);
    scene.add(line);

    const points2 = [];
    points2.push(new THREE.Vector3(-6, -0.15, i));
    points2.push(new THREE.Vector3(6, -0.15, i));
    const geo2 = new THREE.BufferGeometry().setFromPoints(points2);
    const line2 = new THREE.Line(geo2, lineMat);
    scene.add(line2);
  }

  // Floating particles
  const pCount = 200;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 14;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 6 + 2;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.025,
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

    blocks.forEach((block) => {
      const data = block.userData;
      block.position.y = data.baseY + Math.sin(elapsed * data.speed + data.phase) * 0.05;
    });

    camera.position.x += (mouseX * 1 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 1 + 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0.5, 0);

    particles.rotation.y += delta * 0.02;

    renderer.render(scene, camera);
  }
  animate();
})();
