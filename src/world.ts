import { Entity } from './entity';
import { Vector } from './math/vector';
import { MassPoint } from './math/mass-point';
import { Thruster } from './blocks/thruster';
import { Gyroscope } from './blocks/gyroscope';
import { Polygon } from './math/polygon';

export class World {

  center: MassPoint;
  entities: Entity[] = [];

  static createMock(): World {
    let r = new World();
    r.center = new MassPoint(new Vector(300, 200), 0);
    r.createMockThruster(new Vector(300, 200));
    return r;
  }

  createMockThruster(offset: Vector) {
    let entity = new Entity(this, Polygon.fromRaw([
      [0, 0],
      [400, 0],
      [400, 400],
      [0, 400],
    ]));
    entity.r = offset;
    entity.addBlocks([new Thruster(new Vector(80, 0), 40, 0), new Gyroscope(new Vector(100, -40), 40, 0)]);
    entity.f = 0;
    this.entities.push(entity);
  }

}
