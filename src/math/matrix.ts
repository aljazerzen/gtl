import { Vector } from './vector';

export class Matrix {

  v: Vector[];

  constructor(...v: Vector[]) {
    if(v.length > 2)
      throw new Error('matrices for size > 2 are not implemented yet');
    this.v = v;
  }

  determinant() {
    switch(this.v.length) {
      case 1:
        return this.v[0].x;
      case 2:
        return this.v[0].x * this.v[1].y - this.v[1].x * this.v[0].y
    }
    return 0;
  }

}