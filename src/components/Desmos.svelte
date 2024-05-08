<script lang="ts" context="module">
  declare global {
    interface Window {
      __debug_calculator?: unknown;
    }
  }
</script>

<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher<{
    init: {
      state: any;
      element: HTMLDivElement;
    };
  }>();

  export let initialState: any = null;

  export let calculator: any;
  let calculatorElm: HTMLDivElement;

  let didSetup = false;

  let themeObserver: MutationObserver;

  function updateTheme() {
    calculator.updateSettings({
      invertedColors: document.documentElement.classList.contains("dark"),
    });
  }

  function onLoadMount() {
    if (!window.Desmos || didSetup) {
      return;
    }

    calculator = window.Desmos.GraphingCalculator(calculatorElm);
    window.__debug_calculator = calculator;

    // Set the calculator to use the same color scheme as the page
    updateTheme();

    didSetup = true;
    if (initialState) {
      calculator.setState(initialState);
    }

    dispatch("init", { state: initialState, element: calculatorElm });

    themeObserver = new MutationObserver(updateTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
      characterData: false,
      childList: false,
      subtree: false,
    });
  }
  onMount(onLoadMount);
</script>

<svelte:window on:load={onLoadMount} />

<div class="flex-grow" bind:this={calculatorElm} />
