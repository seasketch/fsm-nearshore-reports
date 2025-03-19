import {
  GeoprocessingHandler,
  genFeatureCollection,
  getFeaturesForSketchBBoxes,
} from "@seasketch/geoprocessing";
import { simplify, bbox } from "@turf/turf";
import project from "../../project/projectClient.js";
import { isPolygonFeatureArray } from "@seasketch/geoprocessing/client-core";

export async function printMap(sketch: any) {
  const land = project.getVectorDatasourceById(
    project.getGeographyById(undefined, {
      fallbackGroup: "default-boundary",
    }).datasourceId,
  );

  // Get bounding box of sketch
  const sketchBox = sketch.bbox || bbox(sketch);

  // Fetch land features
  const url = project.getDatasourceUrl(land);
  const landPolys = await getFeaturesForSketchBBoxes(sketch, url);

  if (!isPolygonFeatureArray(landPolys)) {
    throw new Error("Expected array of Polygon features");
  }

  return {
    sketch: simplify(sketch, { tolerance: 0.001 }),
    land: simplify(genFeatureCollection(landPolys), {
      tolerance: 0.001,
    }),
  };
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
