<script lang="ts">
  import Modal from '$lib/components/Modal.svelte';
  import { onMount } from 'svelte';
  import { engine } from '$lib/game/game.svelte';
  import { gameCompletedSound } from '$lib/audio';

  let showModal = $state(false);

  onMount(() => {
    return engine.features.gameManager.onGameCompleted.subscribe(() => {
      if (engine.features.gameManager.allGamesCompleted) {
        showModal = true;
        gameCompletedSound.play();
      }
    });
  });
</script>

<Modal bind:showModal>
  <div class="flex flex-col items-center space-y-4">
    <h2 class="font-primary text-xl">Incredible!</h2>
    <h2 class="font-primary text-lg">You have completed all the games!</h2>
    <p class="font-primary text-sm">
      Luckily there are
      <a href="https://itch.io/jam/theveryseriousjuniperdevgamejam/submissions" target="_blank" class="underline"
        >way more games to play!</a
      >
    </p>
    <br />
    <h2 class="font-primary text-lg">Thank you for playing!</h2>
    <p class="font-primary text-md">- Isha</p>
    <br />

    <br />
  </div>
</Modal>
