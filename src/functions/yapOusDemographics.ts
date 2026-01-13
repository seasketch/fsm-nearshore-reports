import {
  Sketch,
  GeoprocessingHandler,
  Polygon,
  MultiPolygon,
  ReportResult,
  SketchCollection,
  genFeatureCollection,
  Nullable,
  Feature,
  FeatureCollection,
  getFeaturesForSketchBBoxes,
  toSketchArray,
  clip,
  createMetric,
  getFirstFromParam,
} from "@seasketch/geoprocessing";
import {
  DefaultExtraParams,
  Metric,
} from "@seasketch/geoprocessing/client-core";
import projectClient from "../../project/projectClient.js";
import { booleanIntersects } from "@turf/turf";
import { clipToGeography } from "../util/clipToGeography.js";

export interface OusFeatureProperties {
  resp_id: number;
  sector?: Nullable<string>;
  municipality?: Nullable<string>;
  fishing_method?: Nullable<string>;
  number_of_ppl: string | number;
  rep_in_sector: string | number;
}

export type OusFeature = Feature<MultiPolygon | Polygon, OusFeatureProperties>;
export type OusFeatureCollection = FeatureCollection<
  MultiPolygon | Polygon,
  OusFeatureProperties
>;

export type ClassCountStats = Record<string, number>;

export interface OusStats {
  people: number;
  bySector: ClassCountStats;
  byMunicipality: ClassCountStats;
  byGear: ClassCountStats;
}

export type OusReportResult = {
  stats: OusStats;
  metrics: Metric[];
};

/** Calculate sketch area overlap inside and outside of multiple planning area boundaries */
export async function yapOusDemographics(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
): Promise<ReportResult> {
  // Clip sketch to geography
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = projectClient.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
  const clippedSketch = await clipToGeography(sketch, curGeography);
  const combinedSketch = (() => {
    const sketches = toSketchArray(
      clippedSketch as
        | Sketch<Polygon | MultiPolygon>
        | SketchCollection<Polygon | MultiPolygon>,
    );
    const sketchColl = genFeatureCollection(sketches);
    return clippedSketch ? clip(sketchColl, "union") : null;
  })();

  // Load OUS shapes
  const url = `${projectClient.dataBucketUrl()}yapOusDemographics.fgb`;
  const rawShapes = (await getFeaturesForSketchBBoxes(
    clippedSketch,
    url,
  )) as OusFeature[];
  const shapes = genFeatureCollection(rawShapes) as OusFeatureCollection;

  // Tracking which respondents have been processed
  const respondentProcessed: Record<string, Record<string, boolean>> = {};
  // Track current number of people represented by each respondent
  const pplPerRespondent: Record<string, number> = {};

  // Process OUS shapes
  const countStats = shapes.features.reduce<OusStats>(
    (statsSoFar: OusStats, shape: OusFeature) => {
      // Skip and log malformed OUS shapes
      if (
        !shape.properties ||
        !shape.properties.resp_id ||
        shape.properties.number_of_ppl == null ||
        shape.properties.rep_in_sector == null
      ) {
        console.log(`Malformed shape: ${JSON.stringify(shape)}`);
        return statsSoFar;
      }

      // Skip OUS shapes that do not overlap with the sketch
      if (combinedSketch && !booleanIntersects(shape, combinedSketch))
        return statsSoFar;

      // Extract properties from OUS shape
      // resp_id, totalPeople, and municipality are consistent across a respondent's shapes
      // curPeople, curSector, and curGears are consistent within a sector per respondent, but not across sectors
      const resp_id = shape.properties.resp_id;
      const totalPpl = Number(shape.properties.number_of_ppl);
      const municipality: string = shape.properties.municipality
        ? shape.properties.municipality
        : "unknown-municipality";
      const curPpl = Number(shape.properties.rep_in_sector);
      const curSector: string = shape.properties.sector
        ? shape.properties.sector
        : "unknown-sector";
      const curGears: string[] = shape.properties.fishing_method
        ? shape.properties.fishing_method
            .split(",")
            .map((s: string) => s.trim())
        : ["unknown-gear"];

      // Updated stats object
      let newStats: OusStats = { ...statsSoFar };

      // If new respondent
      if (!respondentProcessed[resp_id]) {
        // Add respondent to total respondents
        newStats.people = newStats.people + curPpl;

        // Add new respondent to municipality stats
        newStats.byMunicipality[municipality] = newStats.byMunicipality[
          municipality
        ]
          ? newStats.byMunicipality[municipality] + curPpl
          : curPpl;

        // Respondent processed
        respondentProcessed[resp_id] = {};

        // Keep track of # people this respondent is currently representing
        respondentProcessed[resp_id][curPpl] = true;
        pplPerRespondent[resp_id] = curPpl;
      }

      // If new number of people represented by respondent, add them (up to total)
      if (!respondentProcessed[resp_id][curPpl]) {
        // Calculate new number of people represented by respondent (up to total)
        let newPplCount = 0;
        const sum = pplPerRespondent[resp_id] + curPpl;
        if (sum > totalPpl) {
          newPplCount = totalPpl;
        } else {
          newPplCount = sum;
        }

        // Calculate additional number to add across stats
        const addnPeople = newPplCount - pplPerRespondent[resp_id];

        // Adjust totals across stats
        newStats.people += addnPeople;
        newStats.byMunicipality[municipality] += addnPeople;
        pplPerRespondent[resp_id] = newPplCount;
        respondentProcessed[resp_id][curPpl] = true;
      }

      // Count sectors once per respondent (# ppl is consistent within sector per respondent)
      if (!respondentProcessed[resp_id][curSector]) {
        newStats.bySector[curSector] = newStats.bySector[curSector]
          ? newStats.bySector[curSector] + curPpl
          : curPpl;
        respondentProcessed[resp_id][curSector] = true;
      }

      // Count gear types once per respondent (# ppl is consistent within fishing sector per respondent)
      curGears.forEach((curGear) => {
        if (!respondentProcessed[resp_id][curGear]) {
          newStats.byGear[curGear] = newStats.byGear[curGear]
            ? newStats.byGear[curGear] + curPpl
            : curPpl;
          respondentProcessed[resp_id][curGear] = true;
        }
      });

      return newStats;
    },
    {
      people: 0,
      bySector: {},
      byMunicipality: {},
      byGear: {},
    },
  );

  // calculate sketch % overlap - divide sketch counts by total counts
  const overallMetrics = [
    createMetric({
      metricId: "ousPeopleCount",
      classId: "ousPeopleCount_all",
      value: countStats.people,
      ...(sketch ? { sketchId: sketch.properties.id } : {}),
    }),
  ];

  const sectorMetrics = genOusClassMetrics(countStats.bySector, sketch);
  const municipalityMetrics = genOusClassMetrics(
    countStats.byMunicipality,
    sketch,
  );
  const gearMetrics = genOusClassMetrics(countStats.byGear, sketch);

  const finalMetrics = {
    stats: countStats,
    metrics: [
      ...overallMetrics,
      ...sectorMetrics,
      ...municipalityMetrics,
      ...gearMetrics,
    ],
  };

  return finalMetrics;
}

/** Generate metrics from OUS class stats */
export function genOusClassMetrics(
  classStats: ClassCountStats,
  sketch?:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
): Metric[] {
  return Object.keys(classStats)
    .map((curClass) => [
      createMetric({
        metricId: "ousPeopleCount",
        classId: curClass,
        value: classStats[curClass],
        ...(sketch ? { sketchId: sketch.properties.id } : {}),
      }),
    ])
    .reduce<Metric[]>((soFar, classMetrics) => soFar.concat(classMetrics), []);
}

export default new GeoprocessingHandler(yapOusDemographics, {
  title: "yapOusDemographics",
  description: "Calculates ous overlap metrics",
  timeout: 900,
  executionMode: "async",
  memory: 10240,
  requiresProperties: [],
});
