export class Vector {

  constructor(public x: number = 0, public y: number = 0) {
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  isZero() {
    return this.x == 0 && this.y == 0;
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
    return a.x * this.x + a.y * this.y;
  }

  multiplyMatrix(a: Vector[]) {
    if (a.length != 2)
      throw new Error(`2 dim vector cannot be multiplied with a ${a.length}x2 matrix`);
    return new Vector(a[0].x * this.x + a[1].x * this.y, a[0].y * this.x + a[1].y * this.y);
  }

  rotation(t: number) {
    return this.multiplyMatrix([
      new Vector(Math.cos(t), Math.sin(t)),
      new Vector(-Math.sin(t), Math.cos(t)),
    ]);
  }

  rotateAround(a: Vector, t: number) {
    return this.subtract(a).rotation(t).add(a);
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  angle(a: Vector) {
    return Math.acos(this.multiplyScalar(a) / this.length / a.length);
  }

  angleDirection(a: Vector) {
    return Math.atan2(a.y, a.x) - Math.atan2(this.y, this.x);
  }

  direction() {
    return this.product(1 / this.length);
  }

}