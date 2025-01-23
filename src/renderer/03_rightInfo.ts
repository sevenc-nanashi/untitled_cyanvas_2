import type p5 from "p5";
import type { State } from "../state.ts";
import { useGraphicContext } from "../utils.ts";
import { fg, font, gray, largeFont, padding, stroke } from "../const.ts";
import { midi } from "../midi.ts";
import { easeOutQuint } from "../easing.ts";
import { Chord, Note } from "@patrady/chord-js";

const localPadding = 16;
const width = 480;
const drumHeight = 64;

const keys = [
  [0, "Cmaj"],
  [75, "C♯maj"],
] as const;

const drumTrackDefs = [
  {
    name: "Sitala",
    midis: {
      36: "kick",
      37: "snare",
    },
  },
  {
    name: "RVK-808",
    midis: {
      50: "openHihat",
    },
  },
  {
    name: "RVK-808 2",
    midis: {
      38: "closedHihat",
    },
  },
  {
    name: "Cymbal",
    midis: {
      68: "cymbal",
    },
  },
] as const;

const chordTrack = midi.tracks.find((track) => track.name === "Piano")!;

const chordAt = (measure: number) => {
  const notes = chordTrack.notes.filter(
    (note) => Math.floor(midi.header.ticksToMeasures(note.ticks)) === measure,
  );
  if (notes.length === 0) {
    return undefined;
  }
  return Chord.for(
    [...new Set(notes.map((note) => note.midi))]
      .filter((midi) => midi >= 48)
      .toSorted((a, b) => b - a)
      .map((midi) => Note.fromMidi(midi)),
  );
};

export const draw = import.meta.hmrify((p: p5, state: State) => {
  using _context = useGraphicContext(p);

  p.translate(p.width - padding, p.height - padding);

  p.translate(0, -drumHeight / 2);
  {
    using _context = useGraphicContext(p);
    p.stroke(...gray, 128);
    p.strokeWeight(stroke);
    p.noFill();
    p.line(-width + stroke / 2, 0, -stroke / 2, 0);
  }
  {
    using _context = useGraphicContext(p);
    p.fill(fg);
    p.noStroke();
    const progressWidth = p.map(state.currentMeasure % 1, 0, 1, stroke, width);
    p.rect(-width, -stroke / 2, progressWidth, stroke, stroke / 2);
  }

  const currentMeasure = Math.floor(state.currentMeasure);
  for (const drumTrackDef of drumTrackDefs) {
    for (const [midiNumber, name] of Object.entries(drumTrackDef.midis)) {
      const notes = midi.tracks
        .find((track) => track.name === drumTrackDef.name)!
        .notes.filter(
          (note) =>
            note.midi === Number.parseInt(midiNumber) &&
            midi.header.ticksToMeasures(note.ticks) >= currentMeasure &&
            note.ticks <= state.currentTick,
        );

      for (const note of notes) {
        using _context = useGraphicContext(p);
        const measure = midi.header.ticksToMeasures(note.ticks);
        const x = p.map(measure, currentMeasure, currentMeasure + 1, -width, 0);
        const progress = p.map(
          state.currentMeasure,
          measure,
          measure + 0.3,
          0,
          1,
          true,
        );
        const alphaProgress = p.map(
          state.currentMeasure,
          measure,
          measure + 0.05,
          0,
          1,
          true,
        );
        p.stroke(...fg, 255 * alphaProgress);
        p.noFill();
        p.strokeWeight(stroke);
        p.translate(x, 0);
        switch (name) {
          case "kick": {
            const size =
              (drumHeight / 2) * Math.sqrt(2) * easeOutQuint(progress);

            p.rotate(Math.PI * 0.25);
            p.rect(-size / 2, -size / 2, size, size);
            break;
          }
          case "snare": {
            p.line(
              drumHeight / 2,
              -drumHeight / 2,
              drumHeight / 2 - drumHeight * easeOutQuint(progress),
              -drumHeight / 2 + drumHeight * easeOutQuint(progress),
            );
            break;
          }
          case "closedHihat": {
            p.line(
              0,
              (drumHeight / 8) * progress,
              0,
              (-drumHeight / 8) * progress,
            );
            break;
          }
        }
      }
    }
  }

  const lastTempo =
    midi.header.tempos.findLast((tempo) => tempo.ticks <= state.currentTick) ||
    midi.header.tempos[0];
  p.translate(0, -drumHeight / 2 - localPadding);
  p.fill(fg);
  p.textFont(font);
  p.textAlign(p.RIGHT, p.BOTTOM);
  p.textSize(32);
  p.text(
    `${Math.floor(state.currentMeasure)}.${Math.floor(
      (state.currentMeasure % 1) * 4 + 1,
    )}.${Math.floor((state.currentMeasure % 1) * 100)
      .toString()
      .padStart(2, "0")}`,
    0,
    0,
  );

  p.textAlign(p.LEFT, p.BOTTOM);

  p.text(
    `${Math.floor(state.currentTime / 60)}:${Math.floor(state.currentTime % 60)
      .toString()
      .padStart(2, "0")}.${Math.floor((state.currentTime % 1) * 1000)
      .toString()
      .padStart(3, "0")}`,
    -width,
    0,
  );
  const tempoProgress = p.map(
    state.currentTick,
    lastTempo.ticks,
    lastTempo.ticks + midi.header.ppq,
    0,
    1,
    true,
  );
  p.text(
    `♩=${Math.round(lastTempo.bpm)}  `,
    -width / 2 - 30,
    4 * (1 - tempoProgress),
  );

  p.translate(0, -32 - localPadding);
  p.textAlign(p.RIGHT, p.BOTTOM);

  const previousChord = chordAt(currentMeasure - 1);
  const chord = chordAt(currentMeasure);

  const chordProgress =
    previousChord?.getName() === chord?.getName()
      ? 1
      : p.map(
          state.currentMeasure,
          currentMeasure,
          currentMeasure + 0.25,
          0,
          1,
          true,
        );
  const currentKey = keys.findLast(([measure]) => measure <= currentMeasure)?.[1]!;
  p.text(currentKey, 0, 0);
  p.textSize(64);
  p.textFont(largeFont);
  p.textAlign(p.LEFT, p.BOTTOM);
  p.text(chord?.getName()?.replace("b", "♭") || "-", -width, 4 * (1 - chordProgress));
});
