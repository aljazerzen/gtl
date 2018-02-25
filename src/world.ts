import { Entity } from './entity';
import { Vector } from './math/vector';
import { MassPoint } from './math/mass-point';

export class World {

  center: MassPoint;
  entities: Entity[];

  static createMock(): World {
    let r = new World();
    r.center = new MassPoint(new Vector(300, 200), 0);
    r.entities = [Entity.createMockBorder(), Entity.createMock(100, 200), Entity.createMockThruster(300, 200)];
    return r;
  }

}
