
      import React from "react";
      import { Group } from '.././Group.jsx';
      import {
        createReportDecorator,
        sampleSketchReportContextValue,
      } from "@seasketch/geoprocessing/client-ui";
      import Translator from "/home/twelch/src/fsm-nearshore-reports/src/components/TranslatorAsync.js";

      const contextValue = sampleSketchReportContextValue({
        visibleLayers: [],
        exampleOutputs: [
  {
    "sketchName": "tradeofftest",
    "results": {
      "metrics": [
        {
          "geographyId": "kosrae",
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "25164",
          "groupId": null,
          "value": 5019267.816824,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 5019267.816824,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "25165",
          "groupId": null,
          "value": 1228786.242812,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 1228786.242812,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "25166",
          "groupId": null,
          "value": 6248054.059636,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 6247866.529347124,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        }
      ],
      "sketch": {
        "id": 25166,
        "type": "FeatureCollection",
        "features": [
          {
            "id": 25164,
            "bbox": [
              162.89255,
              5.299203,
              162.94028,
              5.3289547
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa1_tradeofftest",
              "id": "25164",
              "name": "mpa1_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:05.815649+00:00",
              "updatedAt": "2024-02-08T18:43:32.548116+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          },
          {
            "id": 25165,
            "bbox": [
              162.89998,
              5.2656755,
              162.912,
              5.283677
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa2_tradeofftest",
              "id": "25165",
              "name": "mpa2_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:21.035183+00:00",
              "updatedAt": "2024-02-08T18:43:30.703963+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          }
        ],
        "properties": {
          "6293": "tradeofftest",
          "id": "25166",
          "name": "tradeofftest",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-02-08T18:43:27.930885+00:00",
          "updatedAt": "2024-02-08T18:43:32.548116+00:00",
          "collectionId": null,
          "isCollection": true,
          "sharedInForum": false,
          "sketchClassId": "746",
          "userAttributes": [
            {
              "label": "Description",
              "value": null,
              "exportId": "descriptionconsider_adding_a_ra",
              "fieldType": "TextArea",
              "valueLabel": null,
              "formElementId": 6294,
              "alternateLanguages": {}
            },
            {
              "label": "Author(s)",
              "value": null,
              "exportId": "authors",
              "fieldType": "ShortText",
              "valueLabel": null,
              "formElementId": 6295,
              "alternateLanguages": {}
            }
          ],
          "descriptionconsider_adding_a_ra": null
        }
      }
    },
    "functionName": "boundaryAreaOverlap"
  },
  {
    "sketchName": "tradeofftest",
    "results": {
      "metrics": [
        {
          "geographyId": null,
          "metricId": "groupCountOverlap",
          "classId": "mpa",
          "sketchId": null,
          "groupId": "mpa",
          "value": 2
        }
      ],
      "sketch": {
        "id": 25166,
        "type": "FeatureCollection",
        "features": [
          {
            "id": 25164,
            "bbox": [
              162.89255,
              5.299203,
              162.94028,
              5.3289547
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa1_tradeofftest",
              "id": "25164",
              "name": "mpa1_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:05.815649+00:00",
              "updatedAt": "2024-02-08T18:43:32.548116+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            }
          },
          {
            "id": 25165,
            "bbox": [
              162.89998,
              5.2656755,
              162.912,
              5.283677
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa2_tradeofftest",
              "id": "25165",
              "name": "mpa2_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:21.035183+00:00",
              "updatedAt": "2024-02-08T18:43:30.703963+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            }
          }
        ],
        "properties": {
          "6293": "tradeofftest",
          "id": "25166",
          "name": "tradeofftest",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-02-08T18:43:27.930885+00:00",
          "updatedAt": "2024-02-08T18:43:32.548116+00:00",
          "collectionId": null,
          "isCollection": true,
          "sharedInForum": false,
          "sketchClassId": "746",
          "userAttributes": [
            {
              "label": "Description",
              "value": null,
              "exportId": "descriptionconsider_adding_a_ra",
              "fieldType": "TextArea",
              "valueLabel": null,
              "formElementId": 6294,
              "alternateLanguages": {}
            },
            {
              "label": "Author(s)",
              "value": null,
              "exportId": "authors",
              "fieldType": "ShortText",
              "valueLabel": null,
              "formElementId": 6295,
              "alternateLanguages": {}
            }
          ],
          "descriptionconsider_adding_a_ra": null
        }
      }
    },
    "functionName": "groupCountOverlap"
  },
  {
    "sketchName": "tradeofftest",
    "results": {
      "metrics": [
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "25164",
          "groupId": null,
          "value": 38501.515664,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 38501.515664,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "25165",
          "groupId": null,
          "value": 34972.290105,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 34972.290105,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "25166",
          "groupId": null,
          "value": 73473.805769,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 73473.805769,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "25164",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "25165",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "25166",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "25164",
          "groupId": null,
          "value": 334515.847694,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 334515.847694,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "25165",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "25166",
          "groupId": null,
          "value": 334515.847694,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 334515.847694,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "25164",
          "groupId": null,
          "value": 65717.57204,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 65717.57204,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "25165",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "25166",
          "groupId": null,
          "value": 65717.57204,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 65717.57204,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "25164",
          "groupId": null,
          "value": 4960.22418,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 4960.22418,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "25165",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "25166",
          "groupId": null,
          "value": 4960.22418,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 4960.22418,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "25164",
          "groupId": null,
          "value": 636961.975549,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 636961.975549,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "25165",
          "groupId": null,
          "value": 2274.486148,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 2274.486148,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "25166",
          "groupId": null,
          "value": 639236.461697,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 639236.461697,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        }
      ],
      "sketch": {
        "id": 25166,
        "type": "FeatureCollection",
        "features": [
          {
            "id": 25164,
            "bbox": [
              162.89255,
              5.299203,
              162.94028,
              5.3289547
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa1_tradeofftest",
              "id": "25164",
              "name": "mpa1_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:05.815649+00:00",
              "updatedAt": "2024-02-08T18:43:32.548116+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          },
          {
            "id": 25165,
            "bbox": [
              162.89998,
              5.2656755,
              162.912,
              5.283677
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa2_tradeofftest",
              "id": "25165",
              "name": "mpa2_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:21.035183+00:00",
              "updatedAt": "2024-02-08T18:43:30.703963+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          }
        ],
        "properties": {
          "6293": "tradeofftest",
          "id": "25166",
          "name": "tradeofftest",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-02-08T18:43:27.930885+00:00",
          "updatedAt": "2024-02-08T18:43:32.548116+00:00",
          "collectionId": null,
          "isCollection": true,
          "sharedInForum": false,
          "sketchClassId": "746",
          "userAttributes": [
            {
              "label": "Description",
              "value": null,
              "exportId": "descriptionconsider_adding_a_ra",
              "fieldType": "TextArea",
              "valueLabel": null,
              "formElementId": 6294,
              "alternateLanguages": {}
            },
            {
              "label": "Author(s)",
              "value": null,
              "exportId": "authors",
              "fieldType": "ShortText",
              "valueLabel": null,
              "formElementId": 6295,
              "alternateLanguages": {}
            }
          ],
          "descriptionconsider_adding_a_ra": null
        }
      }
    },
    "functionName": "habitatAreaOverlap"
  },
  {
    "sketchName": "tradeofftest",
    "results": {
      "metrics": [
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Aquaculture",
          "sketchId": "25166",
          "groupId": null,
          "value": 20
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Bottom Fishing",
          "sketchId": "25166",
          "groupId": null,
          "value": 143
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Casting",
          "sketchId": "25166",
          "groupId": null,
          "value": 43
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Community Recreational Use",
          "sketchId": "25166",
          "groupId": null,
          "value": 163
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Construction and Infrastructure",
          "sketchId": "25166",
          "groupId": null,
          "value": 1
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Cultural Use",
          "sketchId": "25166",
          "groupId": null,
          "value": 81
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Fisheries",
          "sketchId": "25166",
          "groupId": null,
          "value": 316
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Gathering / Reef Gleaning",
          "sketchId": "25166",
          "groupId": null,
          "value": 34
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Lelu",
          "sketchId": "25166",
          "groupId": null,
          "value": 152
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Malem",
          "sketchId": "25166",
          "groupId": null,
          "value": 67
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Maritime Activity",
          "sketchId": "25166",
          "groupId": null,
          "value": 90
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Other(Torch fishing)",
          "sketchId": "25166",
          "groupId": null,
          "value": 29
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "ousPeopleCount_all",
          "sketchId": "25166",
          "groupId": null,
          "value": 508
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Research / Data Collection",
          "sketchId": "25166",
          "groupId": null,
          "value": 3
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Spear/Harpoon",
          "sketchId": "25166",
          "groupId": null,
          "value": 30
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Tafunsak",
          "sketchId": "25166",
          "groupId": null,
          "value": 128
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Tourism",
          "sketchId": "25166",
          "groupId": null,
          "value": 6
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Transportation",
          "sketchId": "25166",
          "groupId": null,
          "value": 57
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Trap / Fish Fence / Gill Net",
          "sketchId": "25166",
          "groupId": null,
          "value": 35
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Trolling",
          "sketchId": "25166",
          "groupId": null,
          "value": 81
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "unknown-gear",
          "sketchId": "25166",
          "groupId": null,
          "value": 230
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "unknown-municipality",
          "sketchId": "25166",
          "groupId": null,
          "value": 42
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Utwe",
          "sketchId": "25166",
          "groupId": null,
          "value": 60
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Vertical Longline",
          "sketchId": "25166",
          "groupId": null,
          "value": 16
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "Walung",
          "sketchId": "25166",
          "groupId": null,
          "value": 59
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Aquaculture",
          "sketchId": "25166",
          "groupId": null,
          "value": 2
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Bottom Fishing",
          "sketchId": "25166",
          "groupId": null,
          "value": 31
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Casting",
          "sketchId": "25166",
          "groupId": null,
          "value": 11
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Community Recreational Use",
          "sketchId": "25166",
          "groupId": null,
          "value": 29
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Construction and Infrastructure",
          "sketchId": "25166",
          "groupId": null,
          "value": 1
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Cultural Use",
          "sketchId": "25166",
          "groupId": null,
          "value": 16
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Fisheries",
          "sketchId": "25166",
          "groupId": null,
          "value": 71
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Gathering / Reef Gleaning",
          "sketchId": "25166",
          "groupId": null,
          "value": 7
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Lelu",
          "sketchId": "25166",
          "groupId": null,
          "value": 29
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Malem",
          "sketchId": "25166",
          "groupId": null,
          "value": 13
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Maritime Activity",
          "sketchId": "25166",
          "groupId": null,
          "value": 5
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Other(Torch fishing)",
          "sketchId": "25166",
          "groupId": null,
          "value": 4
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "ousRespondentCount_all",
          "sketchId": "25166",
          "groupId": null,
          "value": 106
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Research / Data Collection",
          "sketchId": "25166",
          "groupId": null,
          "value": 3
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Spear/Harpoon",
          "sketchId": "25166",
          "groupId": null,
          "value": 7
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Tafunsak",
          "sketchId": "25166",
          "groupId": null,
          "value": 31
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Tourism",
          "sketchId": "25166",
          "groupId": null,
          "value": 3
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Transportation",
          "sketchId": "25166",
          "groupId": null,
          "value": 57
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Trap / Fish Fence / Gill Net",
          "sketchId": "25166",
          "groupId": null,
          "value": 8
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Trolling",
          "sketchId": "25166",
          "groupId": null,
          "value": 17
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "unknown-gear",
          "sketchId": "25166",
          "groupId": null,
          "value": 76
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "unknown-municipality",
          "sketchId": "25166",
          "groupId": null,
          "value": 5
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Utwe",
          "sketchId": "25166",
          "groupId": null,
          "value": 15
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Vertical Longline",
          "sketchId": "25166",
          "groupId": null,
          "value": 3
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "Walung",
          "sketchId": "25166",
          "groupId": null,
          "value": 13
        }
      ],
      "sketch": {
        "id": 25166,
        "type": "FeatureCollection",
        "features": [
          {
            "id": 25164,
            "bbox": [
              162.89255,
              5.299203,
              162.94028,
              5.3289547
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa1_tradeofftest",
              "id": "25164",
              "name": "mpa1_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:05.815649+00:00",
              "updatedAt": "2024-02-08T18:43:32.548116+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          },
          {
            "id": 25165,
            "bbox": [
              162.89998,
              5.2656755,
              162.912,
              5.283677
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa2_tradeofftest",
              "id": "25165",
              "name": "mpa2_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:21.035183+00:00",
              "updatedAt": "2024-02-08T18:43:30.703963+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          }
        ],
        "properties": {
          "6293": "tradeofftest",
          "id": "25166",
          "name": "tradeofftest",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-02-08T18:43:27.930885+00:00",
          "updatedAt": "2024-02-08T18:43:32.548116+00:00",
          "collectionId": null,
          "isCollection": true,
          "sharedInForum": false,
          "sketchClassId": "746",
          "userAttributes": [
            {
              "label": "Description",
              "value": null,
              "exportId": "descriptionconsider_adding_a_ra",
              "fieldType": "TextArea",
              "valueLabel": null,
              "formElementId": 6294,
              "alternateLanguages": {}
            },
            {
              "label": "Author(s)",
              "value": null,
              "exportId": "authors",
              "fieldType": "ShortText",
              "valueLabel": null,
              "formElementId": 6295,
              "alternateLanguages": {}
            }
          ],
          "descriptionconsider_adding_a_ra": null
        }
      }
    },
    "functionName": "ousDemographicOverlap"
  },
  {
    "sketchName": "tradeofftest",
    "results": {
      "metrics": [
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 814.132258,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 814.132258,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 814.132258,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 814.132258,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 10600.69695,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 10600.69695,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 10600.69695,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 10600.69695,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 100.835566,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 100.835566,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 100.835566,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 100.835566,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 6797.866378,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 6797.866378,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 711.253165,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 711.253165,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 7509.119543,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 7509.119543,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 8768.888685,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 8768.888685,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 317.423315,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 317.423315,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 9086.312,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 9086.312,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 1220.905346,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 1220.905346,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 45.809159,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 45.809159,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 1266.714505,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 1266.714505,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 74.447991,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 74.447991,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 3.196242,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 3.196242,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 77.644233,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 77.644233,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 5.355647,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 5.355647,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 5.355647,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 5.355647,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 42.217486,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 42.217486,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 0.534451,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 0.534451,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 42.751937,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 42.751937,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        }
      ],
      "sketch": {
        "id": 25166,
        "type": "FeatureCollection",
        "features": [
          {
            "id": 25164,
            "bbox": [
              162.89255,
              5.299203,
              162.94028,
              5.3289547
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa1_tradeofftest",
              "id": "25164",
              "name": "mpa1_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:05.815649+00:00",
              "updatedAt": "2024-02-08T18:43:32.548116+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          },
          {
            "id": 25165,
            "bbox": [
              162.89998,
              5.2656755,
              162.912,
              5.283677
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa2_tradeofftest",
              "id": "25165",
              "name": "mpa2_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:21.035183+00:00",
              "updatedAt": "2024-02-08T18:43:30.703963+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          }
        ],
        "properties": {
          "6293": "tradeofftest",
          "id": "25166",
          "name": "tradeofftest",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-02-08T18:43:27.930885+00:00",
          "updatedAt": "2024-02-08T18:43:32.548116+00:00",
          "collectionId": null,
          "isCollection": true,
          "sharedInForum": false,
          "sketchClassId": "746",
          "userAttributes": [
            {
              "label": "Description",
              "value": null,
              "exportId": "descriptionconsider_adding_a_ra",
              "fieldType": "TextArea",
              "valueLabel": null,
              "formElementId": 6294,
              "alternateLanguages": {}
            },
            {
              "label": "Author(s)",
              "value": null,
              "exportId": "authors",
              "fieldType": "ShortText",
              "valueLabel": null,
              "formElementId": 6295,
              "alternateLanguages": {}
            }
          ],
          "descriptionconsider_adding_a_ra": null
        }
      }
    },
    "functionName": "ousValueOverlap"
  },
  {
    "sketchName": "tradeofftest",
    "results": {
      "sketch": {
        "type": "FeatureCollection",
        "id": 25166,
        "properties": {
          "6293": "tradeofftest",
          "id": "25166",
          "name": "tradeofftest",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-02-08T18:43:27.930885+00:00",
          "updatedAt": "2024-02-08T18:43:32.548116+00:00",
          "collectionId": null,
          "isCollection": true,
          "sharedInForum": false,
          "sketchClassId": "746",
          "userAttributes": [
            {
              "label": "Description",
              "value": null,
              "exportId": "descriptionconsider_adding_a_ra",
              "fieldType": "TextArea",
              "valueLabel": null,
              "formElementId": 6294,
              "alternateLanguages": {}
            },
            {
              "label": "Author(s)",
              "value": null,
              "exportId": "authors",
              "fieldType": "ShortText",
              "valueLabel": null,
              "formElementId": 6295,
              "alternateLanguages": {}
            }
          ],
          "descriptionconsider_adding_a_ra": null
        },
        "features": [
          {
            "type": "Feature",
            "id": 25164,
            "bbox": [
              162.89255,
              5.299203,
              162.94028,
              5.3289547
            ],
            "properties": {
              "6289": "mpa1_tradeofftest",
              "id": "25164",
              "name": "mpa1_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:05.815649+00:00",
              "updatedAt": "2024-02-08T18:43:32.548116+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    162.892542493,
                    5.305457111
                  ],
                  [
                    162.901335707,
                    5.299203114
                  ],
                  [
                    162.9044019,
                    5.3042668
                  ],
                  [
                    162.9098551,
                    5.3072225
                  ],
                  [
                    162.9215169,
                    5.3099604
                  ],
                  [
                    162.9272734,
                    5.314938
                  ],
                  [
                    162.9301942,
                    5.3149585
                  ],
                  [
                    162.936756,
                    5.3187885
                  ],
                  [
                    162.9395329,
                    5.3221269
                  ],
                  [
                    162.934538013,
                    5.328954813
                  ],
                  [
                    162.892542493,
                    5.305457111
                  ]
                ],
                [
                  [
                    162.9152226,
                    5.3114682
                  ],
                  [
                    162.9154125,
                    5.3118816
                  ],
                  [
                    162.9156947,
                    5.3111263
                  ],
                  [
                    162.9152226,
                    5.3114682
                  ]
                ]
              ]
            }
          },
          {
            "type": "Feature",
            "id": 25165,
            "bbox": [
              162.89998,
              5.2656755,
              162.912,
              5.283677
            ],
            "properties": {
              "6289": "mpa2_tradeofftest",
              "id": "25165",
              "name": "mpa2_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:21.035183+00:00",
              "updatedAt": "2024-02-08T18:43:30.703963+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    162.899975329,
                    5.280478257
                  ],
                  [
                    162.90870891,
                    5.265675498
                  ],
                  [
                    162.912005774,
                    5.275655553
                  ],
                  [
                    162.9062976,
                    5.2836316
                  ],
                  [
                    162.899975329,
                    5.280478257
                  ]
                ]
              ]
            }
          }
        ]
      },
      "land": {
        "type": "FeatureCollection",
        "bbox": [
          162.69569614270827,
          5.056159471228227,
          163.23952731095758,
          5.578779690482619
        ],
        "features": [
          {
            "type": "Feature",
            "id": "52cd20f6-bccf-4f61-b252-eac0f5a0c26a",
            "properties": {
              "fid": 3,
              "MRGID": 49046,
              "GEONAME": "Micronesian 12 NM",
              "POL_TYPE": "12NM",
              "MRGID_TER1": 8595,
              "TERRITORY1": "Micronesia",
              "MRGID_SOV1": 8595,
              "SOVEREIGN1": "Micronesia",
              "ISO_TER1": "FSM",
              "MRGID_EEZ": 8316,
              "ISO_SOV1": "FSM",
              "UN_SOV1": 583,
              "UN_TER1": 583,
              "ID": 3,
              "line_length": 186455.86262734962,
              "id": "52cd20f6-bccf-4f61-b252-eac0f5a0c26a",
              "name": "featureCollection-b8a98cb3-cfb4-4b51-9f05-d5424d9456d5-0"
            },
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    163.01072237769816,
                    5.578130458093
                  ],
                  [
                    163.03587969075002,
                    5.57764675645106
                  ],
                  [
                    163.0597086632956,
                    5.57423708809327
                  ],
                  [
                    163.0829638161977,
                    5.567991239939929
                  ],
                  [
                    163.10726646389426,
                    5.558056482320339
                  ],
                  [
                    163.12823900591243,
                    5.546223531744857
                  ],
                  [
                    163.14831087049797,
                    5.531406229613637
                  ],
                  [
                    163.1686049519458,
                    5.511976103492088
                  ],
                  [
                    163.18386818211795,
                    5.493330152236553
                  ],
                  [
                    163.19680179464333,
                    5.472972073946025
                  ],
                  [
                    163.21039815701752,
                    5.445535960511194
                  ],
                  [
                    163.22849689660117,
                    5.397616844229091
                  ],
                  [
                    163.23449187358747,
                    5.376547813900345
                  ],
                  [
                    163.23814117396475,
                    5.355151683745348
                  ],
                  [
                    163.23946893054418,
                    5.333457644347035
                  ],
                  [
                    163.23901639300263,
                    5.299529469009471
                  ],
                  [
                    163.23498986325333,
                    5.271322461768079
                  ],
                  [
                    163.22529194494584,
                    5.234734389336552
                  ],
                  [
                    163.21875541866027,
                    5.21611855519231
                  ],
                  [
                    163.2020898271982,
                    5.181661733139634
                  ],
                  [
                    163.18960603320775,
                    5.161048612153166
                  ],
                  [
                    163.1747507539629,
                    5.142080237656373
                  ],
                  [
                    163.14857926575857,
                    5.115069078844769
                  ],
                  [
                    163.12981903051664,
                    5.099978058076459
                  ],
                  [
                    163.10778662494656,
                    5.085908529087135
                  ],
                  [
                    163.08658008312122,
                    5.074546926378531
                  ],
                  [
                    163.0639556437121,
                    5.065741671225254
                  ],
                  [
                    163.0408837460699,
                    5.05982653689783
                  ],
                  [
                    163.0174014854596,
                    5.056703667226529
                  ],
                  [
                    162.98126928333485,
                    5.057025281562403
                  ],
                  [
                    162.944196144323,
                    5.063030411679136
                  ],
                  [
                    162.92170943945072,
                    5.064105371045898
                  ],
                  [
                    162.90011655947652,
                    5.067557860170083
                  ],
                  [
                    162.85036960173417,
                    5.081301791169949
                  ],
                  [
                    162.83034867576893,
                    5.089075470703108
                  ],
                  [
                    162.81164350038645,
                    5.098653317142265
                  ],
                  [
                    162.79441051954618,
                    5.109872871031754
                  ],
                  [
                    162.7774286361812,
                    5.123686423582285
                  ],
                  [
                    162.76323541392506,
                    5.137909053237621
                  ],
                  [
                    162.749450182593,
                    5.154930524552725
                  ],
                  [
                    162.71691699786564,
                    5.209281569910928
                  ],
                  [
                    162.70826939290615,
                    5.229238844421957
                  ],
                  [
                    162.70228614542432,
                    5.248216462137833
                  ],
                  [
                    162.69760560784638,
                    5.271719545637865
                  ],
                  [
                    162.69575257852964,
                    5.295350958080036
                  ],
                  [
                    162.6965541135019,
                    5.322163226491227
                  ],
                  [
                    162.7002065528849,
                    5.345999542570652
                  ],
                  [
                    162.70663272758074,
                    5.369679713803336
                  ],
                  [
                    162.71444424818063,
                    5.390160471224192
                  ],
                  [
                    162.72892208078756,
                    5.418883016459034
                  ],
                  [
                    162.74158850407164,
                    5.438290873344357
                  ],
                  [
                    162.763744960073,
                    5.463550019588055
                  ],
                  [
                    162.7902007922792,
                    5.485167125903445
                  ],
                  [
                    162.8092883580375,
                    5.505900849093152
                  ],
                  [
                    162.829490919989,
                    5.522699239347261
                  ],
                  [
                    162.85056118150393,
                    5.536726410390457
                  ],
                  [
                    162.86992930166966,
                    5.546968417854458
                  ],
                  [
                    162.93299851208874,
                    5.56984028504931
                  ],
                  [
                    162.97111263640218,
                    5.57766563396234
                  ],
                  [
                    163.01072237769816,
                    5.578130458093
                  ]
                ],
                [
                  [
                    162.9395708,
                    5.269442
                  ],
                  [
                    162.9389117,
                    5.2683973
                  ],
                  [
                    162.939947,
                    5.268844
                  ],
                  [
                    162.9395708,
                    5.269442
                  ]
                ],
                [
                  [
                    162.9521912,
                    5.2704213
                  ],
                  [
                    162.9508729,
                    5.2700983
                  ],
                  [
                    162.9514285,
                    5.2696207
                  ],
                  [
                    162.9521912,
                    5.2704213
                  ]
                ],
                [
                  [
                    162.9469473,
                    5.2708045
                  ],
                  [
                    162.9465073,
                    5.2705424
                  ],
                  [
                    162.9477583,
                    5.2704565
                  ],
                  [
                    162.9469473,
                    5.2708045
                  ]
                ],
                [
                  [
                    162.9452218,
                    5.2707315
                  ],
                  [
                    162.9447171,
                    5.2709849
                  ],
                  [
                    162.9446869,
                    5.2705467
                  ],
                  [
                    162.9452218,
                    5.2707315
                  ]
                ],
                [
                  [
                    162.9586182,
                    5.2717418
                  ],
                  [
                    162.9590621,
                    5.2734076
                  ],
                  [
                    162.9548622,
                    5.2699204
                  ],
                  [
                    162.9586182,
                    5.2717418
                  ]
                ],
                [
                  [
                    162.9649153,
                    5.2771431
                  ],
                  [
                    162.9614365,
                    5.2724354
                  ],
                  [
                    162.9543016,
                    5.2691191
                  ],
                  [
                    162.9632913,
                    5.2721112
                  ],
                  [
                    162.9652533,
                    5.2747257
                  ],
                  [
                    162.9649153,
                    5.2771431
                  ]
                ],
                [
                  [
                    162.9040003,
                    5.2931372
                  ],
                  [
                    162.8994268,
                    5.2997717
                  ],
                  [
                    162.8983876,
                    5.2990349
                  ],
                  [
                    162.9049534,
                    5.28759
                  ],
                  [
                    162.9065571,
                    5.2903732
                  ],
                  [
                    162.906029,
                    5.29256
                  ],
                  [
                    162.9040003,
                    5.2931372
                  ]
                ],
                [
                  [
                    162.9154125,
                    5.3111552
                  ],
                  [
                    162.9156947,
                    5.3111263
                  ],
                  [
                    162.9154125,
                    5.3118816
                  ],
                  [
                    162.9154125,
                    5.3111552
                  ]
                ],
                [
                  [
                    162.9493897,
                    5.3552937
                  ],
                  [
                    162.9493682,
                    5.3560415
                  ],
                  [
                    162.9488103,
                    5.355486
                  ],
                  [
                    162.9493897,
                    5.3552937
                  ]
                ],
                [
                  [
                    162.9631251,
                    5.3591286
                  ],
                  [
                    162.9659628,
                    5.3611899
                  ],
                  [
                    162.9650347,
                    5.3625348
                  ],
                  [
                    162.9516296,
                    5.3533157
                  ],
                  [
                    162.9516356,
                    5.3515036
                  ],
                  [
                    162.9543557,
                    5.3532329
                  ],
                  [
                    162.9559601,
                    5.3504169
                  ],
                  [
                    162.957495,
                    5.3503833
                  ],
                  [
                    162.9567392,
                    5.3544958
                  ],
                  [
                    162.9631251,
                    5.3591286
                  ]
                ],
                [
                  [
                    162.9618981,
                    5.2792692
                  ],
                  [
                    162.9613664,
                    5.2765193
                  ],
                  [
                    162.9628997,
                    5.2791255
                  ],
                  [
                    162.9618981,
                    5.2792692
                  ]
                ],
                [
                  [
                    163.0200536,
                    5.3388502
                  ],
                  [
                    163.0175789,
                    5.3349624
                  ],
                  [
                    163.0204576,
                    5.3366703
                  ],
                  [
                    163.0216617,
                    5.3349414
                  ],
                  [
                    163.0197705,
                    5.3321857
                  ],
                  [
                    163.0294265,
                    5.3274492
                  ],
                  [
                    163.032707,
                    5.3278957
                  ],
                  [
                    163.0326915,
                    5.3336612
                  ],
                  [
                    163.0320643,
                    5.3325539
                  ],
                  [
                    163.0217799,
                    5.3349862
                  ],
                  [
                    163.0199352,
                    5.3394737
                  ],
                  [
                    163.0224132,
                    5.3499736
                  ],
                  [
                    163.0218335,
                    5.3638208
                  ],
                  [
                    163.0190884,
                    5.3683129
                  ],
                  [
                    162.9912933,
                    5.3693304
                  ],
                  [
                    162.9737659,
                    5.3633007
                  ],
                  [
                    162.9613345,
                    5.3554315
                  ],
                  [
                    162.9607607,
                    5.3513115
                  ],
                  [
                    162.9639284,
                    5.3515778
                  ],
                  [
                    162.9629617,
                    5.3457
                  ],
                  [
                    162.9579632,
                    5.3440411
                  ],
                  [
                    162.95568,
                    5.3398222
                  ],
                  [
                    162.9512987,
                    5.3372007
                  ],
                  [
                    162.9494886,
                    5.3325516
                  ],
                  [
                    162.9464854,
                    5.3307698
                  ],
                  [
                    162.9451689,
                    5.3249737
                  ],
                  [
                    162.9215169,
                    5.3099604
                  ],
                  [
                    162.9091883,
                    5.3070846
                  ],
                  [
                    162.9044019,
                    5.3042668
                  ],
                  [
                    162.9008476,
                    5.2982965
                  ],
                  [
                    162.9059821,
                    5.2929432
                  ],
                  [
                    162.9095307,
                    5.2838368
                  ],
                  [
                    162.9068966,
                    5.287069
                  ],
                  [
                    162.9046811,
                    5.2868061
                  ],
                  [
                    162.9048679,
                    5.2855363
                  ],
                  [
                    162.9123786,
                    5.2754122
                  ],
                  [
                    162.942439,
                    5.2661201
                  ],
                  [
                    162.9531043,
                    5.2687431
                  ],
                  [
                    162.9400561,
                    5.2675951
                  ],
                  [
                    162.9312249,
                    5.2711203
                  ],
                  [
                    162.94863,
                    5.2713288
                  ],
                  [
                    162.9515523,
                    5.272892
                  ],
                  [
                    162.9543851,
                    5.2717377
                  ],
                  [
                    162.954348,
                    5.2728418
                  ],
                  [
                    162.9576496,
                    5.2729157
                  ],
                  [
                    162.9580926,
                    5.2770883
                  ],
                  [
                    162.9645101,
                    5.2820279
                  ],
                  [
                    162.9679879,
                    5.2811865
                  ],
                  [
                    162.9711926,
                    5.2771694
                  ],
                  [
                    162.977607,
                    5.2765677
                  ],
                  [
                    162.9763781,
                    5.276646
                  ],
                  [
                    162.9743972,
                    5.2706167
                  ],
                  [
                    162.9869663,
                    5.2613485
                  ],
                  [
                    163.0025897,
                    5.2592919
                  ],
                  [
                    163.00881,
                    5.2629648
                  ],
                  [
                    163.0168517,
                    5.2721453
                  ],
                  [
                    163.0207958,
                    5.2745135
                  ],
                  [
                    163.0265962,
                    5.2876299
                  ],
                  [
                    163.0297639,
                    5.2912503
                  ],
                  [
                    163.0302976,
                    5.2979482
                  ],
                  [
                    163.0343412,
                    5.3095767
                  ],
                  [
                    163.0356302,
                    5.316776
                  ],
                  [
                    163.0320194,
                    5.3205002
                  ],
                  [
                    163.0286741,
                    5.3215203
                  ],
                  [
                    163.0227598,
                    5.3181209
                  ],
                  [
                    163.0156152,
                    5.3241457
                  ],
                  [
                    163.0167445,
                    5.3271755
                  ],
                  [
                    163.0148095,
                    5.330301
                  ],
                  [
                    163.015754,
                    5.3371477
                  ],
                  [
                    163.0177685,
                    5.3397055
                  ],
                  [
                    163.0174155,
                    5.3450617
                  ],
                  [
                    163.019339,
                    5.346614
                  ],
                  [
                    163.019324,
                    5.3509934
                  ],
                  [
                    163.0203567,
                    5.3494244
                  ],
                  [
                    163.0179406,
                    5.3411042
                  ],
                  [
                    163.0200536,
                    5.3388502
                  ]
                ],
                [
                  [
                    163.0305076,
                    5.3349202
                  ],
                  [
                    163.0300771,
                    5.3346071
                  ],
                  [
                    163.0306223,
                    5.3343887
                  ],
                  [
                    163.0305076,
                    5.3349202
                  ]
                ],
                [
                  [
                    163.0205051,
                    5.3361222
                  ],
                  [
                    163.0196973,
                    5.3350077
                  ],
                  [
                    163.0204113,
                    5.3346812
                  ],
                  [
                    163.0205051,
                    5.3361222
                  ]
                ],
                [
                  [
                    163.0237675,
                    5.3386307
                  ],
                  [
                    163.0235454,
                    5.3381707
                  ],
                  [
                    163.0238205,
                    5.3380576
                  ],
                  [
                    163.0237675,
                    5.3386307
                  ]
                ],
                [
                  [
                    163.019086,
                    5.339894
                  ],
                  [
                    163.0183636,
                    5.3402038
                  ],
                  [
                    163.018065,
                    5.3394971
                  ],
                  [
                    163.019086,
                    5.339894
                  ]
                ],
                [
                  [
                    163.0198184,
                    5.3485723
                  ],
                  [
                    163.0195181,
                    5.3483799
                  ],
                  [
                    163.019808,
                    5.3478851
                  ],
                  [
                    163.0198184,
                    5.3485723
                  ]
                ],
                [
                  [
                    162.9607628,
                    5.3487889
                  ],
                  [
                    162.9608095,
                    5.3491345
                  ],
                  [
                    162.9604516,
                    5.3491307
                  ],
                  [
                    162.9607628,
                    5.3487889
                  ]
                ],
                [
                  [
                    163.0201428,
                    5.3494519
                  ],
                  [
                    163.0199288,
                    5.349555
                  ],
                  [
                    163.0196734,
                    5.3489777
                  ],
                  [
                    163.0201428,
                    5.3494519
                  ]
                ],
                [
                  [
                    162.9621291,
                    5.3500745
                  ],
                  [
                    162.9623222,
                    5.3507154
                  ],
                  [
                    162.961546,
                    5.3505942
                  ],
                  [
                    162.9621291,
                    5.3500745
                  ]
                ]
              ]
            }
          }
        ]
      }
    },
    "functionName": "printMap"
  },
  {
    "sketchName": "tradeofftest",
    "results": {
      "metrics": [
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "25164",
          "groupId": null,
          "value": 1080657.135127,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 1080657.135127,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "25165",
          "groupId": null,
          "value": 37246.776253,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 37246.776253,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "25166",
          "groupId": null,
          "value": 1117903.911379,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 1117903.911379,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "25164",
          "groupId": "band-0",
          "value": 8768.888685,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 8768.888685,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "25165",
          "groupId": "band-0",
          "value": 317.423315,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 317.423315,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "25166",
          "groupId": "band-0",
          "value": 9086.312,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 9086.312,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "25164",
          "groupId": null,
          "value": 5019267.816824,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "25164",
          "groupId": "mpa",
          "value": 5019267.816824,
          "extra": {
            "sketchName": "mpa1_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "25165",
          "groupId": null,
          "value": 1228786.242812,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "25165",
          "groupId": "mpa",
          "value": 1228786.242812,
          "extra": {
            "sketchName": "mpa2_tradeofftest"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "25166",
          "groupId": null,
          "value": 6248054.059636,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "25166",
          "groupId": "mpa",
          "value": 6248054.059636,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "25166",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "tradeofftest",
            "isCollection": true
          }
        }
      ],
      "sketch": {
        "id": 25166,
        "type": "FeatureCollection",
        "features": [
          {
            "id": 25164,
            "bbox": [
              162.89255,
              5.299203,
              162.94028,
              5.3289547
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa1_tradeofftest",
              "id": "25164",
              "name": "mpa1_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:05.815649+00:00",
              "updatedAt": "2024-02-08T18:43:32.548116+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          },
          {
            "id": 25165,
            "bbox": [
              162.89998,
              5.2656755,
              162.912,
              5.283677
            ],
            "type": "Feature",
            "properties": {
              "6289": "mpa2_tradeofftest",
              "id": "25165",
              "name": "mpa2_tradeofftest",
              "postId": null,
              "userId": "531",
              "authors": null,
              "userSlug": "Abby",
              "createdAt": "2024-02-08T18:43:21.035183+00:00",
              "updatedAt": "2024-02-08T18:43:30.703963+00:00",
              "collectionId": "25166",
              "isCollection": false,
              "sharedInForum": false,
              "sketchClassId": "745",
              "userAttributes": [
                {
                  "label": "Description",
                  "value": null,
                  "exportId": "descriptionconsider_adding_a_ra",
                  "fieldType": "TextArea",
                  "valueLabel": null,
                  "formElementId": 6291,
                  "alternateLanguages": {}
                },
                {
                  "label": "Author(s)",
                  "value": null,
                  "exportId": "authors",
                  "fieldType": "ShortText",
                  "valueLabel": null,
                  "formElementId": 6292,
                  "alternateLanguages": {}
                }
              ],
              "descriptionconsider_adding_a_ra": null
            },
            "geometry": null
          }
        ],
        "properties": {
          "6293": "tradeofftest",
          "id": "25166",
          "name": "tradeofftest",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-02-08T18:43:27.930885+00:00",
          "updatedAt": "2024-02-08T18:43:32.548116+00:00",
          "collectionId": null,
          "isCollection": true,
          "sharedInForum": false,
          "sketchClassId": "746",
          "userAttributes": [
            {
              "label": "Description",
              "value": null,
              "exportId": "descriptionconsider_adding_a_ra",
              "fieldType": "TextArea",
              "valueLabel": null,
              "formElementId": 6294,
              "alternateLanguages": {}
            },
            {
              "label": "Author(s)",
              "value": null,
              "exportId": "authors",
              "fieldType": "ShortText",
              "valueLabel": null,
              "formElementId": 6295,
              "alternateLanguages": {}
            }
          ],
          "descriptionconsider_adding_a_ra": null
        }
      }
    },
    "functionName": "tradeoffValueOverlap"
  }
]
      });

      export const tradeofftest = () => (
        <Translator>
          <Group />
        </Translator>
      );

      export default {
        component: Group,
        title: 'Project/Components/Group',
        name: 'tradeofftest',
        decorators: [createReportDecorator(contextValue)],
      };
    