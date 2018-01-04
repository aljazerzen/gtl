import { Block } from './block';
import { MassPoint } from '../math/mass-point';
import { Vector } from '../math/vector';

export class Circle extends Block {
  constructor(s: Vector, public r: number) {
    super(s);
  }

  get mass(): number {
    return Math.PI * this.r * this.r;
  }

  get massPoint(): MassPoint {
    return new MassPoint(this.offset, this.mass);
  }

  rotate(): void {
  }

}