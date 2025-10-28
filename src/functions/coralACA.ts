import {
  GeoprocessingHandler,
  MultiPolygon,
  Polygon,
  getFirstFromParam,
  Feature,
  isInternalVectorDatasource,
  getFlatGeobufFilename,
  overlapFeaturesGroupMetrics,
  getFeaturesForSketchBBoxes,
  overlapPolygonArea,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import {
  DefaultExtraParams,
  Metric,
  ReportResult,
  Sketch,
  SketchCollection,
  rekeyMetrics,
  sortMetrics,
  toNullSketch,
} from "@seasketch/geoprocessing/client-core";
import { clipToGeography } from "../util/clipToGeography.js";
import { getGroup, groups } from "../util/getGroup.js";

const mg = project.getMetricGroup("coralACA");

export async function coralACA(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
): Promise<ReportResult> {
  // Clip to portion of sketch within current geography
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
  const clippedSketch = await clipToGeography(sketch, curGeography);

  // Fetch features
  const featuresByClass: Record<string, Feature<Polygon>[]> = {};
  const polysByBoundary = (
    await Promise.all(
      mg.classes.map(async (curClass) => {
        if (!curClass.datasourceId)
          throw new Error(`Missing data ${curClass.classId}`);
        const ds = project.getDatasourceById(curClass.datasourceId);
        if (isInternalVectorDatasource(ds)) {
          const url = `${project.dataBucketUrl()}${getFlatGeobufFilename(ds)}`;

          const dsFeatures = await getFeaturesForSketchBBoxes<Polygon>(
            clippedSketch,
            url,
          );
          featuresByClass[curClass.classId] = dsFeatures;

          return dsFeatures;
        }
        return [];
      }),
    )
  ).reduce<Record<string, Feature<Polygon>[]>>((acc, polys, classIndex) => {
    return {
      ...acc,
      [mg.classes[classIndex].classId]: polys,
    };
  }, {});

  // Run overlap analysis
  const metrics: Metric[] = (
    await Promise.all(
      mg.classes.map(async (curClass) => {
        const overlapResult = await overlapPolygonArea(
          mg.metricId,
          polysByBoundary[curClass.classId],
          clippedSketch,
        );
        return overlapResult.map(
          (metric): Metric => ({
            ...metric,
            classId: curClass.classId,
          }),
        );
      }),
    )
  ).reduce(
    // merge
    (metricsSoFar, curClassMetrics) => [...metricsSoFar, ...curClassMetrics],
    [],
  );

  // Generate group metrics
  const sketchToZone = getGroup(sketch);
  const metricToZone = (sketchMetric: Metric) => {
    return sketchToZone[sketchMetric.sketchId!];
  };
  const groupMetrics = await overlapFeaturesGroupMetrics({
    metricId: mg.metricId,
    groupIds: groups,
    sketch: clippedSketch as Sketch<Polygon> | SketchCollection<Polygon>,
    metricToGroup: metricToZone,
    metrics: metrics,
    featuresByClass,
  });

  console.log(groupMetrics);

  return {
    metrics: sortMetrics(rekeyMetrics([...metrics, ...groupMetrics])),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(coralACA, {
  title: "coralACA",
  description: "key benthic habitat aca metrics",
  timeout: 900, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 4096,
});
