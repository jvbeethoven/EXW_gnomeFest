import synth from './lib/synth';
import * as THREE from 'three';

let potgoud, fakkel, container,
  scene, camera, abstractTexture, abstractMaterial, WIDTH, HEIGHT;

const renderer = new THREE.WebGLRenderer({antialias: true});
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const cylindergeometry = new THREE.CylinderGeometry(.2, .2, .2, .2);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(cylindergeometry, material);

const loader = new THREE.JSONLoader();

const init = () => {
  abstractTexture = new THREE.TextureLoader().load(`./assets/textures/testure.jpg`);
  createScene();
  loadAssets()
    .then(() => render());
  // console.log(`Hello`);
  // synth();
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

const loadWithJSONLoader = url => {
  return new Promise(resolve => {
    loader.load(url, geometry => {
      resolve(geometry);
    });
  });
};

const loadAssets = () => {

  return loadWithJSONLoader(`./assets/json/potgoud.json`)
    .then(geometry => {
      abstractMaterial = new THREE.MeshBasicMaterial({map: abstractTexture});
      console.log(abstractMaterial);
      potgoud = new THREE.Mesh(geometry, abstractMaterial);
      potgoud.scale.set(0.001, 0.001, 0.001);
      potgoud.position.x = 0;
      potgoud.rotation.x = 3;
      scene.add(potgoud);
    })
    .then(() => loadWithJSONLoader(`./assets/json/fakkel.json`))
    .then(geometry => {
      fakkel = new THREE.Mesh(geometry, material);
      fakkel.scale.set(0.001, 0.001, 0.001);
      fakkel.position.x = 2;
      fakkel.rotation.x = 0;
      scene.add(fakkel);
    });
};


const checkCollision = () => {
  /*
  const gnomePos = kabouter.position;
  const paddestoelPos = paddestoel.position;

  const distance = gnomePos.distanceTo(paddestoelPos);
  if (distance < 12) {
    console.log(`boom`);
    synth();

  }
  */
  synth();

};

const render = () => {
//  abstractMaterial.map.rotation += .03;

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
