import { Vector } from '../math/vector';
import { Block } from './block';

export class Rectangle extends Block {

  constructor(r: Vector, size: Vector) {
    super(r);
    Block.TYPE.RECTANGLE = Rectangle;

    this.points = [new Vector(), size.horizontal(), size.clone(), size.vertical()];
  }
}
