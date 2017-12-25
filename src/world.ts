import { Entity } from './entity';
import { Vector } from './math/vector';
import { MassPoint } from './math/mass-point';

export class World {

  center: MassPoint;
  entities: Entity[];

  static createMock(): World {
    let r = new World();
    r.center = new MassPoint(new Vector(200, 200), 0);
    r.entities = [Entity.createMock(100, 200)];
    r.entities[0].v.y = 0;
    r.entities[0].vf = 0.01;
    r.entities[0].f = Math.PI / 6;
    return r;
  }

}