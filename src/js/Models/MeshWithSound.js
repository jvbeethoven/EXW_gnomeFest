import * as THREE from 'three';

export default class MeshWithSound {

  constructor(geometry, material, synth) {

    console.log(geometry);
    console.log(material);
    console.log(synth);

    // hier de mesh maken
    this.mesh = new THREE.Mesh(geometry, material);

    // sound configureren
    this.synth = synth;
    this.synthIsPlaying = false;
  }

  trigger() {
    if (!this.synthIsPlaying) {
      // afspelen
    }
  }

  release() {
    // stoppen
  }

}
