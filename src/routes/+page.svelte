<script lang="ts">
  import { engine, game } from '$lib/game/game.svelte';
  import GearGrid from '$lib/components/GearGrid.svelte';
  import { DragDropProvider } from '@dnd-kit/svelte';
  import { onMount } from 'svelte';
  import Panel from '$lib/components/panel/Panel.svelte';
  import GearOverview from '$lib/components/GearOverview.svelte';

  let { data } = $props();

  // TODO(@Isha): Where should this go, on the server?
  engine.contentManager.load(data);

  onMount(() => {
    // TODO(@Isha): Consider if we even want to support saving?
    game.start();
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onDragEnd(event: any) {
    if (event.canceled) return;

    const source = event.operation.source;
    const target = event.operation.target;
    if (!source || !target) {
      return;
    }

    const gearId = source.id;
    const targetId = target.id;

    if (targetId.startsWith('cancel')) {
      engine.features.gearGrid.removeById(gearId);
      return;
    }

    const x = event.operation.target.data.x;
    const y = event.operation.target.data.y;

    engine.features.gearGrid.removeById(gearId);
    engine.features.gearGrid.placeGear(x, y, gearId);
  }
</script>

<DragDropProvider {onDragEnd}>
  <div class="flex flex-col lg:flex-row h-full space-y-2 lg:space-y-0 lg:space-x-8 lg:pl-8">
    <Panel className="grow">
      <GearGrid />
    </Panel>

    <Panel className="max-h-96 lg:max-h-full lg:max-w-1/2">
      <GearOverview />
    </Panel>
  </div>
</DragDropProvider>
