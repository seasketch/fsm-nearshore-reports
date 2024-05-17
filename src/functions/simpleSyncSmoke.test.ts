/**
 * @jest-environment node
 * @group smoke
 */
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { simpleSync } from "./simpleSync.js";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof simpleSync).toBe("function");
  });
  test("simpleSync - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await simpleSync(example, {
        geographyIds: ["geog1", "geog2"],
      });
      expect(result).toBeTruthy();
      writeResultOutput(result, "simpleSync", example.properties.name);
    }
  }, 60000);
});
