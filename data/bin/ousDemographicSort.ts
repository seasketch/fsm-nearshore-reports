import fs from "fs-extra";
import { OusFeatureProperties } from "../../src/util/overlapOusDemographic";
import { FeatureCollection, Polygon } from "@seasketch/geoprocessing";

// Assumes already done:
// join spatial and tabular data
// remove extraneous fields or those uniquely identifying people

const shapeFc = fs.readJSONSync(
  "../src/Data_Products/data_packages/kosrae_data_package/ous_demographics.geojson",
) as FeatureCollection<Polygon, OusFeatureProperties>;

// sort by respondent_id (string)
const sortedShapes = shapeFc.features.sort(
  (a, b) => a.properties.resp_id - b.properties.resp_id,
);
fs.writeFileSync(
  "../src/Analytics/ous_demographics_sorted.geojson",
  JSON.stringify({ ...shapeFc, features: sortedShapes }),
);
