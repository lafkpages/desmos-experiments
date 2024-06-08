<script lang="ts">
  import { tick } from "svelte";

  import { Accordion, AccordionItem, Button, Input, Label, Textarea } from "flowbite-svelte";

  import Desmos from "$components/Desmos.svelte";
  import { desmosColorLaTeX } from "$lib/color";
  import { charHeight, charWidth, generateInterpolatedTextState } from "$lib/interpoltext";

  let calculator: any;

  let textToInterpolate = "";
  let color: string | null = null;
  $: colorNumber = color ? parseInt(color.slice(1), 16) : -1;
  $: colorRgb =
    colorNumber >= 0
      ? ([(colorNumber >> 16) & 255, (colorNumber >> 8) & 255, colorNumber & 255] as const)
      : null;

  let charSpacing = "0";
  let lineSpacing = "0";

  $: if (calculator) {
    charSpacing;
    lineSpacing;
    refreshCalculator(textToInterpolate);

    console.debug({ charSpacing, lineSpacing });
  }

  $: if (calculator && colorRgb) {
    calculator.setExpression({
      id: "color",
      latex: `C=${desmosColorLaTeX(colorRgb)}`,
    });
  }

  let calculatorHasColorLoaded = false;
  function refreshCalculator(textToInterpolate: string) {
    let targetFunction = "";
    for (const expression of calculator.getExpressions()) {
      if (expression.id === "targetFunction") {
        if (expression.latex.startsWith("f\\left(x\\right)=")) {
          targetFunction = expression.latex;
        }
        break;
      }
    }

    calculatorHasColorLoaded = colorRgb !== null;

    calculator.setState(
      generateInterpolatedTextState(textToInterpolate, {
        charSpacing: parseFloat(charSpacing),
        lineSpacing: parseFloat(lineSpacing),
        targetFunction,
        color: colorRgb,
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

  <Input
    type="color"
    on:input={() => {
      if (!calculatorHasColorLoaded) {
        refreshCalculator(textToInterpolate);
      }
    }}
    bind:value={color}
    class="w-16 h-full"
  />
  <Button
    size="xs"
    on:click={async () => {
      color = null;

      // wait for colorRgb to be updated
      await tick();

      refreshCalculator(textToInterpolate);
    }}>Reset</Button
  >
</div>

<Accordion>
  <AccordionItem>
    <span slot="header">Options</span>

    <div class="flex gap-2">
      <div class="grow">
        <Label for="charSpacing" class="block mb-2">Character spacing</Label>
        <Input type="number" min={0} max={charWidth} id="charSpacing" bind:value={charSpacing} />
      </div>

      <div class="grow">
        <Label for="lineSpacing" class="block mb-2">Line spacing</Label>
        <Input type="number" min={0} max={charHeight} id="lineSpacing" bind:value={lineSpacing} />
      </div>
    </div>
  </AccordionItem>
</Accordion>

<Desmos bind:calculator />
