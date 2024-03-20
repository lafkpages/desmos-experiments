<script lang="ts">
  import type { ImgWorkerRequestData, ImgWorkerResponseData } from "$lib/img.worker";

  import { onMount } from "svelte";

  import {
    Button,
    ButtonGroup,
    Checkbox,
    Fileupload,
    Heading,
    Hr,
    Input,
    Label,
    Modal,
    P,
    Progressbar,
  } from "flowbite-svelte";
  import { CogSolid, ForwardStepSolid, PauseSolid, PlaySolid } from "flowbite-svelte-icons";
  import { ShapeTypes } from "geometrizejs";
  import { queryParam, ssp } from "sveltekit-search-params";

  import { browser } from "$app/environment";
  import Desmos from "$components/Desmos.svelte";
  import { colorToHex } from "$lib/color";
  import { ImgWorkerRequestType } from "$lib/img.worker";
  import ImgWorker from "$lib/img.worker?worker";

  let calculator: any;

  const image = browser ? new Image() : null;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  // settings
  const autoplay = queryParam("autoplay", ssp.boolean(true));
  const iterations = queryParam("iterations", ssp.number(100));
  const shapeTypes = [ShapeTypes.ELLIPSE, ShapeTypes.RECTANGLE, ShapeTypes.TRIANGLE];
  const alpha = queryParam("alpha", ssp.number(128));
  const candidateShapesPerStep = queryParam("candidateShapesPerStep", ssp.number(50));
  const shapeMutationsPerStep = queryParam("shapeMutationsPerStep", ssp.number(100));

  let settingsModal = false;

  let imgWorker: Worker;
  let playing = false;
  let iteration = 0;
  let hasRunner = false;

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

    geometrizeImage(URL.createObjectURL(file));
  }

  function geometrizeImage(src: string) {
    if (!image) {
      return;
    }

    // clear previous shapes
    calculator.setBlank();

    // reset
    iteration = 0;
    playing = false;
    hasRunner = false;

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
              type: "folder",
              id: "image-border-folder",
              title: "Image border",
              collapsed: true,
            },
            {
              type: "expression",
              id: "image-border",
              folderId: "image-border-folder",
              color: "#000000",
              latex: `\\operatorname{polygon}\\left(\\left(0,0\\right),\\left(${image.width},0\\right),\\left(${image.width},${image.height}\\right),\\left(0,${image.height}\\right)\\right)`,
              fillOpacity: "0",
            },
            {
              type: "folder",
              id: "current-iteration-label-folder",
              title: "Iteration label",
              collapsed: true,
            },
            {
              type: "expression",
              id: "current-iteration-label",
              folderId: "current-iteration-label-folder",
              latex: `\\left(${image.width},${image.height}\\right)`,
              label: "Iteration `${i}`",
              labelOrientation: "below_left",
              hidden: true,
              showLabel: true,
              color: "#000000",
            },
            {
              type: "expression",
              id: "current-iteration",
              folderId: "current-iteration-label-folder",
              latex: "i=0",
            },
          ],
        },
      });

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const bitmapData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      imgWorker.postMessage({
        type: ImgWorkerRequestType.Start,
        bitmapData,
      } satisfies ImgWorkerRequestData);

      if ($autoplay) {
        playing = true;
        step();
      }
    };

    image.src = src;
  }

  function step() {
    if ($alpha === null || $candidateShapesPerStep === null || $shapeMutationsPerStep === null) {
      return;
    }

    imgWorker.postMessage({
      type: ImgWorkerRequestType.Step,
      options: {
        shapeTypes,
        alpha: $alpha,
        candidateShapesPerStep: $candidateShapesPerStep,
        shapeMutationsPerStep: $shapeMutationsPerStep,
      },
    } satisfies ImgWorkerRequestData);
  }

  onMount(() => {
    canvas = document.createElement("canvas");

    const _ctx = canvas.getContext("2d");
    if (_ctx) {
      ctx = _ctx;
    } else {
      throw new Error("Could not get 2d context");
    }

    if (!image) {
      return;
    }
    image.crossOrigin = "anonymous";

    imgWorker = new ImgWorker();

    imgWorker.onmessage = (e) => {
      if (!image || !$iterations) {
        return;
      }

      const msg = e.data as ImgWorkerResponseData;

      hasRunner = true;
      iteration++;

      if (iteration >= $iterations) {
        playing = false;
      }

      for (const shape of msg.shapes) {
        let latex: string | null = null;

        switch (shape.type) {
          case ShapeTypes.ELLIPSE: {
            let { x, y, rx, ry } = shape.shape;

            // flip across Y axis
            y = image.height - y;

            latex = `\\left(\\frac{1}{${rx}}^{2}\\right)\\left(x-\\left(${x}\\right)\\right)^{2}+\\left(\\frac{1}{${ry}}^{2}\\right)\\left(y-\\left(${y}\\right)\\right)^{2}<1`;
            break;
          }

          case ShapeTypes.RECTANGLE: {
            let { x1, y1, x2, y2 } = shape.shape;

            // flip across Y axis
            y1 = image.height - y1;
            y2 = image.height - y2;

            latex = `\\operatorname{polygon}\\left(\\left(${x1},${y1}\\right),\\left(${x2},${y1}\\right),\\left(${x2},${y2}\\right),\\left(${x1},${y2}\\right)\\right)`;
            break;
          }

          case ShapeTypes.TRIANGLE: {
            let { x1, y1, x2, y2, x3, y3 } = shape.shape;

            // flip across Y axis
            y1 = image.height - y1;
            y2 = image.height - y2;
            y3 = image.height - y3;

            latex = `\\operatorname{polygon}\\left(\\left(${x1},${y1}\\right),\\left(${x2},${y2}\\right),\\left(${x3},${y3}\\right)\\right)`;
            break;
          }
        }

        if (latex) {
          const expression = {
            id: `iteration-${iteration}`,
            latex,
            color: colorToHex(shape.color),
            fillOpacity: (shape.color & 255) / 255,
            lineWidth: 0,
          };

          calculator.setExpression(expression);
        }

        calculator.setExpression({ id: "current-iteration", latex: `i=${iteration}` });
      }

      if (playing) {
        step();
      }
    };

    // random image on load
    geometrizeImage("https://i.imgur.com/v8IjGkx.jpeg");
  });
</script>

<svelte:head>
  <title>Image geometrizer</title>
</svelte:head>

<Heading tag="h1">Image geometrizer</Heading>

<P>Converts an image into different shapes and graphs them in Desmos.</P>

<div class="flex gap-4">
  <Fileupload accept="image/*" on:change={onFileUpload} />

  <ButtonGroup>
    <Button
      on:click={() => {
        playing = true;
      }}
      disabled={!hasRunner || playing}
    >
      <PlaySolid />
    </Button>
    <Button
      on:click={() => {
        playing = false;
      }}
      disabled={!hasRunner || !playing}
    >
      <PauseSolid />
    </Button>
    <Button
      on:click={() => {
        step();
      }}
      disabled={!hasRunner}
    >
      <ForwardStepSolid />
    </Button>
  </ButtonGroup>
</div>

<Button
  color="alternative"
  class="absolute top-4 right-4 !p-2"
  on:click={() => {
    settingsModal = true;
  }}
>
  <CogSolid class="w-4 h-4" />
</Button>

{#if iteration && $iterations}
  <Progressbar
    progress={Math.min((iteration / $iterations) * 100, 100)}
    labelOutside="Geometrizing image..."
  />
{/if}

<Modal title="Settings" bind:open={settingsModal} outsideclose>
  {#if $autoplay !== null}
    <Checkbox bind:checked={$autoplay}>Autoplay</Checkbox>
  {/if}

  <Label for="iterations">Iterations</Label>
  <Input type="number" id="iterations" bind:value={$iterations} />

  <Label for="alpha">Alpha</Label>
  <Input type="number" id="alpha" min="1" max="255" bind:value={$alpha} />

  <Label for="candidate-shapes-per-iteration">Candidate shapes per iteration</Label>
  <Input type="number" id="candidate-shapes-per-iteration" bind:value={$candidateShapesPerStep} />

  <Label for="shape-mutations-per-iteration">Shape mutations per iteration</Label>
  <Input type="number" id="shape-mutations-per-iteration" bind:value={$shapeMutationsPerStep} />

  <Hr />
  <Heading tag="h6">Advanced</Heading>
</Modal>

<Desmos initialState={null} bind:calculator />
