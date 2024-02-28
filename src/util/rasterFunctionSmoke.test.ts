/**
 * @jest-environment node
 * @group smoke
 */
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { rasterFunction } from "./rasterFunction";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof rasterFunction).toBe("function");
  });
  test("rasterFunction - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await rasterFunction(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "rasterFunction", example.properties.name);
    }
  }, 60000);
});
