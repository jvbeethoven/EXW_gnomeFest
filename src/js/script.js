import * as THREE from 'three';
import * as DAT from 'dat.gui/build/dat.gui.js';
import DragControls from 'three-dragcontrols';
import Tone from 'tone';
import MeshWithSound from './Models/MeshWithSound';
import addText from './lib/addText';
import loadingScreen from './lib/loadingScreen';
import createError from './lib/createError';


let potOfGold, torch, gnome, shroom, log, pickaxe, container, controls, scene, camera, skydome, WIDTH, HEIGHT;


let random1;/*, random2, random3, random4, random5;*/

const synthA = new Tone.Player({
  url: `../assets/audio/drums.wav`,
  loop: true
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
    createControls();
    loadingScreen(true);
    createScene();
    loadAssets()
      .then(() => render())
      .then(() => loadingScreen(false))
      .then(() => addText())
      .then(() => createRandom())
      .then(() => makeDraggable());
  }
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
  gui.add(controls, `frequencySynth`, 0, 20);
  gui.add(controls, `random`, 0, .1, .001);
};

const createRandom = () => {
  random1 = controls.random;
  console.log(random1);
};

const createScene = () => {

  container = document.createElement(`div`);
  document.body.appendChild(container);

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, - 200, 10000);

  camera.position.set(- 10, 10, 100);
  camera.rotation.x = 0;
  camera.rotation.y = 0;
  camera.rotation.z = 0;

  //skybox
  const skygeometry = new THREE.SphereGeometry(1000, 60, 40);
  const skymaterial = new THREE.MeshBasicMaterial();
  skymaterial.map = THREE.ImageUtils.loadTexture(`./assets/img/skybox.png`);
  console.log(skymaterial);
  skymaterial.minFilter = THREE.LinearFilter;
  skymaterial.side = THREE.BackSide;
  skydome = new THREE.Mesh(skygeometry, skymaterial);
  scene.add(skydome);
  console.log(skydome);

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
      potOfGold = new MeshWithSound(geometry, testmaterial, synthA, synthANote, true);
      potOfGold.mesh.scale.set(0.3, 0.3, 0.3);
      potOfGold.mesh.position.x = - 600;
      potOfGold.mesh.position.y = 150;
      potOfGold.mesh.position.z = - 70;
      potOfGold.mesh.rotation.x = 0;
      scene.add(potOfGold.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/torch.json`))
    .then(geometry => {
      torch = new MeshWithSound(geometry, testmaterial, synthB, synthBNote, false);
      torch.mesh.scale.set(0.4, 0.4, 0.4);
      torch.mesh.position.x = - 300;
      torch.mesh.position.y = - 90;
      torch.mesh.rotation.x = 0;
      scene.add(torch.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/shroom.json`))
    .then(geometry => {
      shroom = new MeshWithSound(geometry, testmaterial, synthC, synthCNote, false);
      shroom.mesh.scale.set(0.4, 0.4, 0.4);
      shroom.mesh.position.x = 0;
      shroom.mesh.position.y = - 200;
      shroom.mesh.rotation.x = 0;
      scene.add(shroom.mesh);
    })
    .then(() => loadWithJSONLoader(`./assets/json/log.json`))
    .then(geometry => {
      log = new MeshWithSound(geometry, testmaterial, synthD, synthDNote, false);
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
      pickaxe = new MeshWithSound(geometry, testmaterial, synthE, synthENote, false);
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

const makeDraggable = () => new DragControls(gnomes, camera, renderer.domElement);

const checkCollision = () => {

  const potOfGoldToGnome = getgnomesCloseToObject(potOfGold);

  if (potOfGoldToGnome.length > 0) {
    potOfGold.trigger();
    skydome.rotation.x += controls.random;
    skydome.material.color.b -= controls.random;
  } else {
    potOfGold.release();
    Tone.Transport.stop();
    skydome.material.color.b += .002;
  }

  const torchToGnome = getgnomesCloseToObject(torch);

  if (torchToGnome.length > 0) {
    torch.trigger();
    skydome.rotation.y += controls.random;
  } else {
    torch.release();
  }

  const shroomToGnome = getgnomesCloseToObject(shroom);

  if (shroomToGnome.length > 0) {
    shroom.trigger();
    skydome.rotation.z += .002;
    skydome.material.color.r -= controls.random;
  } else {
    shroom.release();
  }

  const logToGnome = getgnomesCloseToObject(log);

  if (logToGnome.length > 0) {
    log.trigger();
    skydome.rotation.x += .005;
    skydome.material.color.r -= controls.random - Math.random();

    skydome.rotation.y += .005;
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
