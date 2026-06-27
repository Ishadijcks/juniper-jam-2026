import { LudiekFeature } from '@123ishatest/ludiek';
import type { GameContent, GameDetail, GameId } from '$lib/game/features/game-manager/Game.content';
import type { GameCompletedEvent } from '$lib/game/features/game-manager/GameManagerEvents';
import { SimpleEventDispatcher, type ISimpleEvent } from 'strongly-typed-events';

type Dependencies = {
  content: [GameContent];
};

type GameManagerState = {
  completions: Record<
    GameId,
    {
      timestamp: Date;
    }
  >;
};

export class GameManager extends LudiekFeature<Dependencies> {
  readonly type = 'gameManager';
  protected _state: GameManagerState = $state({
    completions: {},
  });

  public update() {
    this.scanForCompletions();
  }

  // eslint-disable-next-line svelte/prefer-svelte-reactivity
  public completeGame(gameId: GameId, timestamp: Date = new Date()): void {
    if (this.isCompleted(gameId)) {
      return;
    }
    this._state.completions[gameId] = {
      timestamp,
    };

    const game = this.engine.contentManager.get(gameId, 'game');
    this._onGameCompleted.dispatch({
      game,
    });
  }

  public scanForCompletions(): void {
    this.games.forEach((game) => {
      if (this.isCompleted(game.id)) {
        return;
      }

      this.scanLocalStorage(game);
    });
  }

  public scanLocalStorage(game: GameDetail): void {
    const data = localStorage.getItem(game.saveKey);
    if (!data) {
      return;
    }

    console.log(`${game.id}: Found data ${data}`);

    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const date = new Date(data);
    this.completeGame(game.id, date);
  }

  /**
   * Reset the progress flag from all other games
   */
  public resetGames(): void {
    this.games.forEach((game) => {
      localStorage.removeItem(game.saveKey);
    });
  }

  public isCompleted(gameId: GameId): boolean {
    return this._state.completions[gameId] != null;
  }

  public get games(): GameDetail[] {
    return this.engine.contentManager.getList('game');
  }

  public get gameCount(): number {
    return this.games.length;
  }

  public get gamesCompleted(): number {
    return this.completedGames.length;
  }

  public get completedGames(): GameDetail[] {
    return this.games.filter((game) => this.isCompleted(game.id));
  }

  public get allGamesCompleted(): boolean {
    return this.games.every((game) => this.isCompleted(game.id));
  }

  // Events
  protected _onGameCompleted = new SimpleEventDispatcher<GameCompletedEvent>();

  /**
   * Emitted when a game is completed
   */
  public get onGameCompleted(): ISimpleEvent<GameCompletedEvent> {
    return this._onGameCompleted.asEvent();
  }
}
