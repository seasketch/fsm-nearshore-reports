import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  DefaultExtraParams,
  GeoprocessingRequestModel,
  JSONValue,
} from "@seasketch/geoprocessing";

export interface SimpleResults {
  sum: number;
}

export async function simpleSumWorker(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: Record<string, JSONValue> = { workerId: 0 },
  request?: GeoprocessingRequestModel<Polygon | MultiPolygon>
): Promise<SimpleResults> {
  return {
    sum: extraParams.workerId as number,
  };
}

export default new GeoprocessingHandler(simpleSumWorker, {
  title: "simpleSumWorker",
  description: "Returns the extraParams it is passed",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
