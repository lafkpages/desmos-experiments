<script lang="ts" context="module">
  declare global {
    interface Window {
      __debug_calculator?: unknown;
    }
  }
</script>

<script lang="ts">
  import "$types/desmos.d.ts";

  import type { ObjFile, ObjModel } from "obj-file-parser";

  import { onMount, tick } from "svelte";

  import {
    Button,
    Dropdown,
    DropdownItem,
    Fileupload,
    Heading,
    Modal,
    Spinner,
  } from "flowbite-svelte";
  import { ChevronDownSolid } from "flowbite-svelte-icons";
  import ObjFileParser from "obj-file-parser";

  import { generateEquations } from "$lib";
  import { setupCalculator } from "$lib/calculator";

  let calculatorElm: HTMLDivElement;
  let calculator: any;

  let objSource = "";
  let objData: ObjFile;
  let objModel: ObjModel;

  let loadingModal = false;
  let multipleModelsModal = false;
  let errorModal = false;
  let errorModalMessage = "";

  let didSetup = false;

  function onLoadMount() {
    if (!window.Desmos || didSetup) {
      return;
    }

    calculator = window.Desmos.GraphingCalculator(calculatorElm);
    window.__debug_calculator = calculator;

    didSetup = true;
    setupCalculator(calculator);
  }
  onMount(onLoadMount);

  async function onFileUpload(e: Event) {
    const objFile = (e.currentTarget as HTMLInputElement).files?.[0];

    if (!objFile) {
      return;
    }

    loadingModal = true;

    await tick();

    setTimeout(async () => {
      try {
        objSource = await objFile.text();
        objData = new ObjFileParser(objSource).parse();

        if (objData.models.length < 0) {
          throw new Error("No models found in file");
        }

        if (objData.models.length == 1) {
          objModel = objData.models[0];
        } else {
          loadingModal = false;
          multipleModelsModal = true;
          return;
        }

        loadModel();

        loadingModal = false;
      } catch (err) {
        console.error(err);

        loadingModal = false;

        errorModal = true;
        errorModalMessage = err?.toString() || "An error occurred";
      }
    }, 100);
  }

  function loadModel() {
    const equations = generateEquations(objModel);

    console.log(equations);

    // remove face expressions
    calculator.removeExpressions(
      calculator.getExpressions().filter((e) => e.id.startsWith("face")),
    );

    // replace vertex and rotated vertex expressions
    calculator.setExpressions([
      { id: "x0", latex: equations.vertices[0] },
      { id: "y0", latex: equations.vertices[1] },
      { id: "z0", latex: equations.vertices[2] },
      { id: "x1", latex: equations.rotatedVertices[0] },
      { id: "y1", latex: equations.rotatedVertices[1] },
      { id: "z1", latex: equations.rotatedVertices[2] },
      { id: "x2", latex: equations.rotatedVertices[3] },
      { id: "y2", latex: equations.rotatedVertices[4] },
      { id: "z2", latex: equations.rotatedVertices[5] },
      { id: "x3", latex: equations.rotatedVertices[6] },
      { id: "y3", latex: equations.rotatedVertices[7] },
      { id: "z3", latex: equations.rotatedVertices[8] },
    ]);

    // add face expressions
    calculator.setExpressions(
      equations.faces.map((f, i) => ({
        id: `face${i}`,
        latex: f,
        folderId: "projectedFaces",
      })),
    );
  }
</script>

<svelte:window on:load={onLoadMount} />

<Heading tag="h1">OBJ to Desmos</Heading>

<p>Converts an OBJ file into Desmos equations.</p>

<Fileupload type="file" accept=".obj" on:change={onFileUpload} />

<div class="flex-grow" bind:this={calculatorElm} />

<Modal title="Loading" bind:open={loadingModal}>
  <p>
    <Spinner class="mr-4" />
    Importing your 3D model... This might take a while...
  </p>
</Modal>

<Modal title="Multiple models" bind:open={multipleModelsModal}>
  <p>Looks like your OBJ file contains multiple models. Please select one.</p>

  <Button>
    Choose a model

    <ChevronDownSolid class="w-3 h-3 ms-2" />
  </Button>
  <Dropdown>
    {#each objData.models as model}
      <DropdownItem
        on:click={async () => {
          objModel = model;

          loadingModal = true;
          multipleModelsModal = false;

          await tick();

          loadModel();

          loadingModal = false;
        }}>{model.name}</DropdownItem
      >
    {/each}
  </Dropdown>
</Modal>

<Modal title="Error" bind:open={errorModal}>
  <p>{errorModalMessage}</p>
</Modal>
