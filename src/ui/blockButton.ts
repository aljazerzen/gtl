import { Button } from './button';
import { DragElement, EventHandler } from './event-handler';
import { Vector } from '../math/vector';
import { Renderer } from '../renderer';
import { Block } from '../blocks/block';
import { Thruster } from '../blocks/thruster';
import { Hud } from './hud';
import { Gyroscope } from '../blocks/gyroscope';

export class BlockButton extends Button implements DragElement {

  block: Block;
  ghost: Block;

  constructor(r: Vector, context: Hud, public blockType: any) {
    super(r, context, new Vector(50, 50));
    this.block = this.constructBlock(blockType);
  }

  constructBlock(blockType: any) {
    if (blockType === Thruster) {
      return new Thruster(
        this.size.product(0.1).sum(this.size.horizontal().product(0.18)),
        this.size.horizontal().length * 0.44,
        0,
      );
    } else if (blockType === Gyroscope) {
      return new Gyroscope(
        this.size.product(0.5),
        this.size.length * 0.6,
        0,
      );
    }
  }

  clickRelative(c: Vector, controls: EventHandler): DragElement {
    this.ghost = this.constructBlock(this.blockType);
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

      // place the block
      this.ghost.offset.subtract(controls.ec.entity.r);
      this.ghost.offset.rotate(-controls.ec.entity.f);
      this.ghost.rotate(-controls.ec.entity.f);

      controls.ec.entity.addBlocks([this.ghost]);
      this.context.addThrusterSlider(this.ghost);

      this.ghost = null;
    }
  };

  wheel(delta: number): void {
    this.ghost.scale(1 + delta * 0.05);
  }

  draw(renderer: Renderer) {
    super.draw(renderer);

    const padding = new Vector(2, 2);
    renderer.setStyle(0);
    renderer.drawRectangle(this.r.sum(padding), this.size.difference(padding.product(2)), 0);

    renderer.drawBlock(this.block, this.r);

    if (this.ghost)
      renderer.drawBlock(this.ghost);
  }

  tick(controls: EventHandler) {
    if (this.ghost)
      if (controls.rotatePlacingRight)
        this.ghost.rotate(0.01);
      else if (controls.rotatePlacingLeft)
        this.ghost.rotate(-0.01);
  }


}
