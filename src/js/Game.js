import * as THREE from 'three';
import DragControls from 'three-dragcontrols';
import ProduceMusic from './Models/ProduceMusic';

let potgoud, kabouter, fakkel, paddestoel, boomstronk, pickaxe, container,
  scene, camera, WIDTH, HEIGHT;

const displacementMap = THREE.ImageUtils.loadTexture(`./assets/img/testmap2.png`);
const colormap = THREE.ImageUtils.loadTexture(`./assets/img/abstracttexture.jpeg`);

const testmaterial = new THREE.MeshPhongMaterial({
  map: colormap,
  displacementMap: displacementMap,
  displacementScale: 0,
  displacementBias: 0,
  specular: 100,
  emissive: 100,
  shininess: 3
});


const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const cylindergeometry = new THREE.CylinderGeometry(.2, .2, .2, .2);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(cylindergeometry, material);



const loader = new THREE.JSONLoader();
const kabouters = [];

const init = () => {
  createLoadingScreen();
  createScene();
  loadAssets()
    .then(() => render())
    .then(() => removeLoadingScreen())
    .then(() => addText())
    .then(() => makeDraggable());
};

const createLoadingScreen = () => {
  const loadingContainer = document.createElement(`div`);
  loadingContainer.classList.add(`loadingContainer`);
  document.body.appendChild(loadingContainer);

  const loading = document.createElement(`h1`);
  loading.innerHTML = `loading`;
  loading.classList.add(`loading`);
  loading.classList.add(`unselectable`);
  loadingContainer.appendChild(loading);
};

const createScene = () => {

  container = document.createElement(`div`);
  document.body.appendChild(container);

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, - 50, 300);

  camera.position.set(- 10, 10, 100);
  camera.rotation.x = 0;
  camera.rotation.y = 0;
  camera.rotation.z = 0;

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 1, 1).normalize();
  scene.add(light);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  mesh2.position.x = 2;

  scene.add(mesh2);
  scene.add(mesh);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener(`resize`, handleWindowResize, false);

};

const addText = () => {
  const title = document.createElement(`h1`);
  title.innerHTML = `GnomeForest`;
  title.classList.add(`Title`);
  title.classList.add(`unselectable`);
  document.body.appendChild(title);

  const explanation = document.createElement(`h1`);
  explanation.innerHTML = `Move the gnomes to produce beautiful sounds`;
  explanation.classList.add(`exp`);
  explanation.classList.add(`unselectable`);
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
      potgoud = new THREE.Mesh(geometry, testmaterial);
      potgoud.scale.set(0.3, 0.3, 0.3);
      potgoud.position.x = - 600;
      potgoud.position.y = 0;
      potgoud.position.z = 0;
      potgoud.rotation.x = 0;
      scene.add(potgoud);
    })
    .then(() => loadWithJSONLoader(`./assets/json/fakkel.json`))
    .then(geometry => {
      fakkel = new THREE.Mesh(geometry, testmaterial);
      fakkel.scale.set(0.4, 0.4, 0.4);
      fakkel.position.x = - 300;
      fakkel.position.y = 0;
      fakkel.rotation.x = 0;
      scene.add(fakkel);
    })
    .then(() => loadWithJSONLoader(`./assets/json/paddestoel.json`))
    .then(geometry => {
      paddestoel = new THREE.Mesh(geometry, material);
      paddestoel.scale.set(0.4, 0.4, 0.4);
      paddestoel.position.x = 0;
      paddestoel.rotation.x = 0;
      scene.add(paddestoel);
    })
    .then(() => loadWithJSONLoader(`./assets/json/boomstronk.json`))
    .then(geometry => {
      boomstronk = new THREE.Mesh(geometry, material);
      const s = 0.9;
      boomstronk.scale.set(s, s, s);
      boomstronk.position.x = 300;
      boomstronk.rotation.x = - 10;
      boomstronk.rotation.y = 2;
      scene.add(boomstronk);
    })
    .then(() => loadWithJSONLoader(`./assets/json/pickaxe.json`))
    .then(geometry => {
      pickaxe = new THREE.Mesh(geometry, material);
      pickaxe.scale.set(0.4, 0.4, 0.4);
      pickaxe.position.x = 600;
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


  kabouters.forEach(kabouter => {
    const distanceToPotgoud = potgoudPos.distanceTo(kabouter.position);
    const potgoudMusic = new ProduceMusic(1, false, false);
    if (distanceToPotgoud <= 100) {

      if (!potgoudMusic.isPlaying) {
        //potgoudMusic.playMusic(1);
        console.log(potgoud);
        potgoud.material.displacementScale = Math.floor((Math.random() * 20) + 1);
        potgoud.material.displacementBias = Math.floor((Math.random() * 20) + 1);
        potgoudMusic.isPlaying = true;
      }
      if (potgoudMusic.isPlaying) {
        potgoudMusic.isPlaying = true;
      }
    } else if (distanceToPotgoud > 120) {
      potgoudMusic.stopMusic(1);
      potgoudMusic.isPlaying = false;
      potgoud.material.displacementScale = 0;
      potgoud.material.displacementBias = 0;
    }

    const distanceToFakkel = fakkelPos.distanceTo(kabouter.position);
    const fakkelMusic = new ProduceMusic(2, false, false);
    if (distanceToFakkel <= 100) {

      if (!fakkelMusic.isPlaying) {
        fakkelMusic.playMusic(2);
        fakkelMusic.isPlaying = true;
      }
      if (fakkelMusic.isPlaying) {
        fakkelMusic.isPlaying = true;
      }
    } else if (distanceToFakkel > 120) {
      fakkelMusic.stopMusic(2);
      fakkelMusic.isPlaying = false;
    }


    const distanceToPaddestoel = paddestoelPos.distanceTo(kabouter.position);
    const paddestoelMusic = new ProduceMusic(3, false, false);
    if (distanceToPaddestoel <= 100) {

      if (!paddestoelMusic.isPlaying) {
        paddestoelMusic.playMusic(3);
        paddestoelMusic.isPlaying = true;
      }
      if (paddestoelMusic.isPlaying) {
        paddestoelMusic.isPlaying = true;
      }
    } else if (distanceToPaddestoel > 120) {
      paddestoelMusic.stopMusic(3);
      paddestoelMusic.isPlaying = false;
    }


    const distanceToBoomstronk = boomstronkPos.distanceTo(kabouter.position);
    const BoomstronkMusic = new ProduceMusic(4, false, false);
    if (distanceToBoomstronk <= 100) {

      if (!BoomstronkMusic.isPlaying) {
        BoomstronkMusic.playMusic(4);
        BoomstronkMusic.isPlaying = true;
      }
      if (BoomstronkMusic.isPlaying) {
        BoomstronkMusic.isPlaying = true;
      }
    } else if (distanceToBoomstronk > 120) {
      BoomstronkMusic.stopMusic(4);
      BoomstronkMusic.isPlaying = false;
    }


    const distanceToPickaxe = pickaxePos.distanceTo(kabouter.position);
    const pickaxeMusic = new ProduceMusic(5, false, false);
    if (distanceToPickaxe <= 100) {

      if (!pickaxeMusic.isPlaying) {
        pickaxeMusic.playMusic(5);
        pickaxeMusic.isPlaying = true;
      }
      if (pickaxeMusic.isPlaying) {
        pickaxeMusic.isPlaying = true;
      }
    } else if (distanceToPickaxe > 120) {
      pickaxeMusic.stopMusic(5);
      pickaxeMusic.isPlaying = false;
    }
  });

};

const removeLoadingScreen = () => {
  const elem = document.querySelector(`.loadingContainer`);
  elem.classList.add(`hide`);
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
