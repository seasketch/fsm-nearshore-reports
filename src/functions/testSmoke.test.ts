import {
  getExamplePolygonSketchAll,
  writeResultOutput,
  polygonPreprocessorSmokeTest,
  getExamplePolygonAllSketchAll,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import { boundaryAreaOverlap } from "./boundaryAreaOverlap.js";
import handler, { clipToOceanNearshore } from "./clipToOceanNearshore.js";
import { coralACA } from "./coralACA.js";
import { depthZones } from "./depthZones.js";
import { groupCountOverlap } from "./groupCountOverlap.js";
import { kosraeOusDemographicOverlap } from "./kosraeOusDemographicOverlap.js";
import { yapOusDemographics } from "./yapOusDemographics.js";
import { printMap } from "./printMap.js";
import { reefGeomorphic } from "./reefGeomorphic.js";
import { seagrassACA } from "./seagrassACA.js";
import { spawnAgg } from "./spawnAgg.js";
import { mangroves } from "./mangroves.js";
import { fad } from "./fad.js";
import { existingMPAs } from "./existingMPAs.js";
import { reefMonitoring } from "./reefMonitoring.js";
import { kosraeOus } from "./kosraeOus.js";
import { yapOus } from "./yapOus.js";
import { faisOus } from "./faisOus.js";
import { woleaiOus } from "./woleaiOus.js";
import { yapProtectedAreas } from "./yapProtectedAreas.js";
import { woleaiOusDemographics } from "./woleaiOusDemographics.js";
import { faisOusDemographics } from "./faisOusDemographics.js";
import { ulithiOus } from "./ulithiOus.js";
import { ulithiOusDemographics } from "./ulithiOusDemographics.js";
import { eauripikOus } from "./eauripikOus.js";
import { eauripikOusDemographics } from "./eauripikOusDemographics.js";
import { elatoOus } from "./elatoOus.js";
import { elatoOusDemographics } from "./elatoOusDemographics.js";
import { faraulepOus } from "./faraulepOus.js";
import { ifalikOus } from "./ifalikOus.js";
import { ifalikOusDemographics } from "./ifalikOusDemographics.js";
import { lamotrekOus } from "./lamotrekOus.js";
import { lamotrekOusDemographics } from "./lamotrekOusDemographics.js";
import { nguluOus } from "./nguluOus.js";
import { nguluOusDemographics } from "./nguluOusDemographics.js";
import { satawalOus } from "./satawalOus.js";
import { satawalOusDemographics } from "./satawalOusDemographics.js";

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
        const examples = await getExamplePolygonAllSketchAll(
          "Ik kwoe (Unicorn Fish) - For Abby",
        );
        for (const example of examples) {
          const result = await functionToTest(example, {
            geographyIds: ["kosrae"],
          });
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
  { name: "kosraeOusDemographicOverlap", func: kosraeOusDemographicOverlap },
  { name: "yapOusDemographics", func: yapOusDemographics },
  { name: "woleaiOusDemographics", func: woleaiOusDemographics },
  { name: "faisOusDemographics", func: faisOusDemographics },
  { name: "ulithiOusDemographics", func: ulithiOusDemographics },
  { name: "eauripikOusDemographics", func: eauripikOusDemographics },
  { name: "elatoOusDemographics", func: elatoOusDemographics },
  { name: "ifalikOusDemographics", func: ifalikOusDemographics },
  { name: "lamotrekOusDemographics", func: lamotrekOusDemographics },
  { name: "nguluOusDemographics", func: nguluOusDemographics },
  { name: "kosraeOus", func: kosraeOus, timeout: 120_000 },
  { name: "yapOus", func: yapOus, timeout: 120_000 },
  { name: "woleaiOus", func: woleaiOus, timeout: 120_000 },
  { name: "faisOus", func: faisOus, timeout: 120_000 },
  { name: "ulithiOus", func: ulithiOus, timeout: 120_000 },
  { name: "faraulepOus", func: faraulepOus, timeout: 120_000 },
  { name: "ifalikOus", func: ifalikOus, timeout: 120_000 },
  { name: "eauripikOus", func: eauripikOus, timeout: 120_000 },
  { name: "elatoOus", func: elatoOus, timeout: 120_000 },
  { name: "lamotrekOus", func: lamotrekOus, timeout: 120_000 },
  { name: "nguluOus", func: nguluOus, timeout: 120_000 },
  { name: "satawalOus", func: satawalOus, timeout: 120_000 },
  { name: "satawalOusDemographics", func: satawalOusDemographics },
  { name: "printMap", func: printMap },
  { name: "reefGeomorphic", func: reefGeomorphic },
  { name: "seagrassACA", func: seagrassACA, timeout: 120_000 },
  { name: "spawnAgg", func: spawnAgg },
  { name: "mangroves", func: mangroves },
  { name: "fad", func: fad },
  { name: "existingMPAs", func: existingMPAs },
  { name: "reefMonitoring", func: reefMonitoring },
  { name: "yapProtectedAreas", func: yapProtectedAreas },
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
