import {
  GeoprocessingHandler,
  MultiPolygon,
  Polygon,
  GeoprocessingRequestModel,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import {
  DefaultExtraParams,
  Metric,
  ReportResult,
  Sketch,
  SketchCollection,
  rekeyMetrics,
  sortMetrics,
  toNullSketch,
} from "@seasketch/geoprocessing/client-core";
import awsSdk from "aws-sdk";
import { ousValueOverlapWorker } from "./ousValueOverlapWorker.js";
import { parseLambdaResponse, runLambdaWorker } from "../util/lambdaHelpers.js";

const mg = project.getMetricGroup("ousValueOverlap");

export async function ousValueOverlap(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
  request?: GeoprocessingRequestModel<Polygon | MultiPolygon>
): Promise<ReportResult> {
  const metrics = (
    await Promise.all(
      mg.classes.map(async (curClass) => {
        const parameters = {
          ...extraParams,
          metricGroup: mg,
          classId: curClass.classId,
        };

        return process.env.NODE_ENV === "test"
          ? ousValueOverlapWorker(sketch, parameters)
          : runLambdaWorker(
              sketch,
              parameters,
              "ousValueOverlapWorker",
              request
            );
      })
    )
  ).reduce<Metric[]>(
    (metrics, lambdaResult) =>
      metrics.concat(
        process.env.NODE_ENV === "test"
          ? (lambdaResult as Metric[])
          : parseLambdaResponse(
              lambdaResult as awsSdk.Lambda.InvocationResponse
            )
      ),
    []
  );

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(ousValueOverlap, {
  title: "ousValueOverlap",
  description: "ocean use metrics",
  timeout: 900, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 10240,
});
