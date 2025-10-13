import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { spawnAgg } from "./spawnAgg.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof spawnAgg).toBe("function");
  });
  test("spawnAgg - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await spawnAgg(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "spawnAgg", example.properties.name);
    }
  }, 60_000);
});
