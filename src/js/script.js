import synth from './lib/synth';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const cylindergeometry = new THREE.CylinderGeometry(.2, .2, .2, .2);
const material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
//const material2 = new THREE.MeshBasicMaterial();
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(cylindergeometry, material);
const renderer = new THREE.WebGLRenderer({antialias: true});
const loader = new THREE.JSONLoader();

let potgoud;

const init = () => {

  loader.load(`./assets/json/potgoud.json`, function (geometry) {
    potgoud = new THREE.Mesh(geometry, material);

    potgoud.scale.set(0.01, 0.01, 0.01);
    potgoud.position.x = 0;
    potgoud.rotation.y = 2;
    scene.add(potgoud);
    animate();
  });

  console.log(`Hello`);
  synth();
  camera.position.z = 5;
  mesh2.position.x = 2;

  scene.add(mesh2);
  scene.add(mesh);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

};

const animate = () => {
  requestAnimationFrame(animate);
  /*
  mesh2.rotation.y += 0.01;
  mesh2.rotation.x += 0.01;
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  */

  renderer.render(scene, camera);
};

init();
