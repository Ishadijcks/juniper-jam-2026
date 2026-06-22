<script lang="ts">
  import { engine } from '$lib/game/game.svelte';
</script>

<button class="d-btn" onclick={() => engine.features.gameManager.scanForCompletions()}>Scan</button>
