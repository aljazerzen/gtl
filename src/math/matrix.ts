import { Vector } from './vector';

export class Matrix {

  constructor(public u: Vector, public v: Vector) {
  }

  det() {
    return this.u.x * this.v.y - this.v.x * this.u.y;
  }

  multiply(A: Matrix) {
    return new Matrix(
      new Vector(this.u.x * A.u.x + this.u.y * A.v.x, this.u.x * A.u.y + this.u.y * A.v.y),
      new Vector(this.v.x * A.u.x + this.v.y * A.v.x, this.v.x * A.u.y + this.v.y * A.v.y),
    );
  }

}
