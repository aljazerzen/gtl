import { Vector } from '../math/vector';
import { Block, RegisterBlock } from './block';
import { Polygon } from '../math/polygon';

@RegisterBlock('rectangle')
export class Rectangle extends Block {

  constructor(r: Vector, size: Vector) {
    super(r);

    this.polygon = new Polygon([new Vector(), size.horizontal(), size.clone(), size.vertical()]);
  }
}
