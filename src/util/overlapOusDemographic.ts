import {
  Feature,
  Polygon,
  FeatureCollection,
  Metric,
  MultiPolygon,
  Nullable,
  Sketch,
  SketchCollection,
  GeoprocessingTask,
  GeoprocessingTaskStatus,
  GeoprocessingRequestParams,
  genTaskCacheKey,
  GeoprocessingRequestModel,
} from "@seasketch/geoprocessing";
import {
  OusDemographicExtraParams,
  ousDemographicOverlapChild,
} from "../functions/ousDemographicOverlapWorker.js";
import awsSdk from "aws-sdk";
import {
  parseLambdaOUSResponse,
  parseLambdaResponse,
  runLambdaWorker,
} from "./lambdaHelpers.js";

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

/**
  Calculates demographics of ocean use within a sketch

  Weight - includes 0-100 normalized and also unnormalized up to 4500
  Municipality - one assigned municipality value per respondent
  Sector - one per respondent, except for bait fishing, which is only/also asked if tuna fishing is selected by respondent
  Gear - one or more per shape (list where each element separated by 3 spaces), answered by respondent per shape
  Number of people - answered once per respondent, gets joined in from respondents csv to each shape.  This means it's answered effectively once per sector, except for bait fishing.

  What this means we can do with the data:
  * number of respondents (unique respondent_id's) is not equal to number of people surveyed.  Someone could respond to the survey multiples times, for a different sector each time
    * The names of the people and their municipality can be used to better uniquely identify people but also not perfect.  This report doesn't attempt to use names
  * number_of_ppl is therefore also an approximation.
 */
export async function overlapOusDemographic(
  /** ous shape polygons */
  shapes: OusFeatureCollection,
  /** optionally calculate stats for OUS shapes that overlap with sketch  */
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  request?: GeoprocessingRequestModel<Polygon | MultiPolygon>
) {
  if (!request) {
    throw new Error("No request parameters provided to function");
  }

  // Sort by respondent_id
  const sortedShapes = shapes.features.sort(
    (a, b) => a.properties.resp_id - b.properties.resp_id
  );

  // Calculate start and end index for each lambda to
  // process shapes in parallel
  const numWorkers = 10;
  const workerParams: OusDemographicExtraParams[] = [];
  let sIndex = 0; // Starting shapes index for worker
  let eIndex = 0; // Ending shapes index for worker
  for (
    let index = Math.ceil(sortedShapes.length / numWorkers);
    index <= Math.ceil(sortedShapes.length / numWorkers) * numWorkers;
    index += Math.ceil(sortedShapes.length / numWorkers)
  ) {
    if (index === Math.ceil(sortedShapes.length / numWorkers) * numWorkers) {
      // If last worker group
      workerParams.push({
        startIndex: sIndex,
        endIndex: sortedShapes.length - 1,
      });
    } else {
      // All others cases
      eIndex = index;
      while (
        sortedShapes[eIndex].properties.resp_id ===
        sortedShapes[index - 1].properties.resp_id
      ) {
        // Don't split a respondent's shapes into multiple workers or they are double-counted
        eIndex++;
      }
      workerParams.push({
        startIndex: sIndex,
        endIndex: eIndex,
      });
      sIndex = eIndex;
    }
  }

  const lambdaResults = await Promise.all(
    workerParams.map(async (workerParamObject) => {
      return process.env.NODE_ENV === "test"
        ? ousDemographicOverlapChild(sketch, workerParamObject)
        : runLambdaWorker(
            sketch,
            workerParamObject,
            "ousDemographicOverlapChild",
            request
          );
    })
  );

  // Result template
  const finalResult: OusReportResult = {
    stats: {
      respondents: 0,
      people: 0,
      bySector: {},
      byMunicipality: {},
      byGear: {},
    },
    metrics: [],
  };

  lambdaResults.reduce<OusReportResult>((finalResult, lambdaResult) => {
    const result: OusReportResult =
      process.env.NODE_ENV === "test"
        ? (lambdaResult as OusReportResult)
        : parseLambdaOUSResponse(
            lambdaResult as awsSdk.Lambda.InvocationResponse
          );

    // stats
    finalResult.stats.respondents += result.stats.respondents;
    finalResult.stats.people += result.stats.people;

    // stats.bySector
    for (const sector in result.stats.bySector) {
      if (finalResult.stats.bySector[sector]) {
        finalResult.stats.bySector[sector].people +=
          result.stats.bySector[sector].people;
        finalResult.stats.bySector[sector].respondents +=
          result.stats.bySector[sector].respondents;
      } else {
        finalResult.stats.bySector[sector] = {
          people: result.stats.bySector[sector].people,
          respondents: result.stats.bySector[sector].respondents,
        };
      }
    }

    // stats.byMunicipality
    for (const municipality in result.stats.byMunicipality) {
      if (finalResult.stats.byMunicipality[municipality]) {
        finalResult.stats.byMunicipality[municipality].people +=
          result.stats.byMunicipality[municipality].people;
        finalResult.stats.byMunicipality[municipality].respondents +=
          result.stats.byMunicipality[municipality].respondents;
      } else {
        finalResult.stats.byMunicipality[municipality] = {
          people: result.stats.byMunicipality[municipality].people,
          respondents: result.stats.byMunicipality[municipality].respondents,
        };
      }
    }

    // stats.byGear
    for (const gear in result.stats.byGear) {
      if (finalResult.stats.byGear[gear]) {
        finalResult.stats.byGear[gear].people +=
          result.stats.byGear[gear].people;
        finalResult.stats.byGear[gear].respondents +=
          result.stats.byGear[gear].respondents;
      } else {
        finalResult.stats.byGear[gear] = {
          people: result.stats.byGear[gear].people,
          respondents: result.stats.byGear[gear].respondents,
        };
      }
    }

    // metrics
    result.metrics.forEach((metric) => {
      const index = finalResult.metrics.findIndex(
        (finalMetric) =>
          finalMetric.metricId === metric.metricId &&
          finalMetric.classId === metric.classId &&
          finalMetric.sketchId === metric.sketchId
      );
      if (index === -1) {
        finalResult.metrics.push(JSON.parse(JSON.stringify(metric)));
      } else {
        finalResult.metrics[index].value += metric.value;
      }
    });

    return finalResult;
  }, finalResult);

  return finalResult;
}
