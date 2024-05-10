
      import React from "react";
      import { OUSCard } from '.././OUSCard.jsx';
      import {
        createReportDecorator,
        sampleSketchReportContextValue,
      } from "@seasketch/geoprocessing/client-ui";
      import Translator from "/home/twelch/src/fsm-nearshore-reports/src/components/TranslatorAsync.js";

      const contextValue = sampleSketchReportContextValue({
        visibleLayers: [],
        exampleOutputs: [
  {
    "sketchName": "pohnpei",
    "results": {
      "metrics": [
        {
          "geographyId": "kosrae",
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "24608",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "boundaryAreaOverlap",
          "classId": "nearshore",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        }
      ],
      "sketch": {
        "id": 24608,
        "bbox": [
          157.90259,
          6.9638658,
          158.03699,
          7.099727
        ],
        "type": "Feature",
        "properties": {
          "6289": "pohnpei",
          "id": "24608",
          "name": "pohnpei",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-01-19T18:33:19.730358+00:00",
          "updatedAt": "2024-01-19T18:33:19.730358+00:00",
          "collectionId": null,
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
    },
    "functionName": "boundaryAreaOverlap"
  },
  {
    "sketchName": "pohnpei",
    "results": {
      "metrics": [
        {
          "geographyId": null,
          "metricId": "groupCountOverlap",
          "classId": "mpa",
          "sketchId": null,
          "groupId": "mpa",
          "value": 1
        }
      ],
      "sketch": {
        "id": 24608,
        "bbox": [
          157.90259,
          6.9638658,
          158.03699,
          7.099727
        ],
        "type": "Feature",
        "properties": {
          "6289": "pohnpei",
          "id": "24608",
          "name": "pohnpei",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-01-19T18:33:19.730358+00:00",
          "updatedAt": "2024-01-19T18:33:19.730358+00:00",
          "collectionId": null,
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
    },
    "functionName": "groupCountOverlap"
  },
  {
    "sketchName": "pohnpei",
    "results": {
      "metrics": [
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "24608",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Coral/Algae",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "24608",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Microalgal Mats",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "24608",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rock",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "24608",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Rubble",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "24608",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Sand",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "24608",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "habitatAreaOverlap",
          "classId": "Seagrass",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        }
      ],
      "sketch": {
        "id": 24608,
        "bbox": [
          157.90259,
          6.9638658,
          158.03699,
          7.099727
        ],
        "type": "Feature",
        "properties": {
          "6289": "pohnpei",
          "id": "24608",
          "name": "pohnpei",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-01-19T18:33:19.730358+00:00",
          "updatedAt": "2024-01-19T18:33:19.730358+00:00",
          "collectionId": null,
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
    },
    "functionName": "habitatAreaOverlap"
  },
  {
    "sketchName": "pohnpei",
    "results": {
      "metrics": [
        {
          "geographyId": "kosrae",
          "metricId": "ousPeopleCount",
          "classId": "ousPeopleCount_all",
          "sketchId": "24608",
          "groupId": null,
          "value": 0
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousRespondentCount",
          "classId": "ousRespondentCount_all",
          "sketchId": "24608",
          "groupId": null,
          "value": 0
        }
      ],
      "sketch": {
        "id": 24608,
        "bbox": [
          157.90259,
          6.9638658,
          158.03699,
          7.099727
        ],
        "type": "Feature",
        "properties": {
          "6289": "pohnpei",
          "id": "24608",
          "name": "pohnpei",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-01-19T18:33:19.730358+00:00",
          "updatedAt": "2024-01-19T18:33:19.730358+00:00",
          "collectionId": null,
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
    },
    "functionName": "ousDemographicOverlap"
  },
  {
    "sketchName": "pohnpei",
    "results": {
      "metrics": [
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_aquaculture",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_community_recreational_use",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_construction_infrastructure",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_cultural_use",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_fisheries",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_maritime_activity",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_research",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_tourism",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "ousValueOverlap",
          "classId": "ous_transportation",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        }
      ],
      "sketch": {
        "id": 24608,
        "bbox": [
          157.90259,
          6.9638658,
          158.03699,
          7.099727
        ],
        "type": "Feature",
        "properties": {
          "6289": "pohnpei",
          "id": "24608",
          "name": "pohnpei",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-01-19T18:33:19.730358+00:00",
          "updatedAt": "2024-01-19T18:33:19.730358+00:00",
          "collectionId": null,
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
    },
    "functionName": "ousValueOverlap"
  },
  {
    "sketchName": "pohnpei",
    "results": {
      "sketch": {
        "type": "Feature",
        "id": 24608,
        "bbox": [
          157.90259,
          6.9638658,
          158.03699,
          7.099727
        ],
        "properties": {
          "6289": "pohnpei",
          "id": "24608",
          "name": "pohnpei",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-01-19T18:33:19.730358+00:00",
          "updatedAt": "2024-01-19T18:33:19.730358+00:00",
          "collectionId": null,
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
                157.902591505,
                7.033036468
              ],
              [
                157.974770459,
                6.963865676
              ],
              [
                158.036993696,
                7.003393098
              ],
              [
                157.979748318,
                7.099727119
              ],
              [
                157.902591505,
                7.033036468
              ]
            ]
          ]
        }
      },
      "land": {
        "type": "FeatureCollection",
        "bbox": [
          null,
          null,
          null,
          null
        ],
        "features": []
      }
    },
    "functionName": "printMap"
  },
  {
    "sketchName": "pohnpei",
    "results": {
      "metrics": [
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "24608",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "benthic_tradeoff",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "24608",
          "groupId": "band-0",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": "kosrae",
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "fisheries_tradeoff",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "24608",
          "groupId": null,
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "24608",
          "groupId": "mpa",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        },
        {
          "geographyId": null,
          "metricId": "tradeoffValueOverlap",
          "classId": "nearshore",
          "sketchId": "24608",
          "groupId": "aquaculture",
          "value": 0,
          "extra": {
            "sketchName": "pohnpei"
          }
        }
      ],
      "sketch": {
        "id": 24608,
        "bbox": [
          157.90259,
          6.9638658,
          158.03699,
          7.099727
        ],
        "type": "Feature",
        "properties": {
          "6289": "pohnpei",
          "id": "24608",
          "name": "pohnpei",
          "postId": null,
          "userId": "531",
          "authors": null,
          "userSlug": "Abby",
          "createdAt": "2024-01-19T18:33:19.730358+00:00",
          "updatedAt": "2024-01-19T18:33:19.730358+00:00",
          "collectionId": null,
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
    },
    "functionName": "tradeoffValueOverlap"
  }
]
      });

      export const pohnpei = () => (
        <Translator>
          <OUSCard />
        </Translator>
      );

      export default {
        component: OUSCard,
        title: 'Project/Components/OUSCard',
        name: 'pohnpei',
        decorators: [createReportDecorator(contextValue)],
      };
    