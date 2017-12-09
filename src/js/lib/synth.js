import Tone from 'tone';

const synth = isTriggered => {
  // console.log(Tone);
  console.log(isTriggered);

  const synth = new Tone.FMSynth().toMaster();

  synth.triggerAttack(`C4`, `8n`);
};

export default synth;
