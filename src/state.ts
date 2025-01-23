import { frameRate } from "./const.ts";
import { midi } from "./midi.ts";

export class State {
  constructor(
    public currentFrame: number,
    public playing: boolean,
  ) {}

  get currentTick(): number {
    const tick = midi.header.secondsToTicks(this.currentTime);
    return tick;
  }

  get currentMeasure(): number {
    return midi.header.ticksToMeasures(this.currentTick);
  }

  get currentTime(): number {
    return this.currentFrame / frameRate;
  }
}
