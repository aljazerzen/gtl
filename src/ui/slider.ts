import { UIElementRectangle } from './UIElementRectangle';
import { Vector } from '../math/vector';
import { Renderer } from '../renderer';
import { DragElement } from './event-handler';
import { Hud } from './hud';

export class Slider extends UIElementRectangle implements DragElement {

  static size = new Vector(15, 60);

  constructor(r: Vector, context: Hud, protected setValue: (v: number) => void, protected getValue: () => number) {
    super(r, context, Slider.size);
  }

  clickRelative(c: Vector): DragElement {
    this.setValue(this.toRange(c.y / this.size.y));
    return this;
  }

  toRange(v: number) {
    return Math.max(0, Math.min(1, v));
  }

  draw(renderer: Renderer) {
    super.draw(renderer);
    renderer.setStyle(2);
    let value = this.toRange(this.getValue());
    renderer.drawRectangle(this.r, new Vector(this.size.x, this.size.y * value), 0)
  }

  move(c: Vector): boolean {
    c.subtract(this.r);
    this.setValue(this.toRange(c.y / this.size.y));
    return true;
  }

  end(c: Vector): void {
    this.move(c);
  }
}
