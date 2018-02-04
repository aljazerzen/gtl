import { Renderer } from './renderer';
import { StepperEngine } from './engines/stepper-engine';
import { World } from './world';
import { Controls } from './ui/controls';
import { Hud } from './ui/hud';

let canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
canvas.height = document.body.clientHeight;
canvas.width = document.body.clientWidth;

let ctx = canvas.getContext('2d');

let renderer = new Renderer(ctx);
let engine = new StepperEngine(World.createMock());

let controls = new Controls();
controls.setListeners();
controls.controlling = engine.getWorld().entities[1];

let hud = new Hud(controls);

renderer.render(engine.getWorld(), hud);
let lastTick = Date.now();
const targetFPS = 60;

function tick() {

  engine.tick(controls, renderer);
  hud.tick();
  renderer.render(engine.getWorld(), hud);

  setTimeout(tick, lastTick + 1000 / targetFPS - Date.now());
  lastTick = Date.now();
}
tick();

/*
// For testing collision detection

let poly1 = new Polygon(
  [new Vector(10, 10), new Vector(10, 90), new Vector(90, 90), new Vector(90, 10)],
);
let poly2 = new Polygon(
  [
    [150, 200],
    [500, 200],
    [500, 500],
    [150, 500],
    // [150, 450],
    // [400, 450],
    // [400, 250],
    // [200, 250],
  ].map(a => new Vector(Math.random() * 0 + a[0], Math.random() * 0 + a[1]))
);
// poly2.rotate(0.05);

let path = new Vector(50, 50);

let offset = new Vector;
document.body.onmousemove = function (event) {

  poly1.offset(offset.product(-1));
  offset = new Vector(event.clientX, event.clientY);
  poly1.offset(offset);
  let inter1 = poly2.interceptPolygon(poly1, path);

  renderer.clear();
  renderer.setStyle(1);
  renderer.drawPolygon(new Vector, poly1, 0);
  renderer.drawPolygon(new Vector, poly2, 0);
  renderer.setStyle(2);
  inter1.intersections.forEach(i => renderer.drawCross(i, 5));

  renderer.setStyle(3);
  poly1.points.map(p => renderer.drawCross(p.sum(path), 3));
};*/
