import * as THREE from 'three';
import * as DAT from 'dat.gui/build/dat.gui.js';
import DragControls from 'three-dragcontrols';
import Tone from 'tone';
import MeshWithSound from './Models/MeshWithSound';
import addText from './lib/addText';
import loadingScreen from './lib/loadingScreen';
import menuScreen from './lib/menuScreen';
import createError from './lib/createError';
import showNames from './lib/showNames';

let potOfGold, torch, gnome, shroom, log, pickaxe, container, controls, scene, camera,
  skydome, WIDTH, HEIGHT, potgoldGnome, torchGnome, shroomGnome, logGnome, pickaxeGnome;

const gnomeNames = [`David`, `Kawouter`, `Plop`, `Wesley`, `Gnomio`];
const currentGnomes = [];

const synthA = new Tone.Player({
  url: `assets/audio/drums.wav`,
  loop: true
}).toMaster();
const synthANote = `c4`;
const synthB = new Tone.MonoSynth({
  volume: - 15,
  oscillator: {
    type: `sine4`
  },
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
const synthC = new Tone.DuoSynth({
  vibratoAmount: 0.5,
  vibratoRate: 5,
  portamento: 0.1,
  harmonicity: 1.005,
  volume: 5,
  voice0: {
    volume: - 2,
    oscillator: {
      type: `sawtooth`
    },
    filter: {
      Q: 1,
      type: `lowpass`,
      rolloff: - 24
    },
    envelope: {
      attack: 0.01,
      decay: 0.25,
      sustain: 0.4,
      release: 1.2
    },
    filterEnvelope: {
      attack: 0.001,
      decay: 0.05,
      sustain: 0.3,
      release: 2,
      baseFrequency: 100,
      octaves: 4
    }
  },
  voice1: {
    volume: - 10,
    oscillator: {
      type: `sawtooth`
    },
    filter: {
      Q: 2,
      type: `bandpass`,
      rolloff: - 12
    },
    envelope: {
      attack: 0.25,
      decay: 4,
      sustain: 0.1,
      release: 0.8
    },
    filterEnvelope: {
      attack: 0.05,
      decay: 0.05,
      sustain: 0.7,
      release: 2,
      baseFrequency: 5000,
      octaves: - 1.5
    }
  }
}).toMaster();
const synthCNote = `G2`;
const synthD = new Tone.AMSynth({
  harmonicity: 3,
  detune: 0,
  oscillator: {
    type: `triangle`
  },
  envelope: {
    attack: 0.01,
    decay: 0.01,
    sustain: 1,
    release: 2
  },
  modulation: {
    type: `square`
  },
  modulationEnvelope: {
    attack: 0.5,
    decay: 0,
    sustain: 1,
    release: 0.5
  }
}).toMaster();
const synthDNote = `D3`;
const synthE = new Tone.Synth().toMaster();
const synthENote = `G3`;

const displacementMap = THREE.ImageUtils.loadTexture(`./assets/img/displacement.jpeg`);
const displacementMap2 = THREE.ImageUtils.loadTexture(`./assets/img/displacement2.png`);
const displacementMap3 = THREE.ImageUtils.loadTexture(`./assets/img/displacement3.jpeg`);
const displacementMap4 = THREE.ImageUtils.loadTexture(`./assets/img/displacement4.png`);
const displacementMap5 = THREE.ImageUtils.loadTexture(`./assets/img/displacement5.jpeg`);

const colormap = THREE.ImageUtils.loadTexture(`./assets/img/textures/drug_texture.jpg`);
const seaTexture = THREE.ImageUtils.loadTexture(`./assets/img/seatexture.jpeg`);
const texture1 = THREE.ImageUtils.loadTexture(`./assets/img/texture1.jpeg`);
const texture2 = THREE.ImageUtils.loadTexture(`./assets/img/texture2.png`);

const potOfGoldMaterial = new THREE.MeshPhongMaterial({
  map: colormap,
  displacementMap: displacementMap,
  displacementScale: 0,
  displacementBias: 0,
});
const torchMaterial = new THREE.MeshPhongMaterial({
  map: texture1,
  displacementMap: displacementMap2,
  displacementScale: 0,
  displacementBias: 0,
});
const shroomMaterial = new THREE.MeshPhongMaterial({
  map: texture2,
  displacementMap: displacementMap3,
  displacementScale: 0,
  displacementBias: 0,
});
const logMaterial = new THREE.MeshPhongMaterial({
  map: seaTexture,
  displacementMap: displacementMap4,
  displacementScale: 0,
  displacementBias: 0,
});
const pickaxeMaterial = new THREE.MeshPhongMaterial({
  map: colormap,
  displacementMap: displacementMap5,
  displacementScale: 0,
  displacementBias: 0,
});

colormap.minFilter = THREE.LinearFilter;
displacementMap.minFilter = THREE.LinearFilter;
displacementMap2.minFilter = THREE.LinearFilter;
displacementMap3.minFilter = THREE.LinearFilter;
displacementMap4.minFilter = THREE.LinearFilter;
displacementMap5.minFilter = THREE.LinearFilter;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
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
    frequencySynth: 2,
    random: Math.random() * .1 + .001
  };
  gui.add(controls, `displacement`, .1, 10000, .001);
  gui.add(controls, `rotation`, 0, .1, .01);
  gui.add(controls, `random`, 0, .1, .001);
};

const createScene = () => {

  container = document.createElement(`div`);
  document.body.appendChild(container);

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, - 500, 2000);

  camera.position.set(- 10, 10, 100);
  camera.rotation.x = 0;
  camera.rotation.y = 0;
  camera.rotation.z = 0;

  //skybox
  const skygeometry = new THREE.SphereGeometry(1000, 60, 40);
  const displacementMap = THREE.ImageUtils.loadTexture(`./assets/img/displacement3.jpeg`);
  const skymaterial = new THREE.MeshPhongMaterial({
    displacementMap: displacementMap,
    displacementScale: 0,
    displacementBias: 0,
  });
  skymaterial.map = THREE.ImageUtils.loadTexture(`./assets/img/skybox.png`);
  skymaterial.minFilter = THREE.LinearFilter;
  skymaterial.side = THREE.BackSide;
  skydome = new THREE.Mesh(skygeometry, skymaterial);
  scene.add(skydome);

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
      potOfGold = new MeshWithSound(geometry, potOfGoldMaterial, synthA, synthANote, true);
      potOfGold.mesh.scale.set(0.3, 0.3, 0.3);
      potOfGold.mesh.position.x = - 600;
      potOfGold.mesh.position.y = 150;
      potOfGold.mesh.position.z = - 70;
      potOfGold.mesh.rotation.x = 0;
      scene.add(potOfGold.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/torch.json`))
    .then(geometry => {
      torch = new MeshWithSound(geometry, torchMaterial, synthB, synthBNote, false);
      torch.mesh.scale.set(0.4, 0.4, 0.4);
      torch.mesh.position.x = - 300;
      torch.mesh.position.y = - 90;
      torch.mesh.rotation.x = 0;
      scene.add(torch.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/shroom.json`))
    .then(geometry => {
      shroom = new MeshWithSound(geometry, shroomMaterial, synthC, synthCNote, false);
      shroom.mesh.scale.set(0.4, 0.4, 0.4);
      shroom.mesh.position.x = 0;
      shroom.mesh.position.y = - 100;
      shroom.mesh.rotation.x = 0;
      scene.add(shroom.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/devine.json`))
    .then(geometry => {
      log = new MeshWithSound(geometry, logMaterial, synthD, synthDNote, false);
      const s = 0.5;
      log.mesh.scale.set(s, s, s);
      log.mesh.position.x = 300;
      log.mesh.position.y = - 100;
      log.mesh.rotation.x = - .5;
      log.mesh.rotation.y = .1;
      scene.add(log.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/pickaxe.json`))
    .then(geometry => {
      pickaxe = new MeshWithSound(geometry, pickaxeMaterial, synthE, synthENote, false);
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
        gnome.name = gnomeNames[i];
        gnome.scale.set(0.2, 0.2, 0.2);
        gnome.position.x = - 180 + (i * 70);
        gnome.position.y = - 300;
        gnome.position.z = 0;
        gnome.rotation.x = 0;
        gnome.rotation.y = 0;
        gnome.rotation.z = 0;
        scene.add(gnome);
        gnomes.push(gnome);
        console.log(gnomes);
      }
    });
};

const randomObject = (object, bool) => {
  if (bool) {
    object.mesh.material.displacementScale += .1;
    object.mesh.rotation.x += .01;
    object.mesh.rotation.y += .005;
    object.mesh.rotation.z += .03;
  } else {
    object.mesh.material.displacementScale = 0;
  }
};

const makeDraggable = () => new DragControls(gnomes, camera, renderer.domElement);

const checkCollision = () => {

  const potOfGoldToGnome = getgnomesCloseToObject(potOfGold);
  if (potOfGoldToGnome.length > 0) {
    potOfGold.trigger();
    potgoldGnome = potOfGoldToGnome[0].name;
    currentlyDancing(potgoldGnome, true);
    skydome.rotation.y += .005;
    randomObject(potOfGold, true);
  } else if (potOfGoldToGnome.length === 0) {
    randomObject(potOfGold, false);
    currentlyDancing(potgoldGnome, false);
    skydome.rotation.z += .005;
    potOfGold.release();
    Tone.Transport.stop();
    skydome.material.displacementScale -= .01;
  }

  const torchToGnome = getgnomesCloseToObject(torch);
  if (torchToGnome.length > 0) {
    skydome.material.color.b -= .002;
    skydome.rotation.x += .005;
    torch.trigger();
    randomObject(torch, true);
    torchGnome = torchToGnome[0].name;
    currentlyDancing(torchGnome, true);
    skydome.rotation.y += .02;
  } else if (torchToGnome.length === 0) {
    currentlyDancing(torchGnome, false);
    randomObject(torch, false);
    torch.release();
  }

  const shroomToGnome = getgnomesCloseToObject(shroom);
  if (shroomToGnome.length > 0) {
    shroom.trigger();
    randomObject(shroom, true);
    shroomGnome = shroomToGnome[0].name;
    currentlyDancing(shroomGnome, true);
    skydome.rotation.z += .002;
  } else if (shroomToGnome.length === 0) {
    currentlyDancing(shroomGnome, false);
    randomObject(shroom, false);
    shroom.release();
  }

  const logToGnome = getgnomesCloseToObject(log);
  if (logToGnome.length > 0) {
    log.trigger();
    randomObject(log, true);
    logGnome = logToGnome[0].name;
    currentlyDancing(logGnome, true);
    skydome.rotation.x += .005;
    skydome.rotation.y += .005;
  } else if (logToGnome.length === 0) {
    currentlyDancing(logGnome, false);
    log.release();
    randomObject(log, false);
  }

  const pickaxeToGnome = getgnomesCloseToObject(pickaxe);
  if (pickaxeToGnome.length > 0) {
    pickaxe.trigger();
    pickaxeGnome = pickaxeToGnome[0].name;
    currentlyDancing(pickaxeGnome, true);
    skydome.rotation.z += .009;
    randomObject(pickaxe, true);
  } else if (pickaxeToGnome.length === 0) {
    currentlyDancing(pickaxeGnome, false);
    randomObject(pickaxe, false);
    pickaxe.release();
  }

};

const currentlyDancing = (object, bool) => {
  if (bool) {
    if (!currentGnomes.includes(object)) {
      currentGnomes.push(object);
      showNames(currentGnomes);
    }
  } else if (!bool) {
    const index = currentGnomes.indexOf(object);
    if (index > - 1) {
      currentGnomes.splice(index, 1);
      showNames(currentGnomes);
    }
  }

};

const getgnomesCloseToObject = object => {
  return gnomes.filter(gnome => {
    const distance = object.mesh.position.distanceTo(gnome.position);
    if (distance <= 150) { return true;
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
