import { Vector } from '../math/vector';
import { Renderer } from '../renderer';
import { Controls, DragElement } from './controls';
import { Hud } from './hud';

export abstract class UIElement implements DragElement {

  constructor(protected r: Vector, protected context: Hud) {

  }

  abstract click(c: Vector, controls: Controls): DragElement;

  abstract draw(renderer: Renderer): void;

  tick(controls: Controls) {
  }

  move(c: Vector, controls: Controls): boolean | void {
  }

  end(c: Vector, controls: Controls): boolean | void {
  }

  wheel(delta: number): void {
  }
}
