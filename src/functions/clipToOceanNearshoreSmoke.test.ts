/**
 * @vitest-environment node
 */
import handler, { clipToOceanNearshore } from "./clipToOceanNearshore.js";
import { polygonPreprocessorSmokeTest } from "@seasketch/geoprocessing/scripts/testing";

polygonPreprocessorSmokeTest(clipToOceanNearshore, handler.options.title, {
  timeout: 20000,
  debug: true,
});
