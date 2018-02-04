import { Vector } from './vector';

export class Line {

  constructor(public a: Vector, public b: Vector) {

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

}
