<script lang="ts">
  import { engine } from '$lib/game/game.svelte';
  import type { GearDetail } from '$lib/game/features/gear-grid/Gear.content';
  import DraggableGear from '$lib/components/DraggableGear.svelte';
  import AnimatedGear from '$lib/components/AnimatedGear.svelte';
  import { createDroppable } from '@dnd-kit/svelte';
  import Panel from '$lib/components/panel/Panel.svelte';
  import type { GameId } from '$lib/game/features/game-manager/Game.content';

  interface Props {
    gear: GearDetail;
  }

  let { gear }: Props = $props();
  let gearGrid = $derived(engine.features.gearGrid);
  let gameManager = $derived(engine.features.gameManager);

  let isUnlocked = $derived(gameManager.isCompleted(gear.game as GameId));

  const defaultSize = 48;

  let game = $derived(engine.contentManager.get(gear.game as GameId, 'game'));
</script>

<div class="w-full">
  <div class="flex flex-row h-full space-x-4 items-center">
    <div class="flex flex-row justify-center items-center w-24">
      {#if isUnlocked}
        {#if !gearGrid.isPlaced(gear.id)}
          <!-- Ugly ugly hack -->
          <DraggableGear speed={0} gearId={gear.id} cellSize={defaultSize / gear.size} />
        {:else}
          <div class="disabled grayscale-100 opacity-25" {@attach createDroppable({ id: `cancel${gear.id}` }).attach}>
            <AnimatedGear speed={0} image={gear.image} size={defaultSize} />
          </div>
        {/if}
      {/if}
    </div>

    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href={game.url} target="_blank" class="w-full">
      <Panel --pixel-upscale={1} className="w-full hover:bg-red-600 ">
        <div class="font-primary text-xl">
          <div class="flex flex-col">
            <h2 class="text-md lg:text-xl font-primary">{game.title}</h2>
            <h2 class="text-xs lg:text-sm font-primary">{game.description}</h2>
          </div>
        </div>
      </Panel>
    </a>
  </div>
</div>
