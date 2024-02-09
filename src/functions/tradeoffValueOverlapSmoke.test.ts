/**
 * @jest-environment node
 * @group smoke
 */
import { tradeoffValueOverlap } from "./tradeoffValueOverlap";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof tradeoffValueOverlap).toBe("function");
  });
  test("tradeoffValueOverlapSmoke - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await tradeoffValueOverlap(example);
      expect(result).toBeTruthy();
      writeResultOutput(
        result,
        "tradeoffValueOverlap",
        example.properties.name
      );
    }
  }, 120000);
});
