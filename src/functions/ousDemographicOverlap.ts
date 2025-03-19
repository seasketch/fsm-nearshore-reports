import {
  Sketch,
  GeoprocessingHandler,
  Polygon,
  MultiPolygon,
  ReportResult,
  SketchCollection,
  toNullSketch,
  rekeyMetrics,
  getFirstFromParam,
  genFeatureCollection,
  Nullable,
  Feature,
  FeatureCollection,
  getFeaturesForSketchBBoxes,
  loadFgb,
  toSketchArray,
  clip,
  createMetric,
} from "@seasketch/geoprocessing";
import { clipToGeography } from "../util/clipToGeography.js";
import { Metric, sortMetrics } from "@seasketch/geoprocessing/client-core";
import projectClient from "../../project/projectClient.js";
import { featureCollection, intersect } from "@turf/turf";

export interface OusFeatureProperties {
  resp_id: number;
  weight: number;
  municipality?: Nullable<string>;
  sector?: Nullable<string>;
  gear?: Nullable<string>;
  number_of_ppl: string | number;
}

export type OusFeature = Feature<MultiPolygon | Polygon, OusFeatureProperties>;
export type OusFeatureCollection = FeatureCollection<
  MultiPolygon | Polygon,
  OusFeatureProperties
>;

export interface BaseCountStats {
  respondents: number;
  people: number;
}

export type ClassCountStats = Record<string, BaseCountStats>;

export interface OusStats extends BaseCountStats {
  bySector: ClassCountStats;
  byMunicipality: ClassCountStats;
  byGear: ClassCountStats;
}

export type OusReportResult = {
  stats: OusStats;
  metrics: Metric[];
};

/** Calculate sketch area overlap inside and outside of multiple planning area boundaries */
export async function ousDemographicOverlap(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: { geographyIds: string[]; overlapSketch: boolean },
): Promise<ReportResult> {
  // Use caller-provided geographyId if provided
  const geographyId = getFirstFromParam("geographyIds", extraParams);

  // Get geography features, falling back to geography assigned to default-boundary group
  const curGeography = projectClient.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });

  const clippedSketch = extraParams.overlapSketch
    ? await clipToGeography(sketch, curGeography, {
        tolerance: 0.00001,
      })
    : sketch;

  const url = `${projectClient.dataBucketUrl()}ous_demographics.fgb`;

  const rawShapes = (
    extraParams.overlapSketch
      ? ((await getFeaturesForSketchBBoxes(clippedSketch, url)) as OusFeature[])
      : ((await loadFgb(url)) as OusFeature[])
  ).sort((a, b) => a.properties.resp_id - b.properties.resp_id);

  const shapes = genFeatureCollection(rawShapes) as OusFeatureCollection;

  const combinedSketch = (() => {
    if (extraParams.overlapSketch) {
      const sketches = toSketchArray(
        sketch as
          | Sketch<Polygon | MultiPolygon>
          | SketchCollection<Polygon | MultiPolygon>,
      );
      const sketchColl = featureCollection(sketches);
      return sketch ? clip(sketchColl, "union") : null;
    } else {
      return null;
    }
  })();

  // Track counting of respondent/sector level stats, only need to count once
  const respondentProcessed: Record<string, Record<string, boolean>> = {};

  // Track counting of max represented people for respondent stats
  const maxPeoplePerRespondent: Record<string, number> = {};

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

      let isOverlapping: boolean;
      if (!combinedSketch) {
        isOverlapping = true;
      } else {
        try {
          isOverlapping = !!intersect(
            featureCollection([shape, combinedSketch!]),
          );
          if (!isOverlapping) return statsSoFar;
        } catch {
          console.log(JSON.stringify(shape), JSON.stringify(combinedSketch));
          throw new Error("Error in intersect");
        }
      }
      if (!isOverlapping) return statsSoFar;

      const resp_id = shape.properties.resp_id;
      const respMunicipality = shape.properties.municipality
        ? `${shape.properties.municipality}`
        : "unknown-municipality";
      const curSector: string = shape.properties.sector
        ? shape.properties.sector
        : "unknown-sector";
      const curGears: string[] = shape.properties.gear
        ? shape.properties.gear.split(/\s{2,}/)
        : ["unknown-gear"];

      // Number of people is gathered once per sector
      // So you can only know the total number of people for each sector, not overall
      const curPeople = (() => {
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

      // Mutates
      let newStats: OusStats = { ...statsSoFar };

      // If new respondent
      if (!respondentProcessed[resp_id]) {
        // Add respondent to total respondents
        newStats.respondents = newStats.respondents + 1;
        newStats.people = newStats.people + curPeople;

        // Add new respondent to municipality stats
        newStats.byMunicipality[respMunicipality] = {
          respondents: newStats.byMunicipality[respMunicipality]
            ? newStats.byMunicipality[respMunicipality].respondents + 1
            : 1,
          people: newStats.byMunicipality[respMunicipality]
            ? newStats.byMunicipality[respMunicipality].people + curPeople
            : curPeople,
        };

        respondentProcessed[resp_id] = {};

        // Keep track of # people this respondent represents
        respondentProcessed[resp_id][curPeople] = true;
        maxPeoplePerRespondent[resp_id] = curPeople;
      }

      // If new number of people represented by respondent
      if (!respondentProcessed[resp_id][curPeople]) {
        // If respondent is representing MORE people, add them
        if (maxPeoplePerRespondent[resp_id] < curPeople) {
          const addnPeople = curPeople - maxPeoplePerRespondent[resp_id];
          newStats.people = newStats.people + addnPeople;

          newStats.byMunicipality[respMunicipality] = {
            respondents: newStats.byMunicipality[respMunicipality].respondents,
            people:
              newStats.byMunicipality[respMunicipality].people + addnPeople,
          };

          // Update maxPeoplePerRespondent
          maxPeoplePerRespondent[resp_id] = curPeople;
        }
      }

      // Once per respondent and gear type counts
      curGears.forEach((curGear) => {
        if (!respondentProcessed[resp_id][curGear]) {
          newStats.byGear[curGear] = {
            respondents: newStats.byGear[curGear]
              ? newStats.byGear[curGear].respondents + 1
              : 1,
            people: newStats.byGear[curGear]
              ? newStats.byGear[curGear].people + curPeople
              : curPeople,
          };
          respondentProcessed[resp_id][curGear] = true;
        }
      });

      // Once per respondent and sector counts
      if (!respondentProcessed[resp_id][curSector]) {
        newStats.bySector[curSector] = {
          respondents: newStats.bySector[curSector]
            ? newStats.bySector[curSector].respondents + 1
            : 1,
          people: newStats.bySector[curSector]
            ? newStats.bySector[curSector].people + curPeople
            : curPeople,
        };
        respondentProcessed[resp_id][curSector] = true;
      }

      return newStats;
    },
    {
      respondents: 0,
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
    createMetric({
      metricId: "ousRespondentCount",
      classId: "ousRespondentCount_all",
      value: countStats.respondents,
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

  const metrics = finalMetrics.metrics.map(
    (metric): Metric => ({
      ...metric,
      geographyId: curGeography.geographyId,
    }),
  );

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
    sketch: toNullSketch(sketch, true),
  };
}

/** Generate metrics from OUS class stats */
function genOusClassMetrics<G extends Polygon | MultiPolygon>(
  classStats: ClassCountStats,
  /** optionally calculate stats for OUS shapes that overlap with sketch  */
  sketch?:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
): Metric[] {
  return Object.keys(classStats)
    .map((curClass) => [
      createMetric({
        metricId: "ousPeopleCount",
        classId: curClass,
        value: classStats[curClass].people,
        ...(sketch ? { sketchId: sketch.properties.id } : {}),
      }),
      createMetric({
        metricId: "ousRespondentCount",
        classId: curClass,
        value: classStats[curClass].respondents,
        ...(sketch ? { sketchId: sketch.properties.id } : {}),
      }),
    ])
    .reduce<Metric[]>((soFar, classMetrics) => soFar.concat(classMetrics), []);
}

export default new GeoprocessingHandler(ousDemographicOverlap, {
  title: "ousDemographicOverlap",
  description: "Calculates ous overlap metrics",
  timeout: 900, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  memory: 10240,
  requiresProperties: [],
});
