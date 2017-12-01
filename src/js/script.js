import synth from './lib/synth';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const cylindergeometry = new THREE.CylinderGeometry(.2, .2, .2, .2);
//const material2 = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(cylindergeometry, material);
const renderer = new THREE.WebGLRenderer({antialias: true});
const loader = new THREE.JSONLoader();

let potgoud, kabouter, fakkel, paddestoel, boomstronk, pickaxe;


const init = () => {

  loadAssets();
  console.log(`Hello`);
  synth();
  camera.position.z = 5;
  mesh2.position.x = 2;

  scene.add(mesh2);
  scene.add(mesh);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

};

const loadAssets = () => {
  //POTGOUD
  loader.load(`./assets/json/potgoud.json`, function (geometry) {
    potgoud = new THREE.Mesh(geometry, material);
    potgoud.scale.set(0.001, 0.001, 0.001);
    potgoud.position.x = 0;
    potgoud.rotation.x = 46;
    scene.add(potgoud);
  });

  //kabouter
  loader.load(`./assets/json/kabouter.json`, function (geometry) {
    kabouter = new THREE.Mesh(geometry, material);
    kabouter.scale.set(0.001, 0.001, 0.001);
    kabouter.position.x = 4;
    kabouter.rotation.x = 0;
    scene.add(kabouter);
  });

  //fakkel
  loader.load(`./assets/json/fakkel.json`, function (geometry) {
    fakkel = new THREE.Mesh(geometry, material);
    fakkel.scale.set(0.001, 0.001, 0.001);
    fakkel.position.x = 2;
    fakkel.rotation.x = 0;
    scene.add(fakkel);
  });

  //paddestoel
  loader.load(`./assets/json/paddestoel.json`, function (geometry) {
    paddestoel = new THREE.Mesh(geometry, material);
    paddestoel.scale.set(0.001, 0.001, 0.001);
    paddestoel.position.x = 4;
    paddestoel.rotation.x = 0;
    scene.add(paddestoel);
  });

  //boomstronk
  loader.load(`./assets/json/boomstronk.json`, function (geometry) {
    boomstronk = new THREE.Mesh(geometry, material);
    const s = 0.006;
    boomstronk.scale.set(s, s, s);
    boomstronk.position.x = 3;
    boomstronk.rotation.x = 0;
    scene.add(boomstronk);
  });

  //pickaxe
  loader.load(`./assets/json/pickaxe.json`, function (geometry) {
    pickaxe = new THREE.Mesh(geometry, material);
    pickaxe.scale.set(0.001, 0.001, 0.001);
    pickaxe.position.x = 4;
    pickaxe.rotation.x = 0;
    scene.add(pickaxe);
  });

  render();
};

const render = () => {
  requestAnimationFrame(render);
  scene.rotation.x += 0.01;
  /*
  mesh2.rotation.y += 0.01;
  mesh2.rotation.x += 0.01;
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  */

  renderer.render(scene, camera);
};

init();
