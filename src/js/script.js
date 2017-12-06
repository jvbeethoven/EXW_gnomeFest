import * as THREE from 'three';

let potgoud, fakkel, container,
  scene, camera, abstractTexture, abstractMaterial, WIDTH, HEIGHT;

const renderer = new THREE.WebGLRenderer({antialias: false});
const material = new THREE.MeshNormalMaterial();

const loader = new THREE.JSONLoader();
const textureLoader = new THREE.TextureLoader();

const init = () => {
  createScene();
  loadAssets()
    .then(loadMaterials())
    .then(() => render());
  // console.log(`Hello`);
  // synth();
};

const loadMaterials = () => {

  abstractTexture = textureLoader.load(`./assets/textures/testure2.jpeg`);
  //displacementMap = loader.load(`./assets/textures/displacementMap.png`);
  abstractTexture.minFilter = THREE.LinearFilter;
  abstractMaterial = new THREE.MeshBasicMaterial({map: abstractTexture});
  console.log(abstractMaterial);

  /*
  const displacementMap = textureLoader.load(`./assets/textures/testure.jpeg`);

  abstractMaterial = new THREE.MeshPhongMaterial({
    color: 0x0a0100,
    displacementMap: displacementMap,
    displacementScale: 2.436143,
    displacementBias: - 0.428408,
  });
  */
};


const createScene = () => {

  container = document.createElement(`div`);
  document.body.appendChild(container);

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
  2,
  WIDTH / HEIGHT,
  0.11,
  500
  );

  camera.position.set(0, 0, 100);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
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
      potgoud = new THREE.Mesh(geometry, abstractMaterial);
      console.log(abstractMaterial);
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

const render = () => {
  //abstractMaterial.map.rotation += .03;
  potgoud.rotation.z += .01;
  potgoud.rotation.x += .02;
  abstractMaterial.map.rotation += .05;
  console.log(`waarom render ik zo traag`);

  renderer.render(scene, camera);
  //handleWindowResize();
  requestAnimationFrame(render);
};


init();
