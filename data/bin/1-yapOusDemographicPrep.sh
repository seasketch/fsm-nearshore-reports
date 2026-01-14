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
ogr2ogr -t_srs "EPSG:4326" -f GeoJSON -nlt PROMOTE_TO_MULTI -wrapdateline -dialect OGRSQL -sql "select all_sectors_main_island.response_id as resp_id, all_sectors_main_island.sector as sector, all_sectors_main_island.participants as number_of_ppl, all_sectors_main_island.represented_in_sector as rep_in_sector, all_sectors_main_island.municipality as municipality, all_sectors_main_island.fishing_type as fishing_type, all_sectors_main_island.fishing_method as fishing_method from all_sectors_main_island" ./yapOusDemographics.geojson ../src/Data_Products/heatmaps/yap/shapes/main-island/clipped/all_sectors_main_island.geojson  

# Delete old dist files in prep for new
rm ../dist/yapOusDemographics.json
rm ../dist/yapOusDemographics.fgb

# Sort by respondent_id
npx tsx yapOusDemographicSort.ts

# Create json file for direct import by precalc
cp ./yapOusDemographics_sorted.geojson ../dist/yapOusDemographics.json

# Generate cloud-optimized Flatgeobuf
./genFgb.sh ../dist/yapOusDemographics.json ../dist yapOusDemographics 'SELECT * FROM all_sectors_main_island' -nlt PROMOTE_TO_MULTI