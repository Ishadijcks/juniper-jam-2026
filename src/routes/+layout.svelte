<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import { LuiConfigBuilder, LuiContext } from '@123ishatest/lui';
  import { engine } from '$lib/game/game.svelte';

  import background from '$lib/assets/background.png';
  import ResetSaveToolbarEntry from '$lib/debug/ResetSaveToolbarEntry.svelte';
  import ManualScanToolbarEntry from '$lib/debug/ManualScanToolbarEntry.svelte';
  import ResetGamesToolbarEntry from '$lib/debug/ResetGamesToolbarEntry.svelte';

  let { children } = $props();

  const config = new LuiConfigBuilder()
    .addToolbarItem('meta/reset-save', ResetSaveToolbarEntry)
    .addToolbarItem('meta/manual-scan', ManualScanToolbarEntry)
    .addToolbarItem('meta/reset-game-progress', ResetGamesToolbarEntry)

    .build();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<LuiContext {config} {engine}>
  <div class="p-4 h-screen w-full overflow-hidden select-none" style="background-image: url({background})">
    {@render children()}
  </div>
</LuiContext>

<style>
</style>
