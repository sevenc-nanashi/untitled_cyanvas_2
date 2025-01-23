import { Midi } from "@tonejs/midi";
import data from "./assets/main.mid?uint8array";

export const midi = new Midi(data);
midi.tracks = midi.tracks.filter((track) => !track.name.startsWith("#"));
