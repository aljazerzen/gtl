import { Vector } from '../math/vector';
import { MassPoint } from '../math/mass-point';
import { ForcePoint } from '../math/force-point';

export abstract class Block {

  static TYPE: { [blockName: string]: any } = {};

  color: number = 1;

  constructor(r: Vector) {
    this._offset = r.clone();
  }

  area: number;
  mass: number;
  massPoint: MassPoint;

  private _offset: Vector;
  private _points: Vector[];

  set offset(offset: Vector) {
    this.massPoint.r.subtract(this._offset);
    this._offset = offset;
    this.massPoint.r.add(this._offset);
  }

  get offset() {
    return this._offset;
  }

  set points(points: Vector[]) {
    this._points = points;
    this.pointsUpdated();
  }

  get points() {
    return this._points;
  }

  pointsUpdated() {

    // recalculate block area, mass and mass point
    const p = this.points;

    let sumArea = 0, sumX = 0, sumY = 0;
    for (let i = 0; i < p.length - 1; i++) {
      sumArea += p[i].x * p[i + 1].y - p[i + 1].x * p[i].y;
      sumX += (p[i].x + p[i + 1].x) * (p[i].x * p[i + 1].y - p[i + 1].x * p[i].y);
      sumY += (p[i].y + p[i + 1].y) * (p[i].x * p[i + 1].y - p[i + 1].x * p[i].y);
    }

    this.area = Math.abs(sumArea / 2);
    this.mass = this.area;
    this.massPoint = new MassPoint(
      this.offset.sum(new Vector(sumX / this.area / 6, sumY / this.area / 6)),
      this.mass,
    );

  }

  thrust(): ForcePoint {
    return null;
  };

  thrustUnthrottled(): ForcePoint {
    return null;
  };

  rotate(t: number): void {
    this.points.forEach(point => point.rotate(t));
    this.pointsUpdated();
  }

  scale(k: number): void {
    this.points.forEach(point => point.multiply(k));
    this.pointsUpdated();
  }
}
