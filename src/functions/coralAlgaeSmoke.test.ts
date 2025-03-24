import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { coralAlgae } from "./coralAlgae.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof coralAlgae).toBe("function");
  });
  test("coralAlgae - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await coralAlgae(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "coralAlgae", example.properties.name);
    }
  }, 120_000);
});
