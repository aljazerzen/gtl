import { Vector } from './vector';

export class ForcePoint {

  constructor(public r: number = 0, public f: Vector = new Vector()) {
  }

  add(p: ForcePoint) {
    if (p) {
      this.f.add(p.f);
      this.r += (p.r - this.r) * (p.f.length / this.f.length) || 0;
    }
    return this;
  }

}