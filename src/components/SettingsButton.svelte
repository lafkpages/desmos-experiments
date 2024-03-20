<script>
  import { Button } from "flowbite-svelte";
  import { CogSolid } from "flowbite-svelte-icons";

  export let settingsModal = false;
</script>

<Button
  color="alternative"
  class="absolute top-9 right-8 !p-2"
  on:click={() => {
    settingsModal = true;
  }}
>
  <CogSolid class="w-4 h-4" />
</Button>
