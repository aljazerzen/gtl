import { Vector } from './vector';
import { Line } from './line';

export class Polygon {

  edges: Line[];

  constructor(public points: Vector[] = []) {
    this.makeEdges();
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

