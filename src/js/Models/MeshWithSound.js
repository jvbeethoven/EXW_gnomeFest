import * as THREE from 'three';

export default class MeshWithSound {

  constructor(geometry, material, synth, note, audio) {

    // create Mesh
    this.mesh = new THREE.Mesh(geometry, material);

    // configurate sound
    this.synth = synth;
    this.note = note;
    this.synthIsPlaying = false;
    this.audio = audio;
  }

  trigger() {

    if (!this.synthIsPlaying) {
      if (this.audio) {
        this.synth.start();
      } else {
        this.synth.triggerAttack(this.note);
      }
    }
    this.synthIsPlaying = true;
  }

  release() {
    this.synthIsPlaying = false;

    if (this.audio) {
      this.synth.stop();
    } else {
      this.synth.triggerRelease();
    }
  }

}
