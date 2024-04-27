<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { ComputeEngine } from "@cortex-js/compute-engine";
  import { Heading } from "flowbite-svelte";
  import { MathfieldElement } from "mathlive";

  let mathfieldInputContainer: HTMLDivElement;
  let mfInput: MathfieldElement;
  let mathfieldOutputContainer: HTMLDivElement;
  let mfOutput: MathfieldElement;

  let latex = "";
  let simplifiedLatex = "";

  const ce = new ComputeEngine();

  function inputHandler() {
    latex = mfInput.value;
    simplifiedLatex = ce.parse(latex).simplify().latex;
    mfOutput.value = simplifiedLatex;
  }

  onMount(() => {
    mfInput = new MathfieldElement();
    mfOutput = new MathfieldElement();

    mfInput.addEventListener("input", inputHandler);
    mfOutput.readonly = true;

    mathfieldInputContainer.appendChild(mfInput);
    mathfieldOutputContainer.appendChild(mfOutput);
  });

  onDestroy(() => {
    mfInput?.removeEventListener("input", inputHandler);
  });
</script>

<table>
  <thead>
    <tr>
      <th>
        <Heading tag="h2">Input</Heading>
      </th>
      <th>
        <Heading tag="h2">Output</Heading>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <div class="mathlive-container" bind:this={mathfieldInputContainer} />
      </td>
      <td>
        <div class="mathlive-container" bind:this={mathfieldOutputContainer} />
      </td>
    </tr>
    <tr>
      <td>
        <textarea
          id="latex-input"
          value={latex}
          on:input={(e) => {
            mfInput.value = e.currentTarget.value;
          }}
        />
      </td>
      <td>
        <textarea readonly value={simplifiedLatex} />
      </td>
    </tr>
  </tbody>
</table>

<style>
  .mathlive-container :global(math-field) {
    width: 100%;
    min-height: 46px;
    height: 100%;
    border: 1px solid black;
    box-sizing: border-box;
  }

  textarea {
    width: 100%;
  }
</style>
