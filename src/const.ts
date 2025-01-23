import { midi } from "./midi.ts";
import { toRgb } from "./utils.ts";

export const width = 1920;
export const height = 1080;

export const bg = [255, 255, 255];
export const fg = toRgb(0x83ccd2);
export const fill = toRgb(0x83ccd2);

export const gray = toRgb(0xcbd5e1);

export const font = "M+ 1c Regular";
export const largeFont = "M+ 1c Light";

export const stroke = 3;
export const padding = 32;

export const frameRate = 60;

export const songLength = midi.header.ticksToSeconds(
  Math.max(
    ...midi.tracks.flatMap((track) =>
      track.notes.map((note) => note.ticks + note.durationTicks),
    ),
  ),
);
