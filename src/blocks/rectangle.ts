import { MassPoint } from '../math/mass-point';
import { Vector } from '../math/vector';
import { Block } from './block';

export class Rectangle extends Block {

  private _points: Vector[];

  get points(): Vector[] {
    return this._points;
  }

  constructor(r: Vector, size: Vector) {
    super(r);
    this._points = [new Vector(), size.horizontal(), size.clone(), size.vertical()];

    Block.TYPE.RECTANGLE = Rectangle;
  }

  get mass(): number {
    return this.points[1].x * this.points[2].y;
  }

  get massPoint(): MassPoint {
    return new MassPoint(this.offset.sum(this.points[2].product(0.5)), this.mass);
  }
}
