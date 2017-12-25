import { Vector } from './vector';

export class MassPoint {

  constructor(public r: Vector, public mass: number) {
  }

  add(p: MassPoint) {
    this.mass += p.mass;
    this.r.add(p.r.difference(this.r).multiply(p.mass / this.mass));
    return this;
  }

}