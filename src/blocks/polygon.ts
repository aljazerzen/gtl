import { Block } from './block';
import { Vector } from '../math/vector';

export abstract class Polygon extends Block {

  abstract get points(): Vector[];

  rotate(t: number): void {
    this.points.forEach(point => point.rotate(t));
  }

}