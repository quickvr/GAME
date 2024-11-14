// app.js

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
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

// Create an initial grid of blocks
for (let x = 0; x < 10; x++) {
    for (let z = 0; z < 10; z++) {
        addBlock(x * blockSize, 0, z * blockSize, '#8B4513'); // Brown color for ground
    }
}

// Position the camera
camera.position.set(5, 5, 10);
camera.lookAt(5, 0, 5);

// Handle keyboard input for moving the camera
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            camera.position.z -= 0.5;
            break;
        case 'ArrowDown':
            camera.position.z += 0.5;
            break;
        case 'ArrowLeft':
            camera.position.x -= 0.5;
            break;
        case 'ArrowRight':
            camera.position.x += 0.5;
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
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
