const canvas3D = document.getElementById("diesel-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true });
renderer.setSize(innerWidth, innerHeight);

const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1.5, 0.5, 120, 16),
  new THREE.MeshStandardMaterial({ color: 0xff1a1a, wireframe: true })
);
scene.add(knot);

const light = new THREE.PointLight(0xffffff, 2);
light.position.set(5,5,5);
scene.add(light);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  knot.rotation.x += 0.003;
  knot.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();






