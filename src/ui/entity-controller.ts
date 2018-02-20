import { Entity } from '../entity';
import { Thruster } from '../blocks/thruster';
import { Gyroscope } from '../blocks/gyroscope';
import { Vector } from '../math/vector';
import { Matrix } from '../math/matrix';

export enum ThrustControl {
  NONE, INCREASE, DECREASE
}

export enum GyroControl {
  NONE, POSITIVE, NEGATIVE
}

export class EntityController {

  thrustControl: ThrustControl = ThrustControl.NONE;
  gyroControl: GyroControl = GyroControl.NONE;

  rotationDampener: boolean;
  inertiaEqualizer: boolean;

  private inertiaEqualizerLastState: boolean;

  constructor(public entity: Entity) {
  }

  tick() {

    // Thrusters
    if (this.thrustControl !== ThrustControl.NONE || (this.inertiaEqualizerLastState && !this.inertiaEqualizer)) {
      for (let block of this.entity.blocks)
        if (block instanceof Thruster)
          block.controlThrottle(this.thrustControl === ThrustControl.INCREASE ? block.throttleTarget + 0.01 : 0);
    } else {

      // inertia equalizer
      if (this.inertiaEqualizer) {
        const desiredVelocity = new Vector();
        const velocity = desiredVelocity.difference(this.entity.v);  // velocity to kill

        const thrustFactors = this.entity.blocks
          .filter(b => b instanceof Thruster)
          .map((b: Thruster) => {
            let vector = b.thrustVector.rotation(this.entity.f);
            let codirection = vector.multiplyScalar(velocity) / velocity.length;
            return { block: b, vector, target: 0, codirection };
          })
          .sort((a, b) => a.codirection - b.codirection);

        for (let i = 0; i < thrustFactors.length; i++) {
          if (thrustFactors[i].target < 1) {
            const factor1 = thrustFactors[i];

            for (let j = i + 1; j < thrustFactors.length; j++) {
              const factor2 = thrustFactors[j];

              let detA = new Matrix(factor1.vector, factor2.vector).det();
              let detV1 = new Matrix(velocity, factor1.vector).det();
              let detV2 = new Matrix(velocity, factor2.vector).det();

              let lambda = Math.max(0, (1 - factor1.target) * detA / detV2);
              let f2 = Math.min(
                (1 - factor2.target), // remaining thrust for thruster 2
                -lambda * detV1 / detA
              );
              lambda = -f2 * detA / detV1;
              let f1 = lambda * detV2 / detA;

              factor2.target += f2;
              factor1.target += f1;
            }

          }
        }
        for (let factor of thrustFactors)
          factor.block.controlThrottle(factor.target);
      }
    }
    this.inertiaEqualizerLastState = this.inertiaEqualizer;

    // Gyroscopes
    let power = 0;
    if (this.gyroControl !== GyroControl.NONE)
      power = this.gyroControl === GyroControl.POSITIVE ? 1 : -1;
    if (power !== 0 || !this.rotationDampener) {

      for (let block of this.entity.blocks)
        if (block instanceof Gyroscope)
          block.controlPower(power);

    } else {
      // Rotation dampener
      let torqueRequired = this.entity.inertia * this.entity.vf;

      for (let block of this.entity.blocks)
        if (block instanceof Gyroscope) {
          let power = Math.min(1, Math.max(-1, torqueRequired / block.maxTorque()));
          block.controlPower(power);
          torqueRequired += block.torque().torque;
        }
    }

  }

}
