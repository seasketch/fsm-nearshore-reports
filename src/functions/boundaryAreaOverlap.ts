import {
  Sketch,
  Feature,
  GeoprocessingHandler,
  Metric,
  Polygon,
  ReportResult,
  SketchCollection,
  toNullSketch,
  rekeyMetrics,
  sortMetrics,
  isPolygonFeatureArray,
  getFirstFromParam,
  DefaultExtraParams,
  splitSketchAntimeridian,
  isVectorDatasource,
  overlapAreaGroupMetrics,
  getFeaturesForSketchBBoxes,
  MultiPolygon,
  overlapPolygonArea,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import { clipToGeography } from "../util/clipToGeography.js";
import { getGroup, groups } from "../util/getGroup.js";
import { firstMatchingMetric } from "@seasketch/geoprocessing/client-core";

const metricGroup = project.getMetricGroup("boundaryAreaOverlap");

export async function boundaryAreaOverlap(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  extraParams: DefaultExtraParams = {},
): Promise<ReportResult> {
  // Use caller-provided geographyId if provided
  const geographyId = getFirstFromParam("geographyIds", extraParams);

  // Get geography features, falling back to geography assigned to default-boundary group
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });

  // Support sketches crossing antimeridian
  const splitSketch = splitSketchAntimeridian(sketch);

  // Clip to portion of sketch within current geography
  const clippedSketch = await clipToGeography(splitSketch, curGeography);

  // Fetch boundary features indexed by classId
  const polysByBoundary = (
    await Promise.all(
      metricGroup.classes.map(async (curClass) => {
        if (!curClass.datasourceId) {
          throw new Error(`Missing datasourceId ${curClass.classId}`);
        }
        const ds = project.getDatasourceById(curClass.datasourceId);
        if (!isVectorDatasource(ds))
          throw new Error(`Expected vector datasource ${ds.datasourceId}`);

        // Fetch datasource features overlapping with sketch remainder
        const url = project.getDatasourceUrl(ds);
        const polys = await getFeaturesForSketchBBoxes<Polygon | MultiPolygon>(
          clippedSketch,
          url,
        );
        if (!isPolygonFeatureArray(polys)) {
          throw new Error("Expected array of Polygon features");
        }
        return polys;
      }),
    )
  ).reduce<Record<string, Feature<Polygon>[]>>((acc, polys, classIndex) => {
    return {
      ...acc,
      [metricGroup.classes[classIndex].classId]: polys,
    };
  }, {});

  const metrics: Metric[] = // calculate area overlap metrics for each class
    (
      await Promise.all(
        metricGroup.classes.map(async (curClass) => {
          const overlapResult = await overlapPolygonArea(
            metricGroup.metricId,
            polysByBoundary[curClass.classId],
            clippedSketch,
          );
          return overlapResult.map(
            (metric): Metric => ({
              ...metric,
              classId: curClass.classId,
              geographyId: curGeography.geographyId,
            }),
          );
        }),
      )
    ).reduce(
      // merge
      (metricsSoFar, curClassMetrics) => [...metricsSoFar, ...curClassMetrics],
      [],
    );

  // Generate area metrics grouped by zone type, with area overlap within zones removed
  // Each sketch gets one group metric for its zone type, while collection generates one for each zone type
  const sketchToZone = getGroup(sketch);
  const metricToZone = (sketchMetric: Metric) => {
    return sketchToZone[sketchMetric.sketchId!];
  };

  const totalArea = firstMatchingMetric(
    project.getPrecalcMetrics(metricGroup, "area", curGeography.geographyId),
    (m) => m.groupId === null,
  ).value;

  const levelMetrics = await overlapAreaGroupMetrics({
    metricId: metricGroup.metricId,
    groupIds: groups,
    sketch: clippedSketch as Sketch<Polygon> | SketchCollection<Polygon>,
    metricToGroup: metricToZone,
    metrics: metrics,
    classId: metricGroup.classes[0].classId,
    outerArea: totalArea,
  });

  return {
    metrics: sortMetrics(rekeyMetrics([...metrics, ...levelMetrics])),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(boundaryAreaOverlap, {
  title: "boundaryAreaOverlap",
  description: "Calculate sketch overlap with boundary polygons",
  executionMode: "async",
  timeout: 40,
  requiresProperties: [],
  memory: 10240,
});
