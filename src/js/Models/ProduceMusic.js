import Tone from 'tone';

const distortion = new Tone.Distortion(0.6);
const tremolo = new Tone.Tremolo().start();

const polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master);

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
      this.playDrums(distortion, tremolo, polySynth);

      break;
    case 2:
      this.playDrums(distortion, tremolo, polySynth);

      break;
    case 3:
      this.playDrums(distortion, tremolo, polySynth);

      break;
    case 4:
      this.playDrums(distortion, tremolo, polySynth);

      break;
    case 5:
      this.playDrums(distortion, tremolo, polySynth);

      break;
    default:
      console.log(`default`);
    }
  };

  stopMusic = target => {

    switch (target) {
    case 1:
      this.stopDrums(distortion, tremolo, polySynth);

      break;
    case 2:
      this.stopDrums(distortion, tremolo, polySynth);

      break;
    case 3:
      this.stopDrums(distortion, tremolo, polySynth);

      break;
    case 4:
      this.stopDrums(distortion, tremolo, polySynth);

      break;
    case 5:
      this.stopDrums(distortion, tremolo, polySynth);

      break;
    default:
      console.log(`default`);
    }
  };

  playDrums = (distortion, tremolo, polySynth) => {
    polySynth.triggerAttack([`C4`, `E4`, `G4`, `B4`]);

  };

  stopDrums = (distortion, tremolo, polySynth) => {
    polySynth.triggerRelease([`C4`, `E4`, `G4`, `B4`]);

  };
}
