<script lang="ts">
  import { Input } from "flowbite-svelte";

  import "mathlive";

  import type { MathfieldElement } from "mathlive";

  export let latex = "";
  $: if (mathfield) {
    mathfield.value = latex;
  }

  let mathfield: MathfieldElement;
</script>

<Input {...$$props} let:props>
  <!-- type="text" fixes styling -->
  <math-field
    type="text"
    {...props}
    class="mt-2 {props.class}"
    bind:this={mathfield}
    on:input={() => {
      // TODO: readable store might be more efficient
      latex = mathfield.value;
    }}
  />
</Input>
