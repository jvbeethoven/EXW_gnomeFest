import * as THREE from 'three';

export default class MeshWithSound {

  constructor(geometry, material, synth, note) {

    // create Mesh
    this.mesh = new THREE.Mesh(geometry, material);

    // configurate sound
    this.synth = synth;
    this.note = note;
    this.synthIsPlaying = false;
  }

  trigger() {

    if (!this.synthIsPlaying) {
      this.playMusic();
    }
    this.synthIsPlaying = true;
  }

  release() {
    this.synthIsPlaying = false;
    this.synth.triggerRelease();
    this.stopMusic();
  }

  playMusic() {

    this.synth.triggerAttack(this.note);

  }

  stopMusic() {

  }

}
