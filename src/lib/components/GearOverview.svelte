<script lang="ts">
  import Panel from '$lib/components/panel/Panel.svelte';
  import { engine } from '$lib/game/game.svelte';
  import GearGameDisplay from '$lib/components/GearGameDisplay.svelte';

  let gameManager = $derived(engine.features.gameManager);
  let gearGrid = $derived(engine.features.gearGrid);

  // let games = $derived(gameManager.games)
  let gears = $derived(gearGrid.gears);

  let gamesCompleted = $derived(gameManager.gamesCompleted);
  let totalGames = $derived(gameManager.gameCount);
</script>

<div class="flex h-full">
  <Panel>
    <div class="flex flex-col space-y-2">
      <p>Games completed: {gamesCompleted}/{totalGames}</p>
      {#each gears as gear (gear.id)}
        <GearGameDisplay {gear} />
      {/each}
    </div>
  </Panel>
</div>
