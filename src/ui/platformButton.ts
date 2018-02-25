import { Button } from './button';
import { DragElement, EventHandler } from './event-handler';
import { Vector } from '../math/vector';
import { Renderer } from '../renderer';
import { Hud } from './hud';
import { Platform } from '../platform/platform';
import { Rectangle } from '../platform/rectangle';

export class PlatformButton extends Button implements DragElement {

  platform: Platform;
  ghost: Platform;

  constructor(r: Vector, context: Hud, protected platformType: any) {
    super(r, context, new Vector(50, 50));
    this.platform = this.constructPlatform();
  }

  constructPlatform() {
    if (this.platformType === Rectangle) {
      return new Rectangle(this.size.product(0.15).add(this.r), this.size.product(0.7), 0);
    }
  }

  clickRelative(c: Vector, controls: EventHandler): DragElement {
    this.ghost = this.constructPlatform();
    this.move(c.sum(this.r));
    return this;
  }

  move(c: Vector): boolean | void {
    this.ghost.offset = c;
    return true;
  };

  end(c: Vector, controls: EventHandler): boolean | void {
    if (this.isOver(c)) {
      return true;
    } else {

      // place the platform
      controls.ec.entity.addPlatform(this.ghost.absolute());

      this.ghost = null;
    }
  };

  wheel(delta: number): void {
    this.ghost.polygon.scale(1 + delta * 0.05);
  }

  draw(renderer: Renderer) {
    super.draw(renderer);

    const padding = new Vector(2, 2);
    renderer.setStyle(0);
    renderer.drawRectangle(this.r.sum(padding), this.size.difference(padding.product(2)), 0);

    renderer.drawPlatform(this.platform);

    if (this.ghost)
      renderer.drawPlatform(this.ghost);
  }

  tick(controls: EventHandler) {
    if (this.ghost)
      if (controls.rotatePlacingRight)
        this.ghost.phi += 0.01;
      else if (controls.rotatePlacingLeft)
        this.ghost.phi -= 0.01;
  }


}
