import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const loadModel = (modelData, container) => {
  const scene = new THREE.Scene();

  // Renderer with transparent background
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.setClearColor(0x000000, 0); // Fully transparent
  container.appendChild(renderer.domElement);

  // Camera
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  scene.add(camera);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 2));

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 15, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  let userControlling = false;
  controls.addEventListener('start', () => (userControlling = true));
  controls.addEventListener('end', () => (userControlling = false));

  // Load Model
  const loader = new FBXLoader();
  let fbx;

  try {
    fbx = loader.parse(modelData);

    // Compute original bounding box
    const box = new THREE.Box3().setFromObject(fbx);
    const boxSize = new THREE.Vector3();
    box.getSize(boxSize);

    // Scale model to fit inside a standard bounding size
    const FIXED_BOX_SIZE = 10;
    const maxModelSize = Math.max(boxSize.x, boxSize.y, boxSize.z);
    let scaleFactor = FIXED_BOX_SIZE / maxModelSize;

    // Prevent models from being too tiny
    if (scaleFactor < 0.1) scaleFactor = 0.1;

    fbx.scale.set(scaleFactor, scaleFactor, scaleFactor);

    // Center the model
    const newBox = new THREE.Box3().setFromObject(fbx);
    const newCenter = new THREE.Vector3();
    newBox.getCenter(newCenter);
    fbx.position.sub(newCenter);

    // Apply material and shadows
    directionalLight.castShadow = false;
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    

    scene.add(fbx);

    // **🚀 Adjust Camera Distance Dynamically 🚀**
    const modelBoundingSphere = newBox.getBoundingSphere(new THREE.Sphere());
    const modelRadius = modelBoundingSphere.radius;
    const minViewDistance = modelRadius * 2.5; // Ensure model fits well in view
    camera.position.set(0, modelRadius * 1.5, minViewDistance);
    camera.lookAt(0, 0, 0);
    controls.update();

    // console.log('Model loaded and resized successfully');
  } catch (error) {
    console.error('Error parsing the model:', error);
    return;
  }

  // Ground Plane (Optional, Can Be Removed)
  const ground = new THREE.Mesh(
    // new THREE.PlaneGeometry(100, 100),
    // new THREE.ShadowMaterial({ opacity: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -5;
  ground.receiveShadow = true;
  scene.add(ground);

  // Animate Rotation
  const rotationSpeed = 0.009;
  const animate = () => {
    requestAnimationFrame(animate);
    if (!userControlling && fbx) {
      fbx.rotation.y += rotationSpeed;
    }
    controls.update();
    renderer.render(scene, camera);
  };

  animate();
};
