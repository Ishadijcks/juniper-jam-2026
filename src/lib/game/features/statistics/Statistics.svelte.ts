import { LudiekFeature } from '@123ishatest/ludiek';
import type { GameManager } from '$lib/game/features/game-manager/GameManager.svelte.js';
import { doc, setDoc } from 'firebase/firestore';
import { db, firebaseAuth } from '$lib/game/features/statistics/firebase';
import { signInAnonymously } from 'firebase/auth';

type StatisticsState = object;

type Dependencies = {
  features: [GameManager];
};
export class Statistics extends LudiekFeature<Dependencies> {
  public readonly type = 'statistics';

  protected _state: StatisticsState = $state({});

  start() {
    this.engine.features.gameManager.onGameCompleted.subscribe(async () => {
      await this.publishGames();
    });
    signInAnonymously(firebaseAuth).then(() => this.publishGames());
  }

  public async publishGames(): Promise<void> {
    const userId = firebaseAuth.currentUser?.uid;
    console.log(`Attempting to publish with id '${userId}'`);
    if (!userId) {
      return;
    }
    const games: string[] = this.engine.features.gameManager.completedGames.map((game) => game.id);
    await setDoc(doc(db, 'users', userId), {
      games,
    });
  }
}
