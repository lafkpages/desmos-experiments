import { desmosColorLaTeX } from "./color";

function formatNumberOrList(value: number | number[]) {
  return typeof value === "number" ? value.toString() : `[${value}]`;
}

function verticalLine(x: number | number[], y: number | number[], height: number | number[]) {
  const xStr = formatNumberOrList(x);
  const yStr = formatNumberOrList(y);
  const heightStr = formatNumberOrList(height);

  return {
    latex: `\\left(Xa+At+AX-\\frac{AH}{2},ta+Ya+Af\\left(t+X-\\frac{H}{2}\\right)\\right)\\operatorname{with}X=${xStr},Y=${yStr},H=${heightStr}`,
    parametricDomain: {
      min: "",
      max: heightStr,
    },
    domain: {
      min: "0",
      max: heightStr,
    },
  };
}

export const interpolatedChars: Record<
  string,
  (
    x: number,
    y: number,
  ) => {
    latex: string;
    parametricDomain?: {
      min: string;
      max: string;
    };
    domain?: {
      min: string;
      max: string;
    };
  }[]
> = {
  A: (x, y) => [
    {
      latex: `y=a\\left(\\left[4x\\left\\{0<x<1\\right\\},-4\\left(x-2\\right)\\left\\{1<x<2\\right\\},2\\left\\{\\frac{1}{2}<x<\\frac{3}{2}\\right\\}\\right]+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  B: (x, y) => [
    verticalLine(x, y, 4),
    {
      latex: `y=\\left(a\\operatorname{join}\\left(3+\\left[1,-1\\right]\\sqrt{1-\\left(x-0.7\\right)^{2}}\\left\\{x-0.7\\ge0\\right\\}+Y,1+\\left[1,-1\\right]\\sqrt{1-\\left(x-1\\right)^{2}}\\left\\{x-1\\ge0\\right\\}+Y,\\left[Y,Y+2\\right]\\left\\{1>x>0\\right\\},\\left[Y+4\\right]\\left\\{0.7>x>0\\right\\}\\right)\\operatorname{with}x=x-${x},Y=${y}\\right)+Af\\left(x\\right)`,
    },
  ],
  C: (x, y) => [
    {
      latex: `y=a\\left(2+\\left[1,-1\\right]\\sqrt{4-2\\left(x-\\sqrt{2}\\right)^{2}}\\left\\{x\\le2\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  D: (x, y) => [
    verticalLine(x, y, 4),
    {
      latex: `y=a\\left(\\operatorname{join}\\left(\\left(2+\\left[1,-1\\right]\\sqrt{4-1.8\\left(x-0.5\\right)^{2}}\\left\\{x\\ge0.5\\right\\}\\operatorname{with}x=x-${x}\\right),\\left[0,4\\right]\\left\\{0\\le x-${x}\\le0.5\\right\\}\\right)+${y}\\right)+Af\\left(x\\right)`,
    },
  ],
  E: (x, y) => [
    verticalLine(x, y, 4),
    {
      latex: `y=a\\left(\\operatorname{join}\\left(\\left[0,4\\right]\\left\\{2\\ge x\\ge0\\right\\},\\left[2\\left\\{1.5\\ge x\\ge0\\right\\}\\right]\\right)+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  F: (x, y) => [
    verticalLine(x, y, 4),
    {
      latex: `y=a\\left(\\left[2\\left\\{1.5\\ge x\\ge0\\right\\},4\\left\\{2\\ge x\\ge0\\right\\}\\right]+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  G: (x, y) => [
    {
      latex: `y=a\\left(\\operatorname{join}\\left(2+\\left[1,-1\\right]\\sqrt{4-2\\left(x-\\sqrt{2}\\right)^{2}}\\left\\{x\\le2\\right\\}+${y},\\frac{3}{2}\\left\\{1\\le x\\le2\\right\\}+${y}\\right)\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
    verticalLine(x + 2, y + 0.18, 1.32),
  ],
  H: (x, y) => [
    verticalLine([x, x + 2], y, 4),
    {
      latex: `y=a\\left(2\\left\\{0\\le x-${x}\\le2\\right\\}+${y}\\right)+Af\\left(x\\right)`,
    },
  ],
  I: (x, y) => [
    verticalLine(x + 1, y, 4),
    {
      latex: `y=a\\left(\\left[0,4\\right]\\left\\{2\\ge x-${x}\\ge0\\right\\}+${y}\\right)+Af\\left(x\\right)`,
    },
  ],
  J: (x, y) => [
    verticalLine(x + 2, y + 1, 3),
    {
      latex: `y=a\\left(1-\\sqrt{1-\\left(x-${x + 1}\\right)^{2}}+${y}\\right)+Af\\left(x\\right)`,
    },
  ],
  K: (x, y) => [
    verticalLine(x, y, 4),
    {
      latex: `y=a\\left(\\left[1.5,2.8\\right]+\\left[1.25,-1.4\\right]x\\left\\{2\\ge x\\ge\\left[0,0.49\\right]\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  L: (x, y) => [
    verticalLine(x, y, 4),
    {
      latex: `y=a\\left(0\\left\\{2\\ge x-${x}\\ge0\\right\\}+${y}\\right)+Af\\left(x\\right)`,
    },
  ],
  M: (x, y) => [
    verticalLine([x, x + 2], y, 4),
    {
      latex: `y=a\\left(\\left[3,-3\\right]x+\\left[-2,4\\right]\\left\\{\\left[2,1\\right]\\ge x\\ge\\left[1,0\\right]\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  N: (x, y) => [
    verticalLine([x, x + 2], y, 4),
    {
      latex: `y=a\\left(-2x+4\\left\\{0\\le x\\le2\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  O: (x, y) => [
    {
      latex: `y=a\\left(2+\\left[2,-2\\right]\\sqrt{1-\\left(x-${x + 1}\\right)^{2}}+${y}\\right)+Af\\left(x\\right)`,
    },
  ],
  P: (x, y) => [
    verticalLine(x, y, 4),
    {
      latex: `y=a\\left(3+\\left[1,-1\\right]\\sqrt{1-\\left(\\max\\left(x,1\\right)-1\\right)^{2}}\\left\\{0\\le x\\le2\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  Q: (x, y) => [
    {
      latex: `y=a\\left(\\operatorname{join}\\left(4-2x\\left\\{1.5\\le x\\le2\\right\\},2+\\left[2,-2\\right]\\sqrt{1-\\left(x-1\\right)^{2}}\\right)+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  R: (x, y) => [
    verticalLine(x, y, 4),
    {
      latex: `y=a\\left(\\operatorname{join}\\left(4-2x\\left\\{1\\le x\\le2\\right\\},3+\\left[1,-1\\right]\\sqrt{1-\\left(\\max\\left(x,1\\right)-1\\right)^{2}}\\left\\{0\\le x\\le2\\right\\}\\right)+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  S: (x, y) => [
    {
      latex: `y=a\\left(\\operatorname{join}\\left(\\left[3,1\\right]+\\left[1,-1\\right]\\sqrt{1-\\left(x-1\\right)^{2}},2+2\\frac{\\sin^{-1}\\left(-x+1\\right)}{\\pi}\\right)+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  T: (x, y) => [
    verticalLine(x + 1, y, 4),
    {
      latex: `y=a\\left(4\\left\\{0\\le x-${x}\\le2\\right\\}+${y}\\right)+Af\\left(x\\right)`,
    },
  ],
  U: (x, y) => [
    verticalLine([x, x + 2], y + 1, 3),
    {
      latex: `y=a\\left(1-\\sqrt{1-\\left(x-${x + 1}\\right)^{2}}+${y}\\right)+Af\\left(x\\right)`,
    },
  ],
  V: (x, y) => [
    {
      latex: `y=a\\left(\\left[4,-4\\right]\\left(x-1\\right)\\left\\{\\left[1,0\\right]\\le x\\le\\left[2,1\\right]\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  W: (x, y) => [
    {
      latex: `y=a\\left(\\left[6,-6,6,-6\\right]\\left(x-\\frac{\\left[2,2,4,4\\right]}{3}\\right)\\left\\{\\left[\\frac{2}{3},0,\\frac{4}{3},\\frac{2}{3}\\right]\\le x\\le\\left[\\frac{4}{3},\\frac{2}{3},2,\\frac{4}{3}\\right]\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  X: (x, y) => [
    {
      latex: `y=a\\left(\\left[0,4\\right]+\\left[2,-2\\right]x\\left\\{0\\le x\\le2\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  Y: (x, y) => [
    {
      latex: `y=a\\left(\\left[0,4\\right]+\\left[2,-2\\right]x\\left\\{\\left[1,0\\right]\\le x\\le\\left[2,1\\right]\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
    verticalLine(x + 2, y, 2),
  ],
  Z: (x, y) => [
    {
      latex: `y=a\\left(\\left[0,4,2x\\right]\\left\\{0\\le x\\le2\\right\\}+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
  ],
  "?": (x, y) => [
    {
      latex: `y=a\\left(\\left[3+\\sqrt{1-\\left(x-1\\right)^{2}},2+2\\frac{\\sin^{-1}\\left(2x-3\\right)}{\\pi}\\right]+${y}\\operatorname{with}x=x-${x}\\right)+Af\\left(x\\right)`,
    },
    verticalLine(x + 1, y + 0.5, 0.5),
    {
      latex: `\\left(${x + 1},${y}a+Af\\left(${x + 1}\\right)\\right)`,
    },
  ],
};

const charWidth = 2;
const charHeight = 4;

export interface GenerateInterpolatedTextStateOptions {
  x?: number;
  y?: number;
  charSpacing?: number;
  lineSpacing?: number;
  targetFunction?: string | null;
  color?: readonly [number, number, number] | null;
}

export const generateInterpolatedTextStateDefaultOptions: Required<GenerateInterpolatedTextStateOptions> =
  {
    x: 0,
    y: 0,
    charSpacing: 0,
    lineSpacing: 1,
    targetFunction: "f\\left(x\\right)=\\sin x",
    color: null,
  };

export function generateInterpolatedTextState(
  textToInterpolate: string,
  options?: GenerateInterpolatedTextStateOptions,
) {
  const realOptions: Required<GenerateInterpolatedTextStateOptions> = {
    ...generateInterpolatedTextStateDefaultOptions,
    ...options,
  };
  realOptions.targetFunction ||= generateInterpolatedTextStateDefaultOptions.targetFunction;

  const state = {
    version: 10,
    expressions: {
      list: [
        {
          id: "animationFolder",
          type: "folder",
          title: "Animation",
          collapsed: false,
        },
        {
          id: "a",
          type: "expression",
          folderId: "animationFolder",
          latex: "a=0",
          slider: {
            hardMin: true,
            hardMax: true,
            min: "0",
            max: "1",
            loopMode: "PLAY_ONCE",
          },
        },
        {
          id: "A",
          type: "expression",
          folderId: "animationFolder",
          latex: "A=1-a",
        },
        {
          id: "space1",
          type: "expression",
        },
        {
          id: "targetFunctionFolder",
          type: "folder",
          title: "Target Function",
        },
        {
          id: "targetFunction",
          type: "expression",
          folderId: "targetFunctionFolder",
          latex: realOptions.targetFunction,
          hidden: true,
          color: "black",
        },
        {
          id: "space2",
          type: "expression",
        },
      ],
    },
  };

  let { x, y } = realOptions;

  for (let charIndex = 0; charIndex < textToInterpolate.length; charIndex++) {
    const char = textToInterpolate[charIndex];

    if (char === "\n") {
      x = 0;
      y -= charHeight + realOptions.lineSpacing;
      continue;
    }

    if (interpolatedChars[char]) {
      const expressions = interpolatedChars[char](x, y);

      const folderId = `ch-${charIndex}`;
      state.expressions.list.push({
        id: folderId,
        type: "folder",
        title: `Char: ${char}`,
        collapsed: true,
      });

      for (let expressionIndex = 0; expressionIndex < expressions.length; expressionIndex++) {
        const expression = {
          id: `che-${charIndex}-${expressionIndex}`,
          type: "expression",
          folderId,
          ...expressions[expressionIndex],
        };

        if (realOptions.color) {
          expression.colorLatex = "C";
        }

        state.expressions.list.push(expression);
      }
    }

    x += charWidth + realOptions.charSpacing;
  }

  if (realOptions.color) {
    state.expressions.list.push(
      {
        id: "space3",
        type: "expression",
      },
      {
        id: "colorFolder",
        type: "folder",
        title: "Color",
        collapsed: true,
      },
      {
        id: "color",
        type: "expression",
        folderId: "colorFolder",
        latex: `C=${desmosColorLaTeX(realOptions.color)}`,
      },
    );
  }

  return state;
}
