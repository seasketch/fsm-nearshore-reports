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
  Metric,
} from "@seasketch/geoprocessing";
import project from "../../project/projectClient.js";
import { clipToGeography } from "../util/clipToGeography.js";

const metricGroup = project.getMetricGroup("fad");

export async function fad(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
  extraParams: DefaultExtraParams = {},
): Promise<Metric> {
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
  if (!overlapArea) throw new Error(`Missing total overlap area`);

  return overlapArea;
}

export default new GeoprocessingHandler(fad, {
  title: "fad",
  description: "Calculate sketch overlap with boundary polygons",
  executionMode: "async",
  timeout: 40,
  requiresProperties: [],
  memory: 1024,
});
