import { Vector } from './vector';

export class Graph {

  firstVertex: Vertex;

  constructor() {
  }

  insertVertex(r: Vector): Vertex {
    this.firstVertex = new Vertex(this.firstVertex, r);
    return this.firstVertex;
  }

  insertEdge(v: Vertex, u: Vertex): Edge {
    v.firstEdge = new Edge(v.firstEdge, u);
    return v.firstEdge;
  }

}

export class Vertex {
  constructor(
    public next: Vertex,
    public r: Vector,
    public firstEdge: Edge = null,
  ) {
  }
}

export class Edge {
  constructor(
    public next: Edge,
    public end: Vertex,
  ) {
  }
}
