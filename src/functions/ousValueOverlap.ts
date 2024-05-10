import {
  GeoprocessingHandler,
  MultiPolygon,
  Polygon,
  getCogFilename,
  getFirstFromParam,
  rasterMetrics,
  splitSketchAntimeridian,
  overlapRasterGroupMetrics,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import {
  DefaultExtraParams,
  Georaster,
  Metric,
  ReportResult,
  Sketch,
  SketchCollection,
  rekeyMetrics,
  sortMetrics,
  toNullSketch,
} from "@seasketch/geoprocessing/client-core";
import { clipToGeography } from "../util/clipToGeography.js";
import bbox from "@turf/bbox";
import { loadCog } from "@seasketch/geoprocessing/dataproviders";
import { getGroup, groups } from "../util/getGroup.js";

const mg = project.getMetricGroup("ousValueOverlap");

export async function ousValueOverlap(
  sketch:
    | Sketch<Polygon | MultiPolygon>
    | SketchCollection<Polygon | MultiPolygon>,
  extraParams: DefaultExtraParams = {}
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

  // Get bounding box of sketch remainder
  const sketchBox = clippedSketch.bbox || bbox(clippedSketch);

  const featuresByClass: Record<string, Georaster> = {};

  const metrics: Metric[] = (
    await Promise.all(
      mg.classes.map(async (curClass) => {
        // start raster load and move on in loop while awaiting finish
        if (!curClass.datasourceId)
          throw new Error(`Expected datasourceId for ${curClass}`);
        const url = `${project.dataBucketUrl()}${getCogFilename(
          project.getInternalRasterDatasourceById(curClass.datasourceId)
        )}`;
        const raster = await loadCog(url);
        featuresByClass[curClass.classId] = raster;
        // start analysis as soon as source load done
        const overlapResult = await rasterMetrics(raster, {
          metricId: mg.metricId,
          feature: clippedSketch,
        });
        return overlapResult.map(
          (metrics): Metric => ({
            ...metrics,
            classId: curClass.classId,
            geographyId: curGeography.geographyId,
          })
        );
      })
    )
  ).reduce(
    // merge
    (metricsSoFar, curClassMetrics) => [...metricsSoFar, ...curClassMetrics],
    []
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

export default new GeoprocessingHandler(ousValueOverlap, {
  title: "ousValueOverlap",
  description: "ocean use metrics",
  timeout: 900, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 10240,
});
