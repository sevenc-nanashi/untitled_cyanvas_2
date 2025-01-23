import yaml from "@rollup/plugin-yaml";
import { defineConfig } from "vite";
import arraybuffer from "vite-plugin-arraybuffer";
import hmrify from "vite-plugin-hmrify";

export default defineConfig({
  plugins: [yaml(), hmrify(), arraybuffer()],
});
