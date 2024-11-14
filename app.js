// app.js

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Block properties
const blockSize = 1;
const blocks = new Set();
let currentBlockColor = '#ff0000'; // Default block color

// Function to add blocks
function addBlock(x, y, z, color) {
    const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
    const material = new THREE.MeshLambertMaterial({ color: color });
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y, z);
    scene.add(block);
    blocks.add(`${x},${y},${z}`);
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
}

generateTerrain();

// Position the camera
camera.position.set(50, 30, 50);
camera.lookAt(50, 0, 50);

// Mouse control variables
let mouseX = 0;
let mouseY = 0;
let cameraRotationSpeed = 0.002;

// Handle mouse movement for camera rotation
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Handle keyboard input for moving the camera
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w': // Forward
            camera.position.z -= 0.1 * Math.cos(camera.rotation.y);
            camera.position.x -= 0.1 * Math.sin(camera.rotation.y);
            break;
        case 's': // Backward
            camera.position.z += 0.1 * Math.cos(camera.rotation.y);
            camera.position.x += 0.1 * Math.sin(camera.rotation.y);
            break;
        case 'a': // Left
            camera.position.z -= 0.1 * Math.sin(camera.rotation.y);
            camera.position.x += 0.1 * Math.cos(camera.rotation.y);
            break;
        case 'd': // Right
            camera.position.z += 0.1 * Math.sin(camera.rotation.y);
            camera.position.x -= 0.1 * Math.cos(camera.rotation.y);
            break;
    }
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

    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
