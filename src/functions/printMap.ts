import {
  Feature,
  GeoprocessingHandler,
  Polygon,
  genFeatureCollection,
  isVectorDatasource,
} from "@seasketch/geoprocessing";
import simplify from "@turf/simplify";
import project from "../../project";
import { getFeatures } from "@seasketch/geoprocessing/dataproviders";
import { isPolygonFeatureArray } from "@seasketch/geoprocessing/client-core";
import bbox from "@turf/bbox";

export async function printMap(sketch: any) {
  const mg = project.getMetricGroup("printMap");

  // Get bounding box of sketch
  const sketchBox = sketch.bbox || bbox(sketch);

  const polysByBoundary = (
    await Promise.all(
      mg.classes.map(async (curClass) => {
        if (!curClass.datasourceId) {
          throw new Error(`Missing datasourceId ${curClass.classId}`);
        }
        const ds = project.getDatasourceById(curClass.datasourceId);
        if (!isVectorDatasource(ds)) {
          throw new Error(`Expected vector datasource for ${ds.datasourceId}`);
        }

        // Fetch datasource features overlapping with sketch remainder
        const url = project.getDatasourceUrl(ds);
        const polys = await getFeatures(ds, url, {
          bbox: sketchBox,
        });
        if (!isPolygonFeatureArray(polys)) {
          throw new Error("Expected array of Polygon features");
        }
        return polys;
      })
    )
  ).reduce<Record<string, Feature<Polygon>[]>>((acc, polys, classIndex) => {
    return {
      ...acc,
      [mg.classes[classIndex].classId]: polys,
    };
  }, {});

  return {
    sketch: simplify(sketch, { tolerance: 0.001 }),
    land: simplify(genFeatureCollection(polysByBoundary["land"]), {
      tolerance: 0.001,
    }),
  };
}

export default new GeoprocessingHandler(printMap, {
  title: "printMap",
  description: "printMap",
  timeout: 900, // seconds
  executionMode: "async",
  // Specify any Sketch Class form attributes that are required
  requiresProperties: [],
  memory: 10240,
});
