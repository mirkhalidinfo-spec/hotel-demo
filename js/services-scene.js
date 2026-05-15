/* ============================================
   SERVICES PAGE - 3D Scene
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
  const goldLight = new THREE.PointLight(0xc9a84c, 0.4, 10);
  goldLight.position.set(-2, 3, 3);
  scene.add(goldLight);

  // Floating geometric shapes representing different services
  const shapes = [];

  function createShape(type, x, y, z) {
    let geo;
    const color = new THREE.Color().setHSL(0.1, 0.4, 0.2 + Math.random() * 0.15);

    switch(type) {
      case 0: geo = new THREE.OctahedronGeometry(0.4); break;
      case 1: geo = new THREE.DodecahedronGeometry(0.35); break;
      case 2: geo = new THREE.TorusKnotGeometry(0.25, 0.1, 64, 8); break;
      case 3: geo = new THREE.IcosahedronGeometry(0.35); break;
      case 4: geo = new THREE.TetrahedronGeometry(0.4); break;
    }

    const mat = new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.4,
      roughness: 0.3,
      emissive: 0xc9a84c,
      emissiveIntensity: 0.05,
      transparent: true,
      opacity: 0.6,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.userData = {
      type: type,
      speed: 0.3 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
      baseY: y,
      rotSpeed: { x: 0.5 + Math.random(), y: 0.5 + Math.random(), z: 0.3 + Math.random() },
    };
    scene.add(mesh);
    shapes.push(mesh);

    // Gold wireframe overlay
    const wireMat = new THREE.MeshPhysicalMaterial({
      color: 0xc9a84c,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const wire = new THREE.Mesh(geo.clone(), wireMat);
    wire.position.copy(mesh.position);
    wire.scale.set(1.05, 1.05, 1.05);
    wire.userData = mesh.userData;
    scene.add(wire);
    shapes.push(wire);

    return mesh;
  }

  // Create shapes in a circle
  const shapeTypes = [0, 1, 2, 3, 4, 0, 1, 2];
  const radius = 2.5;
  shapeTypes.forEach((type, i) => {
    const angle = (i / shapeTypes.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 0.3 + Math.random() * 0.5;
    createShape(type, x, y, z);
  });

  // Particles
  const pCount = 200;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 12;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 6;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.02,
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

    shapes.forEach((mesh) => {
      const data = mesh.userData;
      mesh.rotation.x += delta * data.rotSpeed.x;
      mesh.rotation.y += delta * data.rotSpeed.y;
      mesh.rotation.z += delta * data.rotSpeed.z;
      mesh.position.y = data.baseY + Math.sin(elapsed * data.speed + data.phase) * 0.2;
    });

    particles.rotation.y += delta * 0.02;

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 0.3 + 1 - camera.position.y) * 0.02;
    camera.lookAt(0, 0.5, 0);

    renderer.render(scene, camera);
  }
  animate();
})();
