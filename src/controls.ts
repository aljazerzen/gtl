import { Entity } from './entity';

export class Controls {

  up = false;
  down = false;
  left = false;
  right = false;
  rotationDampeners = false;

  controlling: Entity;

  constructor() {
  }

  setListeners() {
    window.document.onkeydown = (event) => this.onkeydown(event);
    window.document.onkeyup = (event) => this.onkeyup(event);
  }

  onkeydown(event: KeyboardEvent) {
    const actions = {
      'ArrowDown': () => this.down = true,
      'ArrowUp': () => this.up = true,
      'ArrowLeft': () => this.left = true,
      'ArrowRight': () => this.right = true,
      'p': () => this.rotationDampeners = !this.rotationDampeners,
    } as any;

    if(actions[event.key])
      actions[event.key]();
    else
      console.log(event.key);
  }

  onkeyup(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        this.down = false;
        break;
      case 'ArrowUp':
        this.up = false;
        break;
      case 'ArrowLeft':
        this.left = false;
        break;
      case 'ArrowRight':
        this.right = false;
        break;

    }
  }
}
