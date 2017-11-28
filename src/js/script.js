// import synth from './lib/synth';
import Tone from 'tone';
import * as THREE from 'three';
import DragControls from 'three-dragcontrols';
import TrackballControls from 'three-trackballcontrols';

let camera, controls, scene, renderer, container;
const objects = [];

const synth = new Tone.Synth().toMaster();

const init = () => {

  container = document.createElement(`div`);
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  controls = new TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  scene.add(new THREE.AmbientLight(0x505050));

  const light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 500, 2000);
  light.castShadow = true;
  light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 200, 10000));
  light.shadow.bias = - 0.00022;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  scene.add(light);

  const geometry = new THREE.BoxGeometry(40, 40, 40);
  for (let i = 0;i < 7;i ++) {
    const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));
    object.position.x = Math.random() * 1000 - 500;
    object.position.y = Math.random() * 600 - 300;
    object.position.z = Math.random() * 800 - 400;
    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;
    object.scale.x = Math.random() * 2 + 1;
    object.scale.y = Math.random() * 2 + 1;
    object.scale.z = Math.random() * 2 + 1;
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);
    objects.push(object);
  }

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);

  const dragControls = new DragControls(objects, camera, renderer.domElement);

  dragControls.addEventListener(`dragstart`, e => {
    console.log(e.target);
    // console.log(`object${  objects}`);
    controls.enabled = false;
    synth.triggerAttack(`${e.target}.C4`);
  });

  dragControls.addEventListener(`dragend`, e => {
    console.log(e);
    synth.triggerRelease();
    controls.enabled = true;
  });

  window.addEventListener(`resize`, onWindowResize, false);
  animate();

};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

};

const animate = () => {

  requestAnimationFrame(animate);
  render();

};

const render = () => {
  controls.update();
  renderer.render(scene, camera);

};

init();
