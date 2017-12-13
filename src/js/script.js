import * as THREE from 'three';
import * as DAT from 'dat.gui/build/dat.gui.js';
import DragControls from 'three-dragcontrols';
import Tone from 'tone';
import MeshWithSound from './Models/MeshWithSound';


let potOfGold, torch, gnome, shroom, log, pickaxe, container, controls, scene, camera, WIDTH, HEIGHT;
// let , gnome, torch, paddestoel, log, pickaxe, container, controls,
//   scene, camera, WIDTH, HEIGHT;

const synth = new Tone.Synth({
  oscillator: {
    type: `triangle8`
  },
  envelope: {
    attack: 2,
    decay: 1,
    sustain: 0.4,
    release: 4
  }
}).toMaster();

const displacementMap = THREE.ImageUtils.loadTexture(`./assets/img/testmap.jpeg`);
const colormap = THREE.ImageUtils.loadTexture(`./assets/img/abstracttexture.jpeg`);

const testmaterial = new THREE.MeshPhongMaterial({
  map: colormap,
  displacementMap: displacementMap,
  displacementScale: 0,
  displacementBias: 0,
});

colormap.minFilter = THREE.LinearFilter;
displacementMap.minFilter = THREE.LinearFilter;


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
const gnomes = [];

const init = () => {
  console.log(window.innerWidth);
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 1000) {
    createError();
  } else {
    createControls();
    createLoadingScreen();
    createScene();
    loadAssets()
      .then(() => render())
      .then(() => removeLoadingScreen())
      .then(() => addText())
      .then(() => makeDraggable());
  }
};

const createError = () => {
  const errorContainer = document.createElement(`div`);
  errorContainer.classList.add(`errorContainer`);
  document.body.appendChild(errorContainer);

  const loading = document.createElement(`h1`);
  loading.innerHTML = `This Experiment is not supported on your device. :(`;
  loading.classList.add(`error`);
  loading.classList.add(`unselectable`);
  errorContainer.appendChild(loading);
};

const createControls = () => {
  const gui = new DAT.GUI({
    height: 5 * 32 - 1
  });
  controls = {
    displacement: .1,
    rotation: .01,
    frequencySynth: 2
  };
  gui.add(controls, `displacement`, .1, 10000, .001);
  gui.add(controls, `rotation`, 0, .1, .01);
  gui.add(controls, `frequencySynth`, 0, 20);
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

  const loadingGif = document.createElement(`img`);
  loadingGif.src = `./assets/img/loader.gif`;
  loadingGif.title = `loadingGif`;
  loadingGif.width = 240;
  loadingGif.height = 240;
  loadingGif.classList.add(`loading`);
  loadingContainer.appendChild(loadingGif);
};

const createScene = () => {

  container = document.createElement(`div`);
  document.body.appendChild(container);

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, - 200, 500);

  camera.position.set(- 10, 10, 100);
  camera.rotation.x = 0;
  camera.rotation.y = 0;
  camera.rotation.z = 0;

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 1, 1).normalize();
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040); // soft white ambientLight
  scene.add(ambientLight);

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
  title.innerHTML = `GnomeFest`;
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

  return loadWithJSONLoader(`./assets/json/potOfGold.json`)
    .then(geometry => {
      potOfGold = new MeshWithSound(geometry, testmaterial, synth);
      potOfGold.mesh.scale.set(0.3, 0.3, 0.3);
      potOfGold.mesh.position.x = - 600;
      potOfGold.mesh.position.y = 0;
      potOfGold.mesh.position.z = - 70;
      potOfGold.mesh.rotation.x = 0;
      scene.add(potOfGold.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/torch.json`))
    .then(geometry => {
      torch = new MeshWithSound(geometry, testmaterial, synth);
      torch.mesh.scale.set(0.4, 0.4, 0.4);
      torch.mesh.position.x = - 300;
      torch.mesh.position.y = 0;
      torch.mesh.rotation.x = 0;
      scene.add(torch.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/shroom.json`))
    .then(geometry => {
      shroom = new MeshWithSound(geometry, testmaterial, synth);
      shroom.mesh.scale.set(0.4, 0.4, 0.4);
      shroom.mesh.position.x = 0;
      shroom.mesh.position.y = 0;
      shroom.mesh.rotation.x = 0;
      scene.add(shroom.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/log.json`))
    .then(geometry => {
      log = new MeshWithSound(geometry, testmaterial, synth);
      const s = 0.9;
      log.mesh.scale.set(s, s, s);
      log.mesh.position.x = 300;
      log.mesh.rotation.x = - 10;
      log.mesh.rotation.y = 2;
      scene.add(log.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/pickaxe.json`))
    .then(geometry => {
      pickaxe = new MeshWithSound(geometry, testmaterial, synth);
      pickaxe.mesh.scale.set(0.4, 0.4, 0.4);
      pickaxe.mesh.position.x = 600;
      pickaxe.mesh.position.y = 10;
      pickaxe.mesh.rotation.x = 0;
      pickaxe.mesh.rotation.y = 1;
      scene.add(pickaxe.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/gnome.json`))
    .then(geometry => {
      for (let i = 0;i < 5;i ++) {
        gnome = new THREE.Mesh(geometry, material);
        gnome.scale.set(0.2, 0.2, 0.2);
        gnome.position.x = - 780 + (i * 70);
        gnome.position.y = - 350;
        gnome.position.z = 0;
        gnome.rotation.x = 0;
        gnome.rotation.y = 0;
        gnome.rotation.z = 0;
        scene.add(gnome);
        gnomes.push(gnome);
      }
    });
};

const makeDraggable = () => { new DragControls(gnomes, camera, renderer.domElement);};

const checkCollision = () => {

//check potOfGold collision
  const potOfGoldToGnome = getgnomesCloseToObject(potOfGold);

  if (potOfGoldToGnome.length > 0) {
    potOfGold.trigger();
  } else {
    potOfGold.release();
  }

//check potOfGold collision
  const torchToGnome = getgnomesCloseToObject(torch);

  if (torchToGnome.length > 0) {
    torch.trigger();
  } else {
    torch.release();
  }

//check potOfGold collision
  const shroomToGnome = getgnomesCloseToObject(shroom);

  if (shroomToGnome.length > 0) {
    shroom.trigger();
  } else {
    shroom.release();
  }

//check potOfGold collision
  const logToGnome = getgnomesCloseToObject(log);

  if (logToGnome.length > 0) {
    log.trigger();
  } else {
    log.release();
  }

//check potOfGold collision
  const pickaxeToGnome = getgnomesCloseToObject(pickaxe);

  if (pickaxeToGnome.length > 0) {
    pickaxe.trigger();
  } else {
    pickaxe.release();
  }

};

const getgnomesCloseToObject = object => {
  return gnomes.filter(gnome => {
    const distance = object.mesh.position.distanceTo(gnome.position);
    if (distance <= 100) { return true;
    } else { return false;}
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
