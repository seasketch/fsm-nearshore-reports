import fs from "fs-extra";
import { rekeyMetrics, genSketchCollection } from "@seasketch/geoprocessing";
import { kosraeOusDemographicOverlap } from "../../src/functions/kosraeOusDemographicOverlap.js";

const DEST_PATH = "kosraeOusDemographicPrecalcTotals.json";

async function main() {
  const metrics = rekeyMetrics(
    (
      await kosraeOusDemographicOverlap(genSketchCollection([]), {
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
