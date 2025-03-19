import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { printMap } from "./printMap.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof printMap).toBe("function");
  });
  test("printMap - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await printMap(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "printMap", example.properties.name);
    }
  }, 1_000);
});
