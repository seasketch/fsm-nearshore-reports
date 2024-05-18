/**
 * @jest-environment node
 * @group smoke
 */
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { simpleSumWorker } from "./simpleSumWorker.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof simpleSumWorker).toBe("function");
  });
  test("simpleSumWorker - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await simpleSumWorker(
        example,
        {
          workerId: 4,
        },
        { geometryUri: "https://sketch.m" }
      );
      expect(result).toBeTruthy();
      writeResultOutput(result, "simpleSumWorker", example.properties.name);
    }
  }, 60000);
});
