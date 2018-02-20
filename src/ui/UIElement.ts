import { Vector } from '../math/vector';
import { Renderer } from '../renderer';
import { DragElement, EventHandler } from './event-handler';
import { Hud } from './hud';

export abstract class UIElement implements DragElement {

  constructor(protected r: Vector, protected context: Hud) {

  }

  abstract click(c: Vector, controls: EventHandler): DragElement;

  abstract draw(renderer: Renderer): void;

  tick(controls: EventHandler) {
  }

  move(c: Vector, controls: EventHandler): boolean | void {
  }

  end(c: Vector, controls: EventHandler): boolean | void {
  }

  wheel(delta: number): void {
  }
}
