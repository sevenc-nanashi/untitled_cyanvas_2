export const easeOutQuint = (t: number) => {
  const t1 = t - 1;
  return 1 + t1 * t1 * t1 * t1 * t1;
};
export const easeInQuint = (t: number) => {
  return t * t * t * t * t;
};
export const easeOutInQuint = (t: number) => {
  if (t < 0.5) {
    return easeOutQuint(t * 2) / 2;
  }
  return 0.5 + easeInQuint((t - 0.5) * 2) / 2;
};
