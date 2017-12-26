import { Renderer } from './renderer';
import { StepperEngine } from './engines/stepper-engine';
import { World } from './world';
import { Controls } from './controls';

let canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

let ctx = canvas.getContext("2d");

let renderer = new Renderer(ctx);
let engine = new StepperEngine(World.createMock());

let controls = new Controls();
controls.setListeners();
controls.controlling = engine.getWorld().entities[1];

renderer.render(engine.getWorld(), controls);
let lastTick = Date.now();
const targetFPS = 60;

function tick() {

  engine.tick(controls);
  renderer.render(engine.getWorld(), controls);

  setTimeout(tick, lastTick + 1000 / targetFPS - Date.now());
  lastTick = Date.now();
}
tick();
