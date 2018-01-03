import { Vector } from './vector';

export class ForcePoint {

  // constructor(public r: Vector = null, public f: Vector = null) {
  constructor(public r = new Vector, public f = new Vector) {
  }

  add(p: ForcePoint) {
    if (p) {

      // if (!this.r || !this.f) {
      //   this.r = p.r.clone();
      //   this.f = p.f.clone();
      // }

      // this.r = p.r.difference(this.r).product(1 / (1 + p.r.length / this.r.length));

      if (this.f.isZero()) {

        this.r = p.r.clone();

      } else if (p.f.isZero()) {

        // this.r = this.r;

      } else {

        let a1 = this.r;
        let a2 = this.r.sum(this.f);

        let a3 = p.r;
        let a4 = p.r.sum(p.f);

        let b = (a1.x - a2.x) * (a3.y - a4.y) - (a1.y - a2.y) * (a3.x - a4.x);

        if (Math.abs(b) < 0.000001) {

          // Thrust lines are parallel - do same as with mass point

          this.r.add(p.r.difference(this.r).multiply(1 / (1 + this.f.length / p.f.length)));

        } else {

          // Thrust lines have an intersection - algebra magic
          // https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection

          let x = ((a1.x * a2.y - a1.y * a2.x) * (a3.x - a4.x) - (a1.x - a2.x) * (a3.x * a4.y - a3.y * a4.x)) / b;
          let y = ((a1.x * a2.y - a1.y * a2.x) * (a3.y - a4.y) - (a1.y - a2.y) * (a3.x * a4.y - a3.y * a4.x)) / b;
          this.r = new Vector(x, y);

        }

      }

      if(this.r.length > 1255500)
        debugger;

      this.f.add(p.f);
    }
    return this;
  }

}