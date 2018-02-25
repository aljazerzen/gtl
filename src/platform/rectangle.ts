import { Vector } from '../math/vector';
import { Polygon } from '../math/polygon';
import { Platform, RegisterPlatform } from './platform';

@RegisterPlatform('rectangle')
export class Rectangle extends Platform {

  constructor(r: Vector, size: Vector, phi: number) {
    super(
      new Polygon(
        [new Vector(), size.horizontal(), size.clone(), size.vertical()]
      ),
      r,
      phi
    );
  }
}
