import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { seagrassACA } from "./seagrassACA.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof seagrassACA).toBe("function");
  });
  test("seagrassACA - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await seagrassACA(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "seagrassACA", example.properties.name);
    }
  }, 120_000);
});
