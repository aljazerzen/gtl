import { Entity } from '../entity';
import { Vector } from '../math/vector';

export class Controls {

  up = false;
  down = false;
  left = false;
  right = false;
  rotatePlacingRight = false;
  rotatePlacingLeft = false;
  rotationDampeners = false;

  controlling: Entity;

  onclickListeners: ((c: Vector) => DragElement)[] = [];
  currentDragElement: DragElement;

  constructor() {
  }

  setListeners() {
    window.document.onkeydown = (event) => this.keyboardEvent(event, true);
    window.document.onkeyup = (event) => this.keyboardEvent(event, false);
    window.document.onmousedown = (event) => this.onmousedown(event);
    window.document.onmousemove = (event) => this.onmousemove(event);
    window.document.onmouseup = (event) => this.onmouseup(event);
    window.document.onwheel = (event) => this.wheel(event);
  }

  static toggles: any = {
    'p': 'rotationDampeners',
  };

  static bindings: any = {
    'ArrowDown': 'down',
    'ArrowUp': 'up',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'e': 'rotatePlacingLeft',
    'q': 'rotatePlacingRight',
  };

  keyboardEvent(event: KeyboardEvent, down: boolean) {
    const taa = this as any;
    const toggle = Controls.toggles[event.key];
    if (toggle && down) {
      taa[toggle] = !taa[toggle];
    }

    const binding = Controls.bindings[event.key];
    if (binding) {
      taa[binding] = down;
    }
    if (!toggle && !binding)
      console.log(event.key);
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

export interface DragElement {

  // return true to continue drag
  move(c: Vector, controls: Controls): boolean | void;

  // return true to continue drag
  end(c: Vector, controls: Controls): boolean | void;

  wheel(delta: number): void;
}
