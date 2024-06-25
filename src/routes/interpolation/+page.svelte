<script lang="ts">
  import "mathlive";

  import { Label, Range, Select } from "flowbite-svelte";

  import Desmos from "$components/Desmos.svelte";
  import MathInput from "$components/MathInput.svelte";

  enum InterpolationType {
    Function = "Function",
    Parametric = "Parametric",
    Polar = "Polar",
  }

  let interpolationType = InterpolationType.Function;

  let latexA = "\\sin x";
  let latexB = "x^2";
  let interpolationFactor = 0;

  let calculator: any;
</script>

<Label>
  Interpolation type
  <Select
    class="mt-2"
    items={[
      { name: "Functions", value: InterpolationType.Function },
      { name: "Parametrics", value: InterpolationType.Parametric },
      { name: "Polar", value: InterpolationType.Polar },
    ]}
    bind:value={interpolationType}
  />
</Label>

<div class="flex gap-2">
  <Label class="grow">
    {interpolationType} A
    <MathInput bind:latex={latexA} />
  </Label>

  <Label class="grow">
    {interpolationType} B
    <MathInput bind:latex={latexB} />
  </Label>
</div>

<Label for="input-interpolation-factor">Interpolation factor: {interpolationFactor}</Label>
<Range
  id="input-interpolation-factor"
  min={0}
  max={1}
  step={0.01}
  bind:value={interpolationFactor}
/>

<Desmos
  bind:calculator
  initialState={{
    version: 11,
    expressions: {
      list: [
        {
          type: "expression",
          id: "a",
          latex: "a\\left(x\\right)=\\sin x",
          hidden: true,
        },
        {
          type: "expression",
          id: "b",
          latex: "b\\left(x\\right)=x^2",
          hidden: true,
        },
        {
          type: "expression",
          id: "space1",
        },
        {
          type: "expression",
          id: "t",
          latex: "t=1",
          slider: {
            hardMin: true,
            hardMax: true,
            playDirection: -1,
            min: "0",
            max: "1",
          },
        },
        {
          type: "expression",
          id: "T",
          latex: "T=1-t",
        },
        {
          type: "expression",
          id: "space2",
        },
        {
          type: "expression",
          id: "3",
          latex: "y=ta\\left(x\\right)+Tb\\left(x\\right)",
        },
      ],
    },
  }}
/>
