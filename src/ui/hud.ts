import { UIElement } from './UIElement';
import { ToggleButton } from './toggleButton';
import { Vector } from '../math/vector';
import { Controls, DragElement } from './controls';
import { Renderer } from '../renderer';
import { Thruster } from '../blocks/thruster';
import { Slider } from './slider';
import { BlockButton } from './blockButton';
import { BlockId } from '../blocks/blockId';
import { Block } from '../blocks/block';

export class Hud {

  elements: UIElement[];

  constructor(private controls: Controls) {

    this.elements = [

      new ToggleButton(
        new Vector(10, 10),
        this,
        () => (controls.rotationDampeners = !controls.rotationDampeners),
        () => controls.rotationDampeners,
      ),

    ];

    controls.controlling.blocks.forEach((t) => this.addThrusterSlider(t));

    const y = document.body.clientHeight - 60;
    this.elements.push(...BlockId.BLOCKS
      .map((b: BlockId, i: number) => new BlockButton(new Vector(10 + i * 60, y), this, b))
    );

    controls.onclickListeners.push(c => this.click(c, controls));

  }

  thrusterSliderCount = 0;

  addThrusterSlider(t: Block) {
    if(t instanceof Thruster) {
      this.elements.push(new Slider(
        new Vector(30 + this.thrusterSliderCount++ * 20, 10),
        this,
        (v: number) => t.throttle = v,
        () => t.throttle),
      );
    }
  }

  draw(renderer: Renderer) {
    this.elements.forEach(element => element.draw(renderer));
  }

  click(c: Vector, controls: Controls): DragElement {
    for (let element of this.elements) {
      const dragElement = element.click(c, controls);
      if (dragElement) return dragElement;
    }
    return null;
  }

  tick() {
    for (let element of this.elements) {
      element.tick(this.controls);
    }
  }
}