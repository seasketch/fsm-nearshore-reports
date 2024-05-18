/**
 * @vitest-environment node
 */
import Handler from "./simpleSum.js";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { geometry } from "@turf/helpers";
import { describe, test, expect } from "vitest";
import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";

const simpleSum = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof simpleSum).toBe("function");
  });
  test("simpleSum - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("Lambda", "invoke", {
      StatusCode: 200,
      ExecutedVersion: "$LATEST",
      Payload:
        '{"statusCode":200,"headers":{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":true,"Cache-Control":"max-age=30, stale-while-revalidate=86400","x-gp-cache":"Cache miss"},"body":"{\\"id\\":\\"29386-2024-05-18T03:06:25.802888+00:00-7e2a39032880b8defab8c44792e06392\\",\\"service\\":\\"simpleSumWorker\\",\\"wss\\":\\"wss://.execute-api..amazonaws.com/\\",\\"location\\":\\"/simpleSumWorker/tasks/29386-2024-05-18T03:06:25.802888+00:00-7e2a39032880b8defab8c44792e06392\\",\\"startedAt\\":\\"2024-05-18T03:06:36.337Z\\",\\"logUriTemplate\\":\\"/simpleSumWorker/tasks/29386-2024-05-18T03:06:25.802888+00:00-7e2a39032880b8defab8c44792e06392/logs{?limit,nextToken}\\",\\"geometryUri\\":\\"/simpleSumWorker/tasks/29386-2024-05-18T03:06:25.802888+00:00-7e2a39032880b8defab8c44792e06392/geometry\\",\\"status\\":\\"completed\\",\\"estimate\\":300,\\"data\\":{\\"sum\\":1},\\"duration\\":376}"}',
    });

    for (const example of examples) {
      const result = await simpleSum(
        example,
        {},
        {
          geometryUri:
            "https://api.seasket.ch/sketches/29375.geojson.json?reporting_access_token=XXX",
        }
      );
      expect(result).toBeTruthy();
      writeResultOutput(result, "simpleSum", example.properties.name);
    }

    AWSMock.restore("Lambda");
  }, 60000);
});
