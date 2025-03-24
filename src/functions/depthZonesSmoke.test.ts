import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { depthZones } from "./depthZones.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof depthZones).toBe("function");
  });
  test("depthZones - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await depthZones(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "depthZones", example.properties.name);
    }
  }, 120_000);
});
