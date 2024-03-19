<script>
  import { Navbar, NavBrand, NavHamburger, NavLi, NavUl } from "flowbite-svelte";

  import "../app.pcss";
</script>

<Navbar fluid>
  <NavBrand href="/">
    <img src="/favicon.png" alt="Cube in Desmos" class="me-3 h-6 sm:h-9" />
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite</span
    >
  </NavBrand>
  <NavHamburger />
  <NavUl>
    <NavLi href="/obj">OBJ to Desmos</NavLi>
    <NavLi href="/img">Image to Desmos</NavLi>
  </NavUl>
</Navbar>

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
