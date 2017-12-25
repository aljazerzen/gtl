import { Engine } from './engine';
import { Vector } from '../math/vector';

export class StepperEngine extends Engine {

  tick() {

    const G = 100;
    const c = this.world.center;

    this.world.entities.forEach(entity => {

      let massPoint = entity.massPoint;

      const d = c.r.difference(massPoint.r);
      const r = d.length;
      const force = c.mass * massPoint.mass * G / r / r;
      const a = force / massPoint.mass;

      const dv = new Vector(a * d.x / r, a * d.y / r);

      entity.v.add(dv);

      // const fiBefore = dy == 0 ? 0 : Math.tan(dy / dx);

      entity.r.add(entity.v);
      entity.f += entity.vf;

      // const massPoint2 = entity.massPoint;
      // const dx2 = c.x - massPoint2.x;
      // const dy2 = c.y - massPoint2.y;
      // const fiAfter = dy2 == 0 ? 0 : Math.tan(dy2 / dx2);

    });

  }

}