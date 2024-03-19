import type { ImageRunnerOptions, ShapeResult, ShapeTypes } from "geometrizejs";

import { Bitmap, ImageRunner } from "geometrizejs";

/// <reference lib="webworker" />

export interface ImgWorkerRequestData {
  bitmapData: ImageData;
  iterations: number;
  options: ImageRunnerOptions;
}

export interface ImgWorkerResponseData {
  iteration: number;
  shapes: ({
    type: number;
  } & ShapeResult)[];
}

declare function postMessage(message: ImgWorkerResponseData): void;

onmessage = (e) => {
  const msg = e.data as ImgWorkerRequestData;

  const bitmap = Bitmap.createFromByteArray(
    msg.bitmapData.width,
    msg.bitmapData.height,
    Array.from(msg.bitmapData.data),
  );

  const runner = new ImageRunner(bitmap);

  for (let i = 0; i < msg.iterations; i++) {
    console.log(`Iteration ${i + 1}`);
    const shapes = runner.step(msg.options);
    postMessage({
      iteration: i,
      shapes: shapes.map((shape) => {
        return { type: shape.shape.getType(), ...shape };
      }),
    });
  }
};
