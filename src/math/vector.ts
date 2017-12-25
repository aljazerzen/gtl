export class Vector {

  constructor(public x: number, public y: number) {
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  sum(a: Vector) {
    return new Vector(this.x + a.x, this.y + a.y);
  }

  difference(a: Vector) {
    return new Vector(this.x - a.x, this.y - a.y);
  }

  product(k: number) {
    return new Vector(k * this.x, k * this.y);
  }

  add(a: Vector) {
    this.x += a.x;
    this.y += a.y;
    return this;
  }

  invert() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  subtract(a: Vector) {
    return this.invert().add(a).invert();
  }

  multiply(k: number) {
    this.x *= k;
    this.y *= k;
    return this;
  }

  multiplyScalar(a: Vector): number {
    return a.x * this.x + a.y + this.y;
  }

  multiplyMatrix(a: Vector[]) {
    if (a.length != 2)
      throw new Error(`2 dim vector cannot be multiplied with a ${a.length}x2 matrix`);
    return new Vector(a[0].x * this.x + a[1].x * this.y, a[0].y * this.x + a[1].y * this.y);
  }

  rotate(t: number) {
    return this.multiplyMatrix([
      new Vector(Math.cos(t), Math.sin(t)),
      new Vector(-Math.sin(t), Math.cos(t)),
    ]);
  }

  rotateAround(a: Vector, t: number) {
    return this.subtract(a).rotate(t).add(a);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

}