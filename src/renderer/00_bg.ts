import type p5 from "p5";
import type { State } from "../state.ts";
import { useGraphicContext } from "../utils.ts";
import chcyChanUrl from "../assets/chcy_chan.png?url";
import notesUrl from "../assets/notes.png?url";
import { midi } from "../midi.ts";

let chcyChan: p5.Image;
let notes: p5.Image;

const preload = (p: p5) => {
  chcyChan = p.loadImage(chcyChanUrl);
  notes = p.loadImage(notesUrl);
};

const openHihatTrack = midi.tracks.find((track) => track.name === "RVK-808")!;
const cybalsTrack = midi.tracks.find((track) => track.name === "Cymbal")!;

const openHihatMidi = 50;
const cymbalsMidi = 49;

export const draw = import.meta.hmrify((p: p5, state: State) => {
  if (!chcyChan || !notes) {
    preload(p);
    return;
  }
  using _context = useGraphicContext(p);

  p.drawingContext.filter = "blur(16px)";
  const yShift = Math.sin((state.currentMeasure * Math.PI) / 4) * 6;

  const lastOpenHihat = openHihatTrack.notes.findLast(
    (note) => note.midi === openHihatMidi && note.ticks <= state.currentTick,
  );
  const lastCymbal = cybalsTrack.notes.findLast(
    (note) => note.midi === cymbalsMidi && note.ticks <= state.currentTick,
  );

  let alpha = 64;
  alpha *= p.map(
    lastOpenHihat ? state.currentTick - lastOpenHihat.ticks : midi.header.ppq * 2,
    0,
    midi.header.ppq * 2,
    0.5,
    1,
    true,
  );
  alpha *= p.map(
    lastCymbal ? state.currentTick - lastCymbal.ticks : midi.header.ppq * 4,
    0,
    midi.header.ppq * 4,
    0,
    1,
    true,
  );

  p.tint(255, alpha);
  {
    const chcyHeight = (p.width / chcyChan.width) * chcyChan.height;
    p.image(chcyChan, 0, p.height - chcyHeight + yShift, p.width, chcyHeight);
  }
  {
    const notesHeight = (p.width / notes.width) * notes.height;
    p.image(notes, 0, p.height - notesHeight - yShift, p.width, notesHeight);
  }
});
