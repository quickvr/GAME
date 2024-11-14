let scene, camera, renderer, controls;
let bullets = [];
let bulletSpeed = 300;
let terrainSize = 200;
let terrain;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.PointerLockControls(camera, document.body);
    scene.add(controls.getObject());

    // Request pointer lock on the click
    document.addEventListener('click', () => {
        controls.lock();
    });

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    generateTerrain();

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('mousedown', shoot, false);
}

function generateTerrain() {
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, 100, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
    terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -1;
    scene.add(terrain);
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

function shoot() {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    
    bullet.position.copy(camera.position);
    bullet.velocity = new THREE.Vector3();
    bullet.velocity.copy(camera.getWorldDirection(new THREE.Vector3())).multiplyScalar(bulletSpeed);
    
    bullets.push(bullet);
    scene.add(bullet);
}

function animate() {
    requestAnimationFrame(animate);
    
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.position.add(bullet.velocity.clone().multiplyScalar(0.016)); // Assuming ~60 FPS

        // Remove bullet if it goes too far
        if (bullet.position.length() > 500) {
            scene.remove(bullet);
            bullets.splice(i, 1);
        }
    }

    renderer.render(scene, camera);
}

init();
animate();
