import { UIElementRectangle } from './UIElementRectangle';
import { Vector } from '../math/vector';
import { Renderer } from '../renderer';

export class Slider extends UIElementRectangle {

  static size = new Vector(15, 60);

  constructor(r: Vector, protected setValue: (v: number) => void, protected getValue: () => number) {
    super(r, Slider.size);
  }

  clickRelative(c: Vector): boolean {
    this.setValue(c.y / this.size.y);
    return true;
  }

  draw(renderer: Renderer) {
    super.draw(renderer);
    renderer.setStyle(2);
    let value = Math.max(0, Math.min(1, this.getValue()));
    renderer.drawRectangle(this.r, new Vector(this.size.x, this.size.y * value), 0)
  }


}