import { UIElement } from './UIElement';
import { Vector } from '../math/vector';
import { Renderer } from '../renderer';

export abstract class UIElementRectangle extends UIElement {

  constructor(r: Vector, protected size: Vector) {
    super(r);
  }

  click(c: Vector): boolean {
    let o = this.r.sum(this.size);
    if (c.x >= this.r.x && c.x < o.x && c.y >= this.r.y && c.y < o.y) {
      return this.clickRelative(c.difference(this.r));
    }

  }

  abstract clickRelative(c: Vector): boolean;

  draw(renderer: Renderer): void {
    renderer.setStyle(1);
    renderer.drawRectangle(this.r, this.size, 0);
  }

}