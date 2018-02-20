import { Vector } from './vector';

export class ForcePoint {

  constructor(public torque = 0, public f = new Vector) {
  }

  add(p: ForcePoint) {
    this.torque += p.torque;
    this.f.add(p.f);
  }

}
