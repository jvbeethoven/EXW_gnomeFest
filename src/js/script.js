import * as THREE from 'three';
import * as DAT from 'dat.gui/build/dat.gui.js';
import DragControls from 'three-dragcontrols';
import Tone from 'tone';
import MeshWithSound from './Models/MeshWithSound';
import addText from './lib/addText';
import loadingScreen from './lib/loadingScreen';
import menuScreen from './lib/menuScreen';
import createError from './lib/createError';


let potOfGold, torch, gnome, shroom, log, pickaxe, container, controls, scene, camera, WIDTH, HEIGHT;

const synthA = new Tone.Synth({
  portamento: .01,
  oscillator: {
    type: `square`
  },
  envelope: {
    attack: .005,
    decay: .2,
    sustain: .4,
    release: 1.4
  },
  filterEnvelope: {
    attack: .005,
    decay: .1,
    sustain: .05,
    release: .8,
    baseFrequency: 300,
    octaves: 4
  }
}).toMaster();

const synthANote = `c4`;

const synthB = new Tone.MonoSynth({
  volume: - 10,
  envelope: {
    attack: 0.1,
    decay: 0.3,
    release: 2,
  },
  filterEnvelope: {
    attack: 0.001,
    decay: 0.01,
    sustain: 0.5,
    baseFrequency: 200,
    octaves: 2.6
  }
}).toMaster();
const synthBNote = `D2`;

// const synthA = new Tone.FMSynth().toMaster();
// const synthB = new Tone.PluckSynth().toMaster();
const synthC = new Tone.Synth().toMaster();
const synthCNote = `c4`;
const synthD = new Tone.MembraneSynth().toMaster();
const synthDNote = `c2`;
const synthE = new Tone.Synth().toMaster();
const synthENote = `c2`;

const displacementMap = THREE.ImageUtils.loadTexture(`./assets/img/testmap.jpeg`);
const colormap = THREE.ImageUtils.loadTexture(`./assets/img/textures/drug_texture.jpg`);

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
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 1000) {
    createError();
  } else {
    menuScreen(true);
    const button = document.getElementById(`button`);
    button.addEventListener(`click`, loadGame);
  }
};

const loadGame = () => {
  menuScreen(false);
  createControls();
  loadingScreen(true);
  createScene();
  loadAssets()
    .then(() => render())
    .then(() => loadingScreen(false))
    .then(() => addText())
    .then(() => makeDraggable());
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
      potOfGold = new MeshWithSound(geometry, testmaterial, synthA, synthANote);
      potOfGold.mesh.scale.set(0.3, 0.3, 0.3);
      potOfGold.mesh.position.x = - 600;
      potOfGold.mesh.position.y = 150;
      potOfGold.mesh.position.z = - 70;
      potOfGold.mesh.rotation.x = 0;
      scene.add(potOfGold.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/torch.json`))
    .then(geometry => {
      torch = new MeshWithSound(geometry, testmaterial, synthB, synthBNote);
      torch.mesh.scale.set(0.4, 0.4, 0.4);
      torch.mesh.position.x = - 300;
      torch.mesh.position.y = - 90;
      torch.mesh.rotation.x = 0;
      scene.add(torch.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/shroom.json`))
    .then(geometry => {
      shroom = new MeshWithSound(geometry, testmaterial, synthC, synthCNote);
      shroom.mesh.scale.set(0.4, 0.4, 0.4);
      shroom.mesh.position.x = 0;
      shroom.mesh.position.y = - 200;
      shroom.mesh.rotation.x = 0;
      scene.add(shroom.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/log.json`))
    .then(geometry => {
      log = new MeshWithSound(geometry, testmaterial, synthD, synthDNote);
      const s = 0.9;
      log.mesh.scale.set(s, s, s);
      log.mesh.position.x = 300;
      log.mesh.position.y = - 200;
      log.mesh.rotation.x = - 10;
      log.mesh.rotation.y = 2;
      scene.add(log.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/pickaxe.json`))
    .then(geometry => {
      pickaxe = new MeshWithSound(geometry, testmaterial, synthE, synthENote);
      pickaxe.mesh.scale.set(0.4, 0.4, 0.4);
      pickaxe.mesh.position.x = 500;
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
        gnome.position.y = - 100;
        gnome.position.z = 0;
        gnome.rotation.x = 0;
        gnome.rotation.y = 0;
        gnome.rotation.z = 0;
        scene.add(gnome);
        gnomes.push(gnome);
      }
    });
};

const makeDraggable = () => new DragControls(gnomes, camera, renderer.domElement);

const checkCollision = () => {

  const potOfGoldToGnome = getgnomesCloseToObject(potOfGold);

  if (potOfGoldToGnome.length > 0) {
    potOfGold.trigger();

  } else {
    potOfGold.release();
    Tone.Transport.stop();
  }

  const torchToGnome = getgnomesCloseToObject(torch);

  if (torchToGnome.length > 0) {
    torch.trigger();
  } else {
    torch.release();
  }

  const shroomToGnome = getgnomesCloseToObject(shroom);

  if (shroomToGnome.length > 0) {
    shroom.trigger();
  } else {
    shroom.release();
  }

  const logToGnome = getgnomesCloseToObject(log);

  if (logToGnome.length > 0) {
    log.trigger();
  } else {
    log.release();
  }

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
