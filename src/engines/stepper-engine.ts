import { Engine } from './engine';
import { Vector } from '../math/vector';
import { Renderer } from '../renderer';

export class StepperEngine extends Engine {

  tick(renderer?: Renderer) {

    const G = 100;
    const c = this.world.center;

    for (const entity of this.world.entities) {

      entity.tick();
      let massPoint = entity.massPoint();

      const dv = new Vector();
      let dfv = 0;

      // Center gravity
      const distance = c.r.difference(massPoint.r);
      const force = c.mass * massPoint.mass * G / distance.length / distance.length;
      const a = force / massPoint.mass;
      dv.add(distance.product(a / distance.length));

      // Thrust
      const thrust = entity.force();
      dv.add(thrust.f.product(1 / massPoint.mass));
      dfv += thrust.torque / entity.inertia || 0;

      entity.v.add(dv);
      entity.vf += dfv;

      // const fiBefore = dy == 0 ? 0 : Math.tan(dy / dx);

      // collision detection
      let poly1 = entity.absolutePolygon();

      for (const collidedEntity of this.world.entities) {
        if(entity !== collidedEntity) {

          let poly2 = collidedEntity.absolutePolygon();

          const { intersections, distance } = poly2.interceptPolygon(poly1, entity.v);
          if(distance) {
            entity.v.multiply(0);
          }

        }
      }

      entity.r.add(entity.v);
      entity.f += entity.vf;

      // const massPoint2 = entity.massPoint;
      // const dx2 = c.x - massPoint2.x;
      // const dy2 = c.y - massPoint2.y;
      // const fiAfter = dy2 == 0 ? 0 : Math.tan(dy2 / dx2);

    }

  }

}
