import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const viewer = document.getElementById('viewer');
if (!viewer) {
  console.error('Không tìm thấy element #viewer');
}

const scene = new THREE.Scene();
scene.background = null;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.setClearColor(0x000000, 0);
viewer.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, viewer.clientWidth / viewer.clientHeight, 0.1, 100);
camera.position.set(3, 2, 4);

const pmrem = new THREE.PMREMGenerator(renderer);
const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = env;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 6;
controls.target.set(0, 0.5, 0);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xff5577, 0.8);
rimLight.position.set(-4, 3, -2);
scene.add(rimLight);

scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 0.5));

const loader = new GLTFLoader();
const modelUrl = './redDice.gltf';

viewer.dataset.loading = 'Đang tải mô hình...';

loader.load(
  modelUrl,
  (gltf) => {
    console.log('Model loaded successfully:', gltf);
    const dice = gltf.scene;
    
    dice.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        console.log('Mesh found:', child.name, child.material?.name);
      }
    });
    
    dice.position.y = -0.2;
    dice.rotation.set(0.35, -0.45, 0.25);
    dice.scale.setScalar(1.1);
    scene.add(dice);
    
    delete viewer.dataset.loading;
    delete viewer.dataset.error;
    console.log('Dice added to scene');
  },
  (event) => {
    if (event.total) {
      const percent = (event.loaded / event.total) * 100;
      viewer.dataset.loading = `Đang tải: ${percent.toFixed(0)}%`;
    }
  },
  (error) => {
    console.error('Không thể tải mô hình dice', error);
    viewer.dataset.loading = '';
    viewer.dataset.error = 'Không thể tải mô hình. Kiểm tra redDice.gltf';
  }
);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  const { clientWidth, clientHeight } = viewer;
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight);
});
