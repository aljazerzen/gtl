import { Button } from './button';
import { Controls, DragElement } from './controls';
import { Vector } from '../math/vector';
import { Renderer } from '../renderer';
import { BlockId } from '../blocks/blockId';
import { Circle } from '../blocks/circle';
import { Rectangle } from '../blocks/rectangle';
import { Block } from '../blocks/block';
import { Thruster } from '../blocks/thruster';
import { Hud } from './hud';

export class BlockButton extends Button implements DragElement {

  block: Block;
  ghost: Block;

  constructor(r: Vector, context: Hud, public blockId: BlockId) {
    super(r, context, new Vector(50, 50));
    this.block = this.constructBlock(blockId);
  }

  constructBlock(blockId: BlockId) {
    if (blockId.block === Circle) {
      return new Circle(this.size.product(0.5), this.size.length / 4);
    }
    if (blockId.block === Rectangle) {
      return new Rectangle(this.size.product(0.15), this.size.product(0.7));
    }
    if (blockId.block === Thruster) {
      return new Thruster(
        this.size.product(0.1).sum(this.size.horizontal().product(0.18)),
        this.size.horizontal().length * 0.44,
        0,
      );
    }
  }

  clickRelative(c: Vector, controls: Controls): DragElement {
    this.ghost = this.constructBlock(this.blockId);
    this.move(c.sum(this.r));
    return this;
  }

  move(c: Vector): boolean | void {
    this.ghost.offset = c;
    return true;
  };

  end(c: Vector, controls: Controls): boolean | void {
    if (this.isOver(c)) {
      return true;
    } else {

      // place the block
      this.ghost.offset.subtract(controls.controlling.r);
      this.ghost.offset.rotate(-controls.controlling.f);
      this.ghost.rotate(-controls.controlling.f);

      controls.controlling.addBlocks([this.ghost]);
      this.context.addThrusterSlider(this.ghost);

      this.ghost = null;
    }
  };

  draw(renderer: Renderer) {
    super.draw(renderer);

    const padding = new Vector(2, 2);
    renderer.setStyle(0);
    renderer.drawRectangle(this.r.sum(padding), this.size.difference(padding.product(2)), 0);

    renderer.drawBlock(this.block, this.r);

    if (this.ghost)
      renderer.drawBlock(this.ghost);
  }

  tick(controls: Controls) {
    if (this.ghost)
      if (controls.rotatePlacingRight)
        this.ghost.rotate(0.01);
      else if (controls.rotatePlacingLeft)
        this.ghost.rotate(-0.01);
  }


}