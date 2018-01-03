import { Vector } from '../math/vector';
import { MassPoint } from '../math/mass-point';
import { ForcePoint } from '../math/force-point';

export abstract class Block {

  color: number = 1;
  offset: Vector;

  constructor(x: number, y: number) {
    this.offset = new Vector(x, y);
  }

  abstract get mass(): number;

  abstract get massPoint(): MassPoint;

  thrust(): ForcePoint {
    return null;
  };

  thrustUnthrottled(): ForcePoint {
    return null;
  };
}