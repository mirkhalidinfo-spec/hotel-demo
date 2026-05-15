/* ============================================
   THREE.JS SETUP - Shared Scene Manager
   ============================================ */

const ThreeManager = {
  scene: null,
  camera: null,
  renderer: null,
  clock: null,
  animationId: null,
  isInitialized: false,
  cleanupFns: [],

  init(containerId = 'three-container', options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('Three.js container not found:', containerId);
      return false;
    }

    const {
      cameraFov = 75,
      cameraPosition = { x: 0, y: 0, z: 5 },
      bgColor = 0x0a0a0f,
      rendererAlpha = false,
      ambientColor = 0x404060,
      ambientIntensity = 0.5,
      directionalColor = 0xffffff,
      directionalIntensity = 1,
      directionalPosition = { x: 5, y: 10, z: 7 }
    } = options;

    // Scene
    this.scene = new THREE.Scene();
    if (!rendererAlpha) {
      this.scene.background = new THREE.Color(bgColor);
    }

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      cameraFov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: rendererAlpha
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // Clock
    this.clock = new THREE.Clock();

    // Lights
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity);
    directionalLight.position.set(directionalPosition.x, directionalPosition.y, directionalPosition.z);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(
      0x080820,
      0x1a1a2e,
      0.8
    );
    this.scene.add(hemisphereLight);

    // Add subtle point light
    const pointLight = new THREE.PointLight(0xc9a84c, 0.5, 20);
    pointLight.position.set(-3, 2, 4);
    this.scene.add(pointLight);

    // Window resize handler
    const handleResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    this.cleanupFns.push(() => window.removeEventListener('resize', handleResize));

    this.isInitialized = true;
    return true;
  },

  startAnimation(animateFn) {
    if (!this.isInitialized) return;

    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      if (animateFn) {
        animateFn(delta, elapsed);
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  },

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  dispose() {
    this.stopAnimation();
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.isInitialized = false;
  }
};
