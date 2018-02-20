import { Renderer } from './renderer';
import { Vector } from './math/vector';
import { Matrix } from './math/matrix';

let canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
canvas.height = document.body.clientHeight - 300;
canvas.width = document.body.clientWidth;

let inputs = Array.prototype.slice.call(document.getElementsByTagName('input')) as HTMLInputElement[];

let ctx = canvas.getContext('2d');

let renderer = new Renderer(ctx);

function go() {
  let t = +inputs[0].value;
  let maxT = 100;

  let r1 = new Vector(320, 100 + +inputs[5].value);
  let a1 = new Vector(+inputs[1].value, +inputs[2].value);
  let o = new Vector(-50, -50);
  let theta = Math.PI * (+inputs[4].value);

  let r2 = new Vector(300, 150);
  let a2 = new Vector(-150, 0);

  let f = (t) => A.det() * t + a2.length * o.length * Math.sin(theta * t + g) - deltaR2.det();

  let A = new Matrix(a1, a2);
  let deltaR2 = new Matrix(r2.difference(r1), a2);

  let g = Math.atan2(new Matrix(o, a2).det(), -o.multiplyScalar(a2));

  let contact = null;
  if (A.det() === 0) {

    let j = Math.asin(deltaR2.det() / o.length / a2.length);
    if (!isNaN(j)) {

      let tContact = Math.min(
        (Math.ceil((g - j) / Math.PI / 2) * 2 * Math.PI + j - g ) / theta,
        (Math.ceil((g - Math.PI + j) / Math.PI / 2) * 2 * Math.PI + Math.PI - j - g ) / theta,
      );
      contact = new Vector(tContact, f(tContact));

    }

  } else {

    let t1 = (deltaR2.det() - a2.length * o.length) / A.det();
    let t2 = (deltaR2.det() + a2.length * o.length) / A.det();
    [t1, t2] = [Math.min(t1, t2), Math.max(t1, t2)];

    const findContactBisection = function (lower: Vector, upper: Vector) {
      while (upper.x - lower.x > 0.0001) {
        let tMiddle = (upper.x + lower.x) / 2;
        let middle = new Vector(tMiddle, f(tMiddle));

        if (middle.y * lower.y >= 0) lower = middle;
        if (middle.y * upper.y >= 0) upper = middle;
      }

      return lower.x >= 0 ? lower : null;
    };

    let h = Math.acos(-A.det() / a2.length / o.length / theta);

    if (isNaN(h)) {
      // f is monotonic (decreasing or increasing)

      let start = new Vector(0, f(0));
      let end = new Vector(maxT, f(maxT));

      // are start and end on different sides of x-axis?
      if (start.y * end.y <= 0) {
        contact = findContactBisection(start, end);
      }

    } else {
      let k0 = Math.floor((h + g) / 2 / Math.PI);
      let k1 = Math.floor((theta * t1 - h + g) / 2 / Math.PI);
      let k2 = Math.ceil((theta * t2 + h + g) / 2 / Math.PI);

      let tk = (k, hPlus: boolean) => (2 * Math.PI * k + (hPlus ? h : -h) - g) / theta;

      let tk01 = tk(k0, false);
      let tk02 = tk(k0, true);
      let tk0 = tk02 < 0 ? tk02 : tk01;

      let extremePrev = new Vector(tk0, f(tk0));
      sequentialExtremes: for (let k = k1; k <= k2; k++) {
        for (let plusMinus = 0; plusMinus < 2; plusMinus++) {
          let tCurr = tk(k, plusMinus == 1);
          let extremeCurr = new Vector(tCurr, f(tCurr));

          // are values on different sides of x-axis (or touch it)?
          if (extremePrev.y * extremeCurr.y <= 0) {

            contact = findContactBisection(extremePrev, extremeCurr);

            if (contact) break sequentialExtremes;
          }

          extremePrev = extremeCurr;
        }
      }
    }
  }

  renderer.clear();
  renderer.drawVector(r1, a1.product(t));
  renderer.drawVector(r1.sum(a1.product(t)), o.rotation(theta * t));
  renderer.drawVector(r2, a2.product(+inputs[3].value));

  renderer.drawVector(new Vector(0, 500), new Vector(10000, 0));
  renderer.drawVector(new Vector(400, 300), new Vector(0, 10000));

  let drawT = (ta, s = 7) =>
    renderer.drawCross(new Vector(400, 500).add(new Vector(ta * 100, f(ta) / 100)), s);

  renderer.setStyle(2);
  if (contact) {
    drawT(contact.x, 10);
    renderer.drawCross(r1.sum(a1.product(contact.x)).sum(o.rotation(theta * contact.x)), 5);
  }

  renderer.setStyle(3);

  renderer.setStyle(1);
  renderer.drawCross(new Vector(400, 500).add(new Vector(t * 100, f(t) / 100)), 7);
  let points = [];
  for (let i = -5; i < 5; i += 0.001) {
    points.push(new Vector(i * 100, f(i) / 100));
  }
  renderer.drawLineString(new Vector(400, 500), points, 0);
  points = [];
  for (let i = -5; i < 5; i += 0.001) {
    points.push(a1.product(i).sum(o.rotation(theta * i)));
  }
  renderer.drawLineString(r1, points, 0);

}

inputs.map(i => i.oninput = go);
go();

/*let engine = new StepperEngine(World.createMock());

let controls = new EventHandler(engine.getWorld().entities[1].controller);
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
*/

/*
// For testing linear collision detection

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
