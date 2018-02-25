import { Block } from './blocks/block';
import { Rectangle } from './blocks/rectangle';
import { Vector } from './math/vector';
import { MassPoint } from './math/mass-point';
import { Thruster } from './blocks/thruster';
import { ForcePoint } from './math/force-point';
import { MultiPolygon } from './math/multi-polygon';
import { EntityController } from './ui/entity-controller';
import { Gyroscope } from './blocks/gyroscope';

export class Entity {
  r: Vector = new Vector();
  v: Vector = new Vector();

  f: number = 0;
  vf = 0;

  public blocks: Block[] = [];
  controller: EntityController = new EntityController(this);

  get inertia(): number {
    let sum = 0;
    for (let block of this.blocks)
      sum += block.mass * Math.max(1, Math.pow(block.massPoint.r.length, 2));
    return sum;
  }

  static createMockThruster(x: number, y: number): Entity {
    let r = new Entity();
    r.r = new Vector(x, y);
    r.addBlocks([new Thruster(new Vector(80, 0), 40, 0), new Gyroscope(new Vector(100, -40), 40, 0)]);
    r.f = Math.PI;
    return r;
  }

  static createMock(x: number, y: number): Entity {
    let r = new Entity();
    r.r = new Vector(x, y);
    r.addBlocks([
      new Rectangle(new Vector(200, 450), new Vector(100, 100)),
      new Rectangle(new Vector(542, 124), new Vector(200, 140)),
    ]);
    return r;
  }

  static createMockBorder() {
    let r = new Entity();
    r.r = new Vector(50, 50);
    r.addBlocks([
      new Rectangle(new Vector(0, 0), new Vector(20, 1000)),
      new Rectangle(new Vector(40, 0), new Vector(1000, 20)),
    ]);
    return r;
  }

  addBlocks(blocks: Block[]) {
    this.blocks.push(...blocks);
    const massPoint = this.massPoint();
    const correction = this.r.difference(massPoint.r).rotate(-this.f);

    this.blocks.forEach(block => block.offset = block.offset.sum(correction));
    this.r = massPoint.r;
  }

  mass(): number {
    return this.blocks.reduce((acc, block) => acc + block.mass, 0);
  }

  massPoint(): MassPoint {
    let relative = this.blocks.reduce((mp, block) => mp.add(block.massPoint), new MassPoint());

    return new MassPoint(relative.r.rotation(this.f).add(this.r), relative.mass);
  }

  force(): ForcePoint {
    let relative = new ForcePoint;
    for (let block of this.blocks) {
      if (block instanceof Thruster)
        relative.add(block.thrust());
      if (block instanceof Gyroscope)
        relative.add(block.torque());
    }
    return new ForcePoint(relative.torque, relative.f.rotation(this.f));
  }

  polygon() {
    return new MultiPolygon(
      this.blocks.map(b => {
        let p = b.polygon.clone();
        p.offset(b.offset);
        return p;
      })
    );
  }

  absolutePolygon() {
    let mp = this.polygon();
    mp.clone();
    mp.rotate(this.f);
    mp.offset(this.r);
    return mp;
  }

  thrustUnthrottled(): ForcePoint {
    const relative = new ForcePoint;
    for (let block of this.blocks) {
      if (block instanceof Thruster)
        relative.add(block.thrustUnthrottled());
    }
    return new ForcePoint(relative.torque, relative.f.rotation(this.f));
  }

  tick() {
    this.controller.tick();
    for (let block of this.blocks) {
      block.tick();
    }
  }
}
