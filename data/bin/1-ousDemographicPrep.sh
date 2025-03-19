#!/bin/bash

# OKAY! Here's how the OUS Demographic set up works in the FSM Nearshore reports (from data/bin folder):
# 1. Run this script data folder to create json: 
#    ./1-ousDemographicPrep.sh
# 2. Run this script to publish fgb to aws:
#    ./2-ousDemographicPublish.sh
# 3. Run this script to precalculate demographics data overlap:
#    npx tsx 3-ousDemographicPrecalc.ts

# Delete old merged geojson since ogr2ogr can't overwrite it
rm ../src/Data_Products/data_packages/kosrae_data_package/ous_demographics.geojson

# Pares down OUS demographic data (copied from Data Products) to what reports need
ogr2ogr -t_srs "EPSG:4326" -f GeoJSON -nlt PROMOTE_TO_MULTI -wrapdateline -dialect OGRSQL -sql "select kosrae_scrubbed_shapes.anon_id as resp_id, kosrae_scrubbed_shapes.fish_method as gear, kosrae_scrubbed_shapes.kosrae_mun as municipality, kosrae_scrubbed_shapes.value as weight, kosrae_scrubbed_shapes.sector as sector, kosrae_scrubbed_shapes.individuals_represented as number_of_ppl from kosrae_scrubbed_shapes" ../src/Data_Products/data_packages/kosrae_data_package/ous_demographics.geojson ../src/Data_Products/data_packages/kosrae_data_package/kosrae_scrubbed_shapes.geojson

# Delete old dist files in prep for new
rm ../dist/ous_demographics.json
rm ../dist/ous_demographics.fgb

# Sort by respondent_id (for faster processing at runtime)
npx tsx ousDemographicSort.ts

# Create json file for direct import by precalc
cp ../src/Analytics/ous_demographics_sorted.geojson ../dist/ous_demographics.json

# Create fgb file
./genFgb.sh ../dist/ous_demographics.json ../dist ous_demographics 'SELECT * FROM kosrae_scrubbed_shapes' -nlt PROMOTE_TO_MULTI