import {
  Sketch,
  GeoprocessingHandler,
  Polygon,
  MultiPolygon,
  ReportResult,
  SketchCollection,
  DefaultExtraParams,
  toNullSketch,
  rekeyMetrics,
  getFirstFromParam,
  getFlatGeobufPath,
  genFeatureCollection,
} from "@seasketch/geoprocessing";
import {
  OusFeature,
  OusFeatureCollection,
  overlapOusDemographic,
} from "../util/overlapOusDemographic";
import project from "../../project";
import { clipToGeography } from "../util/clipToGeography";
import { fgbFetchAll } from "@seasketch/geoprocessing/dataproviders";
import { Metric, sortMetrics } from "@seasketch/geoprocessing/client-core";

/** Calculate sketch area overlap inside and outside of multiple planning area boundaries */
export async function ousDemographicOverlap(
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

  const clippedSketch = await clipToGeography(sketch, curGeography, {
    tolerance: 0.00001,
  });

  const sh = await fgbFetchAll<OusFeature>(
    getFlatGeobufPath(project.dataBucketUrl(), "ous_demographics")
  );

  const metrics = (
    await overlapOusDemographic(
      genFeatureCollection(sh) as OusFeatureCollection,
      clippedSketch
    )
  ).metrics.map(
    (metric): Metric => ({
      ...metric,
      geographyId: curGeography.geographyId,
    })
  );

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
    sketch: toNullSketch(sketch, true),
  };
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
