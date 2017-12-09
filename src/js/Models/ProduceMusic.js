export default class ProduceMusic {
  target = 0
  isPlaying = false
  isTriggered = false

  constructor(target, isPlaying, isTriggered) {
    this.target = target;
    this.isPlaying = isPlaying;
    this.isTriggered = isTriggered;
  }

  toggleIsPlaying = () => {
    this.isPlaying = !this.isPlaying;
  }
}
