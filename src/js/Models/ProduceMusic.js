import Tone from 'tone';

// const polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master);

const synthA = new Tone.Synth({
  oscillator: {
    type: `fmsquare`,
    modulationType: `sawtooth`,
    modulationIndex: 3,
    harmonicity: 3.4
  },
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0.1,
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

    switch (target) {
    case 1:
      this.playDrums();

      break;
    case 2:
      // this.playDrums(distortion, tremolo, polySynth);

      break;
    case 3:
      // this.playDrums(distortion, tremolo, polySynth);

      break;
    case 4:
      // this.playDrums(distortion, tremolo, polySynth);

      break;
    case 5:
      // this.playDrums(distortion, tremolo, polySynth);
      this.playFifth();

      break;
    default:
      console.log(`default`);
    }
  };

  stopMusic = target => {

    switch (target) {
    case 1:
      this.stopDrums();

      break;
    case 2:
      // this.stopDrums(distortion, tremolo, polySynth);

      break;
    case 3:
      // this.stopDrums(distortion, tremolo, polySynth);

      break;
    case 4:
      // this.stopDrums(distortion, tremolo, polySynth);

      break;
    case 5:
      // this.stopDrums(distortion, tremolo, polySynth);
      this.stopFifth();

      break;
    default:
      console.log(`default`);
    }
  };

  playDrums = () => {
    // polySynth.triggerAttack([`C4`, `E4`, `G4`, `B4`]);
    synthA.triggerAttack(`C4`);

  };

  stopDrums = () => {
    // polySynth.triggerRelease([`C4`, `E4`, `G4`, `B4`]);
    synthA.triggerRelease();

  };

  playFifth = () => {
    synthB.triggerAttack(`C1`);
  };

  stopFifth = () => {
    synthB.triggerRelease();
  };
}
