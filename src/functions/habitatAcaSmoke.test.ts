import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { habitatAca } from "./habitatAca.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof habitatAca).toBe("function");
  });
  test("habitatAca - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await habitatAca(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "habitatAca", example.properties.name);
    }
  }, 120_000);
});
