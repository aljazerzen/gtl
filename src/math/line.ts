import { Vector } from './vector';
import { Matrix } from './matrix';

/**
 * Finds an intersection between x-axis and graph of function f between lower and upper bounds
 * Used in this.interceptAngular function
 * @param {Vector} lower
 * @param {Vector} upper
 * @param {(x: number) => number} f
 * @returns {Vector}
 */
const findContactBisection = function (lower: Vector, upper: Vector, f: (x: number) => number) {
  while (upper.x - lower.x > 0.0001) {
    let tMiddle = (upper.x + lower.x) / 2;
    let middle = new Vector(tMiddle, f(tMiddle));

    if (middle.y * lower.y >= 0) lower = middle;
    if (middle.y * upper.y >= 0) upper = middle;
  }

  return lower.x >= 0 ? lower : null;
};

export class Line {

  constructor(public a: Vector, public b: Vector) {

  }

  sum(r: Vector) {
    return new Line(this.a.sum(r), this.b.sum(r));
  }

  isIntersectedByHorizontalRay(point: Vector): boolean {
    return point.y >= this.a.y && point.y < this.b.y ||
      point.y >= this.b.y && point.y < this.a.y;
  }

  intersectionByHorizontalRay(point: Vector): number {
    return (this.b.x - this.a.x) * (point.y - this.a.y) /
      (this.b.y - this.a.y) + this.a.x;
  }

  intersection(line: Line): Vector {
    const denominator = (this.a.x - this.b.x) * (line.a.y - line.b.y) -
      (this.a.y - this.b.y) * (line.a.x - line.b.x);

    if (denominator === 0)
      return null;

    const t1 = (this.a.x * this.b.y - this.a.y * this.b.x);
    const t2 = (line.a.x * line.b.y - line.a.y * line.b.x);
    const i = new Vector(
      (t1 * (line.a.x - line.b.x) - (this.a.x - this.b.x) * t2) / denominator,
      (t1 * (line.a.y - line.b.y) - (this.a.y - this.b.y) * t2) / denominator,
    );

    if (i.x >= Math.min(this.a.x, this.b.x) && i.x <= Math.max(this.a.x, this.b.x) &&
      i.y >= Math.min(this.a.y, this.b.y) && i.y <= Math.max(this.a.y, this.b.y) &&
      i.x >= Math.min(line.a.x, line.b.x) && i.x <= Math.max(line.a.x, line.b.x) &&
      i.y >= Math.min(line.a.y, line.b.y) && i.y <= Math.max(line.a.y, line.b.y))
      return i;
    return null;
  }

  /**
   * Checks for intersection of this and a point along the path:
   * r = r1 + t*a1 + R(t*theta)*o {0 <= t <=1}
   * Where R(x) is rotary matrix
   * @param {Vector} r1 point's local vector
   * @param {Vector} a1 point's velocity
   * @param {Vector} o point's offset from
   * @param {number} theta angular velocity
   */
  interceptAngular(r1: Vector, a1: Vector, o: Vector, theta: number): { t1: number, t2: number, r: Vector } {
    const r2 = this.a;
    const a2 = this.b.difference(this.a);

    // Helper matrices and values
    const A_det = new Matrix(a1, a2).det();
    const R2_det = new Matrix(r2.difference(r1), a2).det();
    const g = Math.atan2(new Matrix(o, a2).det(), -o.multiplyScalar(a2));
    const b = a2.length * o.length;

    const f = (t) => A_det * t + b * Math.sin(theta * t + g) - R2_det;
    const t2 = (t1) => a2.x !== 0
      ? (r1.x - r2.x + t1 * a1.x + o.rotation(t1 * theta).x) / a2.x
      : (r1.y - r2.y + t1 * a1.y + o.rotation(t1 * theta).y) / a2.y;
    const r = (t2) => a2.product(t2).add(r2);

    let contact = null;
    if (A_det === 0) {
      // Special case: f = b * sin(theta * t + g) - R2_det (no linear term)

      const j = Math.asin(R2_det / b);
      if (!isNaN(j)) {

        // Find k for intersection after t=0
        const k1 = Math.floor((theta > 0 ? 1 : 0) + (g - j) / Math.PI / 2);
        const k2 = Math.floor((theta > 0 ? 1 : 0) + (g - Math.PI + j) / Math.PI / 2);

        const tk = (k, o) => (k * 2 * Math.PI - g + (o == 0 ? j : Math.PI - j ) ) / theta;

        const k0 = (tk(k1, 0) < tk(k2, 1)) ? (k1 * 2) : (k2 * 2 + 1);

        // Loop over intersections
        for (let k = k0; ; k += theta > 0 ? 1 : -1) {
          const t1Curr = tk(Math.floor(k / 2), k % 2);

          // is t1 not feasible?
          if (0 > t1Curr || t1Curr > 1)
            break;

          // is t2 feasible?
          const t2Curr = t2(t1Curr);
          if (0 <= t2Curr && t2Curr <= 1) {
            // contact found
            contact = new Vector(t1Curr, f(t1Curr));
            break;
          }
        }
      }

    } else {
      const h = Math.acos(-A_det / b / theta);

      if (isNaN(h)) {
        // special case: f is monotonic (decreasing or increasing) -> no extremes

        let start = new Vector(0, f(0));
        let end = new Vector(1, f(1));

        // are start and end on different sides of x-axis?
        if (start.y * end.y <= 0) {
          contact = findContactBisection(start, end, f);

          const t2Contact = t2(contact.x);
          if (!(0 <= t2Contact && t2Contact <= 1)) contact = null;

        }

      } else {
        // bounds we get if we consider min and max value of sine
        let tL1 = (R2_det - b) / A_det;
        let tL2 = (R2_det + b) / A_det;
        // sort tL1 and tL2 (cool one-liner, yeah?)
        [tL1, tL2] = [Math.min(tL1, tL2), Math.max(tL1, tL2)];

        const tMin = Math.min(1, Math.max(0, tL1));
        const tMax = Math.max(0, Math.min(1, tL2));

        // function that returns t of a extreme for given k and upper
        const tk = (k, upper: boolean) => (2 * Math.PI * k + (upper ? h : -h) - g) / theta;

        // finding kMin and kMax (k values between which may be feasible solutions)
        const kMin1 = Math.floor((theta * tMin - h + g) / 2 / Math.PI + (theta < 0 ? 1 : 0));
        const kMin2 = Math.floor((theta * tMin + h + g) / 2 / Math.PI + (theta < 0 ? 1 : 0));
        let kMin = tk(kMin1, true) < tk(kMin2, false) ? 2 * kMin2 + (0) : 2 * kMin1 + (1);

        const kMax1 = Math.floor((theta * tMax - h + g) / 2 / Math.PI + (theta > 0 ? 1 : 0));
        const kMax2 = Math.floor((theta * tMax + h + g) / 2 / Math.PI + (theta > 0 ? 1 : 0));
        let kMax = tk(kMax1, true) > tk(kMax2, false) ? 2 * kMax2 + (0) : 2 * kMax1 + (1);

        // loop over extremes
        let extremePrev = null;
        for (let k = kMin; ; k += kMin < kMax ? 1 : -1) {
          let tCurr = Math.max(tMin, Math.min(tMax, tk(Math.floor(k / 2), k % 2 != 0)));
          let extremeCurr = new Vector(tCurr, f(tCurr));

          // for each pair
          if (extremePrev) {

            // if the values are on different sides of x-axis (or touch it)
            if (extremePrev.y * extremeCurr.y <= 0) {

              // find contact
              contact = findContactBisection(extremePrev, extremeCurr, f);

              if (contact) {

                // if contact is feasible
                const t2Contact = t2(contact.x);
                if (0 <= t2Contact && t2Contact <= 1) {
                  // bingo
                  break;
                } else {
                  contact = null;
                }

              }
            }
          }
          extremePrev = extremeCurr;
          if (k == kMax) break;
        }
      }
    }

    if (!contact) return null;

    const t1Contact = contact.x;
    const t2Contact = t2(t1Contact);
    return { t1: t1Contact, t2: t2Contact, r: r(t2Contact) };
  }
}
