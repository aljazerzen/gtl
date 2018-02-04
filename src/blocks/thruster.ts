import { Vector } from '../math/vector';
import { ForcePoint } from '../math/force-point';
import { Block } from './block';
import { Polygon } from '../math/polygon';

export class Thruster extends Block {

  throttle: number = 0;

  points: Vector[];

  constructor(r: Vector, width: number, d: number) {
    super(r);
    Block.TYPE.THRUSTER = Thruster;

    const f = Math.PI / 2 * d;
    this.polygon = new Polygon([
      new Vector(),
      new Vector(width, 0),
      new Vector(width, width),
      new Vector(0.8 * width, width),
      new Vector(width, 1.6 * width),
      new Vector(0, 1.6 * width),
      new Vector(0.2 * width, width),
      new Vector(0, width),
    ].map(v => v.rotation(f)));

    this.thrustVector = new Vector(0, -width * width * 0.1).rotation(f);
  }

  thrustPosition(): Vector {
    return this.offset.sum(this.polygon.points[2].product(0.5)).sum(this.polygon.points[7].product(0.2));
  }

  thrustVector: Vector;

  thrust(): ForcePoint {
    let f = this.thrustVector.product(this.throttle);
    let r = this.thrustPosition();

    return new ForcePoint(Math.sin(r.angleDirection(f)) * r.length * f.length, f);
  };

  thrustUnthrottled(): ForcePoint {
    let f = this.thrustVector;
    let r = this.thrustPosition();
    return new ForcePoint(Math.sin(r.angleDirection(f)) * r.length * f.length, f.clone());
  };

  rotate(t: number) {
    super.rotate(t);
    this.thrustVector.rotate(t);
  }
}
