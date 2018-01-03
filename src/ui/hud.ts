import { UIElement } from './UIElement';
import { ToggleButton } from './toggleButton';
import { Vector } from '../math/vector';
import { Controls } from './controls';
import { Renderer } from '../renderer';
import { Thruster } from '../blocks/thruster';
import { Slider } from './slider';

export class Hud {

  elements: UIElement[];

  constructor(controls: Controls) {

    this.elements = [

      new ToggleButton(
        new Vector(10, 10),
        () => (controls.rotationDampeners = !controls.rotationDampeners),
        () => controls.rotationDampeners,
      ),

    ];

    this.elements.push(...controls.controlling.blocks
      .filter(b => b instanceof Thruster)
      .map((t: Thruster, i: number) => new Slider(
        new Vector(30 + i * 20, 10), (v: number) => t.throttle = v, () => t.throttle),
      )
    );

    controls.onclickListeners.push(c => this.click(c));

  }

  draw(renderer: Renderer) {
    this.elements.forEach(element => element.draw(renderer));
  }

  click(c: Vector): boolean {
    for (let element of this.elements) {
      if (element.click(c))
        return true;
    }
    return false;
  }

}