<script>
  import { Card, Gallery, Heading, P } from "flowbite-svelte";

  import { pages } from "$lib/nav";
</script>

<svelte:head>
  <title>Desmos experiments</title>
</svelte:head>

<main class="flex flex-col items-center justify-center gap-4 size-full h-max">
  <Heading tag="h1" class="w-max">Desmos experiments</Heading>

  <P>Some programs I've made to import cool stuff into Desmos.</P>

  <Gallery class="grid-cols-2 justify-items-center w-max">
    {#each pages as page}
      <Card href={page.href} img="{page.href}.png" class="h-auto">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {page.title}
        </h2>
        <P>{page.description}</P>
      </Card>
    {/each}
  </Gallery>
</main>
