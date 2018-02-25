import { UIElement } from './UIElement';
import { ToggleButton } from './toggleButton';
import { Vector } from '../math/vector';
import { DragElement, EventHandler } from './event-handler';
import { Renderer } from '../renderer';
import { Thruster } from '../blocks/thruster';
import { Slider } from './slider';
import { BlockButton } from './blockButton';
import { Block } from '../blocks/block';
import { Platform } from '../platform/platform';
import { PlatformButton } from './platformButton';

export class Hud {

  elements: UIElement[];
  thrusterSliderCount = 0;

  constructor(private eventHandler: EventHandler) {

    this.elements = [

      new ToggleButton(
        new Vector(10, 10),
        this,
        () => (eventHandler.ec.rotationDampener = !eventHandler.ec.rotationDampener),
        () => eventHandler.ec.rotationDampener,
      ),
      new ToggleButton(
        new Vector(10, 35),
        this,
        () => (eventHandler.ec.inertiaEqualizer = !eventHandler.ec.inertiaEqualizer),
        () => eventHandler.ec.inertiaEqualizer,
      ),

    ];

    eventHandler.ec.entity.blocks.forEach((t) => this.addThrusterSlider(t));

    const y = document.body.clientHeight - 60;
    this.elements.push(...Object.keys(Block.TYPE)
      .map((b, i) => new BlockButton(new Vector(10 + i * 60, y), this, Block.TYPE[b]))
    );
    this.elements.push(...Object.keys(Platform.TYPE)
      .map((b, i) => new PlatformButton(new Vector(10 + i * 60, y - 60), this, Platform.TYPE[b]))
    );

    eventHandler.onclickListeners.push(c => this.click(c, eventHandler));

  }

  addThrusterSlider(t: Block) {
    if (t instanceof Thruster) {
      this.elements.push(new Slider(
        new Vector(30 + this.thrusterSliderCount++ * 20, 10),
        this,
        (v: number) => t.controlThrottle(v),
        () => t.throttleTarget),
      );
    }
  }

  draw(renderer: Renderer) {
    this.elements.forEach(element => element.draw(renderer));
  }

  click(c: Vector, controls: EventHandler): DragElement {
    for (let element of this.elements) {
      const dragElement = element.click(c, controls);
      if (dragElement) return dragElement;
    }
    return null;
  }

  tick() {
    for (let element of this.elements) {
      element.tick(this.eventHandler);
    }
  }
}
