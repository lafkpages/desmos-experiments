<script lang="ts">
  import { Textarea } from "flowbite-svelte";

  import Desmos from "$components/Desmos.svelte";
  import { generateInterpolatedTextState } from "$lib/interpoltext";

  let calculator: any;

  let textToInterpolate = "";
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
      }),
    );
  }
</script>

<Textarea placeholder="Enter text to interpolate" bind:value={textToInterpolate} />

<Desmos bind:calculator />
