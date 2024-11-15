import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { color } from 'three/webgpu';
//gsap
import { gsap } from 'gsap';
// Texture Loader
const textureLoader = new THREE.TextureLoader();
const texture360 = textureLoader.load('model/textures/bg.png');
const matcapTexture = textureLoader.load('model/textures/matcap.png');
const texturecamo = textureLoader.load('model/textures/bliksem.png');
const flash = textureLoader.load('model/textures/flash08.png');
// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// GLTF Loader
const loader = new GLTFLoader();
loader.load('model/scene/scene.gltf', (gltf) => {
    gltf.scene.traverse((child) => {
        console.log(child.name);
        if (child.name !== 'pPlane1') {
            child.material = new THREE.MeshStandardMaterial({
                map: texturecamo, // Zorg ervoor dat 'texturecamo' gedefinieerd is
                color: 0xffffff,
            });
            
            child.material = new THREE.MeshStandardMaterial({
                map: matcapTexture,
                color: 0xffffff,
                reflectivity: 0.9,
                metalness: 0.9,
                roughness: 0.1,
            });
        }
    });
    scene.add(gltf.scene);
    
    // Animate the model rotation
    function animateModel() {
        gltf.scene.rotation.y += 0.01; // Rotate around the Y axis
        requestAnimationFrame(animateModel);
    }
    animateModel(); // Start animation loop for rotation
});


//load cube texures
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
    'public/envmap/night/px.png',
    'public/envmap/night/nx.png',
    'public/envmap/night/py.png',
    'public/envmap/night/ny.png',
    'public/envmap/night/pz.png',
    'public/envmap/night/nz.png',
]);

scene.environment = environmentMapTexture;

// Background Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(50, 32, 32),
    new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        map: texture360,
    })
);
scene.add(sphere);




// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Responsive Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
// detect scroll
window.addEventListener('scroll', () => {
    // const scrollPosition = window.scrollY;
    // gsap.to(camera.position, {
    //     duration: 0.5,
    //     ease: 'power2.out',
    //     y: scrollPosition * 0.01
    // });
    // move spaceground forward on Z on scroll
    const scrollPosition = window.scrollY;
    gsap.to(camera.position, {
        duration: 0.5,
        ease: 'power2.out',
        z: scrollPosition * 0.01
    });
})

//loop 20x, make a plane with a smoke texture in random positions
const smokeParticles = new THREE.Group();
const smokeMaterial = new THREE.MeshBasicMaterial({
    
    map: flash,
    transparent: true,
    opacity: 0.5,
    color: 0xffffff,
});
for (let i = 0; i < 20; i++) {
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(3, 3),
        smokeMaterial
    );
    plane.position.set(
        (Math.random() * 0.3) * 20,
        (Math.random() * 0.3) * 20,
       (Math.random() * 0.3) * 20,
    );
    smokeParticles.add(plane);
}
scene.add(smokeParticles);

// Animation Loop
function animate() {
    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
