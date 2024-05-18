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
} from "@seasketch/geoprocessing";
import { OusDemographicExtraParams } from "../functions/ousDemographicOverlapWorker.js";
import awsSdk from "aws-sdk";

const Lambda = new awsSdk.Lambda();

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
    | SketchCollection<Polygon | MultiPolygon>
) {
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

  // Start workers
  const promises = workerParams.map(async (workerParamObject) => {
    // const worker = await spawn<OverlapOusDemographicWorker>(
    //   new Worker("./overlapOusDemographicWorker")
    // );

    // Call worker lambda

    // id is cache key
    const id = genTaskCacheKey(
      sketch.properties,
      workerParamObject as GeoprocessingRequestParams
    );
    // What should service be?
    const service = "WHAT_SHOULD_THIS_BE";
    const location = `/${service}/tasks/${id}`;
    const task: GeoprocessingTask = {
      id, // cache key
      service,
      wss: "",
      location,
      startedAt: new Date().toISOString(),
      logUriTemplate: `${location}/logs{?limit,nextToken}`,
      geometryUri: `${location}/geometry`,
      status: GeoprocessingTaskStatus.Pending,
      estimate: 2,
    };

    // What should event look like?
    const event = "WHAT_SHOULD_THIS_BE";
    const payload = JSON.stringify(event);

    return Lambda.invoke({
      FunctionName:
        "gp-fsm-nearshore-reports-sync-ousDemographicOverlapWorker-run",
      ClientContext: JSON.stringify(task),
      InvocationType: "RequestResponse", // synchronous, returns response
      Payload: payload,
    }).promise();
  });

  // Add ability to be notified of failed tasks to bail out early

  // Wait for sync lambdas to all finish
  const lambdaResults = await Promise.all(promises);
  console.log("lambdaResults", JSON.stringify(lambdaResults));

  // Combine results
  const firstResult: OusReportResult = JSON.parse(
    JSON.stringify(lambdaResults.shift()) // pops first result to use as base
  );

  const finalResult = lambdaResults.reduce((finalResult, lambdaResult) => {
    // Check result status code for error

    // stats
    // MAKE UP RESULT UNTIL WE CAN GET FROM LAMBDA
    const result: OusReportResult = {
      stats: {
        respondents: 1,
        people: 1,
        bySector: {
          sectorOne: {
            respondents: 1,
            people: 1,
          },
        },
        byMunicipality: {
          muniOne: {
            respondents: 1,
            people: 1,
          },
        },
        byGear: {
          gearOne: {
            respondents: 1,
            people: 1,
          },
        },
      },
      metrics: [],
    };
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
  }, firstResult);

  return finalResult;
}
