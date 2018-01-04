import { UIElementRectangle } from './UIElementRectangle';
import { Vector } from '../math/vector';
import { Controls, DragElement } from './controls';
import { Hud } from './hud';

export class Button extends UIElementRectangle {

  constructor(r: Vector, context: Hud, size: Vector, protected onclick: (a: Button) => void = null) {
    super(r, context, size);
  }

  clickRelative(c: Vector, controls: Controls): DragElement {
    if(this.onclick)
      this.onclick(this);
    return this;
  }

}