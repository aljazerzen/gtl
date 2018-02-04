import { Vector } from '../math/vector';
import { Block } from './block';
import { Polygon } from '../math/polygon';

export class Rectangle extends Block {

  constructor(r: Vector, size: Vector) {
    super(r);
    Block.TYPE.RECTANGLE = Rectangle;

    this.polygon = new Polygon([new Vector(), size.horizontal(), size.clone(), size.vertical()]);
  }
}
