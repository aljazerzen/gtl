import { Block } from './blocks/block';
import { Vector } from './math/vector';
import { MassPoint } from './math/mass-point';
import { Thruster } from './blocks/thruster';
import { ForcePoint } from './math/force-point';
import { EntityController } from './ui/entity-controller';
import { Gyroscope } from './blocks/gyroscope';
import { Polygon } from './math/polygon';
import { World } from './world';

export class Entity {


  platform: Polygon;

  constructor(private world: World, platform: Polygon) {
    this.addPlatform(platform);
  }

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

  addBlocks(blocks: Block[]) {
    this.blocks.push(...blocks);
    const massPoint = this.massPoint();
    const correction = this.r.difference(massPoint.r).rotate(-this.f);

    this.blocks.forEach(block => block.offset = block.offset.sum(correction));
    this.r = massPoint.r;
  }

  addPlatform(p: Polygon) {

    p.offset(this.r.product(-1));
    p.rotate(-this.f);
    let newPolygons = Polygon.union(this.platform, p);

    this.platform = newPolygons[0];

    this.world.entities.push(
      ...newPolygons.slice(1).map(poly => new Entity(this.world, poly))
    );

  }

  mass(): number {
    return this.blocks.reduce((acc, block) => acc + block.mass, 0);
  }

  massPoint(): MassPoint {
    let { area, centroid } = this.platform.areaAndCentroid();
    let platformMassPoint = new MassPoint(centroid, Math.abs(area));

    let relative = this.blocks.reduce((mp, block) => mp.add(block.massPoint), platformMassPoint);

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

  absolutePolygon() {
    let r = this.platform.clone();
    r.rotate(this.f);
    r.offset(this.r);
    return r;
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
