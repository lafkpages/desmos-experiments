<script lang="ts">
  import { onMount } from "svelte";

  import { Button, NumberInput } from "flowbite-svelte";
  import { MathfieldElement } from "mathlive";

  import { generate } from "$lib/crazy-desmos-expressions/src";
  import { ComputeEngine } from "$lib/crazy-desmos-expressions/src/computeEngine";
  import { latexToDesmosLatex } from "$lib/crazy-desmos-expressions/src/utils";

  let n = 0;
  let iters = 100;

  let latex = "";

  let mathContainer: HTMLDivElement;
  let mathfield: MathfieldElement;

  let ce: ComputeEngine;
  onMount(() => {
    ce = new ComputeEngine();

    mathfield = new MathfieldElement();
    mathfield.readonly = true;

    mathContainer.appendChild(mathfield);
  });
</script>

<NumberInput bind:value={n} />
<NumberInput bind:value={iters} />

<Button
  on:click={() => {
    const expr = generate(n, iters);
    const box = ce.box(expr, { canonical: false });
    latex = latexToDesmosLatex(box.latex);

    mathfield.value = latex;
  }}
>
  Generate
</Button>

<div bind:this={mathContainer} />
