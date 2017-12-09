import Tone from 'tone';

// const polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master);

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


export default class ProduceMusic {
  target = 0
  isPlaying = false

  constructor(target, isPlaying) {
    this.target = target;
    this.isPlaying = isPlaying;
  }

  toggleIsPlaying = () => {
    this.isPlaying = !this.isPlaying;
  }

  playMusic = target => {

    if (target === 1) {
      this.playDrums();
    }

    if (target === 2) {
      console.log(`2 hit`);
    }

    if (target === 3) {
      console.log(`3 hit`);
    }

    if (target === 4) {
      console.log(`4 hit`);
    }

    if (target === 5) {
      this.playFifth();
    }
  };

  stopMusic = target => {

    if (target === 1) {
      this.stopDrums();
    }

    if (target === 2) {
      console.log(`2 hit`);
    }

    if (target === 3) {
      console.log(`3 hit`);
    }

    if (target === 4) {
      console.log(`4 hit`);
    }

    if (target === 5) {
      this.stopFifth();
    }
  };


  playDrums = () => {
    // polySynth.triggerAttack([`C4`, `E4`, `G4`, `B4`]);
    synthA.triggerAttack(`4n`);
    console.log(`playing drums`);

  };

  stopDrums = () => {
    // polySynth.triggerRelease([`C4`, `E4`, `G4`, `B4`]);
    synthA.triggerRelease();

  };

  playFifth = () => {
    synthB.triggerAttack(`C1`);
    console.log(`playing fifth`);
  };

  stopFifth = () => {
    synthB.triggerRelease();
  };
}
