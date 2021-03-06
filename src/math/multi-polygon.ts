import { Polygon } from './polygon';
import { Vector } from './vector';

export class MultiPolygon {

  constructor(public polygons: Polygon[]) {
  }

  clone(): MultiPolygon {
    return new MultiPolygon(this.polygons.map(polygon => polygon.clone()));
  }

  offset(r: Vector) {
    for(let polygon of this.polygons)
      polygon.offset(r);
  }

  rotate(f: number) {
    for(let polygon of this.polygons)
      polygon.rotate(f);
  }

  interceptPolygon(mp: MultiPolygon, path: Vector) {
    let minDistance = null, intersections = [];

    for(let polygon1 of this.polygons) {
      for(let polygon2 of mp.polygons) {
        let result = polygon1.interceptPolygon(polygon2, path);

        if (result.distance)
          if(!minDistance || minDistance > result.distance) {
            minDistance = result.distance;
            intersections = result.intersections;
          } else if (minDistance === result.distance) {
            intersections.push(...result.intersections);
          }
      }
    }
    return { distance: minDistance, intersections };
  }

  /**
   *
   * @param {MultiPolygon} mp
   * @param {Vector} velocity of @mp polygon
   * @param {Vector} center of rotation
   * @param {number} theta angular velocity
   * @returns
   */
  interceptPolygonAngular(mp: MultiPolygon, velocity: Vector, center: Vector, theta: number) {
    let tMin = null, interceptions = [];

    for (let polygon1 of this.polygons) {
      for (let polygon2 of mp.polygons) {
        let res = polygon1.interceptPolygonAngular(polygon2, velocity, center, theta);

        if (res.t)
          if (!tMin || tMin > res.t) {
            tMin = res.t;
            interceptions = res.interceptions;
          } else if (tMin === res.t) {
            interceptions.push(...res.interceptions);
          }
      }
    }
    return { t: tMin, interceptions: interceptions };
  }
}
