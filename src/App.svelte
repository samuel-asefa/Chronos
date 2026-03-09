<script>
  import { currentScreen } from "./lib/store.js";
  import Header from "./components/Header.svelte";
  import StartScreen from "./components/StartScreen.svelte";
  import GameScreen from "./components/GameScreen.svelte";
  import ResultsScreen from "./components/ResultsScreen.svelte";
</script>

<Header />

<main>
  {#if $currentScreen === "start"}
    <StartScreen />
  {:else if $currentScreen === "game"}
    <GameScreen />
  {:else if $currentScreen === "results"}
    <ResultsScreen />
  {/if}
</main>

<style>
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
  }
</style>
