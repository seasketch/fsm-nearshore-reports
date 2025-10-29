import {
  Sketch,
  SketchCollection,
  Polygon,
  MultiPolygon,
  GeoprocessingHandler,
  getFirstFromParam,
  DefaultExtraParams,
  rasterMetrics,
  loadCog,
  getCogFilename,
  overlapRasterGroupMetrics,
  Georaster,
  toNullSketch,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import {
  Metric,
  ReportResult,
  rekeyMetrics,
  sortMetrics,
} from "@seasketch/geoprocessing/client-core";
import { clipToGeography } from "../util/clipToGeography.js";
import { getGroup, groups } from "../util/getGroup.js";

export async function reefMonitoring(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {},
): Promise<ReportResult> {
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
  const clippedSketch = await clipToGeography(sketch, curGeography);

  const featuresByClass: Record<string, Georaster> = {};

  const mg = project.getMetricGroup("reefMonitoring");
  const metrics: Metric[] = (
    await Promise.all(
      mg.classes.map(async (curClass) => {
        // start raster load and move on in loop while awaiting finish
        if (!curClass.datasourceId)
          throw new Error(`Expected datasourceId for ${curClass}`);
        const url = `${project.dataBucketUrl()}${getCogFilename(
          project.getInternalRasterDatasourceById(curClass.datasourceId),
        )}`;
        const raster = await loadCog(url);
        featuresByClass[curClass.classId] = raster;
        const overlapResult = await rasterMetrics(raster, {
          metricId: mg.metricId,
          feature: clippedSketch,
        });
        return overlapResult.map(
          (metrics): Metric => ({
            ...metrics,
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

  const groupMetrics = await overlapRasterGroupMetrics({
    metricId: mg.metricId,
    groupIds: groups,
    sketch: clippedSketch as Sketch<Polygon> | SketchCollection<Polygon>,
    metricToGroup: metricToZone,
    metrics: metrics,
    featuresByClass,
  });

  return {
    metrics: sortMetrics(rekeyMetrics([...metrics, ...groupMetrics])),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(reefMonitoring, {
  title: "reefMonitoring",
  description: "",
  timeout: 500, // seconds
  memory: 1024, // megabytes
  executionMode: "async",
});
