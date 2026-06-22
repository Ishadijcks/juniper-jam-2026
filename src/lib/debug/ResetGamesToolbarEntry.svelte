<script lang="ts">
  import { engine } from '$lib/game/game.svelte';
</script>

<button class="d-btn d-btn-danger" onclick={() => engine.features.gameManager.resetGames()}>Reset games</button>
