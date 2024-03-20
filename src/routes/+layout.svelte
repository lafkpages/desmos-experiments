<script>
  import { DarkMode, Navbar, NavBrand, NavHamburger, NavLi, NavUl } from "flowbite-svelte";

  import "../app.pcss";

  import { pages } from "$lib/nav";
</script>

<div class="flex flex-col gap-4 p-4 size-full">
  <Navbar fluid>
    <NavBrand href="/">
      <img src="/obj.png" alt="Cube in Desmos" class="me-3 h-6 sm:h-9" />
      <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
        Desmos experiments
      </span>
    </NavBrand>
    <div class="flex gap-2 md:order-2">
      <DarkMode />
      <div class="w-9 h-9" />

      <NavHamburger />
    </div>
    <NavUl class="order-1">
      {#each pages as page}
        <NavLi href={page.href}>{page.title}</NavLi>
      {/each}
    </NavUl>
  </Navbar>

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
