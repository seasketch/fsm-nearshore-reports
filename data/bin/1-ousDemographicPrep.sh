#!/usr/bin/env bash

# Run using this command:
# ./data/bin/1-ousDemographicPrep.sh kosrae

# Then publish the data to s3 using this command:
# ./data/bin/2-ousDemographicPublish.sh

# Then run the precalc using this command:
# NODE_ENV=test npx tsx ./data/bin/3-ousDemographicPrecalc.ts kosrae

set -euo pipefail

ATOLL="${1:-}"
if [[ -z "${ATOLL}" || "${ATOLL}" == "-h" || "${ATOLL}" == "--help" ]]; then
  cat <<'EOF'
Prepare OUS demographic datasets for precalc + publishing.

Usage:
  ./1-ousDemographicPrep.sh <atoll>

Atolls:
  fais | woleai | yap | kosrae
  <any other neighboring-islands atoll like Fais/Woleai>

Notes:
  - This script is location-independent; it can be run from any working directory.
  - It generates:
    - data/dist/<atoll>OusDemographics.json
    - data/dist/<atoll>OusDemographics.fgb
EOF
  exit 0
fi

BIN_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$(cd -P "${BIN_DIR}/.." && pwd)"
DIST_DIR="${DATA_DIR}/dist"

mkdir -p "${DIST_DIR}"

output_base=""
source_geojson=""
sql_table=""
sql_select=""
tmp_geojson=""
sorted_geojson=""

case "${ATOLL}" in
  fais)
    output_base="faisOusDemographics"
    source_geojson="${DATA_DIR}/src/Data_Products/heatmaps/yap/shapes/neighboring-islands/clipped/byAtoll/atoll_fais.geojson"
    sql_table="atoll_fais"
    sql_select="select ${sql_table}.response_id as resp_id, ${sql_table}.sector as sector, ${sql_table}.participants as number_of_ppl, ${sql_table}.represented_in_sector as rep_in_sector, ${sql_table}.island as island, ${sql_table}.fishing_type as fishing_type, ${sql_table}.fishing_method as fishing_method from ${sql_table}"
    tmp_geojson="${BIN_DIR}/${output_base}.geojson"
    sorted_geojson="${BIN_DIR}/${output_base}_sorted.geojson"
    ;;
  woleai)
    output_base="woleaiOusDemographics"
    source_geojson="${DATA_DIR}/src/Data_Products/heatmaps/yap/shapes/neighboring-islands/clipped/byAtoll/atoll_Woleai.geojson"
    sql_table="atoll_Woleai"
    sql_select="select ${sql_table}.response_id as resp_id, ${sql_table}.sector as sector, ${sql_table}.participants as number_of_ppl, ${sql_table}.represented_in_sector as rep_in_sector, ${sql_table}.island as island, ${sql_table}.fishing_type as fishing_type, ${sql_table}.fishing_method as fishing_method from ${sql_table}"
    tmp_geojson="${BIN_DIR}/${output_base}.geojson"
    sorted_geojson="${BIN_DIR}/${output_base}_sorted.geojson"
    ;;
  yap)
    output_base="yapOusDemographics"
    source_geojson="${DATA_DIR}/src/Data_Products/heatmaps/yap/shapes/main-island/clipped/all_sectors_main_island.geojson"
    sql_table="all_sectors_main_island"
    sql_select="select ${sql_table}.response_id as resp_id, ${sql_table}.sector as sector, ${sql_table}.participants as number_of_ppl, ${sql_table}.represented_in_sector as rep_in_sector, ${sql_table}.municipality as municipality, ${sql_table}.fishing_type as fishing_type, ${sql_table}.fishing_method as fishing_method from ${sql_table}"
    tmp_geojson="${BIN_DIR}/${output_base}.geojson"
    sorted_geojson="${BIN_DIR}/${output_base}_sorted.geojson"
    ;;
  kosrae)
    output_base="kosraeOusDemographics"
    source_geojson="${DATA_DIR}/src/Data_Products/data_packages/kosrae_data_package/kosrae_scrubbed_shapes.geojson"
    sql_table="kosrae_scrubbed_shapes"
    sql_select="select ${sql_table}.anon_id as resp_id, ${sql_table}.gender as gender, ${sql_table}.fish_method as gear, ${sql_table}.kosrae_mun as municipality, ${sql_table}.value as weight, ${sql_table}.sector as sector, ${sql_table}.individuals_represented as number_of_ppl from ${sql_table}"
    # Kosrae keeps its pared-down geojson in the data package folder today
    tmp_geojson="${DATA_DIR}/src/Data_Products/data_packages/kosrae_data_package/ous_demographics.geojson"
    sorted_geojson="${DATA_DIR}/src/Analytics/kosraeOusDemographics_sorted.geojson"
    ;;
  *)
    # Default behavior for atolls that follow the Fais/Woleai neighboring-islands schema.
    # Assumes the GeoJSON layer name matches the file base name: atoll_<atoll>.
    output_base="${ATOLL}OusDemographics"
    source_geojson="${DATA_DIR}/src/Data_Products/heatmaps/yap/shapes/neighboring-islands/clipped/byAtoll/atoll_${ATOLL}.geojson"
    sql_table="atoll_${ATOLL}"
    sql_select="select ${sql_table}.response_id as resp_id, ${sql_table}.sector as sector, ${sql_table}.participants as number_of_ppl, ${sql_table}.represented_in_sector as rep_in_sector, ${sql_table}.island as island, ${sql_table}.fishing_type as fishing_type, ${sql_table}.fishing_method as fishing_method from ${sql_table}"
    tmp_geojson="${BIN_DIR}/${output_base}.geojson"
    sorted_geojson="${BIN_DIR}/${output_base}_sorted.geojson"
    ;;
esac

if [[ ! -f "${source_geojson}" ]]; then
  echo "Missing source geojson for '${ATOLL}': ${source_geojson}" >&2
  exit 1
fi

# Delete old geojson since ogr2ogr can't overwrite it
rm -f "${tmp_geojson}"

# Select only necessary columns, normalize to EPSG:4326
ogr2ogr \
  -t_srs "EPSG:4326" \
  -f GeoJSON \
  -nlt PROMOTE_TO_MULTI \
  -wrapdateline \
  -dialect OGRSQL \
  -sql "${sql_select}" \
  "${tmp_geojson}" \
  "${source_geojson}"

# Delete old dist files in prep for new
rm -f "${DIST_DIR}/${output_base}.json" "${DIST_DIR}/${output_base}.fgb"

# Sort by respondent id (for faster processing at runtime)
npx tsx "${BIN_DIR}/ousDemographicSort.ts" "${tmp_geojson}" "${sorted_geojson}"

# Create json file for direct import by precalc
cp "${sorted_geojson}" "${DIST_DIR}/${output_base}.json"

ogr2ogr \
  -t_srs "EPSG:4326" \
  -f FlatGeobuf \
  -nlt PROMOTE_TO_MULTI \
  -wrapdateline \
  -dialect OGRSQL \
  -sql "SELECT * FROM ${sql_table}" \
  "${DIST_DIR}/${output_base}.fgb" \
  "${DIST_DIR}/${output_base}.json"

# Clean intermediates generated under data/bin (avoid removing Kosrae analytics artifacts)
if [[ "${tmp_geojson}" == "${BIN_DIR}/"* ]]; then
  rm -f "${tmp_geojson}"
fi
if [[ "${sorted_geojson}" == "${BIN_DIR}/"* ]]; then
  rm -f "${sorted_geojson}"
fi

echo "Wrote:"
echo "  ${DIST_DIR}/${output_base}.json"
echo "  ${DIST_DIR}/${output_base}.fgb"
