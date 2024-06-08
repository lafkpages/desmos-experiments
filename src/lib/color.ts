export function colorToHex(color: number) {
  const r = (color >> 24) & 255;
  const g = (color >> 16) & 255;
  const b = (color >> 8) & 255;

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, "0");
}

export function desmosColorLaTeX(rgb: readonly [number, number, number]) {
  return `\\operatorname{rgb}\\left(${rgb}\\right)`;
}
