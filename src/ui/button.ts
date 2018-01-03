import { UIElementRectangle } from './UIElementRectangle';
import { Vector } from '../math/vector';

export class Button extends UIElementRectangle {

  constructor(r: Vector, size: Vector, protected onclick: (a: Button) => void = null) {
    super(r, size);
  }

  clickRelative(c: Vector): boolean {
    if(this.onclick)
      this.onclick(this);
    return true;
  }

}