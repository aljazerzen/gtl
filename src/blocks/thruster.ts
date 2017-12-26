import { MassPoint } from '../math/mass-point';
import { Vector } from '../math/vector';
import { Polygon } from './polygon';
import { ForcePoint } from '../math/force-point';

export class Thruster extends Polygon {

  throttle: number = 0;

  points: Vector[];

  constructor(x: number, y: number, width: number, d: number) {
    super(x, y);
    const f = Math.PI / 2 * d;
    this.points = [
      new Vector(),
      new Vector(width, 0),
      new Vector(width, width),
      new Vector(0.8 * width, width),
      new Vector(width, 1.6 * width),
      new Vector(0, 1.6 * width),
      new Vector(0.2 * width, width),
      new Vector(0, width),
    ].map(v => v.rotation(f));

    this.mass = this.points[1].length * this.points[1].length * 1.5;

    this.thrustVector = new Vector(0, -width * width * 0.1).rotation(f);
  }

  mass: number;

  get massPoint(): MassPoint {
    return new MassPoint(this.offset.sum(this.points[2].product(0.5)), this.mass);
  }

  get thrustPosition(): Vector {
    return this.offset.sum(this.points[2].product(0.5)).sum(this.points[7].product(0.2));
  }

  thrustVector: Vector;

  thrust(): ForcePoint {
    let b = Math.sin(this.thrustPosition.angle(this.thrustVector));
    let a = this.thrustPosition.length * b;
    return new ForcePoint(
      a || 0,
      this.thrustVector.product(this.throttle));
  };

}