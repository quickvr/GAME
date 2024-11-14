// app.js

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a grid of blocks
const blockSize = 1;
const blocks = [];
const gridSize = 5;

for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
        const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
        const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
        const block = new THREE.Mesh(geometry, material);
        block.position.set(x * blockSize, blockSize / 2, z * blockSize);
        scene.add(block);
        blocks.push(block);
    }
}

// Position the camera
camera.position.y = 5;
camera.position.z = 10;
camera.lookAt(0, 0, 0);

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
        case ' ':
            // Place a block in front of the camera
            const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
            const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
            const block = new THREE.Mesh(geometry, material);
            block.position.copy(camera.position);
            block.position.y = blockSize / 2;
            scene.add(block);
            blocks.push(block);
            break;
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
