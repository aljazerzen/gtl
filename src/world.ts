import { Entity } from './entity';
import { Vector } from './math/vector';
import { MassPoint } from './math/mass-point';

export class World {

  center: MassPoint;
  entities: Entity[];

  static createMock(): World {
    let r = new World();
    r.center = new MassPoint(new Vector(300, 200), 0);
    r.entities = [Entity.createMock(100, 200), Entity.createMockThruster(200, 100)];
    r.entities[0].vf = 0.00;
    r.entities[0].f = Math.PI / 6;

    r.entities[1].f = Math.PI;
    // r.entities[1].v.x = 0.1;
    return r;
  }

}
