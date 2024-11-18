let scene, camera, renderer, controls;
let blocks = [];
const blockSize = 1;

init();
animate();

function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 5);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add controls
    controls = new THREE.PointerLockControls(camera, document.body);
    document.body.appendChild(controls.getElement());

    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = - Math.PI / 2;
    scene.add(ground);

    // Event listeners
    document.addEventListener('click', () => {
        controls.lock();
    });

    document.addEventListener('mousemove', (event) => {
        if (controls.isLocked) {
            controls.getObject().rotation.y -= event.movementX * 0.002;
            controls.getObject().rotation.x -= event.movementY * 0.002;
        }
    });

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('mousedown', onMouseDown, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    switch (event.code) {
        case 'KeyW':
            controls.moveForward(0.1);
            break;
        case 'KeyS':
            controls.moveForward(-0.1);
            break;
        case 'KeyA':
            controls.moveRight(-0.1);
            break;
        case 'KeyD':
            controls.moveRight(0.1);
            break;
    }
}

function onMouseDown(event) {
    if (controls.isLocked) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(blocks);

        if (intersects.length > 0) {
            const intersectedBlock = intersects[0].object;
            scene.remove(intersectedBlock);
            blocks = blocks.filter(block => block !== intersectedBlock);
        } else {
            const blockGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
            const blockMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const block = new THREE.Mesh(blockGeometry, blockMaterial);
            block.position.copy(raycaster.ray.at(5));
            scene.add(block);
            blocks.push(block);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
