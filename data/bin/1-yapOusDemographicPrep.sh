#!/bin/bash

# OKAY! Here's how the OUS Demographic set up works in the Vanuatu reports (from data/bin folder):
# 1. Run this script data folder to create json: 
#    ./1-yapOusDemographicPrep.sh
# 2. Run this script to publish fgb to aws:
#    ./2-ousDemographicPublish.sh
# 3. Run this script to precalculate demographics data overlap:
#    NODE_ENV=test npx tsx ./3-yapOusDemographicPrecalc.ts

# Pares down OUS demographic data (copied from Data Products) to what reports need
# and saves into data/dist/ous_demographics.json for use in precalc 

# Delete old merged geojson since ogr2ogr can't overwrite it
rm ./yapOusDemographics.geojson

# Select only necessary columns
ogr2ogr -t_srs "EPSG:4326" -f GeoJSON -nlt PROMOTE_TO_MULTI -wrapdateline -dialect OGRSQL -sql "select anonymized_shapes_clipped.response_id as resp_id, anonymized_shapes_clipped.sector as sector, anonymized_shapes_clipped.total_survey_participants as number_of_ppl, anonymized_shapes_clipped.individuals_represented_in_sector as rep_in_sector, anonymized_shapes_clipped.municipality as municipality, anonymized_shapes_clipped.fishing_type as fishing_type, anonymized_shapes_clipped.fishing_method as fishing_method from anonymized_shapes_clipped" ./yapOusDemographics.geojson ../src/Data_Products/data_packages/yap/anonymized-data-package/shapes/anonymized_shapes_clipped.geojson  

# Delete old dist files in prep for new
rm ../dist/yapOusDemographics.json
rm ../dist/yapOusDemographics.fgb

# Sort by respondent_id
npx tsx yapOusDemographicSort.ts

# Create json file for direct import by precalc
cp ./yapOusDemographics_sorted.geojson ../dist/yapOusDemographics.json

# Generate cloud-optimized Flatgeobuf
./genFgb.sh ../dist/yapOusDemographics.json ../dist yapOusDemographics 'SELECT * FROM anonymized_shapes_clipped' -nlt PROMOTE_TO_MULTI