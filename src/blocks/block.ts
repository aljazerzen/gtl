import { Vector } from '../math/vector';
import { MassPoint } from '../math/mass-point';
import { ForcePoint } from '../math/force-point';
import { Polygon } from '../math/polygon';

export abstract class Block {

  static TYPE: { [blockName: string]: any } = {};

  color: number = 1;

  constructor(r: Vector) {
    this._offset = r.clone();
  }

  mass: number;
  massPoint: MassPoint;

  private _offset: Vector;
  private _polygon: Polygon;

  set offset(offset: Vector) {
    this.massPoint.r.subtract(this._offset);
    this._offset = offset;
    this.massPoint.r.add(this._offset);
  }

  get offset() {
    return this._offset;
  }

  set polygon(points: Polygon) {
    this._polygon = points;
    this.polygonUpdated();
  }

  get polygon() {
    return this._polygon;
  }

  polygonUpdated() {
    const { area, centroid } = this.polygon.areaAndCentroid();

    this.mass = area;
    this.massPoint = new MassPoint(this.offset.sum(centroid), this.mass);
  }

  thrust(): ForcePoint {
    return null;
  };

  thrustUnthrottled(): ForcePoint {
    return null;
  };

  rotate(t: number): void {
    this.polygon.rotate(t);
    this.polygonUpdated();
  }

  scale(k: number): void {
    this.polygon.scale(k);
    this.polygonUpdated();
  }
}
