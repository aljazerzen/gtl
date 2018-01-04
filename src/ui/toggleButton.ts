import { Button } from './button';
import { Vector } from '../math/vector';
import { Renderer } from '../renderer';
import { Hud } from './hud';

export class ToggleButton extends Button {

  constructor(r: Vector, context: Hud, toggle: (a: Button) => void, protected isActive: () => boolean) {
    super(r, context, new Vector(15, 15), toggle);
  }

  draw(renderer: Renderer) {
    renderer.setStyle(this.isActive() ? 2 : 1);
    renderer.drawRectangle(this.r, this.size, 0);
  }

}