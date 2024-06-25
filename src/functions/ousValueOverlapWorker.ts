import {
  Polygon,
  Sketch,
  MultiPolygon,
  SketchCollection,
  getCogFilename,
} from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";
import { loadCog } from "@seasketch/geoprocessing/dataproviders";
import {
  GeoprocessingHandler,
  Metric,
  MetricGroup,
  overlapRasterGroupMetrics,
  rasterMetrics,
  splitSketchAntimeridian,
  Georaster,
  getFirstFromParam,
} from "@seasketch/geoprocessing";
import { clipToGeography } from "../util/clipToGeography.js";
import { getGroup, groups } from "../util/getGroup.js";

export async function ousValueOverlapWorker(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: {
    metricGroup: MetricGroup;
    classId: string;
    geographyIds?: string[];
  }
) {
  const metricGroup = extraParams.metricGroup;
  const curClass = metricGroup.classes.find(
    (c) => c.classId === extraParams.classId
  );
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

  // start raster load and move on in loop while awaiting finish
  if (!curClass || !curClass.datasourceId)
    throw new Error(`Expected datasourceId for ${curClass}`);
  const url = `${project.dataBucketUrl()}${getCogFilename(
    project.getInternalRasterDatasourceById(curClass.datasourceId)
  )}`;
  const raster = await loadCog(url);
  const featuresByClass: Record<string, Georaster> = {};
  featuresByClass[curClass.classId] = raster;

  // start analysis as soon as source load done
  const overlapResult = await rasterMetrics(raster, {
    metricId: extraParams.metricGroup.metricId,
    feature: clippedSketch,
  });

  const metrics = overlapResult.map(
    (metrics): Metric => ({
      ...metrics,
      classId: extraParams.classId,
      geographyId: curGeography.geographyId,
    })
  );

  // Generate area metrics grouped by zone type, with area overlap within zones removed
  // Each sketch gets one group metric for its zone type, while collection generates one for each zone type
  const sketchToZone = getGroup(sketch);
  const metricToZone = (sketchMetric: Metric) => {
    return sketchToZone[sketchMetric.sketchId!];
  };

  const groupMetrics = await overlapRasterGroupMetrics({
    metricId: extraParams.metricGroup.metricId,
    groupIds: groups,
    sketch: clippedSketch as Sketch<Polygon> | SketchCollection<Polygon>,
    metricToGroup: metricToZone,
    metrics: metrics,
    featuresByClass,
  });

  return [...metrics, ...groupMetrics];
}

export default new GeoprocessingHandler(ousValueOverlapWorker, {
  title: "ousValueOverlapWorker",
  description: "",
  timeout: 900, // seconds
  memory: 1024, // megabytes
  executionMode: "sync",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
});
