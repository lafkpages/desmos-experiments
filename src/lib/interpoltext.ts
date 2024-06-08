function verticalLine(x: number, y: number, height: number) {
  const heightStr = height.toString();

  return {
    type: "expression",
    latex: `\\left(${x}a+At+A${x}-\\frac{A${height}}{2},ta+${y}a+Af\\left(t+${x}-\\frac{${height}}{2}\\right)\\right)`,
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
    {
      latex: `\\left(${x}a+At+A${x}-2A,ta+${y}a+Af\\left(t+${x}-2\\right)\\right)`,
      parametricDomain: {
        min: "",
        max: "4",
      },
      domain: {
        min: "0",
        max: "4",
      },
    },
    {
      latex: `y=\\left(a\\operatorname{join}\\left(3+\\left[1,-1\\right]\\sqrt{1-\\left(x-0.7\\right)^{2}}\\left\\{x-0.7\\ge0\\right\\}+Y,1+\\left[1,-1\\right]\\sqrt{1-\\left(x-1\\right)^{2}}\\left\\{x-1\\ge0\\right\\}+Y,\\left[Y,Y+2\\right]\\left\\{1>x>0\\right\\},\\left[Y+4\\right]\\left\\{0.7>x>0\\right\\}\\right)\\operatorname{with}x=x-${x},Y=${y}\\right)+Af\\left(x\\right)`,
    },
  ],
};

export interface GenerateInterpolatedTextStateOptions {
  x?: number;
  y?: number;
  targetFunction?: string;
}

export const generateInterpolatedTextStateDefaultOptions: Required<GenerateInterpolatedTextStateOptions> =
  {
    x: 0,
    y: 0,
    targetFunction: "f\\left(x\\right)=\\sin x",
  };

export function generateInterpolatedTextState(
  textToInterpolate: string,
  options?: GenerateInterpolatedTextStateOptions,
) {
  const realOptions: Required<GenerateInterpolatedTextStateOptions> = {
    ...generateInterpolatedTextStateDefaultOptions,
    ...options,
  };

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
          latex:
            realOptions.targetFunction ||
            generateInterpolatedTextStateDefaultOptions.targetFunction,
          hidden: true,
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
      y -= 5;
      continue;
    }

    if (interpolatedChars[char]) {
      const expressions = interpolatedChars[char](x, y);

      const folderId = `char-${charIndex}`;
      state.expressions.list.push({
        id: folderId,
        type: "folder",
        title: `Char: ${char}`,
        collapsed: true,
      });

      for (let expressionIndex = 0; expressionIndex < expressions.length; expressionIndex++) {
        state.expressions.list.push({
          id: `char-${charIndex}-expression-${expressionIndex}`,
          type: "expression",
          folderId,
          ...expressions[expressionIndex],
        });
      }
    }

    x += 2;
  }

  return state;
}
