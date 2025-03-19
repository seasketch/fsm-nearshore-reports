import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { groupCountOverlap } from "./groupCountOverlap.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof groupCountOverlap).toBe("function");
  });
  test("groupCountOverlap - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await groupCountOverlap(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "groupCountOverlap", example.properties.name);
    }
  }, 120_000);
});
