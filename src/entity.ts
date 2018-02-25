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

  static platformDensity = 0.02;

  platform: Polygon;
  r: Vector = new Vector();
  v: Vector = new Vector();
  f: number = 0;
  vf = 0;
  public blocks: Block[] = [];
  controller: EntityController = new EntityController(this);

  constructor(private world: World, r: Vector, platform: Polygon) {
    this.r = r;
    this.addPlatform(platform);
  }

  get inertia(): number {
    let sum = 0;
    for (let block of this.blocks) {
      for (let point of block.surface.points)
        sum += block.mass * Math.pow(block.offset.sum(point).length, 2) / block.surface.points.length;
    }
    let platformMass = this.platform.areaAndCentroid().area * Entity.platformDensity;
    for (let point of this.platform.points)
      sum += platformMass * Math.pow(point.length, 2) / this.platform.points.length;
    return sum;
  }

  addBlocks(blocks: Block[]) {
    this.blocks.push(...blocks);
    this.normalizeR();
  }

  addPlatform(p: Polygon) {

    let newPolygons = Polygon.union(this.platform, p);

    this.platform = newPolygons[0];

    for (let poly of newPolygons.slice(1)) {
      poly.rotate(this.f);
      poly.offset(this.r);
      this.world.entities.push(new Entity(this.world, new Vector, poly));
    }

    this.normalizeR();
  }

  normalizeR() {
    const massPoint = this.massPoint();
    let correction = this.r.difference(massPoint.r).rotation(-this.f);

    this.blocks.forEach(block => block.offset = block.offset.sum(correction));
    this.platform.offset(correction);

    this.r = massPoint.r;
  }

  massPoint(): MassPoint {
    let { area, centroid } = this.platform.areaAndCentroid();
    let platformMassPoint = new MassPoint(centroid, Math.abs(area) * Entity.platformDensity);

    let relative = this.blocks.reduce((mp, block) => mp.add(block.massPointAbsolute()), platformMassPoint);

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
