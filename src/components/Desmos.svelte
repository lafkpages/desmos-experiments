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

  export let initialState: any;

  export let calculator: any;
  let calculatorElm: HTMLDivElement;

  let didSetup = false;

  function onLoadMount() {
    if (!window.Desmos || didSetup) {
      return;
    }

    calculator = window.Desmos.GraphingCalculator(calculatorElm);
    window.__debug_calculator = calculator;

    didSetup = true;
    calculator.setState(initialState);

    dispatch("init", { state: initialState, element: calculatorElm });
  }
  onMount(onLoadMount);
</script>

<svelte:window on:load={onLoadMount} />

<div class="flex-grow" bind:this={calculatorElm} />
