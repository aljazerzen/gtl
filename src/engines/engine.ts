import { World } from '../world';

export abstract class Engine {

  getWorld(): World {
    return this.world;
  }

  constructor(protected world: World) {
  }

  abstract tick(): void;

}