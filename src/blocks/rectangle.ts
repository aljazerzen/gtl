import { MassPoint } from '../math/mass-point';
import { Vector } from '../math/vector';
import { Polygon } from './polygon';

export class Rectangle extends Polygon {

  private _points: Vector[];

  get points(): Vector[] {
    return this._points;
  }

  constructor(x: number, y: number, w: number, h: number) {
    super(x, y);
    this._points = [new Vector(), new Vector(w, 0), new Vector(w, h), new Vector(0, h)];
  }

  get mass(): number {
    return this.points[1].x * this.points[2].y;
  }

  get massPoint(): MassPoint {
    return new MassPoint(this.offset.sum(this.points[2].product(0.5)), this.mass);
  }
}