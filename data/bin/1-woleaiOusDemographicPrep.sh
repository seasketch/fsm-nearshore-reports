#!/bin/bash

# OKAY! Here's how the OUS Demographic set up works in the Vanuatu reports (from data/bin folder):
# 1. Run this script data folder to create json: 
#    ./1-woleaiOusDemographicPrep.sh
# 2. Run this script to publish fgb to aws:
#    ./2-ousDemographicPublish.sh
# 3. Run this script to precalculate demographics data overlap:
#    NODE_ENV=test npx tsx ./3-woleaiOusDemographicPrecalc.ts

# Pares down OUS demographic data (copied from Data Products) to what reports need
# and saves into data/dist/ous_demographics.json for use in precalc 

# Delete old merged geojson since ogr2ogr can't overwrite it
rm ./woleaiOusDemographics.geojson

# Select only necessary columns
ogr2ogr -t_srs "EPSG:4326" -f GeoJSON -nlt PROMOTE_TO_MULTI -wrapdateline -dialect OGRSQL -sql "select atoll_Woleai.response_id as resp_id, atoll_Woleai.sector as sector, atoll_Woleai.participants as number_of_ppl, atoll_Woleai.represented_in_sector as rep_in_sector, atoll_Woleai.island as island, atoll_Woleai.fishing_type as fishing_type, atoll_Woleai.fishing_method as fishing_method from atoll_Woleai" ./woleaiOusDemographics.geojson ../src/Data_Products/heatmaps/yap/shapes/neighboring-islands/clipped/byAtoll/atoll_Woleai.geojson  

# Delete old dist files in prep for new
rm ../dist/woleaiOusDemographics.json
rm ../dist/woleaiOusDemographics.fgb

# Sort by respondent_id
npx tsx woleaiOusDemographicSort.ts

# Create json file for direct import by precalc
cp ./woleaiOusDemographics_sorted.geojson ../dist/woleaiOusDemographics.json

# Generate cloud-optimized Flatgeobuf
./genFgb.sh ../dist/woleaiOusDemographics.json ../dist woleaiOusDemographics 'SELECT * FROM atoll_Woleai' -nlt PROMOTE_TO_MULTI