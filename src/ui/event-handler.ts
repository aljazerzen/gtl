import { Vector } from '../math/vector';
import { EntityController, GyroControl, ThrustControl } from './entity-controller';

export interface DragElement {

  // return true to continue drag
  move(c: Vector, controls: EventHandler): boolean | void;

  // return true to continue drag
  end(c: Vector, controls: EventHandler): boolean | void;

  wheel(delta: number): void;
}

export class EventHandler {

  rotatePlacingRight = false;
  rotatePlacingLeft = false;

  onclickListeners: ((c: Vector) => DragElement)[] = [];
  currentDragElement: DragElement;

  constructor(public ec?: EntityController) {
  }

  setListeners() {
    window.document.onkeydown = (event) => this.keyboardEvent(event, true);
    window.document.onkeyup = (event) => this.keyboardEvent(event, false);
    window.document.onmousedown = (event) => this.onmousedown(event);
    window.document.onmousemove = (event) => this.onmousemove(event);
    window.document.onmouseup = (event) => this.onmouseup(event);
    window.document.onwheel = (event) => this.wheel(event);
  }

  keyboardEvent(event: KeyboardEvent, pressed: boolean) {

    switch (event.key) {
      case 'e':
        this.rotatePlacingLeft = pressed;
        break;
      case 'q':
        this.rotatePlacingRight = pressed;
        break;
    }

    if (!this.ec)
      return;

    switch (event.key) {
      case 'ArrowDown':
        this.ec.thrustControl = pressed ? ThrustControl.DECREASE : ThrustControl.NONE;
        break;
      case 'ArrowUp':
        this.ec.thrustControl = pressed ? ThrustControl.INCREASE : ThrustControl.NONE;
        break;
      case 'ArrowLeft':
        this.ec.gyroControl = pressed ? GyroControl.POSITIVE : GyroControl.NONE;
        break;
      case 'ArrowRight':
        this.ec.gyroControl = pressed ? GyroControl.NEGATIVE : GyroControl.NONE;
        break;
      case 'p':
        if (pressed)
          this.ec.rotationDampener = !this.ec.rotationDampener;
        break;
      case 'o':
        if (pressed)
          this.ec.inertiaEqualizer = !this.ec.inertiaEqualizer;
        break;
      default:
        console.log(event.key);
    }

  }

  onmousedown(event: MouseEvent) {
    let c = new Vector(event.clientX, event.clientY);
    for (let l of this.onclickListeners) {
      const dragElement = l(c);
      if (dragElement) {
        this.currentDragElement = dragElement;
        break;
      }
    }
  }

  onmousemove(event: MouseEvent) {
    if (this.currentDragElement) {
      let c = new Vector(event.clientX, event.clientY);

      if (!this.currentDragElement.move(c, this)) {

        this.onmouseup(event);

      }
    }
  }

  onmouseup(event: MouseEvent) {
    if (this.currentDragElement) {
      let c = new Vector(event.clientX, event.clientY);

      if (!this.currentDragElement.end(c, this))
        delete this.currentDragElement;
    }
  }

  wheel(event: WheelEvent) {
    if (this.currentDragElement)
      this.currentDragElement.wheel(event.deltaY / 100);
  }

}
