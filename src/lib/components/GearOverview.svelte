<script lang="ts">
  import { engine } from '$lib/game/game.svelte';
  import GearGameDisplay from '$lib/components/GearGameDisplay.svelte';
  import ProgressBar from '$lib/components/progress-bar/ProgressBar.svelte';
  import CreditsBar from '$lib/components/CreditsBar.svelte';
  import { shuffle } from '@123ishatest/ludiek';
  let gameManager = $derived(engine.features.gameManager);
  let gearGrid = $derived(engine.features.gearGrid);

  // let games = $derived(gameManager.games)
  let gears = $derived(gearGrid.gears);

  let shuffledGears = $derived(shuffle(gears));

  let gamesCompleted = $derived(gameManager.gamesCompleted);
  let totalGames = $derived(gameManager.gameCount);
  let progress = $derived(gamesCompleted / totalGames);
</script>

<div class="flex flex-col h-full lg:min-w-[128] space-y-4">
  <div class="flex flex-row w-full">
    <ProgressBar {progress}>
      <span class="font-primary text-xs lg:text-md">{gamesCompleted}/{totalGames} Games completed</span>
    </ProgressBar>
  </div>

  <p class="font-primary text-center">Drag the gears to make the hats spin!</p>

  <div class="flex flex-col space-y-2 overflow-y-scroll">
    {#each shuffledGears as gear (gear.id)}
      {#if gear.game}
        <GearGameDisplay {gear} />
      {/if}
    {/each}
  </div>

  <CreditsBar />
</div>
