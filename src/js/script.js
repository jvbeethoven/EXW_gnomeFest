import synth from './lib/synth';
import * as THREE from 'three';

let potgoud, kabouter, fakkel, paddestoel, boomstronk, pickaxe, container,
  scene, camera, WIDTH, HEIGHT;

const renderer = new THREE.WebGLRenderer({antialias: true});
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const cylindergeometry = new THREE.CylinderGeometry(.2, .2, .2, .2);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(cylindergeometry, material);

const loader = new THREE.JSONLoader();

const init = () => {

  createScene();
  loadAssets();
  loadKabouter();
  console.log(`Hello`);
  // synth();
  render();

};

const createScene = () => {

  container = document.createElement(`div`);
  document.body.appendChild(container);

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
  4,
  WIDTH / HEIGHT,
  0.11,
  500
  );

  camera.position.set(0, 0, 100);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);
  mesh2.position.x = 2;

  scene.add(mesh2);
  scene.add(mesh);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener(`resize`, handleWindowResize, false);

};

const loadAssets = () => {
  //POTGOUD
  loader.load(`./assets/json/potgoud.json`, function (geometry) {
    potgoud = new THREE.Mesh(geometry, material);
    potgoud.scale.set(0.001, 0.001, 0.001);
    potgoud.position.x = 0;
    potgoud.rotation.x = 3;
    scene.add(potgoud);
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
};

const loadKabouter = () => {
  // kabouter
  // loader.load(`./assets/json/kabouter.json`, function (geometry) {
  //   kabouter = new THREE.Mesh(geometry, material);
  //   kabouter.scale.set(0.001, 0.001, 0.001);
  //   kabouter.position.x = 4;
  //   kabouter.rotation.x = 0;
  //   scene.add(kabouter);
  // });

  loader.load(`./assets/json/kabouter.json`, loadGnome);
};

const loadGnome = () => {

  kabouter = new THREE.Mesh(geometry, material);
  kabouter.scale.set(0.001, 0.001, 0.001);
  kabouter.position.x = 4;
  kabouter.rotation.x = 0;
  scene.add(kabouter);
  console.log(loader.onload);

};

const checkCollision = () => {

  console.log(fakkel);

  // const gnomePos = kabouter.position;
  // const paddestoelPos = paddestoel.position;
  //
  // const distance = gnomePos.distanceTo(paddestoelPos);
  // if (distance < 12) {
  //   console.log(`boom`);
  synth();
  //
  // }

};

const render = () => {
  renderer.render(scene, camera);
  checkCollision();

  requestAnimationFrame(render);
};

const handleWindowResize = () => {
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

};

init();
