import fs from "fs-extra";
import {
  createMetric,
  loadFgb,
  genFeatureCollection,
  DataClass,
  MetricGroup,
} from "@seasketch/geoprocessing";
import projectClient from "../../project/projectClient.js";
import {
  genOusClassMetrics,
  OusFeature,
  OusFeatureCollection,
  OusStats,
} from "../../src/functions/woleaiOusDemographics.js";

const DEST_PATH = "woleaiOusDemographicPrecalcTotals.json";
const filename = "woleaiOusDemographics.fgb";

async function main() {
  const url = `${projectClient.dataBucketUrl()}woleaiOusDemographics.fgb`;

  const rawShapes = await loadFgb<OusFeature>(url);
  const shapes = genFeatureCollection(rawShapes) as OusFeatureCollection;

  // Track counting of respondent/sector level stats, only need to count once
  const respondentProcessed: Record<string, Record<string, boolean>> = {};

  const countStats = shapes.features.reduce<OusStats>(
    (statsSoFar: OusStats, shape: OusFeature) => {
      if (!shape.properties) {
        console.log(`Shape missing properties ${JSON.stringify(shape)}`);
      }

      if (!shape.properties.resp_id) {
        console.log(
          `Missing respondent ID for ${JSON.stringify(shape)}, skipping`,
        );
        return statsSoFar;
      }

      const resp_id = shape.properties.resp_id;
      const island = shape.properties.island
        ? `${shape.properties.island}`
        : "unknown-island";
      const curSector: string = shape.properties.sector
        ? shape.properties.sector
        : "unknown-sector";
      const curGears: string[] = shape.properties.fishing_method
        ? shape.properties.fishing_method
            .split(",")
            .map((s: string) => s.trim())
        : ["unknown-gear"];

      // Number of people is gathered once per sector
      // So you can only know the total number of people for each sector, not overall
      const overallPeople = (() => {
        const peopleVal = shape.properties["number_of_ppl"];
        if (peopleVal !== null && peopleVal !== undefined) {
          if (typeof peopleVal === "string") {
            return parseFloat(peopleVal);
          } else {
            return peopleVal;
          }
        } else {
          return 1;
        }
      })();
      const curPeople = (() => {
        const peopleVal = shape.properties["rep_in_sector"];
        if (peopleVal !== null && peopleVal !== undefined) {
          if (typeof peopleVal === "string") {
            return parseFloat(peopleVal);
          } else {
            return peopleVal;
          }
        } else {
          return 1;
        }
      })();

      // Mutates
      let newStats: OusStats = { ...statsSoFar };

      // New respondent
      if (!respondentProcessed[resp_id]) {
        // Add respondent to total respondents
        newStats.people = newStats.people + overallPeople;

        // Add new respondent to island stats
        newStats.byIsland[island] = newStats.byIsland[island]
          ? newStats.byIsland[island] + overallPeople
          : overallPeople;

        respondentProcessed[resp_id] = {};
      }

      // Once per respondent and gear type counts
      curGears.forEach((curGear) => {
        if (!respondentProcessed[resp_id][curGear]) {
          newStats.byGear[curGear] = newStats.byGear[curGear]
            ? newStats.byGear[curGear] + curPeople
            : curPeople;
          respondentProcessed[resp_id][curGear] = true;
        }
      });

      // Once per respondent and sector counts
      if (!respondentProcessed[resp_id][curSector]) {
        newStats.bySector[curSector] = newStats.bySector[curSector]
          ? newStats.bySector[curSector] + curPeople
          : curPeople;
        respondentProcessed[resp_id][curSector] = true;
      }

      return newStats;
    },
    {
      people: 0,
      bySector: {},
      byIsland: {},
      byGear: {},
    },
  );

  // calculate sketch % overlap - divide sketch counts by total counts
  const overallMetrics = [
    createMetric({
      metricId: "ousPeopleCount",
      classId: "ousPeopleCount_all",
      value: countStats.people,
    }),
  ];

  const sectorMetrics = genOusClassMetrics(countStats.bySector);
  const islandMetrics = genOusClassMetrics(countStats.byIsland);
  const gearMetrics = genOusClassMetrics(countStats.byGear);

  const finalMetrics = {
    stats: countStats,
    metrics: [
      ...overallMetrics,
      ...sectorMetrics,
      ...islandMetrics,
      ...gearMetrics,
    ],
  };

  await fs.writeFile(DEST_PATH, JSON.stringify(finalMetrics.metrics, null, 2));
  console.log(`Successfully wrote ${DEST_PATH}`);

  const ousOverallClasses: DataClass[] = [
    {
      classId: "ousPeopleCount_all",
      display: "Total",
      datasourceId: filename,
      layerId: "",
    },
  ];

  const ousOverallDemographicDataGroup = {
    classes: ousOverallClasses,
  };
  const ousOverallDemographicOverlap: MetricGroup = {
    metricId: "woleaiOusOverallDemog",
    type: "countOverlap",
    ...ousOverallDemographicDataGroup,
  };

  console.log(JSON.stringify(ousOverallDemographicOverlap));

  const ousSectorClasses: DataClass[] = Object.keys(
    finalMetrics.stats.bySector,
  ).map(nameToClass);

  const ousSectorDemographicDataGroup = {
    classes: ousSectorClasses,
  };
  const ousSectorDemographicOverlap: MetricGroup = {
    metricId: "woleaiOusSectorDemog",
    type: "countOverlap",
    ...ousSectorDemographicDataGroup,
  };

  console.log(JSON.stringify(ousSectorDemographicOverlap));

  const ousIslandClasses: DataClass[] = Object.keys(finalMetrics.stats.byIsland)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      classId: name,
      display: name,
      datasourceId: filename,
      layerId: "",
    }))
    .concat({
      classId: "unknown-island",
      display: "Unknown",
      datasourceId: filename,
      layerId: "",
    });
  const ousCommunityDemographicDataGroup = {
    classes: ousIslandClasses,
  };
  const ousCommunityDemographicOverlap: MetricGroup = {
    metricId: "woleaiOusIslandDemog",
    type: "countOverlap",
    ...ousCommunityDemographicDataGroup,
  };

  console.log(JSON.stringify(ousCommunityDemographicOverlap));

  const ousGearClasses: DataClass[] = Object.keys(finalMetrics.stats.byGear)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      classId: name,
      display: name[0].toUpperCase() + name.substring(1),
      datasourceId: filename,
      layerId: "",
    }));

  const ousGearDemographicDataGroup = {
    classes: ousGearClasses,
  };
  const ousGearDemographicOverlap: MetricGroup = {
    metricId: "woleaiOusGearDemog",
    type: "countOverlap",
    ...ousGearDemographicDataGroup,
  };

  console.log(JSON.stringify(ousGearDemographicOverlap));
}

main();

function nameToClass(name: string): DataClass {
  return {
    classId: name,
    display: name,
    datasourceId: filename,
    layerId: "",
  };
}
