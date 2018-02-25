import { Vector } from '../math/vector';
import { ForcePoint } from '../math/force-point';
import { Block, RegisterBlock } from './block';
import { Polygon } from '../math/polygon';

@RegisterBlock('thruster')
export class Thruster extends Block {

  throttle: number = 0;
  throttleTarget: number = 0;
  thrustVector: Vector;

  constructor(r: Vector, width: number, d: number) {
    super(r);

    const f = Math.PI / 2 * d;
    const polygon = Polygon.fromRaw([
      [0, 0],
      [width, 0],
      [width, width],
      [0.8 * width, width],
      [width, 1.6 * width],
      [0, 1.6 * width],
      [0.2 * width, width],
      [0, width],
    ]);
    polygon.rotate(f);
    this.surface = polygon;
    this.thrustVector = new Vector(0, -width * width * 0.1).rotation(f);
  }

  thrustPosition(): Vector {
    return this.offset.sum(this.surface.points[2].product(0.5)).sum(this.surface.points[7].product(0.2));
  }

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

  tick() {
    this.throttle = this.throttle + Math.min(this.throttleTarget - this.throttle, 0.01);
  }

  controlThrottle(throttle: number) {
    if (!isNaN(throttle) && this.throttle !== null)
      this.throttleTarget = Math.max(Math.min(throttle, 1), 0);
  }
}
