<script lang="ts">
  import { tick } from "svelte";

  import { ComputeEngine } from "@cortex-js/compute-engine";
  import { Label, NumberInput, Range } from "flowbite-svelte";

  import { ellipseLatex } from "./latex";
  import Desmos from "$components/Desmos.svelte";
  import { latexToDesmosLatex } from "$lib/crazy-desmos-expressions/src/utils";

  let calculator: any;

  const ce = new ComputeEngine();

  let rx = 1;
  let ry = 1;

  let x = 0;
  let y = 0;
  let A = 0;

  // Avoid an infinite loop when dragging points and updating the inputs
  function onDrag() {
    isDragging = true;
    setTimeout(() => {
      isDragging = false;
    }, 100);
  }

  $: degreeMode = calculator?.settings.degreeMode;
  $: calculator?.settings.observe("degreeMode", async () => {
    const oldDegreeMode = degreeMode;
    degreeMode = calculator.settings.degreeMode;

    await tick();

    // Update the angle when switching between degree and radian mode
    if (oldDegreeMode !== degreeMode) {
      A = degreeMode ? (A * 180) / Math.PI : (A * Math.PI) / 180;
    }
  });

  // Draggable point for position
  $: calculator?.setExpression({
    id: "position",
    latex: `\\left(X,Y\\right)`,
  });
  $: if (!isDragging) {
    calculator?.setExpression({
      id: "x",
      latex: `X=${x}`,
    });
    calculator?.setExpression({
      id: "y",
      latex: `Y=${y}`,
    });
  }

  // Sync position inputs with the calculator
  let isDragging = false;
  $: xHelper = calculator?.HelperExpression({ latex: "X" });
  $: yHelper = calculator?.HelperExpression({ latex: "Y" });
  $: xHelper?.observe("numericValue", () => {
    if (!isNaN(xHelper.numericValue)) {
      x = xHelper.numericValue;
      onDrag();
    }
  });
  $: yHelper?.observe("numericValue", () => {
    if (!isNaN(yHelper.numericValue)) {
      y = yHelper.numericValue;
      onDrag();
    }
  });

  // Sliders for radius
  $: calculator?.setExpression({
    id: "rx",
    latex: `r_x=${rx}`,
  });
  $: calculator?.setExpression({
    id: "ry",
    latex: `r_y=${ry}`,
  });

  // Sync radius inputs with the calculator
  $: rxHelper = calculator?.HelperExpression({ latex: "r_x" });
  $: ryHelper = calculator?.HelperExpression({ latex: "r_y" });
  $: rxHelper?.observe("numericValue", () => {
    if (!isNaN(rxHelper.numericValue)) {
      rx = rxHelper.numericValue;
      onDrag();
    }
  });
  $: ryHelper?.observe("numericValue", () => {
    if (!isNaN(ryHelper.numericValue)) {
      ry = ryHelper.numericValue;
      onDrag();
    }
  });

  // Draggable point for angle
  $: calculator?.setExpression({
    id: "angle",
    latex: `\\left(${rx}\\cos A+${x},${rx}\\sin A+${y}\\right)`,
    dragMode: window.Desmos.DragModes.XY,
  });
  $: if (!isDragging) {
    calculator?.setExpression({
      id: "a",
      latex: `A=${A}`,
    });
  }

  // Sync angle input with the calculator
  $: aHelper = calculator?.HelperExpression({ latex: "A" });
  $: aHelper?.observe("numericValue", () => {
    if (!isNaN(aHelper.numericValue)) {
      A = aHelper.numericValue;
      onDrag();
    }
  });

  // Update the ellipse in the calculator
  $: calculator?.setExpression({
    id: "ellipse",
    latex: ellipseLatex("X", "Y", "r_x", "r_y", "A"),
  });

  // Update the ellipse in the math field
  $: calculator?.setExpression({
    id: "ellipseHardcoded",
    latex: latexToDesmosLatex(
      ce.parse(ellipseLatex(x, y, rx, ry, degreeMode ? `${A}\\degree` : A)).evaluate().latex,
    ),
  });
</script>

<div class="grid gap-6 md:grid-cols-2">
  <div>
    <Label for="rx" class="mb-2">Radius (x)</Label>
    <NumberInput id="rx" bind:value={rx} />
  </div>

  <div>
    <Label for="ry" class="mb-2">Radius (y)</Label>
    <NumberInput id="ry" bind:value={ry} />
  </div>

  <div>
    <Label for="x" class="mb-2">Position (x)</Label>
    <NumberInput id="x" bind:value={x} />
  </div>

  <div>
    <Label for="y" class="mb-2">Position (y)</Label>
    <NumberInput id="y" bind:value={y} />
  </div>

  <div class="md:col-span-2">
    <Label for="a" class="mb-2">
      Angle: {A}

      {#if degreeMode}
        &deg;
      {:else}
        rad
      {/if}
    </Label>
    <Range id="a" bind:value={A} min={0} max={degreeMode ? 360 : 2 * Math.PI} step={0.01} />
  </div>
</div>

<Desmos
  bind:calculator
  initialState={{
    version: 11,
    expressions: {
      list: [
        {
          type: "text",
          id: "ellipseHardcodedLabel",
          text: "Ellipse equation with values hardcoded:",
        },
        {
          type: "expression",
          id: "ellipseHardcoded",
          hidden: true,
        },
        {
          type: "expression",
          id: "sep0",
          latex: " ",
        },
        {
          type: "expression",
          id: "ellipse",
        },
        {
          type: "expression",
          id: "sep1",
          latex: " ",
        },
        {
          type: "expression",
          id: "position",
        },
        {
          type: "expression",
          id: "x",
        },
        {
          type: "expression",
          id: "y",
        },
        {
          type: "expression",
          id: "sep2",
          latex: " ",
        },
        {
          type: "expression",
          id: "rx",
        },
        {
          type: "expression",
          id: "ry",
        },
        {
          type: "expression",
          id: "sep3",
          latex: " ",
        },
        {
          type: "expression",
          id: "angle",
        },
        {
          type: "expression",
          id: "a",
        },
      ],
    },
  }}
/>
