<script lang="ts">
  import { createDraggable } from '@dnd-kit/svelte';
  import AnimatedGear from '$lib/components/AnimatedGear.svelte';
  import { engine } from '$lib/game/game.svelte';

  interface Props {
    speed: number;
    cellSize: number;
    gearId: string;
    isDraggable?: boolean;
    isReversed?: boolean;
  }

  let { speed, cellSize, gearId, isReversed = false, isDraggable = true }: Props = $props();

  let gear = $derived(engine.contentManager.get(gearId, 'gear'));
  const draggable = $derived(createDraggable({ id: gear.id }));

  let size = $derived(cellSize * gear.size);
  let image = $derived(gear.image);
</script>

<div class="cursor-grab" {@attach isDraggable && draggable.attach}>
  <AnimatedGear speed={speed / gear.size} {image} {size} {isReversed} />
</div>
