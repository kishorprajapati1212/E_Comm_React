import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const loadModel = (modelData, container) => {
  const scene = new THREE.Scene();

  // Define gradient colors
  const gradientColor1 = '#ff7e5f'; // Start color
  const gradientColor2 = '#feb47b'; // End color

  // Create a canvas for gradient background
  const createGradientTexture = (color1, color2) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    // Create a gradient
    const gradient = context.createLinearGradient(0, canvas.height, 0, canvas.height);
    // const gradient = context.createLinearGradient(0, canvas.height, 0, canvas.height);  // personal choose
    gradient.addColorStop(0, color1); // Start color
    gradient.addColorStop(1, color2); // End color

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return new THREE.CanvasTexture(canvas);
  };

  // Set the background with the gradient texture
  const gradientTexture = createGradientTexture(gradientColor1, gradientColor2);
  scene.background = gradientTexture;

  // Create a camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
  camera.position.set(8, 5, 25); // Adjusted camera height for better viewing angle

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Soft ambient light
  scene.add(ambientLight);

  // Hemisphere Lights for colored reflections
  const hemisphereLightGreen = new THREE.HemisphereLight(0x00ff00, 0x444444, 1); // Sky color green, ground color dark
  scene.add(hemisphereLightGreen);

  const hemisphereLightBlue = new THREE.HemisphereLight(0x0000ff, 0x444444, 1); // Sky color blue, ground color dark
  hemisphereLightBlue.position.set(0, 0, -50); // Position it in the negative Z direction for effect
  scene.add(hemisphereLightBlue);

  // Directional light to create strong highlights and shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7); // Position the light
  directionalLight.castShadow = true; // Enable shadows for the light
  scene.add(directionalLight);

  // Create a renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true; // Enable shadow maps
  container.appendChild(renderer.domElement);

  // Control The Model
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Smoothly interpolate camera movement
  controls.dampingFactor = 0.25;
  controls.rotateSpeed = 0.35;

  let userControlling = false;
  controls.addEventListener('start', () => userControlling = true);
  controls.addEventListener('end', () => userControlling = false);

  // Load model using FBXLoader
  const loader = new FBXLoader();
  let fbx;

  try {
    fbx = loader.parse(modelData);
    fbx.scale.set(50, 35, 50);
    fbx.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting for the model
        child.material = new THREE.MeshStandardMaterial({
          color: 0xffffff, // Base color
          roughness: 3, // Lower roughness for more reflectivity
          metalness: 0.7, // Higher metalness for a more reflective surface
          map: child.material.map ? child.material.map : null
        });
      }
    });
    scene.add(fbx);
    console.log("Model is loaded successfully");
  } catch (error) {
    console.error('Error parsing the model:', error);
    return;
  }

  // Create a ground plane
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2; // Rotate to make it horizontal
  ground.position.y = -10; // Slightly below the origin to avoid clipping
  ground.receiveShadow = true; // Ground to receive shadows
  scene.add(ground);

  // Define rotation animation parameters
  const rotationSpeed = 0.009;

  const animate = () => {
    requestAnimationFrame(animate);

    // Rotate the model only if the user is not controlling it
    if (!userControlling && fbx) {
      fbx.rotation.y += rotationSpeed;
    }

    // Update orbit controls
    controls.update();
    renderer.render(scene, camera);
  };

  animate();
};
