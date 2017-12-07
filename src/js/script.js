import synth from './lib/synth';
import * as THREE from 'three';
import DragControls from 'three-dragcontrols';

let potgoud, kabouter, fakkel, paddestoel, boomstronk, pickaxe, container,
  scene, camera, WIDTH, HEIGHT;

const renderer = new THREE.WebGLRenderer(
  {antialias: true,
    alpha: true});
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const cylindergeometry = new THREE.CylinderGeometry(.2, .2, .2, .2);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(cylindergeometry, material);

const loader = new THREE.JSONLoader();
const kabouters = [];

let lastSynthTriggerdTime = 0;

const init = () => {

  createScene();
  addText();
  loadAssets()
    .then(() => render())
    .then(() => makeDraggable());

};

const createScene = () => {

  container = document.createElement(`div`);
  document.body.appendChild(container);

  // controls = new THREE.TrackballControls(camera);

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xff0000);

  camera = new THREE.OrthographicCamera(WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, 100);
  // camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 1, 10000);

  camera.position.set(- 10, 5, 100);
  camera.rotation.X = 0;
  camera.rotation.y = 0;
  camera.rotation.z = 0;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);
  mesh2.position.x = 2;

  scene.add(mesh2);
  scene.add(mesh);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //create floor
  // const floorGeometry = new THREE.PlaneGeometry(WIDTH, HEIGHT - HEIGHT / 2);
  // const floorMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
  // const floorPlane = new THREE.Mesh(floorGeometry, floorMaterial);
  // floorPlane.position.y = - 25;
  // floorPlane.rotation.x = - Math.PI / 2;
  // floorPlane.receiveShadow = true;
  // scene.add(floorPlane);

  window.addEventListener(`resize`, handleWindowResize, false);

};

const addText = () => {

  const title = document.createElement(`h1`);
  title.innerHTML = `GnomeForest`;
  title.classList.add(`Title`);
  document.body.appendChild(title);

  const explanation = document.createElement(`h1`);
  explanation.innerHTML = `Move the gnomes to produce beautiful sounds`;
  explanation.classList.add(`exp`);
  document.body.appendChild(explanation);
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
      potgoud = new THREE.Mesh(geometry, material);
      potgoud.scale.set(0.2, 0.2, 0.2);
      potgoud.position.x = 0;
      potgoud.position.y = 0;
      potgoud.position.z = 0;
      potgoud.rotation.x = 0;
      scene.add(potgoud);
    })
    .then(() => loadWithJSONLoader(`./assets/json/fakkel.json`))
    .then(geometry => {
      fakkel = new THREE.Mesh(geometry, material);
      fakkel.scale.set(0.2, 0.2, 0.2);
      fakkel.position.x = 20;
      fakkel.rotation.x = 0;
      scene.add(fakkel);
    })
    .then(() => loadWithJSONLoader(`./assets/json/paddestoel.json`))
    .then(geometry => {
      paddestoel = new THREE.Mesh(geometry, material);
      paddestoel.scale.set(0.2, 0.2, 0.2);
      paddestoel.position.x = 40;
      paddestoel.rotation.x = 0;
      scene.add(paddestoel);
    })
    .then(() => loadWithJSONLoader(`./assets/json/boomstronk.json`))
    .then(geometry => {
      boomstronk = new THREE.Mesh(geometry, material);
      const s = 0.6;
      boomstronk.scale.set(s, s, s);
      boomstronk.position.x = - 40;
      boomstronk.rotation.x = - 10;
      boomstronk.rotation.y = 2;
      scene.add(boomstronk);
    })
    .then(() => loadWithJSONLoader(`./assets/json/pickaxe.json`))
    .then(geometry => {
      pickaxe = new THREE.Mesh(geometry, material);
      pickaxe.scale.set(0.2, 0.2, 0.2);
      pickaxe.position.x = - 60;
      pickaxe.position.y = 10;
      pickaxe.rotation.x = 0;
      pickaxe.rotation.y = 1;
      scene.add(pickaxe);
    })
    .then(() => loadWithJSONLoader(`./assets/json/kabouter.json`))
    .then(geometry => {
      for (let i = 0;i < 5;i ++) {
        kabouter = new THREE.Mesh(geometry, material);
        kabouter.scale.set(0.2, 0.2, 0.2);
        kabouter.position.x = - 780 + (i * 70);
        kabouter.position.y = - 350;
        kabouter.position.z = 0;
        kabouter.rotation.x = 0;
        kabouter.rotation.y = 0;
        kabouter.rotation.z = 0;
        scene.add(kabouter);
        kabouters.push(kabouter);
      }
    });
};

const makeDraggable = () => {
  const dragControls = new DragControls(kabouters, camera, renderer.domElement);
  console.log(dragControls);
};

const checkCollision = () => {
  const potgoudPos = potgoud.position;
  const fakkelPos = fakkel.position;
  const paddestoelPos = paddestoel.position;
  const boomstronkPos = boomstronk.position;
  const pickaxePos = pickaxe.position;

  const now = Date.now();

  kabouters.forEach(kabouter => {
    const distanceToPotgoud = potgoudPos.distanceTo(kabouter.position);
    if (distanceToPotgoud < 40) {
      //console.log(`boom potgoud`);
      if (now - lastSynthTriggerdTime > 500) {
        synth();
        lastSynthTriggerdTime = now;
      }
    }
    const distanceToFakkel = fakkelPos.distanceTo(kabouter.position);
    if (distanceToFakkel < 0.4) {
      console.log(`boom fakkel`);
    }
    const distanceToPaddestoel = paddestoelPos.distanceTo(kabouter.position);
    if (distanceToPaddestoel < 0.4) {
      console.log(`boom paddestoel`);
    }
    const distanceToBoomstronk = boomstronkPos.distanceTo(kabouter.position);
    if (distanceToBoomstronk < 0.4) {
      console.log(`boom boomstronk`);
    }
    const distanceToPickaxe = pickaxePos.distanceTo(kabouter.position);
    if (distanceToPickaxe < 0.4) {
      console.log(`boom pickaxe`);
    }
  });

};

const render = () => {
  renderer.render(scene, camera);
  checkCollision();
  requestAnimationFrame(render);
};

const handleWindowResize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

};

init();
