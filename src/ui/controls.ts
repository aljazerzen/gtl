import { Entity } from '../entity';
import { Vector } from '../math/vector';

export class Controls {

  up = false;
  down = false;
  left = false;
  right = false;
  rotationDampeners = false;

  controlling: Entity;

  onclickListeners: ((c: Vector) => boolean)[] = [];

  constructor() {
  }

  setListeners() {
    window.document.onkeydown = (event) => this.onkeydown(event);
    window.document.onkeyup = (event) => this.onkeyup(event);
    window.document.onmousedown = (event) => this.onmousedown(event);
  }

  keyboardEvent(event: KeyboardEvent, actions: any) {
    if (actions[event.key])
      actions[event.key]();
    else
      console.log(event.key);
  }

  onkeydown(event: KeyboardEvent) {
    this.keyboardEvent(event, {
      'ArrowDown': () => this.down = true,
      'ArrowUp': () => this.up = true,
      'ArrowLeft': () => this.left = true,
      'ArrowRight': () => this.right = true,
      'p': () => this.rotationDampeners = !this.rotationDampeners,
    });
  }

  onkeyup(event: KeyboardEvent) {
    this.keyboardEvent(event, {
      'ArrowDown': () => this.down = false,
      'ArrowUp': () => this.up = false,
      'ArrowLeft': () => this.left = false,
      'ArrowRight': () => this.right = false
    });
  }

  onmousedown(event: MouseEvent) {
    let c = new Vector(event.clientX, event.clientY);
    for(let l of this.onclickListeners) {
      if(l(c))
        break;
    }
  }
}