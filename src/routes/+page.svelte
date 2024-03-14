<script lang="ts" context="module">
  declare global {
    interface Window {
      __debug_calculator?: unknown;
    }
  }
</script>

<script lang="ts">
  import "$types/desmos.d.ts";

  import { onMount, tick } from "svelte";

  import { generateEquations } from "$lib";
  import { setupCalculator } from "$lib/calculator";

  let calculatorElm: HTMLDivElement;
  let calculator: any;

  let obj = "";

  let showLoading = false;
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
</script>

<svelte:window on:load={onLoadMount} />

<div class="main">
  <h1>OBJ to Desmos</h1>

  <p>Converts an OBJ file into Desmos equations.</p>

  <input
    type="file"
    accept=".obj"
    on:input={async (e) => {
      const file = e.currentTarget.files?.[0];

      if (!file) {
        return;
      }

      showLoading = true;

      await tick();

      setTimeout(async () => {
        try {
          obj = await file.text();

          const equations = generateEquations(obj);

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

          showLoading = false;
        } catch (err) {
          console.error(err);
          showLoading = false;
          alert(`Error parsing file:\n${err}`);
        }
      }, 100);
    }}
  />

  <div class="calculator" bind:this={calculatorElm} />
</div>

<div class="loading-overlay" class:show={showLoading}>
  <h2>Loading</h2>
  <span></span>
</div>

<style lang="scss">
  .main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    width: 100%;
    height: 100%;

    * {
      margin: 0px;
    }

    .calculator {
      flex-grow: 1;
    }
  }

  .loading-overlay {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    display: none;
    gap: 1rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &.show {
      display: flex;
    }

    h2 {
      margin: 0px;
      color: white;
    }

    span {
      display: block;
      width: 100px;
      height: 100px;
      border: 10px solid #f3f3f3;
      border-top: 10px solid #3498db;
      border-radius: 50%;
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
</style>
