/**
 * @jest-environment node
 * @group smoke
 */
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { vectorFunction } from "./vectorFunction";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof vectorFunction).toBe("function");
  });
  test("vectorFunction - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await vectorFunction(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "vectorFunction", example.properties.name);
    }
  }, 60000);
});
