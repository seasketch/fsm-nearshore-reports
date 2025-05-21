import fs from "fs-extra";
import { ousDemographicOverlap } from "../../src/functions/ousDemographicOverlap.js";
import {
  rekeyMetrics,
  genSketchCollection,
} from "@seasketch/geoprocessing";

const DEST_PATH = "ousDemographicPrecalcTotals.json";

async function main() {
  const metrics = rekeyMetrics(
    (
      await ousDemographicOverlap(genSketchCollection([]), {
        geographyIds: [],
        overlapSketch: false,
      })
    ).metrics.map((metric) => ({
      ...metric,
      sketchId: null,
      geographyId: null,
    })),
  );

  await fs.writeFile(DEST_PATH, JSON.stringify(metrics, null, 2));
  console.log(`Successfully wrote ${DEST_PATH}`);
}

main();
