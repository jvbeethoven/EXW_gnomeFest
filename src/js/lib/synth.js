import Tone from 'tone';

const synth = () => {
  console.log(Tone);
};

// const synth = () =>
  //pass in some initial values for the filter and filter envelope
  // const synth = new Tone.Synth({
  //   oscillator: {
  //     type: `pwm`,
  //     modulationFrequency: 0.2
  //   },
  //   envelope: {
  //     attack: 0.02,
  //     decay: 0.1,
  //     sustain: 0.2,
  //     release: 0.9,
  //   }
  // }).toMaster();
  //
  // //start the note "D3" one second from now
  // synth.triggerAttack(`D3`, `+1`);
  //
  // const polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
  // //play a chord
  // polySynth.triggerAttackRelease([`C4`, `E4`, `G4`, `B4`], `2n`);

// };

export default synth;
