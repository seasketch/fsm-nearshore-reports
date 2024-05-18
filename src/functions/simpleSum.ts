import {
  Sketch,
  GeoprocessingHandler,
  Polygon,
  MultiPolygon,
  ReportResult,
  SketchCollection,
  DefaultExtraParams,
  toNullSketch,
  rekeyMetrics,
  getFirstFromParam,
  Metric,
  sortMetrics,
  genTaskCacheKey,
  GeoprocessingRequestModel,
} from "@seasketch/geoprocessing";

import project from "../../project/projectClient.js";
import awsSdk from "aws-sdk";

export async function simpleSum(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
  request?: GeoprocessingRequestModel<Polygon | MultiPolygon>
): Promise<ReportResult> {
  const numWorkers = 10;
  const workerIds = Array.from({ length: numWorkers }, (_, i) => i);

  const promises = workerIds.map(async (workerId) => {
    const cacheKey = genTaskCacheKey(sketch.properties, { workerId: workerId });

    const event = {
      queryStringParameters: {
        geometryUri: request!.geometryUri,
        extraParams: { workerId: workerId },
        cacheKey,
      },
    };
    const payload = JSON.stringify(event, null, 2);

    const Lambda = new awsSdk.Lambda();
    return Lambda.invoke({
      FunctionName: "gp-fsm-nearshore-worker-sync-simpleSumWorker",
      InvocationType: "RequestResponse", // synchronous, returns response
      Payload: payload,
    }).promise();
  });

  const workerPayloads = await Promise.all(promises);
  const sum = workerPayloads.reduce<number>((acc, payload) => {
    const payloadObj = JSON.parse((payload as unknown as any).Payload);
    const body = JSON.parse(payloadObj.body);
    console.log("body", JSON.stringify(body, null, 2));
    return (acc + body.data.sum) as number;
  }, 0);

  const metrics: Metric[] = [
    {
      metricId: "simpleSum",
      sketchId: sketch.properties.id,
      geographyId: null,
      classId: null,
      groupId: null,
      value: sum,
    },
  ];

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(simpleSum, {
  title: "simpleSum",
  description: "Calculates simple sum using worker functions",
  timeout: 60, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
