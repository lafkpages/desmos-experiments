<script>
  import "../app.pcss";
</script>

<div class="flex flex-col gap-4 p-4 size-full">
  <slot />
</div>

<style>
  :global(html, body) {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
  }

  :global(*) {
    box-sizing: border-box;
  }
</style>
