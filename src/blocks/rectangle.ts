import { Block } from './block';
import { MassPoint } from '../math/mass-point';
import { Vector } from '../math/vector';

export class Rectangle extends Block {

  size: Vector;

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y);
    this.size = new Vector(w, h);
  }

  get mass(): number {
    return this.size.x * this.size.y;
  }

  get massPoint(): MassPoint {
    return new MassPoint(this.offset.sum(this.size.product(0.5)), this.mass);
  }

}