import {
  Sketch,
  GeoprocessingHandler,
  Polygon,
  SketchCollection,
  getFirstFromParam,
  DefaultExtraParams,
  isVectorDatasource,
  getFeaturesForSketchBBoxes,
  MultiPolygon,
  overlapPolygonArea,
  firstMatchingMetric,
  area,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import { clipToGeography } from "../util/clipToGeography.js";

const metricGroup = project.getMetricGroup("existingMPAs");

export async function existingMPAs(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  extraParams: DefaultExtraParams = {},
): Promise<{ overlap: number; overlapPerc: number }> {
  const geographyId = getFirstFromParam("geographyIds", extraParams);
  const curGeography = project.getGeographyById(geographyId, {
    fallbackGroup: "default-boundary",
  });
  const clippedSketch = await clipToGeography(sketch, curGeography);

  const dsId = metricGroup.datasourceId;
  if (!dsId) throw new Error(`Missing dsId for ${metricGroup.metricId}`);
  const ds = project.getDatasourceById(dsId);
  if (!isVectorDatasource(ds))
    throw new Error(`Expected vector ds for ${ds.datasourceId}`);
  const url = project.getDatasourceUrl(ds);
  const features = await getFeaturesForSketchBBoxes<Polygon | MultiPolygon>(
    clippedSketch,
    url,
  );

  const overlap = await overlapPolygonArea(
    metricGroup.metricId,
    features,
    clippedSketch,
  );

  const overlapArea = firstMatchingMetric(
    overlap,
    (m) => m.sketchId === sketch.properties.id,
  );
  if (!overlapArea) throw new Error(`Missing overlap area`);

  const totalArea = firstMatchingMetric(
    await area(clippedSketch),
    (m) => m.sketchId === sketch.properties.id,
  );
  if (!totalArea) throw new Error(`Missing total area`);

  return {
    overlap: overlapArea.value,
    overlapPerc: overlapArea.value / totalArea.value,
  };
}

export default new GeoprocessingHandler(existingMPAs, {
  title: "existingMPAs",
  description: "Calculate sketch overlap with boundary polygons",
  executionMode: "async",
  timeout: 40,
  requiresProperties: [],
  memory: 1024,
});
