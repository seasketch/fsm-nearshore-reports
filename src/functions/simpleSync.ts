import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  getFirstFromParam,
  DefaultExtraParams,
} from "@seasketch/geoprocessing";

export interface SimpleResults {
  result: DefaultExtraParams;
}

export async function simpleSync(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {}
): Promise<SimpleResults> {
  return {
    result: extraParams,
  };
}

export default new GeoprocessingHandler(simpleSync, {
  title: "simpleSync",
  description: "Returns the extraParams it is passed",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
