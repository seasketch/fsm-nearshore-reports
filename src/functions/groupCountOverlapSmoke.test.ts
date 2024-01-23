/**
 * @group smoke
 */
import { groupCountOverlap } from "./groupCountOverlap";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof groupCountOverlap).toBe("function");
  });
  test("groupCountOverlapSmoke - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await groupCountOverlap(example);
      expect(result).toBeTruthy();
      writeResultOutput(result, "groupCountOverlap", example.properties.name);
    }
  });
});
