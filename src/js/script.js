import Tone from 'tone';
import * as THREE from 'three';
import DragControls from 'three-dragcontrols';
import TrackballControls from 'three-trackballcontrols';
//
const synth = new Tone.Synth().toMaster();

let scene, camera, fieldOfView, aspectRatio, near, far, HEIGHT, WIDTH,
  renderer, container, loader;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  //lichten activeren
  scene.add(hemisphereLight);
  scene.add(shadowLight);

};

const createGround = () => {

  loader = new THREE.TextureLoader();

  const groundTexture = loader.load(`./assets/img/textures/vaporwave.jpg`);
  // const groundTexture = loader.load(`./assets/img/textures/marble.jpg`);
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set(25, 25);
  groundTexture.anisotropy = 16;

  const groundMaterial = new THREE.MeshLambertMaterial({map: groundTexture});
  const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
  mesh.position.y = - 250;
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

};

const createTorus = () => {

  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshStandardMaterial({color: 0xffff00});
  torus = new THREE.Mesh(geometry, material);
  torus.position.x = 30;
  torus.position.y = - 10;
  scene.add(torus);

};

const createCylinder = () => {
  const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
  const material = new THREE.MeshStandardMaterial({color: 0xff0000});

  for (let i = 0;i < 2;i ++) {
    cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.x = 20 * i;
    cylinder.position.y = 20 * i;
    scene.add(cylinder);
    cylinders.push(cylinder);
  }

  const dragControls = new DragControls(cylinders, camera, renderer.domElement);

  dragControls.addEventListener(`dragstart`, e => {
    console.log(e.target);
    controls.enabled = false;
    // synth.triggerAttack(`${e.target}.C4`);
  });

  dragControls.addEventListener(`dragend`, e => {
    console.log(e);
    // synth.triggerRelease();
    controls.enabled = true;
  });

};

const checkCollision = () => {
  const torusPos = torus.position;

  cylinders.forEach(cylinder => {
    const distance = torusPos.distanceTo(cylinder.position);
    if (distance < 12) {
      console.log(`boom`);
      synth.triggerAttackRelease(`C4`, `8n`);

    }
  });

};


const animate = () => {
  controls.update();
  renderer.render(scene, camera);

  checkCollision();

  // torus.rotation.x = Date.now() * 0.0002;
  // torus.rotation.y = Date.now() * 0.001;

  cylinders.forEach(cylinder => {
    cylinder.rotation.x = Date.now() * 0.001;
    cylinder.rotation.y = Date.now() * 0.0002;
  });


  requestAnimationFrame(animate);
};


init();
