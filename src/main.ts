import p5 from "p5";
import "./style.css";
import { attachCapturerUi } from "p5-frame-capturer";
import { frameRate, height, width } from "./const.ts";
import { draw } from "./draw.ts";
import { State } from "./state.ts";

const instance = new p5((p: p5) => {
  const state = new State(0, false);
  p.setup = () => {
    p.frameRate(frameRate);
    p.createCanvas(width, height);
  };

  p.draw = () => {
    draw(p, state);
  };
});

attachCapturerUi(instance);
