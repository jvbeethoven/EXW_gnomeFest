import synth from './lib/synth';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
const renderer = new THREE.WebGLRenderer({antialias: true});

const init = () => {

  console.log(`Hello`);
  synth();

  camera.position.z = 1;
  scene.add(mesh);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  animate();

};

const animate = () => {
  requestAnimationFrame(animate);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  renderer.render(scene, camera);
};

init();
