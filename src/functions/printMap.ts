import {
  GeoprocessingHandler,
  MultiPolygon,
  Polygon,
} from "@seasketch/geoprocessing";
import { Sketch, SketchCollection } from "@seasketch/geoprocessing/client-core";
import simplify from "@turf/simplify";

export async function printMap(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
) {
  return simplify(sketch, { tolerance: 0.001 });
}

export default new GeoprocessingHandler(printMap, {
  title: "printMap",
  description: "printMap",
  timeout: 900, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 10240,
});
