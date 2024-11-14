// app.js

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create physics world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // m/s²

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10).normalize();
scene.add(directionalLight);

// Block properties
const blockSize = 1;
let currentBlockColor = '#8B4513'; // Default block color
const blocks = new Set();

// Function to add blocks
function addBlock(x, y, z, color) {
    const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
    const material = new THREE.MeshLambertMaterial({ color: color });
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y, z);
    scene.add(block);
    blocks.add(`${x},${y},${z}`);

    // Add physics body
    const blockBody = new CANNON.Box(new CANNON.Vec3(blockSize / 2, blockSize / 2, blockSize / 2));
    const blockShape = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(x, y + blockSize / 2, z),
    });
    blockShape.addShape(blockBody);
    world.addBody(blockShape);
}

// Generate terrain using Perlin noise
function generateTerrain() {
    const width = 100;
    const depth = 100;
    const heightScale = 5;

    for (let x = 0; x < width; x++) {
        for (let z = 0; z < depth; z++) {
            const height = Math.floor(Perlin.noise(x / 10, z / 10) * heightScale);
            for (let y = 0; y <= height; y++) {
                addBlock(x, y, z, '#8B4513'); // Brown color for dirt
            }
        }
    }

    // Create a ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: '#228B22' }); // Green for grass
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = - Math.PI / 2;
    ground.position.y = -1; // Position below the terrain
    scene.add(ground);
}

// Call terrain generation
generateTerrain();

// Position the camera
camera.position.set(50, 20, 50);
camera.lookAt(50, 0, 50);

// Mouse control variables
let mouseX = 0;
let mouseY = 0;
let cameraRotationSpeed = 0.002;
let velocity = new CANNON.Vec3();

// Handle mouse movement for camera rotation
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Handle keyboard input for moving the camera
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Handle block selection
const blockButtons = document.querySelectorAll('.block-button');
blockButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentBlockColor = button.getAttribute('data-color');
    });
});

// Place blocks in front of the camera
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        const blockPosition = camera.position.clone().add(direction.multiplyScalar(blockSize));
        addBlock(Math.floor(blockPosition.x), Math.floor(blockPosition.y), Math.floor(blockPosition.z), currentBlockColor);
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update camera rotation based on mouse movement
    camera.rotation.y -= (mouseX - 0.5) * cameraRotationSpeed;
    camera.rotation.x -= (mouseY - 0.5) * cameraRotationSpeed;
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x)); // Clamp vertical rotation

    // Handle movement with WASD
    const speed = 0.2;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; // Ignore vertical movement
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    if (keys['w']) {
        camera.position.add(forward.multiplyScalar(speed));
    }
    if (keys['s']) {
        camera.position.add(forward.multiplyScalar(-speed));
    }
    if (keys['a']) {
        camera.position.add(right.multiplyScalar(-speed));
    }
    if (keys['d']) {
        camera.position.add(right.multiplyScalar(speed));
    }

    // Update physics world
    world.step(1 / 60);

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
