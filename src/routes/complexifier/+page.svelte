<script lang="ts">
  import { onMount } from "svelte";

  import { Button, Label, NumberInput } from "flowbite-svelte";
  import { MathfieldElement } from "mathlive";

  import Desmos from "$components/Desmos.svelte";
  import { generate } from "$lib/crazy-desmos-expressions/src";
  import { ComputeEngine } from "$lib/crazy-desmos-expressions/src/computeEngine";
  import { latexToDesmosLatex } from "$lib/crazy-desmos-expressions/src/utils";

  let n = 0;
  let iters = 100;

  let latex = "";

  let mathContainer: HTMLDivElement;
  let mathfield: MathfieldElement;

  let calculator: any;

  let ce: ComputeEngine;
  onMount(() => {
    ce = new ComputeEngine();

    mathfield = new MathfieldElement();
    mathfield.readonly = true;

    mathContainer.appendChild(mathfield);

    calculator.updateSettings({
      graphpaper: false,
      zoomButtons: false,
    });
  });
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

<Button
  class="mb-2"
  on:click={() => {
    const expr = generate(n, iters);
    const box = ce.box(expr, { canonical: false });
    latex = latexToDesmosLatex(box.latex);

    mathfield.value = latex;
    calculator.setExpression({
      id: "expr",
      latex,
    });
  }}
>
  Generate
</Button>

<Desmos bind:calculator />
<div class="w-full overflow-auto" bind:this={mathContainer} />
