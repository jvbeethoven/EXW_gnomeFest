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

    if (!this.synthIsPlaying) {
      console.log(`touched`);
      this.synth.triggerAttack(`B4`);
    }
    this.synthIsPlaying = true;
  }

  release() {
    this.synthIsPlaying = false;
    console.log(`trigger release`);
    this.synth.triggerRelease();
  }

}
