import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  DefaultExtraParams,
  GeoprocessingRequestModel,
} from "@seasketch/geoprocessing";

export interface SimpleResults {
  result: {
    extraParams: DefaultExtraParams;
    request: GeoprocessingRequestModel<Polygon | MultiPolygon> | undefined;
  };
}

export async function simpleSync(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
  request?: GeoprocessingRequestModel<Polygon | MultiPolygon>
): Promise<SimpleResults> {
  console.log("request", JSON.stringify(request));
  return {
    result: {
      extraParams,
      request,
    },
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
