import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  GeoprocessingRequestModel,
  JSONValue,
} from "@seasketch/geoprocessing";

export interface SimpleResults {
  sum: number;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function simpleSumWorker(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: Record<string, JSONValue> = { workerId: 0 },
  request?: GeoprocessingRequestModel<Polygon | MultiPolygon>
): Promise<SimpleResults> {
  await sleep(1000);
  return {
    sum: extraParams.workerId as number,
  };
}

export default new GeoprocessingHandler(simpleSumWorker, {
  title: "simpleSumWorker",
  description: "Returns the workerId it is passed as the sum value",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
