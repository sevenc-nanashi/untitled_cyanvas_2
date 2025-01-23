export const useGraphicContext = (target: {
  push: () => void;
  pop: () => void;
}) => {
  target.push();

  return {
    [Symbol.dispose]() {
      target.pop();
    },
  };
};

export const toRgb = (hex: number): [number, number, number] => {
  const r = (hex >> 16) & 0xff;
  const g = (hex >> 8) & 0xff;
  const b = hex & 0xff;
  return [r, g, b];
};
