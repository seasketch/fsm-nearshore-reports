/**
 * @jest-environment node
 * @group smoke
 */
import { ousValueOverlap } from "./ousValueOverlap.js";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof ousValueOverlap).toBe("function");
  });
  test("ousValueOverlapSmoke - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await ousValueOverlap(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "ousValueOverlap", example.properties.name);
    }
  }, 120000);
});
