import {
  getExamplePolygonSketchAll,
  writeResultOutput,
  polygonPreprocessorSmokeTest,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { boundaryAreaOverlap } from "./boundaryAreaOverlap.js";
import handler, { clipToOceanNearshore } from "./clipToOceanNearshore.js";
import { coralACA } from "./coralACA.js";
import { depthZones } from "./depthZones.js";
import { groupCountOverlap } from "./groupCountOverlap.js";
import { ousDemographicOverlap } from "./ousDemographicOverlap.js";
import { ousValueOverlap } from "./ousValueOverlap.js";
import { printMap } from "./printMap.js";
import { reefGeomorphic } from "./reefGeomorphic.js";
import { seagrassACA } from "./seagrassACA.js";
import { spawnAgg } from "./spawnAgg.js";
import { mangroves } from "./mangroves.js";
import { fad } from "./fad.js";
import { existingMPAs } from "./existingMPAs.js";
import { reefMonitoring } from "./reefMonitoring.js";

// Standard smoke tests
function createSmokeTest(
  functionName: string,
  functionToTest: Function,
  timeout: number = 60_000,
) {
  describe(functionName, () => {
    test("handler function is present", () => {
      expect(typeof functionToTest).toBe("function");
    });

    test(
      `${functionName} - tests run against all examples`,
      async () => {
        const examples = await getExamplePolygonSketchAll();
        for (const example of examples) {
          const result = await functionToTest(example);
          expect(result).toBeTruthy();
          writeResultOutput(result, functionName, example.properties.name);
        }
      },
      timeout,
    );
  });
}

const tests = [
  { name: "boundaryAreaOverlap", func: boundaryAreaOverlap },
  { name: "coralACA", func: coralACA, timeout: 120_000 },
  { name: "depthZones", func: depthZones },
  { name: "groupCountOverlap", func: groupCountOverlap },
  { name: "ousDemographicOverlap", func: ousDemographicOverlap },
  { name: "ousValueOverlap", func: ousValueOverlap },
  { name: "printMap", func: printMap },
  { name: "reefGeomorphic", func: reefGeomorphic },
  { name: "seagrassACA", func: seagrassACA, timeout: 120_000 },
  { name: "spawnAgg", func: spawnAgg },
  { name: "mangroves", func: mangroves },
  { name: "fad", func: fad },
  { name: "existingMPAs", func: existingMPAs },
  { name: "reefMonitoring", func: reefMonitoring },
];

tests.forEach(({ name, func, timeout }) => {
  createSmokeTest(name, func, timeout);
});

// clipToOceanNearshore - preprocessor
describe("clipToOceanNearshore", () => {
  test("clipToOceanNearshore", async () => {
    polygonPreprocessorSmokeTest(clipToOceanNearshore, handler.options.title, {
      timeout: 20000,
      debug: false,
    });
  }, 20000);
});
