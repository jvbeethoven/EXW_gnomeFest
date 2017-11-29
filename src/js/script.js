// import Tone from 'tone';
import * as THREE from 'three';
import DragControls from 'three-dragcontrols';
import TrackballControls from 'three-trackballcontrols';
//
// const synth = new Tone.Synth().toMaster();

let scene, camera, fieldOfView, aspectRatio, near, far, HEIGHT, WIDTH,
  renderer, container;

let hemisphereLight, shadowLight;

let torus, cylinder, controls;
const cylinders = [];
const collidableMeshList = [];

const init = () => {

  createScene();
  createLights();

  createTorus();
  createCylinder();
  checkCollision();


  animate();
};

const createScene = () => {

  container = document.createElement(`div`);
  document.body.appendChild(container);

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();

  // camera creëren
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  near = 1;
  far = 10000;
  camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		near,
		far
		);

  // positie camera instellen
  camera.position.set(0, 0, 100);

  controls = new TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  window.addEventListener(`resize`, handleWindowResize, false);
};

const handleWindowResize = () => {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();

};

const createLights = () => {

  // gradient lichten aanmaken met sky color, ground colorn intensity
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
  // soort van parallelle zonlichten
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);


  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;

  //zichtbare deel van schaduw bepalen
  shadowLight.shadow.camera.left = - 400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = - 400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  //schaduw resolutie bepalen
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  //lichten activeren
  scene.add(hemisphereLight);
  scene.add(shadowLight);

};

const createTorus = () => {

  const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshStandardMaterial({color: 0xffff00});
  torus = new THREE.Mesh(geometry, material);
  scene.add(torus);

};

const createCylinder = () => {
  const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
  const material = new THREE.MeshStandardMaterial({color: 0xff0000});

  for (let i = 0;i < 2;i ++) {
    cylinder = new THREE.Mesh(geometry, material);
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


};

const animate = () => {
  controls.update();
  renderer.render(scene, camera);

  // torus.rotation.x = Date.now() * 0.0002;
  // torus.rotation.y = Date.now() * 0.001;

  cylinders.forEach(cylinder => {
    cylinder.rotation.x = Date.now() * 0.001;
    cylinder.rotation.y = Date.now() * 0.0002;
    collidableMeshList.push(cylinder);
  });

  collidableMeshList.push(torus);

  cylinders.forEach(cylinder => {
    const originPoint = cylinder.position.clone();
    const otherMeshes = collidableMeshList.filter(o => o !== cylinder);

    for (let vertexIndex = 0;vertexIndex < cylinder.geometry.vertices.length;vertexIndex ++) {
      const localVertex = cylinder.geometry.vertices[vertexIndex].clone();
      const globalVertex = localVertex.applyMatrix4(cylinder.matrix);
      const directionVector = globalVertex.sub(cylinder.position);

      const ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      const collisionResults = ray.intersectObjects(otherMeshes);
      if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
        console.log(`hit`);
      }
    }
  });


  requestAnimationFrame(animate);
};


init();
