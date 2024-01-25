/**
 * @jest-environment node
 * @group smoke
 */
import { habitatAreaOverlap } from "./habitatAreaOverlap";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof habitatAreaOverlap).toBe("function");
  });
  test("habitatAreaOverlapSmoke - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await habitatAreaOverlap(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "habitatAreaOverlap", example.properties.name);
    }
  }, 120000);
});
