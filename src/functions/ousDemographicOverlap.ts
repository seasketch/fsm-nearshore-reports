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
} from "@seasketch/geoprocessing";
import {
  OusFeatureCollection,
  overlapOusDemographic,
} from "../util/overlapOusDemographic";
import project from "../../project";
import shapes from "../../data/bin/ous_demographics.json";
import { clipToGeography } from "../util/clipToGeography";

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

  const metrics = (
    await overlapOusDemographic(shapes as OusFeatureCollection, clippedSketch)
  ).metrics.map((metric) => ({
    ...metric,
    geographyId: curGeography.geographyId,
  }));

  return {
    metrics: rekeyMetrics(metrics),
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
