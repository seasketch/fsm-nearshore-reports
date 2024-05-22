/**
 * @jest-environment node
 * @group smoke
 */
import { ousDemographicOverlap } from "./ousDemographicOverlap.js";
import {
  getExamplePolygonSketchAll,
  writeResultOutput,
} from "@seasketch/geoprocessing/scripts/testing";
import { describe, test, expect } from "vitest";
import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";

describe("Basic smoke tests", () => {
  test("handler function is present", () => {
    expect(typeof ousDemographicOverlap).toBe("function");
  });
  test("ousDemographicOverlapSmoke - tests run against all examples", async () => {
    const examples = await getExamplePolygonSketchAll();

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock("Lambda", "invoke", {
      StatusCode: 200,
      ExecutedVersion: '$LATEST',
      Payload: '{"statusCode":200,"headers":{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":true,"Cache-Control":"max-age=30, stale-while-revalidate=86400","x-gp-cache":"Cache miss"},"body":"{\\"id\\":\\"29407-2024-05-22T22:20:06.345455+00:00-6b774228ecd9a3ec931ed424c123c697\\",\\"service\\":\\"ousDemographicOverlapChild\\",\\"wss\\":\\"wss://.execute-api..amazonaws.com/\\",\\"location\\":\\"/ousDemographicOverlapChild/tasks/29407-2024-05-22T22:20:06.345455+00:00-6b774228ecd9a3ec931ed424c123c697\\",\\"startedAt\\":\\"2024-05-22T22:20:09.962Z\\",\\"logUriTemplate\\":\\"/ousDemographicOverlapChild/tasks/29407-2024-05-22T22:20:06.345455+00:00-6b774228ecd9a3ec931ed424c123c697/logs{?limit,nextToken}\\",\\"geometryUri\\":\\"/ousDemographicOverlapChild/tasks/29407-2024-05-22T22:20:06.345455+00:00-6b774228ecd9a3ec931ed424c123c697/geometry\\",\\"status\\":\\"completed\\",\\"estimate\\":1162,\\"data\\":{\\"stats\\":{\\"respondents\\":13,\\"people\\":60,\\"bySector\\":{\\"Transportation\\":{\\"respondents\\":7,\\"people\\":7},\\"Fisheries\\":{\\"respondents\\":10,\\"people\\":47},\\"Cultural Use\\":{\\"respondents\\":3,\\"people\\":11},\\"Community Recreational Use\\":{\\"respondents\\":2,\\"people\\":14}},\\"byMunicipality\\":{\\"Tafunsak\\":{\\"respondents\\":3,\\"people\\":11},\\"Walung\\":{\\"respondents\\":10,\\"people\\":49}},\\"byGear\\":{\\"unknown-gear\\":{\\"respondents\\":11,\\"people\\":31},\\"Bottom Fishing\\":{\\"respondents\\":3,\\"people\\":16},\\"Trap / Fish Fence / Gill Net\\":{\\"respondents\\":3,\\"people\\":12},\\"Vertical Longline\\":{\\"respondents\\":2,\\"people\\":14},\\"Spear/Harpoon\\":{\\"respondents\\":1,\\"people\\":3},\\"Trolling\\":{\\"respondents\\":2,\\"people\\":8},\\"Gathering / Reef Gleaning\\":{\\"respondents\\":1,\\"people\\":3},\\"Casting\\":{\\"respondents\\":1,\\"people\\":4}}},\\"metrics\\":[{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":60,\\"classId\\":\\"ousPeopleCount_all\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":13,\\"classId\\":\\"ousRespondentCount_all\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":7,\\"classId\\":\\"Transportation\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":7,\\"classId\\":\\"Transportation\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":47,\\"classId\\":\\"Fisheries\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":10,\\"classId\\":\\"Fisheries\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":11,\\"classId\\":\\"Cultural Use\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":3,\\"classId\\":\\"Cultural Use\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":14,\\"classId\\":\\"Community Recreational Use\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":2,\\"classId\\":\\"Community Recreational Use\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":11,\\"classId\\":\\"Tafunsak\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":3,\\"classId\\":\\"Tafunsak\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":49,\\"classId\\":\\"Walung\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":10,\\"classId\\":\\"Walung\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":31,\\"classId\\":\\"unknown-gear\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":11,\\"classId\\":\\"unknown-gear\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":16,\\"classId\\":\\"Bottom Fishing\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":3,\\"classId\\":\\"Bottom Fishing\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":12,\\"classId\\":\\"Trap / Fish Fence / Gill Net\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":3,\\"classId\\":\\"Trap / Fish Fence / Gill Net\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":14,\\"classId\\":\\"Vertical Longline\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":2,\\"classId\\":\\"Vertical Longline\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":3,\\"classId\\":\\"Spear/Harpoon\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":1,\\"classId\\":\\"Spear/Harpoon\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":8,\\"classId\\":\\"Trolling\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":2,\\"classId\\":\\"Trolling\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":3,\\"classId\\":\\"Gathering / Reef Gleaning\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":1,\\"classId\\":\\"Gathering / Reef Gleaning\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousPeopleCount\\",\\"value\\":4,\\"classId\\":\\"Casting\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"},{\\"metricId\\":\\"ousRespondentCount\\",\\"value\\":1,\\"classId\\":\\"Casting\\",\\"groupId\\":null,\\"geographyId\\":null,\\"sketchId\\":\\"29407\\"}]},\\"duration\\":1594}"}'
    });

    for (const example of examples) {
      const result = await ousDemographicOverlap(
        example,
        {},
        {
          geometryUri:
            "https://api.seasket.ch/sketches/29375.geojson.json?reporting_access_token=XXX",
        }
      );
      expect(result).toBeTruthy();
      writeResultOutput(result, "ousDemographicOverlap", example.properties.name);
    }

    AWSMock.restore("Lambda");
  }, 500000);
});
