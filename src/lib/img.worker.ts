import type { ImageRunnerOptions, ShapeResult } from "geometrizejs";

import { Bitmap, ImageRunner } from "geometrizejs";

/// <reference lib="webworker" />

export enum ImgWorkerRequestType {
  Start,
  Step,
}

export type ImgWorkerRequestData =
  | {
      type: ImgWorkerRequestType.Start;
      bitmapData: ImageData;
    }
  | {
      type: ImgWorkerRequestType.Step;
      options: ImageRunnerOptions;
    };

export type ImgWorkerResponseData = {
  shapes: ({
    type: number;
  } & ShapeResult)[];
};

declare function postMessage(message: ImgWorkerResponseData): void;

let runner: ImageRunner;

onmessage = (e) => {
  const msg = e.data as ImgWorkerRequestData;

  switch (msg.type) {
    case ImgWorkerRequestType.Start: {
      runner = new ImageRunner(
        Bitmap.createFromByteArray(
          msg.bitmapData.width,
          msg.bitmapData.height,
          Array.from(msg.bitmapData.data),
        ),
      );
      break;
    }

    case ImgWorkerRequestType.Step: {
      const shapes = runner.step(msg.options);
      postMessage({
        shapes: shapes.map((shape) => ({ type: shape.shape.getType(), ...shape })),
      });
      break;
    }
  }
};
