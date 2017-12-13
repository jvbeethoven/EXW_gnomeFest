import * as THREE from 'three';

export default class MeshWithSound {

  constructor(geometry, material, synth) {

    // create Mesh
    this.mesh = new THREE.Mesh(geometry, material);

    // configurate sound
    this.synth = synth;
    this.synthIsPlaying = false;
  }

  trigger() {
    // this.mesh.material.displacementScale += controls.displacement;
    // this.mesh.rotation.x += controls.rotation;
    // this.mesh.rotation.y += controls.rotation;


    if (!this.synthIsPlaying) {
      console.log(this.synth);
      this.synth.triggerAttack(`C4`);
      console.log(`play`);
    }
    this.synthIsPlaying = true;
  }

  release() {
    // potgoud.mesh.material.displacementScale = 0;
    this.synthIsPlaying = false;
    this.synth.triggerRelease();
  }

}
