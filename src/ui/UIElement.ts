import { Vector } from '../math/vector';
import { Renderer } from '../renderer';

export abstract class UIElement {

  constructor(protected r: Vector) {

  }

  abstract click(c: Vector): boolean;

  abstract draw(renderer: Renderer): void;

}