import type p5 from "p5";
import type { State } from "../state.ts";
import { useGraphicContext } from "../utils.ts";
import { fg, font, gray, largeFont, padding, stroke } from "../const.ts";
import { midi } from "../midi.ts";
import { easeOutQuint } from "../easing.ts";
import { Chord, Note } from "@patrady/chord-js";
import jacketUrl from "../assets/jacket.png?url";

const localPadding = 16;

let jacket: p5.Image;
const jacketSize = 360;

const preload = (p: p5) => {
  jacket = p.loadImage(jacketUrl);
};

export const draw = import.meta.hmrify((p: p5, state: State) => {
  if (!jacket) {
    preload(p);
    return;
  }
  using _context = useGraphicContext(p);

  p.drawingContext.shadowBlur = 25;
  p.drawingContext.shadowColor = "#fff";
  p.translate(padding, p.height - padding);
  p.fill(fg);
  p.noStroke();
  p.textSize(32);
  p.textFont(font);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(
    "Nanashi. [from Chart Cyanvas]",
    jacketSize + localPadding,
    0,
  );
  p.textSize(64);
  p.textFont(largeFont);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text("Untitled Cyanvas (2)", jacketSize + localPadding, -32 - stroke * 3);

  p.drawingContext.shadowBlur = 25;
  p.drawingContext.shadowColor = `rgba(${gray.join(",")}, 0.7)`;
  p.image(jacket, 0, -jacketSize, jacketSize, jacketSize);
});
