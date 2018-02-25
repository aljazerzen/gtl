import { Polygon } from '../math/polygon';
import { Vector } from '../math/vector';

export function RegisterPlatform(name: string) {
  return function (constructor: Function) {
    Platform.TYPE[name] = constructor;
  };
}

export class Platform {

  static TYPE: { [blockName: string]: any } = {};

  constructor(
    public polygon: Polygon,
    public offset: Vector = new Vector,
    public phi: number = 0,
  ) {
  }

  absolute() {
    const poly = this.polygon.clone();
    poly.rotate(this.phi);
    poly.offset(this.offset);
    return poly;
  }

}
