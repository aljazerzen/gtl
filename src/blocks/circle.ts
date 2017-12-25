import { Block } from './block';
import { MassPoint } from '../math/mass-point';

export class Circle extends Block {

  constructor(x: number, y: number, public r: number) {
    super(x, y);
  }

  get mass(): number {
    return Math.PI * this.r * this.r;
  }

  get massPoint(): MassPoint {
    return new MassPoint(this.offset, this.mass);
  }

}