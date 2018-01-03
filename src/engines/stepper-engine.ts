import { Engine } from './engine';
import { Vector } from '../math/vector';
import { Controls } from '../controls';
import { Thruster } from '../blocks/thruster';

export class StepperEngine extends Engine {

  tick(controls: Controls = new Controls) {

    const G = 100;
    const c = this.world.center;

    this.world.entities.forEach(entity => {

      let massPoint = entity.massPoint();

      const dv = new Vector();
      let dfv = 0;

      // Center gravity
      const distance = c.r.difference(massPoint.r);
      const force = c.mass * massPoint.mass * G / distance.length / distance.length;
      const a = force / massPoint.mass;
      dv.add(distance.product(a / distance.length));

      // Thrust
      const thrust = entity.thrust();
      dv.add(thrust.f.product(1 / massPoint.mass));
      dfv += Math.sin(thrust.r.angleDirection(thrust.f)) * thrust.r.length * thrust.f.length / entity.inertia || 0;

      if(controls.controlling == entity) {
        if (controls.up) {
          entity.blocks.forEach(block => {
            if (block instanceof Thruster) {
              block.throttle = Math.min(1, block.throttle + 0.01);
            }
          });
        }
        if (controls.down) {
          entity.blocks.forEach(block => {
            if (block instanceof Thruster) {
              block.throttle = Math.max(0, block.throttle - 0.01);
            }
          });
        }
        if (controls.left) {
          dfv -= 0.0005;
        }
        if (controls.right) {
          dfv += 0.0005;
        }
        if (!controls.left && !controls.right && controls.rotationDampeners) {
          dfv -= Math.min(Math.abs(entity.vf), 0.0005) * (entity.vf > 0 ? 1 : -1);
        }
      }

      entity.v.add(dv);
      entity.vf += dfv;

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