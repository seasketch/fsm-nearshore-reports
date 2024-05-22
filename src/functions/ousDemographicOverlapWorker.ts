import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  getFirstFromParam,
  DefaultExtraParams,
  splitSketchAntimeridian,
  getFlatGeobufPath,
  clip,
  createMetric,
  Metric,
  toSketchArray,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import { clipToGeography } from "../util/clipToGeography.js";
import {
  OusFeature,
  OusFeatureCollection,
  ClassCountStats,
  OusStats,
} from "../util/overlapOusDemographic.js";
import { fgbFetchAll } from "@seasketch/geoprocessing/dataproviders";
import { featureCollection } from "@turf/helpers";
import intersect from "@turf/intersect";

export interface OusDemographicExtraParams extends DefaultExtraParams {
  /** Starting shape index, defaults to 0 */
  startIndex?: number;
  /** Ending shape index.  If not defined, will use last */
  endIndex?: number;
}

// This function is designed to be a building block for other geoprocessing functions
// It is not intended to be called directly by the client
// Rather a parent geoprocessing function should invoke the worker function's lambda using the aws-sdk Lambda.invoke API

async function ousDemographicOverlapChild(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: OusDemographicExtraParams = { startIndex: 0 }
) {
  const sh = await fgbFetchAll<OusFeature>(
    getFlatGeobufPath(project.dataBucketUrl(), "ous_demographics")
  );
  const sortedShapes = sh.sort(
    (a, b) => a.properties.resp_id - b.properties.resp_id
  );

  const sIndex = extraParams.startIndex;
  const eIndex = extraParams.endIndex || sh.length - 1;
  const shapes = sortedShapes.slice(sIndex, eIndex);

  const result = (
    await overlapOusDemographicWorker(
      featureCollection(shapes) as OusFeatureCollection,
      sketch
    )
  );

  return result;
}

/**
  Calculates demographics of ocean use within a sketch. This function is specific to the 
  OUS Demographics Survey conducted in Kosrae. Each shape in 'shapes' contains the
  following information:
  - Respondent ID - unique, anonymous Id used to identify a respondent
  - Municipality - one assigned municipality value per respondent
  - Sector - one respondent can draw shapes for multiple sectors
  - Gear - one or more per shape (list where each element separated by 3 spaces), 
  answered by respondent per shape
  - Number of people - one respondent can represented different numbers of people for 
  different sectors. Therefore we keep track of maximum number of people represented per
  respondent ID and use that for total number of people represented in the survey and number of 
  people represented for each municipality. (i.e. if a single respondondent represents 3 people 
  for touristic fishing and 5 people for commercial fishing, 5 people total are counted 
  as being represented). This means number_of_ppl is an approximation.
 */
async function overlapOusDemographicWorker(
  /** ous shape polygons */
  shapes: OusFeatureCollection,
  /** optionally calculate stats for OUS shapes that overlap with sketch  */
  sketch?:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
) {
  // combine into multipolygon
  const combinedSketch = (() => {
    if (sketch) {
      const sketches = toSketchArray(
        sketch as
          | Sketch<Polygon | MultiPolygon>
          | SketchCollection<Polygon | MultiPolygon>
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
    (statsSoFar, shape) => {
      if (!shape.properties) {
        console.log(`Shape missing properties ${JSON.stringify(shape)}`);
      }

      if (!shape.properties.resp_id) {
        console.log(
          `Missing respondent ID for ${JSON.stringify(shape)}, skipping`
        );
        return statsSoFar;
      }

      const isOverlapping = combinedSketch
        ? !!intersect(featureCollection([shape, combinedSketch]))
        : false; // booleanOverlap seemed to miss some so using intersect
      if (sketch && !isOverlapping) return statsSoFar;

      const resp_id = shape.properties.resp_id;
      const respMunicipality = shape.properties.municipality
        ? `${shape.properties.municipality}`
        : "unknown-municipality";
      const curSector = shape.properties.sector
        ? shape.properties.sector
        : "unknown-sector";
      const curGears = shape.properties.gear
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
    }
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
    sketch
  );
  const gearMetrics = genOusClassMetrics(countStats.byGear, sketch);

  return {
    stats: countStats,
    metrics: [
      ...overallMetrics,
      ...sectorMetrics,
      ...municipalityMetrics,
      ...gearMetrics,
    ],
  };
}

/** Generate metrics from OUS class stats */
function genOusClassMetrics<G extends Polygon | MultiPolygon>(
  classStats: ClassCountStats,
  /** optionally calculate stats for OUS shapes that overlap with sketch  */
  sketch?:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>
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

export default new GeoprocessingHandler(ousDemographicOverlapChild, {
  title: "ousDemographicOverlapChild",
  description: "",
  timeout: 60, // seconds
  memory: 1024, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
