import { Vector } from '../math/vector';
import { Block, RegisterBlock } from './block';
import { Polygon } from '../math/polygon';
import { ForcePoint } from '../math/force-point';

@RegisterBlock('gyroscope')
export class Gyroscope extends Block {

  // in range [-1, 1]
  power: number = 0;
  speed: number = 0;
  private oldSpeed: number = 0;

  constructor(r: Vector, width: number = 5, d: number) {
    super(r);

    const f = Math.PI / 2 * d;
    const polygon = Polygon.fromRaw([
      [0.5, -2.5],
      [1.5, -2],
      [1, -1],
      [2, -1.5],
      [2.5, -0.5],

      [2.5, 0.5],
      [2, 1.5],
      [1, 1],
      [1.5, 2],
      [0.5, 2.5],

      [-0.5, 2.5],
      [-1.5, 2],
      [-1, 1],
      [-2, 1.5],
      [-2.5, 0.5],

      [-2.5, -0.5],
      [-2, -1.5],
      [-1, -1],
      [-1.5, -2],
      [-0.5, -2.5],
    ]);
    polygon.rotate(f);
    polygon.scale(width / 5);
    this.surface = polygon;
  }

  controlPower(power: number) {
    this.power = Math.min(Math.max(power, -1), 1);
  }

  tick() {
    this.speed += this.power / 100;
    this.phi += (this.oldSpeed + this.speed ) / 10;
    this.oldSpeed = this.speed;
  }

  torque() {
    return new ForcePoint(-this.maxTorque() * this.power, new Vector);
  }

  maxTorque() {
    return this.mass * 4;
  }
}
