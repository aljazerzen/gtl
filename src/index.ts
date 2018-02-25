import { Renderer } from './renderer';
import { StepperEngine } from './engines/stepper-engine';
import { World } from './world';
import { Hud } from './ui/hud';
import { EventHandler } from './ui/event-handler';

let canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

let ctx = canvas.getContext('2d');

let renderer = new Renderer(ctx);
let engine = new StepperEngine(World.createMock());

let controls = new EventHandler(engine.getWorld().entities[2].controller);
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
