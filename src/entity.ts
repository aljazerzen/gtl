import { Block } from './blocks/block';
import { Circle } from './blocks/circle';
import { Rectangle } from './blocks/rectangle';
import { Vector } from './math/vector';
import { MassPoint } from './math/mass-point';
import { Thruster } from './blocks/thruster';
import { ForcePoint } from './math/force-point';

export class Entity {
  r: Vector = new Vector();
  v: Vector = new Vector();

  f: number = 0;
  vf = 0;

  public blocks: Block[] = [];

  addBlocks(blocks: Block[]) {
    this.blocks = this.blocks.concat(blocks);
    const massPoint = this.massPoint();
    const correction = this.r.difference(massPoint.r);

    this.blocks.forEach(block => block.offset.add(correction));
    this.r = massPoint.r;
  }

  mass(): number {
    return this.blocks.reduce((acc, block) => acc + block.mass, 0);
  }

  massPoint(): MassPoint {
    let relative = this.blocks.reduce((mp, block) => mp.add(block.massPoint), new MassPoint());

    return new MassPoint(relative.r.rotation(this.f).add(this.r), relative.mass);
  }

  get inertia(): number {
    return this.blocks.reduce(
      (acc, block) => acc + block.mass * Math.max(1, Math.pow(block.massPoint.r.length, 2)), 0);
  }

  thrust(): ForcePoint {
    let relative = new ForcePoint;
    for (let block of this.blocks) {
      relative.add(block.thrust());
    }
    return new ForcePoint(relative.r, relative.f.rotation(this.f));
  }

  static createMock(x: number, y: number): Entity {
    let r = new Entity();
    r.r = new Vector(x, y);
    r.addBlocks([new Rectangle(-5, 50, 10, 5), new Circle(0, -50, 10)]);
    return r;
  }

  static createMockThruster(x: number, y: number): Entity {
    let r = new Entity();
    r.r = new Vector(x, y);
    r.addBlocks([new Thruster(0, 0, 20, 0), new Circle(30, 0, 30), new Thruster(40, 0, 20, 0)]);
    return r;
  }

}