import Tone from 'tone';

const synth = () => {
  // console.log(Tone);

  const synth = new Tone.PolySynth(3, Tone.Synth, {
    oscillator: {
      type: `fatsawtooth`,
      count: 3,
      spread: 30
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.4,
      attackCurve: `exponential`
    },
  }).toMaster();

  synth.triggerAttackRelease(`C4`, `8n`);
};

export default synth;
