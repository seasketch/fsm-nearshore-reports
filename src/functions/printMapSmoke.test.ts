/**
 * @jest-environment node
 * @group smoke
 */
import { printMap } from "./printMap.js";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof printMap).toBe("function");
  });
  test("printMapSmoke - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await printMap(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "printMap", example.properties.name);
    }
  }, 120000);
});
