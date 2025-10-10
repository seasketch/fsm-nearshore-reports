import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { coralACA } from "./coralACA.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof coralACA).toBe("function");
  });
  test("coralACA - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await coralACA(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "coralACA", example.properties.name);
    }
  }, 120_000);
});
