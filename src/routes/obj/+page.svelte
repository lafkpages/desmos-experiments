<script lang="ts">
  import "$types/desmos.d.ts";

  import { onMount, tick } from "svelte";

  import {
    Button,
    Checkbox,
    Dropdown,
    DropdownItem,
    Fileupload,
    Heading,
    Hr,
    Modal,
    P,
    Spinner,
  } from "flowbite-svelte";
  import { ChevronDownSolid } from "flowbite-svelte-icons";
  import ObjFileParser from "obj-file-parser";
  import { queryParam, ssp } from "sveltekit-search-params";

  import defaultObj from "$assets/default.obj?raw";
  import Desmos from "$components/Desmos.svelte";
  import SettingsButton from "$components/SettingsButton.svelte";
  import { generateEquations } from "$lib";
  import { objInitialState } from "$lib/calculator";

  let calculator: any;

  let objSource = defaultObj;
  $: objData = new ObjFileParser(objSource).parse();
  let objModelIndex = 0;

  // settings
  let groupFaces = queryParam("groupFaces", ssp.boolean(true));

  let settingsModal = false;
  let loadingModal = false;
  let multipleModelsModal = false;
  let errorModal = false;
  let errorModalMessage = "";

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

        await tick();

        if (objData.models.length < 0) {
          throw new Error("No models found in file");
        }

        if (objData.models.length == 1) {
          objModelIndex = 0;
        } else {
          loadingModal = false;
          multipleModelsModal = true;
          return;
        }

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
    if (!calculator) {
      return;
    }

    const equations = generateEquations(objData, objModelIndex, {});

    // remove face expressions
    calculator.removeExpressions(
      calculator.getExpressions().filter((e: any) => e.id.startsWith("face")),
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

    if ($groupFaces) {
      calculator.setExpression({
        id: "faces",
        latex: `\\left[${equations.faces.join(",")}\\right]`,
        fillOpacity: "F_{opacity}",
      });
    } else {
      // add face expressions
      calculator.setExpressions(
        equations.faces.map((f, i) => ({
          id: `face${i}`,
          latex: f,
          fillOpacity: "F_{opacity}",
          folderId: "projectedFaces",
        })),
      );
    }

    // calculate highest Z value
    const maxZ = Math.ceil(
      objData.models[objModelIndex].vertices.reduce((acc, v) => (v.z > acc ? v.z : acc), 0),
    );

    // update focal length
    calculator.setExpression({
      id: "F",
      latex: `F=${maxZ * 4}`,
      slider: { min: (maxZ * 2).toString(), max: (maxZ * 10).toString() },
    });
  }

  $: {
    // reactivity
    objModelIndex;
    $groupFaces;

    loadModel();
  }

  // apply settings from query params
  onMount(() => {
    loadModel();
  });
</script>

<svelte:head>
  <title>OBJ renderer</title>
</svelte:head>

<Heading tag="h1">OBJ renderer</Heading>

<P>Converts an OBJ file into Desmos equations.</P>

<Fileupload accept=".obj" on:change={onFileUpload} />

<SettingsButton bind:settingsModal />

<Desmos initialState={objInitialState} bind:calculator />

<Modal title="Settings" bind:open={settingsModal} outsideclose>
  {#if $groupFaces !== null}
    <Checkbox bind:checked={$groupFaces}>Group faces</Checkbox>
  {/if}

  <Hr />
  <Heading tag="h6">Advanced</Heading>
</Modal>

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
    {#each objData.models as model, i}
      <DropdownItem
        on:click={async () => {
          objModelIndex = i;

          loadingModal = true;
          multipleModelsModal = false;

          await tick();

          loadingModal = false;
        }}>{model.name}</DropdownItem
      >
    {/each}
  </Dropdown>
</Modal>

<Modal title="Error" bind:open={errorModal} outsideclose>
  <p>{errorModalMessage}</p>
</Modal>
