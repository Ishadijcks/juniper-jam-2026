import { LudiekFeature } from '@123ishatest/ludiek';
import type { GearContent, GearDetail, GearId } from '$lib/game/features/gear-grid/Gear.content';

export interface GearState {
  x: number;
  y: number;
  gear: GearId | null;
  isVisible: boolean;
  isFixed: boolean;
  isSource?: boolean;
  speed: number;
  isReversed: boolean;
}

export interface GearGridState {
  grid: GearState[][];
  connections: { from: GearState; to: GearState }[];
}

type Dependencies = {
  content: [GearContent];
};

export class GearGrid extends LudiekFeature<Dependencies> {
  public readonly type = 'gearGrid';

  public readonly HEIGHT = 11;
  public readonly WIDTH = 11;

  protected _state: GearGridState = $state({
    grid: [],
    connections: [],
  });

  initialize() {
    this._state.grid = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      const row: GearState[] = [];
      for (let x = 0; x < this.WIDTH; x++) {
        const isGridTile = x > 0 && x < this.WIDTH - 1 && y > 0 && y < this.HEIGHT - 1;
        row.push({
          x,
          y,
          gear: null,
          isVisible: isGridTile,
          isFixed: !isGridTile,
          speed: 0,
          isReversed: false,
        });
      }
      this._state.grid.push(row);
    }

    const middleX = Math.floor((this.WIDTH - 1) / 2);
    const middleY = Math.floor((this.HEIGHT - 1) / 2);

    this.grid[middleY][0] = {
      x: 0,
      y: middleY,
      gear: '/gear/source',
      isVisible: true,
      isFixed: true,
      isSource: true,
      speed: 100,
      isReversed: false,
    };
    this.grid[0][middleX].isVisible = true;
    this.grid[middleY][this.WIDTH - 1] = {
      x: this.WIDTH - 1,
      y: middleY,
      gear: '/gear/hat',
      isVisible: true,
      isFixed: true,
      speed: 0,
      isReversed: false,
    };
    this.grid[this.HEIGHT - 1][middleX].isVisible = true;
  }

  public update(): void {
    this.onGearMoved();
  }

  public onGearMoved(): void {
    this.calculateTree();
    this.setSpeeds();
  }

  public setSpeeds(): void {
    this.placedGears.forEach((gear) => {
      if (!gear.isSource) {
        gear.speed = 0;
      }
    });
    this._state.connections.forEach((connection) => {
      connection.to.speed = connection.from.speed;
      connection.to.isReversed = !connection.from.isReversed;
    });
  }

  public placeGear(x: number, y: number, gearId: GearId): void {
    this._state.grid[y][x].gear = gearId;
  }

  public get source(): GearState {
    const middleY = Math.floor((this.HEIGHT - 1) / 2);
    return this.grid[middleY][0];
  }

  public removeById(gearId: GearId): void {
    return this.grid.forEach((row) => {
      row.forEach((tile) => {
        if (tile.gear === gearId) {
          tile.gear = null;
        }
      });
    });
  }

  public calculateTree(): void {
    const connections: { from: GearState; to: GearState }[] = [];
    const isTraversed: Record<GearId, boolean> = {};
    const queue: GearState[] = [this.source];

    while (queue.length) {
      const current = queue.shift();
      if (!current || !current.gear) {
        console.warn('Invalid gear in queue, skipping', current);
        continue;
      }
      isTraversed[current.gear] = true;

      const currentDetail = this.getGearDetail(current.gear);

      const connectedGears = this.placedGears.filter((gear) => {
        if (!gear.gear || gear.gear === current.gear) {
          return false;
        }
        const squaredDistance = Math.pow(gear.x - current.x, 2) + Math.pow(gear.y - current.y, 2);
        const squaredReach = Math.pow(this.getGearDetail(gear.gear).size / 2 + currentDetail.size / 2, 2);
        return Math.abs(squaredReach - squaredDistance) < 0.2;
      });

      connectedGears.forEach((gear) => {
        if (!isTraversed[gear.gear as GearId]) {
          connections.push({
            from: current,
            to: gear,
          });
          queue.push(gear);
        }
      });
    }

    this._state.connections = connections;
  }

  public removeGear(x: number, y: number): void {
    this._state.grid[y][x].gear = null;
  }

  public moveGear(fromX: number, fromY: number, toX: number, toY: number) {
    const fromGear = this.getGear(fromX, fromY);
    if (!fromGear) {
      console.warn(`Cannot move gear as there was no gear at (${fromX}, ${fromY})`);
      return;
    }
    const toGear = this.getGear(toX, toY);
    if (toGear) {
      this.swapGears(fromX, fromY, toX, toY);
      return;
    }

    this.removeGear(fromX, fromY);
    this.placeGear(toX, toY, fromGear);
  }

  public swapGears(fromX: number, fromY: number, toX: number, toY: number) {
    const fromGear = this.getGear(fromX, fromY);
    const toGear = this.getGear(toX, toY);

    if (!(fromGear && toGear)) {
      console.warn(`Cannot swap gear '${fromGear}' with '${toGear}`);
      return;
    }

    this.placeGear(toX, toY, fromGear);
    this.placeGear(fromX, fromY, toGear);
  }

  public getGear(x: number, y: number): GearId | null {
    return this._state.grid[y][x].gear;
  }

  public getGearDetail(gearId: GearId): GearDetail {
    return this.engine.contentManager.get(gearId, 'gear');
  }

  public isPlaced(gearId: GearId): boolean {
    return this.grid.some((row) => row.some((tile) => tile.gear === gearId));
  }

  public get placedGears(): GearState[] {
    return this.grid.flatMap((row) =>
      row.flatMap((tile) => {
        if (tile.gear) {
          return [tile];
        }
        return [];
      }),
    );
  }

  public get gears(): GearDetail[] {
    return this.engine.contentManager.getList('gear');
  }

  public get grid(): GearState[][] {
    return this._state.grid;
  }

  public load() {
    // Don't load the grid
    return;
  }
}
