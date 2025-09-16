import {
  rekeyMetrics,
  sortMetrics,
  toNullSketch,
  Sketch,
  SketchCollection,
  Polygon,
  ReportResult,
  createMetric,
  getSketchFeatures,
} from "@seasketch/geoprocessing/client-core";
import { GeoprocessingHandler } from "@seasketch/geoprocessing";
import projectClient from "../../project/projectClient.js";
import { getGroup } from "../util/getGroup.js";

export async function groupCountOverlap(
  sketch: Sketch<Polygon> | SketchCollection<Polygon>,
): Promise<ReportResult> {
  const mg = projectClient.getMetricGroup("groupCountOverlap");
  const sketchFeatures = getSketchFeatures(sketch);
  const sketchIdToGroup = getGroup(sketch);

  const groups = sketchFeatures.reduce<Record<string, number>>(
    (groupsAcc, sketch) => {
      const group = sketchIdToGroup[sketch.properties.id];
      groupsAcc[group] = 1 + (groupsAcc[group] || 0);
      return groupsAcc;
    },
    {},
  );

  const metrics = Object.keys(groups).map((group) => {
    return createMetric({
      metricId: mg.metricId,
      groupId: group,
      classId: group,
      value: groups[group],
    });
  });

  return {
    metrics: sortMetrics(rekeyMetrics(metrics)),
    sketch: toNullSketch(sketch),
  };
}

export default new GeoprocessingHandler(groupCountOverlap, {
  title: "groupCountOverlap",
  description: "returns area metrics for protection levels for sketch",
  timeout: 60, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 4096,
});
