import fs from "fs-extra";
import {
  createMetric,
  loadFgb,
  genFeatureCollection,
  DataClass,
  MetricGroup,
  rekeyMetrics,
  genSketchCollection,
} from "@seasketch/geoprocessing";
import { Metric } from "@seasketch/geoprocessing/client-core";
import path from "path";
import { fileURLToPath } from "url";
import { Geometry } from "geojson";
import projectClient from "../../project/projectClient.js";
import { kosraeOusDemographicOverlap } from "../../src/functions/kosraeOusDemographicOverlap.js";

type ClassCountStats = Record<string, number>;

type OusStatsBase = {
  people: number;
  bySector: ClassCountStats;
  byGear: ClassCountStats;
};

type OusStatsByIsland = OusStatsBase & { byIsland: ClassCountStats };
type OusStatsByMunicipality = OusStatsBase & {
  byMunicipality: ClassCountStats;
};

type OusStats = OusStatsByIsland | OusStatsByMunicipality;

type OusProps = Record<string, unknown> & {
  resp_id?: number | string | null;
  sector?: string | null;
  fishing_method?: string | null;
  number_of_ppl?: number | string | null;
  rep_in_sector?: number | string | null;
  island?: string | null;
  municipality?: string | null;
};

type OusFeature = {
  type: "Feature";
  geometry: Geometry;
  properties: OusProps | null;
};

const BIN_DIR = path.dirname(fileURLToPath(import.meta.url));

function usage(): never {
  const cmd = process.argv[1]?.split("/").pop() || "3-ousDemographicPrecalc.ts";
  // eslint-disable-next-line no-console
  console.error(`Usage: npx tsx ${cmd} <atoll>

Atolls:
  fais | woleai | yap | kosrae
  <any other neighboring-islands atoll like Fais/Woleai>
  
Output:
  Writes <atoll>Precalc.json to data/bin/
`);
  process.exit(2);
}

function parseNumber(val: unknown, fallback: number): number {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function getString(val: unknown): string | undefined {
  if (val === null || val === undefined) return undefined;
  if (typeof val === "string" && val.trim() !== "") return val;
  return undefined;
}

function inc(map: Record<string, number>, key: string, by: number) {
  map[key] = map[key] ? map[key] + by : by;
}

function genOusClassMetrics(classStats: Record<string, number>): Metric[] {
  return Object.keys(classStats).map((curClass) =>
    createMetric({
      metricId: "ousPeopleCount",
      classId: curClass,
      value: classStats[curClass],
    }),
  );
}

type NonKosraeConfig = {
  atoll: string;
  outputBase: string;
  fgbFilename: string;
  destFilename: string;
  groupKey: "island" | "municipality";
  unknownGroupClassId: string;
  metricIds: {
    overall: string;
    sector: string;
    group: string;
    gear: string;
  };
};

function getNonKosraeConfig(atollRaw: string): NonKosraeConfig {
  const atoll = atollRaw.trim();
  switch (atoll) {
    case "fais":
      return {
        atoll,
        outputBase: "faisOusDemographics",
        fgbFilename: "faisOusDemographics.fgb",
        destFilename: "faisPrecalc.json",
        groupKey: "island",
        unknownGroupClassId: "unknown-island",
        metricIds: {
          overall: "faisOusOverallDemog",
          sector: "faisOusSectorDemog",
          group: "faisOusIslandDemog",
          gear: "faisOusGearDemog",
        },
      };
    case "woleai":
      return {
        atoll,
        outputBase: "woleaiOusDemographics",
        fgbFilename: "woleaiOusDemographics.fgb",
        destFilename: "woleaiPrecalc.json",
        groupKey: "island",
        unknownGroupClassId: "unknown-island",
        metricIds: {
          overall: "woleaiOusOverallDemog",
          sector: "woleaiOusSectorDemog",
          group: "woleaiOusIslandDemog",
          gear: "woleaiOusGearDemog",
        },
      };
    case "yap":
      return {
        atoll,
        outputBase: "yapOusDemographics",
        fgbFilename: "yapOusDemographics.fgb",
        destFilename: "yapPrecalc.json",
        groupKey: "municipality",
        unknownGroupClassId: "unknown-municipality",
        metricIds: {
          overall: "yapOusOverallDemog",
          sector: "yapOusSectorDemog",
          group: "yapOusMunicipalityDemog",
          gear: "yapOusGearDemog",
        },
      };
    default: {
      // Default behavior for atolls that follow the Fais/Woleai neighboring-islands schema.
      const outputBase = `${atoll}OusDemographics`;
      const prefix = `${atoll}Ous`;
      return {
        atoll,
        outputBase,
        fgbFilename: `${outputBase}.fgb`,
        destFilename: `${atoll}Precalc.json`,
        groupKey: "island",
        unknownGroupClassId: "unknown-island",
        metricIds: {
          overall: `${prefix}OverallDemog`,
          sector: `${prefix}SectorDemog`,
          group: `${prefix}IslandDemog`,
          gear: `${prefix}GearDemog`,
        },
      };
    }
  }
}

async function runNonKosrae(atoll: string) {
  const cfg = getNonKosraeConfig(atoll);
  const url = `${projectClient.dataBucketUrl()}${cfg.fgbFilename}`;
  const destPath = path.join(BIN_DIR, cfg.destFilename);

  const rawShapes = (await loadFgb(url)) as unknown as OusFeature[];
  const shapes = genFeatureCollection(rawShapes) as unknown as {
    features: OusFeature[];
  };

  // Track counting of respondent/sector level stats, only need to count once
  const respondentProcessed: Record<string, Record<string, boolean>> = {};

  const countStats = shapes.features.reduce<OusStats>(
    (statsSoFar, shape) => {
      const props = shape.properties || undefined;
      const respId = props?.resp_id;
      if (!respId) return statsSoFar;

      const resp_id = `${respId}`;
      const curSector = getString(props?.sector) ?? "unknown-sector";
      const curGears = getString(props?.fishing_method)
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean) ?? ["unknown-gear"];

      const groupVal = (() => {
        const raw = props?.[cfg.groupKey];
        const s = getString(raw);
        return s ? s : cfg.unknownGroupClassId;
      })();

      // Total people per respondent and people-per-sector (rep_in_sector) are used differently
      const overallPeople = parseNumber(props?.number_of_ppl, 1);
      const curPeople = parseNumber(props?.rep_in_sector, 1);

      const newStats: OusStats = { ...statsSoFar } as OusStats;

      // New respondent
      if (!respondentProcessed[resp_id]) {
        newStats.people = newStats.people + overallPeople;
        if ("byIsland" in newStats)
          inc(newStats.byIsland, groupVal, overallPeople);
        if ("byMunicipality" in newStats)
          inc(newStats.byMunicipality, groupVal, overallPeople);
        respondentProcessed[resp_id] = {};
      }

      // Once per respondent and gear type counts
      curGears.forEach((curGear) => {
        if (!respondentProcessed[resp_id][curGear]) {
          inc(newStats.byGear, curGear, curPeople);
          respondentProcessed[resp_id][curGear] = true;
        }
      });

      // Once per respondent and sector counts
      if (!respondentProcessed[resp_id][curSector]) {
        inc(newStats.bySector, curSector, curPeople);
        respondentProcessed[resp_id][curSector] = true;
      }

      return newStats;
    },
    cfg.groupKey === "island"
      ? ({
          people: 0,
          bySector: {},
          byIsland: {},
          byGear: {},
        } satisfies OusStatsByIsland)
      : ({
          people: 0,
          bySector: {},
          byMunicipality: {},
          byGear: {},
        } satisfies OusStatsByMunicipality),
  );

  const overallMetrics = [
    createMetric({
      metricId: "ousPeopleCount",
      classId: "ousPeopleCount_all",
      value: countStats.people,
    }),
  ];

  const sectorMetrics = genOusClassMetrics(countStats.bySector);
  const gearMetrics = genOusClassMetrics(countStats.byGear);
  const groupStats =
    cfg.groupKey === "island"
      ? (countStats as OusStatsByIsland).byIsland
      : (countStats as OusStatsByMunicipality).byMunicipality;
  const groupMetrics = genOusClassMetrics(groupStats);

  const metrics = [
    ...overallMetrics,
    ...sectorMetrics,
    ...groupMetrics,
    ...gearMetrics,
  ];

  await fs.writeFile(destPath, JSON.stringify(metrics, null, 2));
  // eslint-disable-next-line no-console
  console.log(`Successfully wrote ${destPath}`);

  // Print MetricGroups for easy copy/paste into project/metrics.json when adding new atolls
  const overallGroup: MetricGroup = {
    metricId: cfg.metricIds.overall,
    type: "countOverlap",
    classes: [
      {
        classId: "ousPeopleCount_all",
        display: "Total",
        datasourceId: cfg.fgbFilename,
        layerId: "",
      },
    ],
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(overallGroup));

  const sectorGroup: MetricGroup = {
    metricId: cfg.metricIds.sector,
    type: "countOverlap",
    classes: Object.keys(countStats.bySector).map(
      (name): DataClass => ({
        classId: name,
        display: name,
        datasourceId: cfg.fgbFilename,
        layerId: "",
      }),
    ),
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(sectorGroup));

  const groupGroup: MetricGroup = {
    metricId: cfg.metricIds.group,
    type: "countOverlap",
    classes: Object.keys(groupStats)
      .sort((a, b) => a.localeCompare(b))
      .map(
        (name): DataClass => ({
          classId: name,
          display: name,
          datasourceId: cfg.fgbFilename,
          layerId: "",
        }),
      )
      .concat({
        classId: cfg.unknownGroupClassId,
        display: "Unknown",
        datasourceId: cfg.fgbFilename,
        layerId: "",
      }),
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(groupGroup));

  const gearGroup: MetricGroup = {
    metricId: cfg.metricIds.gear,
    type: "countOverlap",
    classes: Object.keys(countStats.byGear)
      .sort((a, b) => a.localeCompare(b))
      .map(
        (name): DataClass => ({
          classId: name,
          display: name[0] ? name[0].toUpperCase() + name.substring(1) : name,
          datasourceId: cfg.fgbFilename,
          layerId: "",
        }),
      ),
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(gearGroup));
}

async function runKosrae() {
  const destPath = path.join(BIN_DIR, "kosraePrecalc.json");
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
  await fs.writeFile(destPath, JSON.stringify(metrics, null, 2));
  // eslint-disable-next-line no-console
  console.log(`Successfully wrote ${destPath}`);
}

export async function runOusDemographicPrecalc(atollRaw: string) {
  const atoll = atollRaw.trim();
  if (!atoll) usage();
  if (atoll === "kosrae") return runKosrae();
  return runNonKosrae(atoll);
}

async function main() {
  const atoll = process.argv[2];
  if (!atoll) usage();
  await runOusDemographicPrecalc(atoll);
}

main();
