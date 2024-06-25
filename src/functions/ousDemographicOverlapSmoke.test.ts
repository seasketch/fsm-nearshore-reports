/**
 * @jest-environment node
 * @group smoke
 */
import { ousDemographicOverlap } from "./ousDemographicOverlap.js";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import fs from "fs";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof ousDemographicOverlap).toBe("function");
  });
  test("ousDemographicOverlapSmoke - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();

    for (const example of examples) {
      const smokeResult = JSON.parse(
        fs.readFileSync(
          "./examples/output/" +
            example.properties.name +
            "/ousDemographicOverlapWorker.json",
          "utf-8"
        )
      );
      console.log(smokeResult);
      const payload = JSON.stringify({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Cache-Control": "max-age=30, stale-while-revalidate=86400",
          "x-gp-cache": "Cache miss",
        },
        body: JSON.stringify({
          id: "29407-2024-05-22T22:20:06.345455+00:00-6b774228ecd9a3ec931ed424c123c697",
          service: "ousDemographicOverlapChild",
          wss: "wss://.execute-api..amazonaws.com/",
          location:
            "/ousDemographicOverlapChild/tasks/29407-2024-05-22T22:20:06.345455+00:00-6b774228ecd9a3ec931ed424c123c697",
          startedAt: "2024-05-22T22:20:09.962Z",
          logUriTemplate:
            "/ousDemographicOverlapChild/tasks/29407-2024-05-22T22:20:06.345455+00:00-6b774228ecd9a3ec931ed424c123c697/logs{?limit,nextToken}",
          geometryUri:
            "/ousDemographicOverlapChild/tasks/29407-2024-05-22T22:20:06.345455+00:00-6b774228ecd9a3ec931ed424c123c697/geometry",
          status: "completed",
          estimate: 1162,
          data: smokeResult,
          duration: 1594,
        }),
      });
      AWSMock.setSDKInstance(AWS);
      AWSMock.mock("Lambda", "invoke", {
        StatusCode: 200,
        ExecutedVersion: "$LATEST",
        Payload: payload,
      });

      const result = await ousDemographicOverlap(
        example,
        {},
        {
          geometryUri:
            "https://api.seasket.ch/sketches/" +
            example.properties.id +
            ".geojson.json?reporting_access_token=XXX",
        }
      );
      expect(result).toBeTruthy();
      writeResultOutput(
        result,
        "ousDemographicOverlap",
        example.properties.name
      );
      AWSMock.restore("Lambda");
    }
  }, 500000);
});
