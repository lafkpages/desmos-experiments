<script lang="ts">
  import { Button, Input, Textarea } from "flowbite-svelte";

  import Desmos from "$components/Desmos.svelte";
  import { generateInterpolatedTextState } from "$lib/interpoltext";

  let calculator: any;

  let textToInterpolate = "";
  let color: string | null = null;

  $: if (calculator) {
    let targetFunction = "";
    for (const expression of calculator.getExpressions()) {
      if (expression.id === "targetFunction") {
        if (expression.latex.startsWith("f\\left(x\\right)=")) {
          targetFunction = expression.latex;
        }
        break;
      }
    }

    calculator.setState(
      generateInterpolatedTextState(textToInterpolate, {
        targetFunction,
        color,
      }),
    );
  }
</script>

<div class="grid gap-2 grid-cols-1fr-16 grid-rows-2">
  <Textarea
    placeholder="Enter text to interpolate"
    bind:value={textToInterpolate}
    class="row-span-2"
  />

  <Input type="color" bind:value={color} class="w-16 h-full" />
  <Button
    size="xs"
    on:click={() => {
      color = null;
    }}>Reset</Button
  >
</div>

<Desmos bind:calculator />
