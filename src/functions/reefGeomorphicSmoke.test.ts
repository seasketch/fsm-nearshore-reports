import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { reefGeomorphic } from "./reefGeomorphic.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof reefGeomorphic).toBe("function");
  });
  test("reefGeomorphic - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await reefGeomorphic(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "reefGeomorphic", example.properties.name);
    }
  }, 120_000);
});
