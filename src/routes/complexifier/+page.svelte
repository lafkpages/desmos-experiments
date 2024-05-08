<script lang="ts">
  import { onMount, tick } from "svelte";

  import { Button, ButtonGroup, Label, NumberInput } from "flowbite-svelte";
  import { MathfieldElement } from "mathlive";

  import Desmos from "$components/Desmos.svelte";
  import { generate } from "$lib/crazy-desmos-expressions/src";
  import { ComputeEngine } from "$lib/crazy-desmos-expressions/src/computeEngine";
  import { latexToDesmosLatex } from "$lib/crazy-desmos-expressions/src/utils";

  let n = 0;
  let iters = 15;

  let latex = n.toString();
  let mathfield: MathfieldElement;
  let calculator: any;

  let desmosTab = true;

  let ce: ComputeEngine;
  onMount(() => {
    ce = new ComputeEngine();

    render();
  });

  function render() {
    if (mathfield) {
      mathfield.value = latex;
    }

    if (calculator) {
      calculator.updateSettings({
        graphpaper: false,
        zoomButtons: false,
      });

      calculator.setExpression({
        id: "expr",
        latex,
      });
    }
  }
</script>

<div class="flex gap-6 mb-6">
  <div class="grow">
    <Label for="input-n" class="block mb-2">Your number</Label>
    <NumberInput id="input-n" bind:value={n} />
  </div>

  <div class="grow">
    <Label for="input-iters" class="block mb-2">Iterations (a.k.a. complexity)</Label>
    <NumberInput id="input-iters" bind:value={iters} />
  </div>
</div>

<div class="flex justify-between mb-2">
  <Button
    on:click={async () => {
      const expr = generate(n, iters);
      const box = ce.box(expr, { canonical: false });
      latex = latexToDesmosLatex(box.latex);

      await tick();

      render();
    }}
  >
    Generate
  </Button>

  <ButtonGroup>
    <Button
      on:click={async () => {
        desmosTab = true;
        await tick();
        render();
      }}
    >
      Desmos
    </Button>
    <Button
      on:click={async () => {
        desmosTab = false;
        await tick();
        render();
      }}
    >
      LaTeX
    </Button>
  </ButtonGroup>
</div>

{#if desmosTab}
  <Desmos bind:calculator />
{:else}
  <math-field readonly bind:this={mathfield} />
{/if}
