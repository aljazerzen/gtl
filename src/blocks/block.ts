import { Vector } from '../math/vector';
import { MassPoint } from '../math/mass-point';
import { ForcePoint } from '../math/force-point';

export abstract class Block {

  static TYPE: { [blockName: string]: any } = {};

  color: number = 1;
  offset: Vector;

  constructor(r: Vector) {
    this.offset = r.clone();
  }

  abstract get mass(): number;

  abstract get massPoint(): MassPoint;

  thrust(): ForcePoint {
    return null;
  };

  thrustUnthrottled(): ForcePoint {
    return null;
  };

  abstract get points(): Vector[];

  rotate(t: number): void {
    this.points.forEach(point => point.rotate(t));
  }
}
