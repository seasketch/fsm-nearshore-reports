/**
 * @vitest-environment node
 */
import Handler from "./ousValueOverlapWorker.js";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";

const ousValueOverlapWorker = Handler.func;

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof ousValueOverlapWorker).toBe("function");
  });
  test("ousValueOverlapWorker - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();
    for (const example of examples) {
      const result = await ousValueOverlapWorker(example, {
        metricGroup: {
          metricId: "ousValueOverlap",
          type: "valueOverlap",
          classes: [
            {
              classId: "ous_aquaculture",
              display: "Aquaculture",
              datasourceId: "ous_aquaculture",
              layerId: "t_GGIk3CD",
            },
            {
              classId: "ous_community_recreational_use",
              display: "Community/Recreational",
              datasourceId: "ous_community_recreational_use",
              layerId: "1HN8AsnYC",
            },
            {
              classId: "ous_construction_infrastructure",
              display: "Construction/Infrastructure",
              datasourceId: "ous_construction_infrastructure",
              layerId: "Bqy5Bd1gF",
            },
            {
              classId: "ous_cultural_use",
              display: "Cultural Use",
              datasourceId: "ous_cultural_use",
              layerId: "2S3RgfSVg",
            },
            {
              classId: "ous_fisheries",
              display: "Fisheries",
              datasourceId: "ous_fisheries",
              layerId: "8p_ow_c5I",
            },
            {
              classId: "ous_maritime_activity",
              display: "Maritime Activity",
              datasourceId: "ous_maritime_activity",
              layerId: "Z2Mc5AAUB",
            },
            {
              classId: "ous_research",
              display: "Research",
              datasourceId: "ous_research",
              layerId: "CnKHPiBXy",
            },
            {
              classId: "ous_tourism",
              display: "Tourism",
              datasourceId: "ous_tourism",
              layerId: "B1MC9XtEH",
            },
            {
              classId: "ous_transportation",
              display: "Transportation",
              datasourceId: "ous_transportation",
              layerId: "WqhqAjWkl",
            },
          ],
        },
        classId: "ous_aquaculture",
        geographyIds: ["kosrae"],
      });
      expect(result).toBeTruthy();
      writeResultOutput(
        result,
        "ousValueOverlapWorker",
        example.properties.name
      );
    }
  }, 60000);
});
