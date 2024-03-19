<script lang="ts">
  import type { ImgWorkerRequestData, ImgWorkerResponseData } from "$lib/img.worker";
  import type { ImageRunnerOptions } from "geometrizejs";

  import { onMount } from "svelte";

  import {
    Button,
    Fileupload,
    Heading,
    Hr,
    Input,
    Label,
    Modal,
    P,
    Progressbar,
  } from "flowbite-svelte";
  import { CogSolid } from "flowbite-svelte-icons";
  import { ShapeTypes } from "geometrizejs";

  import { browser } from "$app/environment";
  import Desmos from "$components/Desmos.svelte";
  import { colorToHex } from "$lib/color";
  import ImgWorker from "$lib/img.worker?worker";

  let calculator: any;

  const image = browser ? new Image() : null;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  // settings
  let iterations = 100;
  const options: ImageRunnerOptions = {
    shapeTypes: [ShapeTypes.ELLIPSE, ShapeTypes.RECTANGLE, ShapeTypes.TRIANGLE],
    alpha: 128,
  };

  let settingsModal = false;

  let imgWorker: Worker;
  let progress: number | null = null;

  function onFileUpload(e: Event) {
    if (!(e.currentTarget instanceof HTMLInputElement)) {
      return;
    }

    const file = (e.currentTarget as HTMLInputElement).files?.[0];

    if (!file || !image) {
      return;
    }

    if (image.src) {
      URL.revokeObjectURL(image.src);
    }

    // clear previous shapes
    calculator.setBlank();

    image.onload = async () => {
      if (!canvas || !ctx) {
        return;
      }

      // image border and zoom
      calculator.setState({
        version: 10,
        graph: {
          viewport: {
            xmin: 0,
            ymin: 0,
            xmax: image.width,
            ymax: image.height,
          },
        },
        expressions: {
          list: [
            {
              type: "expression",
              id: "image-border",
              color: "#000000",
              latex: `\\operatorname{polygon}\\left(\\left(0,0\\right),\\left(${image.width},0\\right),\\left(${image.width},${image.height}\\right),\\left(0,${image.height}\\right)\\right)`,
              fillOpacity: "0",
            },
          ],
        },
      });

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const bitmapData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      imgWorker.postMessage({
        bitmapData,
        iterations,
        options,
      } satisfies ImgWorkerRequestData);
    };

    image.src = URL.createObjectURL(file);
  }

  onMount(() => {
    canvas = document.createElement("canvas");

    const _ctx = canvas.getContext("2d");
    if (_ctx) {
      ctx = _ctx;
    } else {
      throw new Error("Could not get 2d context");
    }

    imgWorker = new ImgWorker();

    imgWorker.onmessage = (e) => {
      const msg = e.data as ImgWorkerResponseData;

      for (const shape of msg.shapes) {
        let latex: string | null = null;

        console.log(Object.entries(ShapeTypes).find(([k, v]) => v === shape.type)?.[0], shape);

        switch (shape.type) {
          case ShapeTypes.ELLIPSE: {
            const { x, y, rx, ry } = shape.shape;
            latex = `\\left(\\frac{1}{${rx}}^{2}\\right)\\left(x-\\left(${x}\\right)\\right)^{2}+\\left(\\frac{1}{${ry}}^{2}\\right)\\left(y-\\left(${y}\\right)\\right)^{2}<1`;
            break;
          }

          case ShapeTypes.RECTANGLE: {
            const { x1, y1, x2, y2 } = shape.shape;
            latex = `\\operatorname{polygon}\\left(\\left(${x1},${y1}\\right),\\left(${x2},${y1}\\right),\\left(${x2},${y2}\\right),\\left(${x1},${y2}\\right)\\right)`;
            break;
          }

          case ShapeTypes.TRIANGLE: {
            const { x1, y1, x2, y2, x3, y3 } = shape.shape;
            latex = `\\operatorname{polygon}\\left(\\left(${x1},${y1}\\right),\\left(${x2},${y2}\\right),\\left(${x3},${y3}\\right)\\right)`;
            break;
          }
        }

        if (latex) {
          const expression = {
            id: `iteration-${msg.iteration}`,
            latex,
            color: colorToHex(shape.color),
            fillOpacity: (shape.color & 255) / 255,
            lineWidth: 0,
          };

          calculator.setExpression(expression);
          // console.log(Object.entries(ShapeTypes).find(([k, v]) => v === shape.type)?.[0],shape, expression);
        }
      }

      if (msg.iteration >= iterations - 1) {
        progress = null;
      } else {
        progress = (msg.iteration / iterations) * 100;
      }
    };
  });
</script>

<Heading tag="h1">Image to Desmos</Heading>

<P>Imports an image into Desmos equations.</P>

<Fileupload accept="image/*" on:change={onFileUpload} />

<Button
  color="alternative"
  class="absolute top-4 right-4 !p-2"
  on:click={() => {
    settingsModal = true;
  }}
>
  <CogSolid class="w-4 h-4" />
</Button>

{#if progress !== null}
  <Progressbar {progress} labelOutside="Geometrizing image..." />
{/if}

<Modal title="Settings" bind:open={settingsModal} outsideclose>
  <Label for="iterations">Iterations</Label>
  <Input type="number" id="iterations" bind:value={iterations} />

  <Label for="alpha">Alpha</Label>
  <Input type="number" id="alpha" min="1" max="255" bind:value={options.alpha} />

  <Hr />
  <Heading tag="h6">Advanced</Heading>
</Modal>

<Desmos initialState={null} bind:calculator />