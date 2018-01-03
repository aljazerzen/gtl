import { Circle } from './blocks/circle';
import { Block } from './blocks/block';
import { World } from './world';
import { Vector } from './math/vector';
import { Thruster } from './blocks/thruster';
import { Polygon } from './blocks/polygon';
import { Controls } from './ui/controls';
import { Hud } from './ui/hud';

export class Renderer {

  static colors = ['#fff', '#000', '#c9342b', '#8e2cc7', '#5d38c7'];

  constructor(private ctx: CanvasRenderingContext2D) {
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.lineWidth = 1;
  }

  public render(world: World, hud: Hud) {
    this.clear();

    world.entities.forEach(entity => {
      entity.blocks.forEach((block: Block) => {

        const position = entity.r.sum(block.offset.rotation(entity.f));

        this.setStyle(block.color);
        if (block instanceof Circle) {
          this.drawCircle(position, block.r);
        } else if (block instanceof Polygon) {
          this.drawPolygon(position, block.points, entity.f);
        }

        if (block instanceof Thruster) {
          this.setStyle(4);
          this.drawVector(
            block.thrustPosition.rotation(entity.f).sum(entity.r),
            block.thrustVector.rotation(entity.f));

          this.setStyle(3);
          this.drawVector(entity.r, block.thrustPosition.rotation(entity.f));
        }

        // this.drawCross(block.massPoint.r.clone().rotation(entity.f).sum(entity.r), 3);
      });

      this.setStyle(3);
      let thrust = entity.thrust();
      if (!thrust.f.isZero())
        this.drawVector(entity.r, thrust.f);

      this.setStyle(2);
      let thrustUnthrottled = entity.thrustUnthrottled();
      if (!thrustUnthrottled.f.isZero())
        this.drawVector(entity.r, thrustUnthrottled.f);

      this.setStyle(3);
      this.drawCross(entity.massPoint().r, 3);

      // this.setStyle(2);
      // this.drawCross(entity.r, 5);
    });

    hud.draw(this);
  }

  setStyle(style: number) {
    this.ctx.fillStyle = Renderer.colors[style];
    this.ctx.strokeStyle = Renderer.colors[style];
  }

  drawCircle(s: Vector, r: number) {
    this.ctx.beginPath();
    this.ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * @param r local vector for first point of the polygon
   * @param points
   * @param f angle of rotation around first point
   */
  drawPolygon(r: Vector, points: Vector[], f: number) {
    this.ctx.beginPath();
    points.map(point => this.lineTo(point.rotation(f).add(r)));
    this.ctx.fill();
  }

  drawRectangle(a: Vector, s: Vector, f: number) {
    this.ctx.beginPath();
    this.lineTo(a);
    this.lineTo(a.sum(new Vector(s.x, 0).rotation(f)));
    this.lineTo(a.sum(s.rotation(f)));
    this.lineTo(a.sum(new Vector(0, s.y).rotation(f)));
    this.lineTo(a);
    this.ctx.fill();
  }

  /*
   * Draws triangle (r, r + a, r + b) rotated around r for angle of f
   */
  drawTriangle(r: Vector, a: Vector, b: Vector, f: number) {
    this.ctx.beginPath();
    this.lineTo(r);
    this.lineTo(r.sum(a.rotation(f)));
    this.lineTo(r.sum(b.rotation(f)));
    this.ctx.fill();
  }

  /*
   * Draws isosceles triangle left bottom = r, top = r + a
   * rotated around r for angle of f
   */
  drawIsoscelesTriangle(r: Vector, a: Vector, f: number) {
    this.drawTriangle(r, a, new Vector(a.x * 2, 0), f);
  }

  /**
   * @param r local vector to left side of the base of the thruster pointing down
   * @param base vector point from r to other side of the base
   * @param f angle of rotation around r
   */
  drawThruster(r: Vector, base: Vector, f: number) {
    let side = base.rotation(Math.PI / 2);
    this.drawRectangle(r, side.sum(base), f);
    this.drawIsoscelesTriangle(
      r.sum(side.product(1.8).rotation(f)),
      side.invert().product(1.3).add(base.product(0.5)),
      f);
  }

  drawCross(a: Vector, s: number) {
    this.ctx.beginPath();
    this.lineTo(a);
    this.ctx.lineTo(a.x - s, a.y);
    this.ctx.lineTo(a.x + s, a.y);
    this.lineTo(a);
    this.ctx.lineTo(a.x, a.y - s);
    this.ctx.lineTo(a.x, a.y + s);
    this.lineTo(a);
    this.ctx.stroke();
  }

  drawVector(a: Vector, v: Vector) {
    this.ctx.beginPath();
    this.lineTo(a);
    this.lineTo(a.sum(v));
    this.lineTo(a.sum(v).sum(v.direction().rotation(Math.PI * 2 / 360 * 140).product(10)));
    this.lineTo(a.sum(v));
    this.lineTo(a.sum(v).sum(v.direction().rotation(-Math.PI * 2 / 360 * 140).product(10)));
    this.lineTo(a.sum(v));
    this.ctx.stroke();
  }

  lineTo(a: Vector) {
    this.ctx.lineTo(a.x, a.y);
  }
}