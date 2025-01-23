import type p5 from "p5";
import type { State } from "../state.ts";
import { toRgb, useGraphicContext } from "../utils.ts";
import { height, padding, width } from "../const.ts";
import { midi } from "../midi.ts";
import { easeInQuint, easeOutQuint } from "../easing.ts";

const colors = [
  0xcbd5e1, 0x83ccd2, 0x4ade80, 0x94a3b8, 0x0ea5e9, 0xfacc15, 0, 0, 0x8b5cf6,
  0x8b5cf6,
];
const localWidth = width - padding * 2;
const noteHeight = 8;

export const draw = import.meta.hmrify((p: p5, state: State) => {
  using _context = useGraphicContext(p);

  p.translate(padding, padding);
  const currentMeasure = Math.floor(state.currentMeasure / 4) * 4;

  const slideIn = p.map(state.currentMeasure % 4, 0, 0.5, 0, 1, true);
  const slideOut = p.map(state.currentMeasure % 4, 3.5, 4, 0, 1, true);
  p.translate(-easeInQuint(slideOut) * padding, 0);
  p.translate((1 - easeOutQuint(slideIn)) * padding, 0);

  for (const [i, color] of [...colors.entries()].toReversed()) {
    if (color === 0) {
      continue;
    }
    const track = midi.tracks[i];
    for (const note of track.notes) {
      if (midi.header.ticksToMeasures(note.ticks) < currentMeasure) {
        continue;
      }
      if (midi.header.ticksToMeasures(note.ticks) >= currentMeasure + 4) {
        break;
      }
      const x = p.map(
        midi.header.ticksToMeasures(note.ticks),
        currentMeasure,
        currentMeasure + 4,
        0,
        localWidth,
      );
      const y = height - padding - 250 - note.midi * noteHeight;
      const rightX = p.map(
        midi.header.ticksToMeasures(note.ticks + note.durationTicks),
        currentMeasure,
        currentMeasure + 4,
        0,
        localWidth,
      );
      const noteProgress = p.map(
        state.currentTick,
        note.ticks,
        note.ticks + note.durationTicks,
        0,
        1,
        true,
      );
      const width = (rightX - x) * easeOutQuint(noteProgress);
      p.fill(...toRgb(color), 192 * (1 - easeInQuint(slideOut)));
      p.noStroke();
      p.rect(x, y, width, noteHeight);
    }
  }
});
