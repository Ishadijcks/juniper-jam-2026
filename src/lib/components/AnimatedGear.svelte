<script lang="ts">
  import { type Asset } from '$app/types';
  import { onMount } from 'svelte';
  import { asset } from '$app/paths';
  import { Tween } from 'svelte/motion';

  interface Props {
    size: number;
    src: Asset;
    speed: number;
    isReversed?: boolean;
  }

  let { size, src, speed, isReversed = false }: Props = $props();

  let image = $derived(asset('/assets/gear/' + src));

  const intervalDuration = 20;

  let rotation = new Tween(0, {
    duration: intervalDuration,
  });

  let delta = $derived(isReversed ? -speed : speed);

  onMount(() => {
    const interval = setInterval(() => {
      rotation.target += delta * (intervalDuration / 1000);
    }, intervalDuration);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<img
  class="pixelated"
  draggable="false"
  src={image}
  alt="Gear"
  style="width: {size}px; height: {size}px; transform:rotate({rotation.current}deg);"
/>
