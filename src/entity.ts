import { Block } from './blocks/block';
import { Circle } from './blocks/circle';
import { Rectangle } from './blocks/rectangle';
import { Vector } from './math/vector';
import { MassPoint } from './math/mass-point';

export class Entity {
  r: Vector = new Vector(0, 0);
  v: Vector = new Vector(0, 0);

  f: number = 0;
  vf = 0;

  public blocks: Block[] = [];

  addBlocks(blocks: Block[]) {
    this.blocks = this.blocks.concat(blocks);
    const massPoint = this.massPoint;
    const correction = this.r.difference(massPoint.r);

    this.blocks.forEach(block => block.offset.add(correction));
    this.r = massPoint.r;
  }

  get mass(): number {
    return this.blocks.reduce((acc, block) => acc + block.mass, 0);
  }

  get massPoint(): MassPoint {
    let relative = this.blocks.reduce(
      (acc: MassPoint, block) => acc.add(block.massPoint),
      new MassPoint(new Vector(0, 0), 0));
    return new MassPoint(relative.r.rotate(this.f).add(this.r), relative.mass);
  }

  static createMock(x: number, y: number): Entity {
    let r = new Entity();
    r.r = new Vector(x, y);
    r.addBlocks([new Rectangle(-5, 50, 10, 5), new Circle(0, -50, 10)]);
    return r;
  }

}