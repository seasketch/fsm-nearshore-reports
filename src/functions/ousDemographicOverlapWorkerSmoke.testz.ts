/**
 * @vitest-environment node
 */
import Handler from "./ousDemographicOverlapWorker.js";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";

const ousDemographicOverlapWorker = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof ousDemographicOverlapWorker).toBe("function");
  });
  test("ousDemographicOverlapWorker - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await ousDemographicOverlapWorker(example, {
        startIndex: 0,
        endIndex: 100,
      });
      expect(result).toBeTruthy();
      writeResultOutput(
        result,
        "ousDemographicOverlapWorker",
        example.properties.name
      );
    }
  }, 60000);
});
