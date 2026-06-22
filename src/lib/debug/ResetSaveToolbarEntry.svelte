<script lang="ts">
  import { game } from '$lib/game/game.svelte';

  const resetSave = () => {
    game.deleteSave();
    window.location.reload();
  };
</script>

<button class="d-btn d-btn-error" onclick={() => resetSave()}>Reset save</button>
