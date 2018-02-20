import { UIElementRectangle } from './UIElementRectangle';
import { Vector } from '../math/vector';
import { DragElement, EventHandler } from './event-handler';
import { Hud } from './hud';

export class Button extends UIElementRectangle {

  constructor(r: Vector, context: Hud, size: Vector, protected onclick: (a: Button) => void = null) {
    super(r, context, size);
  }

  clickRelative(c: Vector, controls: EventHandler): DragElement {
    if(this.onclick)
      this.onclick(this);
    return this;
  }

}
