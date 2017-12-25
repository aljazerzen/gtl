import { Circle } from './blocks/circle';
import { Block } from './blocks/block';
import { World } from './world';
import { Rectangle } from './blocks/rectangle';
import { Vector } from './math/vector';

export class Renderer {

  static colors = ['#fff', '#000', '#c9342b', '#8e2cc7', '#5d38c7'];

  constructor(private ctx: CanvasRenderingContext2D) {
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.lineWidth = 1;
  }

  public render(world: World) {
    this.clear();

    world.entities.forEach(entity => {
      entity.blocks.forEach((block: Block) => {

        const position = entity.r.sum(block.offset.rotate(entity.f));

        if (block instanceof Circle) {
          this.drawCircle(position, block.r);
        } else if (block instanceof Rectangle) {
          this.drawRectangle(position, block.size, entity.f);
        }

        this.ctx.fillStyle = Renderer.colors[block.color];
        this.ctx.fill();

        // this.drawCross(block.massPoint.r.clone().rotate(entity.f).sum(entity.r), 3);
        // this.ctx.strokeStyle = Renderer.colors[4];
        // this.ctx.stroke();
      });

      this.drawCross(entity.massPoint.r, 3);
      this.ctx.strokeStyle = Renderer.colors[3];
      this.ctx.stroke();

      // this.drawCross(entity.r, 5);
      // this.ctx.strokeStyle = Renderer.colors[2];
      // this.ctx.stroke();
    });

    if (world.center && world.center.mass !== undefined) {
      this.drawCross(world.center.r, 10);
      this.ctx.strokeStyle = Renderer.colors[1];
      this.ctx.stroke();
    }

  }

  drawCircle(s: Vector, r: number) {
    this.ctx.beginPath();
    this.ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
  }

  drawRectangle(a: Vector, s: Vector, f: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(a.x, a.y);

    const p2 = a.sum(new Vector(s.x, 0).rotate(f));
    this.ctx.lineTo(p2.x, p2.y);

    const p3 = a.sum(s.rotate(f));
    this.ctx.lineTo(p3.x, p3.y);

    const p4 = a.sum(new Vector(0, s.y).rotate(f));
    this.ctx.lineTo(p4.x, p4.y);
  }

  drawCross(a: Vector, s: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(a.x, a.y);
    this.ctx.lineTo(a.x - s, a.y);
    this.ctx.lineTo(a.x + s, a.y);
    this.ctx.lineTo(a.x, a.y);
    this.ctx.lineTo(a.x, a.y - s);
    this.ctx.lineTo(a.x, a.y + s);
  }
}