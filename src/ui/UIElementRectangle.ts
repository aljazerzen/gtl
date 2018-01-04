import { UIElement } from './UIElement';
import { Vector } from '../math/vector';
import { Renderer } from '../renderer';
import { Controls, DragElement } from './controls';
import { Hud } from './hud';

export abstract class UIElementRectangle extends UIElement {

  constructor(r: Vector, context: Hud,  protected size: Vector) {
    super(r, context);
  }

  click(c: Vector, controls: Controls): DragElement {
    if (this.isOver(c)) {
      return this.clickRelative(c.difference(this.r), controls);
    }
  }

  isOver(c: Vector) {
    let o = this.r.sum(this.size);
    return c.x >= this.r.x && c.x < o.x && c.y >= this.r.y && c.y < o.y;
  }

  abstract clickRelative(c: Vector, controls: Controls): DragElement;

  draw(renderer: Renderer): void {
    renderer.setStyle(1);
    renderer.drawRectangle(this.r, this.size, 0);
  }

}