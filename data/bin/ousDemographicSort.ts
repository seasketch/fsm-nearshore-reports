import fs from "fs-extra";

type AnyFc = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties?: Record<string, unknown> | null;
    [k: string]: unknown;
  }>;
  [k: string]: unknown;
};

function usage(): never {
  const cmd = process.argv[1]?.split("/").pop() || "ousDemographicSort.ts";
  // eslint-disable-next-line no-console
  console.error(`Usage: npx tsx ${cmd} <input.geojson> <output_sorted.geojson>`);
  process.exit(2);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if (!inputPath || !outputPath) usage();

const fc = fs.readJSONSync(inputPath) as AnyFc;
if (!fc || fc.type !== "FeatureCollection" || !Array.isArray(fc.features)) {
  throw new Error(`Invalid GeoJSON FeatureCollection at ${inputPath}`);
}

const getRespId = (f: AnyFc["features"][number]) => {
  const raw = f.properties?.["resp_id"];
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (!Number.isNaN(n)) return n;
    return raw;
  }
  return null;
};

const sorted = [...fc.features].sort((a, b) => {
  const ar = getRespId(a);
  const br = getRespId(b);
  if (ar === null && br === null) return 0;
  if (ar === null) return 1;
  if (br === null) return -1;

  if (typeof ar === "number" && typeof br === "number") return ar - br;
  return String(ar).localeCompare(String(br));
});

fs.writeFileSync(outputPath, JSON.stringify({ ...fc, features: sorted }));
