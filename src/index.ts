import { Renderer } from './renderer';
import { StepperEngine } from './engines/stepper-engine';
import { World } from './world';
import { Hud } from './ui/hud';
import { EventHandler } from './ui/event-handler';
import { Thruster } from './blocks/thruster';

let canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

let ctx = canvas.getContext('2d');

export const renderer = new Renderer(ctx);
let engine = new StepperEngine(World.createMock());

let entityToControl =
  engine.getWorld().entities.filter(e => !!e.blocks.filter(t => t instanceof Thruster)[0])[0]
  || engine.getWorld().entities[0];
let controls = new EventHandler(entityToControl.controller);
controls.setListeners();

let hud = new Hud(controls);

renderer.render(engine.getWorld(), hud);
let lastTick = Date.now();
const targetFPS = 60;

function tick() {

  engine.tick(renderer);
  hud.tick();
  renderer.render(engine.getWorld(), hud);

  setTimeout(tick, lastTick + 1000 / targetFPS - Date.now());
  lastTick = Date.now();
}

tick();
