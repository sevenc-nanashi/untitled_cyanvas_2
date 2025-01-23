import type p5 from "p5";
import { state as capturerState, stopCapturer } from "p5-frame-capturer";
import audio from "./assets/main.wav?url";
import { bg, fg, frameRate, songLength } from "./const.ts";
import { midi } from "./midi.ts";
import type { State } from "./state.ts";

const renderers = import.meta.glob("./renderer/*.ts", {
  eager: true,
}) as Record<string, { draw: (p: p5, state: State) => void }>;
const audioElement = new Audio(audio);
audioElement.autoplay = false;

let registeredCallback: ((e: KeyboardEvent) => void) | null = null;
let erroredLastFrame = false;
export const draw = import.meta.hmrify((p: p5, state: State) => {
  if (!audioElement.paused && !state.playing) {
    audioElement.pause();
  }
  if (audioElement.paused && state.playing && !capturerState.isCapturing) {
    audioElement.play();
  }
  try {
    if (!registeredCallback) {
      registeredCallback = keydown(p, state);
      window.addEventListener(
        "keydown",
        registeredCallback as (e: KeyboardEvent) => void,
      );
    }
    if (capturerState.isCapturing) {
      state.currentFrame = capturerState.frameCount;
      if (capturerState.frameCount >= frameRate * (songLength + 5)) {
        stopCapturer();
      }
    } else if (state.playing) {
      state.currentFrame = audioElement.currentTime * frameRate;
    }
    p.background(bg);

    for (const [path, { draw }] of Object.entries(renderers)) {
      p.push();
      draw(p, state);
      p.pop();
    }

    erroredLastFrame = false;
  } catch (e) {
    p.push();
    p.background([255, 0, 0, 250]);
    p.textSize(64);
    p.textAlign(p.LEFT, p.TOP);
    p.fill([255, 255, 255]);
    p.text(String(e), 32, 32);
    p.pop();
    if (!erroredLastFrame) {
      console.error(e);
    }
    erroredLastFrame = true;
  }
});

const keydown = (p: p5, state: State) => (e: KeyboardEvent) => {
  if (e.key === " ") {
    state.playing = !state.playing;
  }
  if (e.key === "ArrowRight") {
    state.currentFrame += frameRate * 5;
    audioElement.currentTime = state.currentFrame / frameRate;
  }
  if (e.key === "ArrowLeft") {
    state.currentFrame -= frameRate * 5;
    if (state.currentFrame < 0) {
      state.currentFrame = 0;
    }
    audioElement.currentTime = state.currentFrame / frameRate;
  }
  if (e.key === "ArrowUp") {
    audioElement.volume += 0.1;
  } else if (e.key === "ArrowDown") {
    audioElement.volume -= 0.1;
  }
};

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    if (registeredCallback)
      window.removeEventListener("keydown", registeredCallback);

    audioElement.pause();
  });
}
