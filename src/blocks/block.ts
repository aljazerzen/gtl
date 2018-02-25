import { Vector } from '../math/vector';
import { MassPoint } from '../math/mass-point';
import { Polygon } from '../math/polygon';

export function RegisterBlock(name: string) {
  return function (constructor: Function) {
    Block.TYPE[name] = constructor;
  };
}

export abstract class Block {

  static TYPE: { [blockName: string]: any } = {};

  color: number = 2;
  mass: number;
  massPoint: MassPoint;

  offset: Vector;
  phi: number = 0;

  constructor(r: Vector, phi: number = 0) {
    this.offset = r.clone();
    this.phi = phi;
  }

  private _surface: Polygon;

  get surface(): Polygon {
    return this._surface;
  }

  set surface(surface: Polygon) {
    this._surface = surface;
    this.surfaceUpdated();
  }

  tick() {
  }

  surfaceUpdated() {
    const { area, centroid } = this.surface.areaAndCentroid();

    this.mass = Math.abs(area);
    this.massPoint = new MassPoint(this.offset.sum(centroid), this.mass);
  }

  rotate(t: number): void {
    this.phi += t;
  }

  scale(k: number): void {
    this._surface.scale(k);
    this.surfaceUpdated();
  }
}
