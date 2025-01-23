/// <reference types="vite/client" />
/// <reference types="vite-plugin-hmrify/client" />
/// <reference types="vite-plugin-arraybuffer/types" />

declare module "*.yml" {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const content: any;
  export default content;
}
