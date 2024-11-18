// Create a scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a simple cube (representing a block in Minecraft)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create a floor
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2; // Rotate to make it horizontal
scene.add(floor);

// Set camera position
camera.position.y = 1.5; // Set camera height
camera.position.z = 5;

// Movement variables
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const speed = 0.1;
let isMovingForward = false;
let isMovingBackward = false;
let isMovingLeft = false;
let isMovingRight = false;

// Mouse control
let mouseX = 0, mouseY = 0;
const movementSpeed = 0.1;

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW': isMovingForward = true; break;
        case 'KeyS': isMovingBackward = true; break;
        case 'KeyA': isMovingLeft = true; break;
        case 'KeyD': isMovingRight = true; break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW': isMovingForward = false; break;
        case 'KeyS': isMovingBackward = false; break;
        case 'KeyA': isMovingLeft = false; break;
        case 'KeyD': isMovingRight = false; break;
    }
});

// Mouse movement event
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Handle movement
    direction.set(
        isMovingLeft ? -1 : isMovingRight ? 1 : 0,
        0,
        isMovingBackward ? -1 : isMovingForward ? 1 : 0
    );

    direction.normalize(); // Normalize to avoid faster diagonal movement
    if (direction.length() > 0) {
        camera.position.add(
            direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), camera.rotation.y).multiplyScalar(speed)
        );
    }

    // Rotate camera based on mouse movement
    camera.rotation.y += (mouseX * movementSpeed);
    camera.rotation.x -= (mouseY * movementSpeed);
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x)); // Limit vertical rotation

    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();
