import {
  GeoprocessingHandler,
  MultiPolygon,
  Polygon,
  getFirstFromParam,
  splitSketchAntimeridian,
  Feature,
  isInternalVectorDatasource,
  getFlatGeobufFilename,
  overlapFeatures,
  overlapFeaturesGroupMetrics,
  overlapRasterGroupMetrics,
  getCogFilename,
  rasterMetrics,
} from "@seasketch/geoprocessing";
import project from "../../project";
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
import { clipToGeography } from "../util/clipToGeography";
import bbox from "@turf/bbox";
import { fgbFetchAll, loadCog } from "@seasketch/geoprocessing/dataproviders";
import { getGroup, groups } from "../util/getGroup";

const mg = project.getMetricGroup("tradeoffValueOverlap");
// This is a weird report currently, with a metric group containing rasters and vectors
const rasterClasses = mg.classes.filter(
  (curClass) => curClass.classId === "fisheries_tradeoff"
);
const vectorClasses = mg.classes.filter(
  (curClass) =>
    curClass.classId === "benthic_tradeoff" || curClass.classId === "nearshore"
);

export async function tradeoffValueOverlap(
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

  let cachedFeatures: Record<string, Feature<Polygon>[]> = {};
  const featuresByClass: Record<string, Feature<Polygon>[]> = {};
  const rasterByClass: Record<string, Georaster> = {};

  const polysByBoundary = (
    await Promise.all(
      vectorClasses.map(async (curClass) => {
        if (!curClass.datasourceId) {
          throw new Error(`Missing datasourceId ${curClass.classId}`);
        }
        const ds = project.getDatasourceById(curClass.datasourceId);
        if (isInternalVectorDatasource(ds)) {
          const url = `${project.dataBucketUrl()}${getFlatGeobufFilename(ds)}`;

          // Fetch features overlapping with sketch, pull from cache if already fetched
          const dsFeatures =
            cachedFeatures[curClass.datasourceId] ||
            (await fgbFetchAll<Feature<Polygon>>(url, sketchBox));
          cachedFeatures[curClass.datasourceId] = dsFeatures;

          // If this is a sub-class, filter by class name, exclude null geometry too
          // ToDo: should do deeper match to classKey
          const finalFeatures =
            curClass.classKey && curClass.classId !== `${ds.datasourceId}_all`
              ? dsFeatures.filter((feat) => {
                  return (
                    feat.geometry &&
                    feat.properties![ds.classKeys[0]] === curClass.classId
                  );
                }, [])
              : dsFeatures;
          featuresByClass[curClass.classId] = finalFeatures;

          return finalFeatures;
        }
        return [];
      })
    )
  ).reduce<Record<string, Feature<Polygon>[]>>((acc, polys, classIndex) => {
    return {
      ...acc,
      [mg.classes[classIndex].classId]: polys,
    };
  }, {});

  const vectorMetrics: Metric[] = (
    await Promise.all(
      vectorClasses.map(async (curClass) => {
        const overlapResult = await overlapFeatures(
          mg.metricId,
          polysByBoundary[curClass.classId],
          clippedSketch
        );
        return overlapResult.map(
          (metric): Metric => ({
            ...metric,
            classId: curClass.classId,
          })
        );
      })
    )
  ).reduce(
    // merge
    (metricsSoFar, curClassMetrics) => [...metricsSoFar, ...curClassMetrics],
    []
  );

  const raster_metrics: Metric[] = (
    await Promise.all(
      rasterClasses.map(async (curClass) => {
        // start raster load and move on in loop while awaiting finish
        if (!curClass.datasourceId)
          throw new Error(`Expected datasourceId for ${curClass}`);
        const url = `${project.dataBucketUrl()}${getCogFilename(
          project.getInternalRasterDatasourceById(curClass.datasourceId)
        )}`;
        const raster = await loadCog(url);
        rasterByClass[curClass.classId] = raster;
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

  const groupVectorMetrics = await overlapFeaturesGroupMetrics({
    metricId: mg.metricId,
    groupIds: groups,
    sketch: clippedSketch as Sketch<Polygon> | SketchCollection<Polygon>,
    metricToGroup: metricToZone,
    metrics: vectorMetrics,
    featuresByClass,
  });

  const groupRasterMetrics = await overlapRasterGroupMetrics({
    metricId: mg.metricId,
    groupIds: groups,
    sketch: clippedSketch as Sketch<Polygon> | SketchCollection<Polygon>,
    metricToGroup: metricToZone,
    metrics: raster_metrics,
    featuresByClass: rasterByClass,
  });

  return {
    metrics: sortMetrics(
      rekeyMetrics([
        ...vectorMetrics,
        ...raster_metrics,
        ...groupVectorMetrics,
        ...groupRasterMetrics,
      ])
    ),
    sketch: toNullSketch(sketch, true),
  };
}

export default new GeoprocessingHandler(tradeoffValueOverlap, {
  title: "tradeoffValueOverlap",
  description: "key benthic habitat metrics",
  timeout: 900, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 10240,
});
