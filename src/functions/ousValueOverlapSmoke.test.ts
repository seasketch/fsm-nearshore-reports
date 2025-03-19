import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { ousValueOverlap } from "./ousValueOverlap.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof ousValueOverlap).toBe("function");
  });
  test("ousValueOverlap - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await ousValueOverlap(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "ousValueOverlap", example.properties.name);
    }
  }, 120_000);
});
