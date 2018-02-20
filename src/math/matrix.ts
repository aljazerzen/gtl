import { Vector } from './vector';

export class Matrix {

  constructor(public u: Vector, public v: Vector) {
  }

  det() {
    return this.u.x * this.v.y - this.v.x * this.u.y;
  }

}
