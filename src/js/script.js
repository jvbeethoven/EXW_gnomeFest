import * as THREE from 'three';
import * as DAT from 'dat.gui/build/dat.gui.js';
import DragControls from 'three-dragcontrols';
import Tone from 'tone';


let potgoud, kabouter, fakkel, paddestoel, boomstronk, pickaxe, container, controls,
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

colormap.minFilter = THREE.LinearFilter;


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
  createControls();
  createLoadingScreen();
  createScene();
  loadAssets()
    .then(() => render())
    .then(() => removeLoadingScreen())
    .then(() => addText())
    .then(() => makeDraggable());
};

const createControls = () => {
  const gui = new DAT.GUI({
    height: 5 * 32 - 1
  });
  controls = {
    displacement: 10
  };
  gui.add(controls, `displacement`, 5, 100);
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

//check potgoud collision
  const potgoudToGnome = kabouters.filter(kabouter => {
    const distancePotgoud = potgoud.position.distanceTo(kabouter.position);
    if (distancePotgoud <= 100) { return true;
    } else { return false;}
  });

  if (potgoudToGnome.length > 0) {
    // synthB.triggerAttack(`c1`);
    console.log(`potgoud hit`);
    potgoud.material.displacementScale = controls.displacement;
    // potgoud.material.displacementBias = Math.floor((Math.random() * 20) + 1);
  } else {
    // synthB.triggerRelease();
    // potgoud.material.displacementScale = 0;
    // potgoud.material.displacementBias = 0;
  }

//check fakkel collision
  const fakkelToGnome = kabouters.filter(kabouter => {
    const distanceFakkel = fakkel.position.distanceTo(kabouter.position);
    if (distanceFakkel <= 100) { return true;
    } else { return false;}
  });

  if (fakkelToGnome.length > 0) {
    synthA.triggerAttack(`4n`);
  } else {
    synthA.triggerRelease();
  }

//check paddestoel collision
  const paddestoelToGnome = kabouters.filter(kabouter => {
    const distancePaddestoel = paddestoel.position.distanceTo(kabouter.position);
    if (distancePaddestoel <= 100) { return true;
    } else { return false;}
  });

  if (paddestoelToGnome.length > 0) {
    // synthB.triggerAttack(`c1`);
    console.log(`paddestoel hit`);
  } else {
    // synthB.triggerRelease();
  }

//check boomstronk collision
  const boomstronkToGnome = kabouters.filter(kabouter => {
    const distanceBoomstronk = boomstronk.position.distanceTo(kabouter.position);
    if (distanceBoomstronk <= 100) { return true;
    } else { return false;}
  });

  if (boomstronkToGnome.length > 0) {
    // synthB.triggerAttack(`c1`);
    console.log(`boomstronk hit`);
  } else {
    synthB.triggerRelease();
  }

//check pickaxe collision
  const pickaxeToGnome = kabouters.filter(kabouter => {
    const distancePickaxe = pickaxe.position.distanceTo(kabouter.position);
    if (distancePickaxe <= 100) { return true;
    } else { return false;}
  });

  if (pickaxeToGnome.length > 0) {
    synthB.triggerAttack(`c1`);
  } else {
    synthB.triggerRelease();
  }

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

const synthA = new Tone.Synth({
  oscillator: {
    type: `square`,
    modulationType: `sawtooth`,
    modulationIndex: 3,
    harmonicity: 3.4
  },
  envelope: {
    attack: 0.03,
    decay: 0.1,
    sustain: 0.4,
    release: 0.1
  }
}).toMaster();

const synthB = new Tone.Synth({
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

init();
