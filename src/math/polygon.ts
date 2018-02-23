import { Vector } from './vector';
import { Line } from './line';

export class Polygon {

  edges: Line[];

  constructor(public points: Vector[] = []) {
    this.makeEdges();
  }

  static fromRaw(data: number[][]): Polygon {
    return new Polygon(data.map(point => new Vector(point[0], point[1])));
  }

  static union(polyA: Polygon, polyB: Polygon) {
    // Greiner–Hormann clipping algorithm
    // http://www.inf.usi.ch/hormann/papers/Greiner.1998.ECO.pdf

    let a = new PolygonLinked(polyA);
    let b = new PolygonLinked(polyB);

    let intersectionFound = false;

    for (let posA = a.firstNode, start = true; posA != a.firstNode || start; posA = posA.next, start = false) {

      if (!posA.intersection) {
        let edgeA = new Line(posA.r, posA.nextNonIntersection().r);

        // for (let polyStart = b.firstNode; polyStart != null; polyStart = polyStart.nextPoly) {
        for (let posB = b.firstNode, start = true; posB != b.firstNode || start; posB = posB.next, start = false) {

          if (!posB.intersection) {

            let intersection = new Line(posB.r, posB.nextNonIntersection().r).intersection(edgeA);
            if (intersection) {

              intersectionFound = true;

              const newNodeA = new PolygonLinkedNode(intersection);
              newNodeA.intersection = true;
              newNodeA.alpha = posA.r.difference(intersection).length / posA.r.difference(posA.next.r).length;

              const newNodeB = new PolygonLinkedNode(intersection);
              newNodeB.intersection = true;
              newNodeB.alpha = posA.r.difference(intersection).length / posA.r.difference(posA.next.r).length;

              newNodeA.neighbour = newNodeB;
              newNodeB.neighbour = newNodeA;

              a.insert(newNodeA, posA);
              b.insert(newNodeB, posB);
            }
          }
        }
      }
    }

    if (!intersectionFound) {
      if (polyB.containsPoint(a.firstNode.r))
        return [polyB];
      else if (polyA.containsPoint(b.firstNode.r))
        return [polyA];
      else
        return [polyA, polyB];
    }

    let inside = polyB.containsPoint(a.firstNode.r);
    for (let posA = a.firstNode, start = true; posA != a.firstNode || start; posA = posA.next, start = false) {
      if (posA.intersection) {
        posA.entry = !inside;
        inside = !inside;
      }
    }

    inside = polyA.containsPoint(b.firstNode.r);
    for (let posB = a.firstNode, start = true; posB != a.firstNode || start; posB = posB.next, start = false) {
      if (posB.intersection) {
        posB.entry = !inside;
        inside = !inside;
      }
    }

    let points: Vector[] = [];
    let initialIntersection = a.firstNode;
    while (!initialIntersection.intersection) initialIntersection = initialIntersection.next;

    for (let node = initialIntersection, s = true; node !== initialIntersection || s; s = false) {
      let direction = node.entry;
      for (s = true; !node.intersection || s; s = false) {
        points.push(node.r);
        node = direction ? node.next : node.prev;
      }
      node = node.neighbour;
    }

    return [new Polygon(points)];
  }

  makeEdges() {
    this.edges = [];

    let last = null;
    for (let point of this.points) {
      if (last)
        this.edges.push(new Line(last, point));
      last = point;
    }
    if (last)
      this.edges.push(new Line(last, this.points[0]));
  }

  containsPoint(point: Vector) {
    let isIn = false;
    let intersectX;

    for (const edge of this.edges) {
      if (edge.isIntersectedByHorizontalRay(point)) {
        intersectX = edge.intersectionByHorizontalRay(point);
        if (point.x === intersectX) {
          return true; // on edge
        }
        if (point.x < intersectX) {
          isIn = !isIn;
        }
      }
    }
    return isIn;
  }

  containsPolygon(poly: Polygon) {
    for (let point of poly.points) {
      if (!this.containsPoint(point))
        return false;
    }
    return true;
  }

  /**
   * Finds first interception of movement of this polygon with polygon @poly
   * @param {Polygon} poly
   * @param {Vector} velocity of this poly
   * @param center of rotation
   * @param {number} theta angular velocity of this poly
   * @returns object describing distance covered and interceptions detected
   */
  interceptPolygonAngular(poly: Polygon, velocity: Vector, center: Vector, theta: number) {
    let interceptions = [];
    let tMin = null;

    for (let point of poly.points) {

      const { t1, interception } = this.interceptPointAngular(center, point.difference(center), velocity, theta);
      if (t1) {
        if (!tMin || t1 < tMin) {
          tMin = t1;
          interceptions = [interception];
        } else if (t1 === tMin) {
          interceptions.push(interception);
        }
      }
    }

    let reverseVelocity = velocity.product(-1);
    for (let point of this.points) {
      const { t1 } = poly.interceptPointAngular(center, point.difference(center), reverseVelocity, -theta);
      if (t1) {
        if (!tMin || t1 < tMin) {
          tMin = t1;
          interceptions = [point];
        } else if (t1 === tMin) {
          interceptions.push(point);
        }
      }
    }

    return { t: tMin, interceptions };
  }

  interceptPolygon(poly: Polygon, path: Vector) {

    let intersections = [];
    let minDistance = null;

    for (let point of poly.points) {

      const { distance, intersection } = this.interceptPoint(point, path);
      if (distance) {
        if (!minDistance || distance < minDistance) {
          minDistance = distance;
          intersections = [intersection];
        } else if (distance === minDistance) {
          intersections.push(intersection);
        }
      }
    }

    let reversePath = path.product(-1);
    for (let point of this.points) {
      const { distance } = poly.interceptPoint(point, reversePath);
      if (distance) {
        if (!minDistance || distance < minDistance) {
          minDistance = distance;
          intersections = [point];
        } else if (distance === minDistance) {
          intersections.push(point);
        }
      }
    }

    return { distance: minDistance, intersections };
  }

  interceptPoint(point: Vector, path: Vector) {
    const movement = new Line(point, point.sum(path));
    let firstIntersection = null;
    let minDistance = null;

    for (const edge of this.edges) {

      const intersection = movement.intersection(edge);

      if (intersection) {
        const distance = intersection.difference(point).length;

        if (!minDistance || distance < minDistance) {
          minDistance = distance;
          firstIntersection = intersection;
        }
      }
    }
    return { distance: minDistance, intersection: firstIntersection };
  }

  /**
   *
   * @param {Vector} r1 center of rotation and local vector for our vector
   * @param {Vector} o offset vector (vector from @r1 to actual position of the point at t = 0)
   * @param {Vector} velocity normalized velocity
   * @param {number} theta angular velocity
   */
  interceptPointAngular(r1: Vector, o: Vector, velocity: Vector, theta: number) {
    let firstIntersection = null;
    let t1First = null;

    for (const edge of this.edges) {

      const intersection = edge.interceptAngular(r1, velocity, o, theta);

      if (intersection) {
        if (!t1First || intersection.t1 < t1First) {
          t1First = intersection.t1;
          firstIntersection = intersection;
        }
      }
    }
    return { t1: t1First, interception: firstIntersection };
  }

  areaAndCentroid() {
    const p = this.points;

    let sumArea = 0, sumX = 0, sumY = 0;
    for (let i = 0; i < p.length - 1; i++) {
      sumArea += p[i].x * p[i + 1].y - p[i + 1].x * p[i].y;
      sumX += (p[i].x + p[i + 1].x) * (p[i].x * p[i + 1].y - p[i + 1].x * p[i].y);
      sumY += (p[i].y + p[i + 1].y) * (p[i].x * p[i + 1].y - p[i + 1].x * p[i].y);
    }

    const area = sumArea / 2;
    const centroid = new Vector(sumX / area / 6, sumY / area / 6);
    return { area, centroid };
  }

  rotate(t: number) {
    for (const point of this.points) {
      point.rotate(t);
    }
  }

  scale(k: number) {
    for (const point of this.points) {
      point.multiply(k);
    }
  }

  offset(r: Vector) {
    for (let point of this.points) {
      point.add(r);
    }
  }

  clone() {
    return new Polygon(this.points.map(p => p.clone()));
  }
}

class PolygonLinked {

  firstNode: PolygonLinkedNode;

  constructor(polygon: Polygon) {
    let prev = null;
    for (let point of polygon.points) {
      let node = new PolygonLinkedNode(point);
      node.prev = prev;
      if (node.prev)
        node.prev.next = node;
      else
        this.firstNode = node;
      prev = node;
    }
    prev.next = this.firstNode;
    this.firstNode.prev = prev;
  }

  insert(node: PolygonLinkedNode, position: PolygonLinkedNode) {
    while (position.intersection && position.alpha > node.alpha) {
      position = position.prev;
    }
    while (position.next.intersection && position.next.alpha < node.alpha) {
      position = position.next;
    }
    node.next = position.next;
    node.prev = position;
    position.next = node;
    node.next.prev = node;
  }

}

class PolygonLinkedNode {
  r: Vector;
  next: PolygonLinkedNode;
  prev: PolygonLinkedNode;

  intersection = false;
  entry: boolean;
  neighbour: PolygonLinkedNode;
  alpha: number;

  constructor(r: Vector) {
    this.r = r;
  }

  nextNonIntersection() {
    return this.next.intersection ? this.next.nextNonIntersection() : this.next;
  }
}

// function intersection(poly1: Polygon, poly2: Polygon) {
//   if (poly1.containsPolygon(poly2)) {
//     return poly2;
//   }
//
//   if (poly2.containsPolygon(poly1)) {
//     return poly1;
//   }
//
//   let intersectPolygons = [new Polygon()];
//
//   let point;
//   let elem;
//
//   for (let edge of poly1.edges) {
//     findPointInPoly(edge.a, poly2);
//     findEdgeIntersection(edge, poly2.edges);
//
//     if (!edge.getIntersectCount()) {
//       continue;
//     }
//
//     elem = getFirstIntersectElem(edge, point);
//     if (!elem) {
//       continue;
//     }
//
//     addIntersectPoint(elem.point, poly2);
//     findNextIntersectPoint(edge);
//   }
//
//   return intersectPolygons.getResult();
//
//
//   function findNextIntersectPoint(edge) {
//     let poly = poly1.isEdgeExist(elem.edge) ? poly2 : poly1;
//     let ownPoly = (poly === poly1) ? poly2 : poly1;
//
//     let point1 = elem.edge.a;
//     let point2 = elem.edge.getEndPoint();
//     poly.isPointInPoly(point1);
//     poly.isPointInPoly(point2);
//
//     let edgePart1 = new Edge(elem.point, point1);
//     let edgePart2 = new Edge(elem.point, point2);
//
//     let edges = [].slice.call(poly.edges);
//     reduceEdges(edges, edge);
//
//     findEdgeIntersection(edgePart1, edges);
//     findEdgeIntersection(edgePart2, edges);
//
//     edgePart1.setState(point1.getState());
//     edgePart2.setState(point2.getState());
//
//     let nextStartPoint;
//     let nextPart;
//     if (point1.getState() === pointState.outPoly && (edgePart1.getIntersectCount() % 2) ||
//       point1.getState() === (pointState.inPoly || pointState.onEdge) &&
//       !(edgePart1.getIntersectCount() % 2)) {
//       nextStartPoint = point1;
//       nextPart = edgePart1;
//     } else {
//       nextStartPoint = point2;
//       nextPart = edgePart2;
//     }
//     if (nextPart.getIntersectCount()) {
//       let element = getFirstIntersectElem(nextPart, elem.point);
//       if (element) {
//         edge = elem.edge;
//         elem = element;
//         addIntersectPoint(element.point, poly);
//         return findNextIntersectPoint(edge);
//       }
//     }
//
//     edges = [].slice.call(ownPoly.edges);
//     reduceEdges(edges, elem.edge);
//
//     let nextEdge;
//     for (let edge of edges) {
//       if (edge.isPointExist(nextStartPoint)) {
//         nextEdge = edge;
//         break;
//       }
//     }
//
//     if (!nextEdge.a.isCoordEqual(nextStartPoint)) {
//       nextEdge.changePoints();
//     }
//     ownPoly.setDirection(elem.edge, nextEdge);
//
//     for (var i = 0; i < ownPoly.edges.length; i++) {
//       if (i !== 0) {
//         nextEdge = ownPoly.getNextEdge();
//       }
//
//       point = nextEdge.a;
//       findPointInPoly(point, poly);
//       findEdgeIntersection(nextEdge, poly.edges);
//
//       if (!nextEdge.getIntersectCount()) {
//         continue;
//       }
//
//       elem = getFirstIntersectElem(nextEdge, point);
//       if (!elem) {
//         return;
//       }
//
//       addIntersectPoint(elem.point, poly);
//       return findNextIntersectPoint(nextEdge);
//     }
//   }
//
//
//   function addIntersectPoint(point, poly) {
//     if (point.getState() === pointState.undefined) {
//       poly.isPointInPoly(point);
//     }
//     let intersectPoly = intersectPolygons.getLast();
//     if (intersectPoly.isIntersectionEnd()) {
//       intersectPolygons.add(new Polygon());
//     }
//     intersectPoly.addPoint(point);
//   }
//
//   function findPointInPoly(point: Vector, poly: Polygon) {
//     if (point is not equal any of points in intersectPolygons && poly.containsPoint(point)) {
//       addIntersectPoint(point, poly);
//     }
//   }
//
//   function getFirstIntersectElem(edge, point) {
//     let intersections = edge.getIntersectElements();
//     intersections = intersections.filter(intersect =>
//       intersect.point.compare(intersectPolygons.getPoints()));
//     if (!intersections.length) {
//       intersectPolygons.getLast().endIntersection();
//       return false;
//     }
//
//     edge.setState(point.getState());
//
//     if (intersections.length > 1) {
//       intersections.forEach(intersect => intersect.point.calcDistance(point));
//       intersections.sort((a, b) => a.point.distance - b.point.distance);
//     }
//     return intersections[0];
//   }
// }

// function findEdgeIntersection(edge, edges) {
//   if (edge.getIntersectElements().length) {
//     return;
//   }
//   let intersectPoint;
//   edges.forEach(intersectEdge => {
//     intersectPoint = edge.findIntersectingPoint(intersectEdge);
//     if (intersectPoint.toString() === 'Point') {
//       edge.addIntersectElement(intersectEdge, intersectPoint);
//     }
//   });
// }

// function reduceEdges(edges, edge) {
//   let index = edges.indexOf(edge);
//   if (index + 1) {
//     edges.splice(index, 1);
//   }
//   return edges;
// }

