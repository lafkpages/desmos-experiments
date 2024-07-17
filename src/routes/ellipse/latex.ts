export function ellipseLatex(
  x: string | number,
  y: string | number,
  rx: string | number,
  ry: string | number,
  angle: string | number,
) {
  x = formatArg(x);
  y = formatArg(y);
  rx = formatArg(rx);
  ry = formatArg(ry);
  angle = formatArg(angle);

  return `\\frac{\\left(\\left(x-${x}\\right)\\cos\\left(${angle}\\right)+\\left(y-${y}\\right)\\sin\\left(${angle}\\right)\\right)^{2}}{${rx}^{2}}+\\frac{\\left(\\left(x-${x}\\right)\\sin\\left(${angle}\\right)-\\left(y-${y}\\right)\\cos\\left(${angle}\\right)\\right)^{2}}{${ry}^{2}}<1`;
}

// TODO: make this general util function
export function formatArg(arg: string | number) {
  return typeof arg === "number" ? `\\left(${arg}\\right)` : arg;
}
