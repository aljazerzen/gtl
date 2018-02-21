import { Renderer } from './renderer';
import { Vector } from './math/vector';
import { Matrix } from './math/matrix';

let canvas = document.getElementsByTagName('canvas')[0] as HTMLCanvasElement;
canvas.height = document.body.clientHeight - 400;
canvas.width = document.body.clientWidth;

let inputs = Array.prototype.slice.call(document.getElementsByTagName('input')) as HTMLInputElement[];
let inp = (index) => +inputs[index].value;

let ctx = canvas.getContext('2d');

let renderer = new Renderer(ctx);

/**
 * Finds an intersection between x-axis and graph of function f between lower and upper bounds
 * Used in this.interceptAngular function
 * @param {Vector} lower
 * @param {Vector} upper
 * @param {(x: number) => number} f
 * @returns {Vector}
 */
const findContactBisection = function (lower: Vector, upper: Vector, f: (x: number) => number) {
  while (upper.x - lower.x > 0.0001) {
    let tMiddle = (upper.x + lower.x) / 2;
    let middle = new Vector(tMiddle, f(tMiddle));

    if (middle.y * lower.y >= 0) lower = middle;
    if (middle.y * upper.y >= 0) upper = middle;
  }

  return lower.x >= 0 ? lower : null;
};

function interceptAngular(r1: Vector, a1: Vector, o: Vector, theta: number, r2: Vector, a2: Vector) {
  // Helper matrices and values
  const A_det = new Matrix(a1, a2).det();
  const R2_det = new Matrix(r2.difference(r1), a2).det();
  const g = Math.atan2(new Matrix(o, a2).det(), -o.multiplyScalar(a2));
  const b = a2.length * o.length;

  const f = (t) => A_det * t + b * Math.sin(theta * t + g) - R2_det;
  const t2 = (t1) => (r1.x - r2.x + t1 * a1.x + o.rotation(t1 * theta).x) / a2.x;
  const r = (t2) => a2.product(t2).add(r2);

  let contact = null;
  if (A_det === 0) {
    // Special case: f = b * sin(theta * t + g) - R2_det (no linear term)

    const j = Math.asin(R2_det / b);
    if (!isNaN(j)) {

      let tContact = Math.min(
        (Math.ceil((g - j) / Math.PI / 2) * 2 * Math.PI + j - g ) / theta,
        (Math.ceil((g - Math.PI + j) / Math.PI / 2) * 2 * Math.PI + Math.PI - j - g ) / theta,
      );
      contact = new Vector(tContact, f(tContact));

    }

  } else {
    const h = Math.acos(-A_det / b / theta);

    if (isNaN(h)) {
      // special case: f is monotonic (decreasing or increasing) -> no extremes

      let start = new Vector(0, f(0));
      let end = new Vector(1, f(1));

      // are start and end on different sides of x-axis?
      if (start.y * end.y <= 0) {
        contact = findContactBisection(start, end, f);
      }

    } else {
      let tL1 = (R2_det - b) / A_det;
      let tL2 = (R2_det + b) / A_det;

      // sort tL1 and tL2 (cool one-liner, yeah?)
      [tL1, tL2] = [Math.min(tL1, tL2), Math.max(tL1, tL2)];

      const k0 = Math.floor((h + g) / 2 / Math.PI);
      const k1 = Math.floor((theta * tL1 - h + g) / 2 / Math.PI);
      const k2 = Math.ceil((theta * tL2 + h + g) / 2 / Math.PI);

      const tk = (k, hPlus: boolean) => (2 * Math.PI * k + (hPlus ? h : -h) - g) / theta;

      const tk01 = tk(k0, false);
      const tk02 = tk(k0, true);
      const tk0 = tk02 < 0 ? tk02 : tk01;

      let extremePrev = new Vector(tk0, f(tk0));
      sequentialExtremes: for (let k = k1; k <= k2; k++) {
        for (let plusMinus = 0; plusMinus < 2; plusMinus++) {
          let tCurr = tk(k, plusMinus == 1);
          let extremeCurr = new Vector(tCurr, f(tCurr));

          // are values on different sides of x-axis (or touch it)?
          if (extremePrev.y * extremeCurr.y <= 0) {

            contact = findContactBisection(extremePrev, extremeCurr, f);

            if (contact) {

              const t2Contact = t2(contact.x);
              if (0 <= t2Contact && t2Contact <= 1) {
                break sequentialExtremes;
              } else {
                contact = null;
              }

            }
          }

          extremePrev = extremeCurr;
        }
      }
    }
  }

  if (!contact) return null;

  const t1Contact = contact.x;
  const t2Contact = t2(t1Contact);
  return { t1: t1Contact, t2: t2Contact, r: r(t2Contact) };
}

function go() {
  let r1 = new Vector(320, 100 + inp(0));
  let a1 = new Vector(inp(1), inp(2));
  let o = new Vector(inp(3), inp(3));
  let theta = Math.PI * (inp(4));

  let r2 = new Vector(300, 150);
  let a2 = new Vector(inp(5), inp(6));
  let t1 = inp(7);

  let contact = interceptAngular(r1, a1, o, theta, r2, a2);

  let points;
  renderer.clear();
  renderer.drawVector(r1, a1);
  renderer.drawVector(r1.sum(a1.product(t1)), o.rotation(theta * t1));
  renderer.drawVector(r2, a2);

  /* Coordinate system */
  let center = new Vector(400, 500);
  renderer.drawVector(new Vector(0, center.y), new Vector(10000, 0));
  renderer.drawVector(new Vector(center.x, 0), new Vector(0, 10000));
  const A_det = new Matrix(a1, a2).det();
  const R2_det = new Matrix(r2.difference(r1), a2).det();
  const g = Math.atan2(new Matrix(o, a2).det(), -o.multiplyScalar(a2));
  const b = a2.length * o.length;
  const f = (t) => A_det * t + b * Math.sin(theta * t + g) - R2_det;
  points = [];
  for (let i = -10; i < 10; i += 0.001) {
    points.push(new Vector(i * 100, f(i) / 100));
  }
  renderer.drawLineString(center, points, 0);
  let drawT = (ta, s = 7) =>
    renderer.drawCross(center.sum(new Vector(ta * 100, f(ta) / 100)), s);

  renderer.setStyle(2);
  if (contact) {
    drawT(contact.t1, 10);
    renderer.drawCross(contact.r, 5);
  }

  renderer.setStyle(1);
  points = [];
  for (let i = 0; i < 1; i += 0.001) {
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
