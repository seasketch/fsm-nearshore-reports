import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  ReportError,
  ResultsCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import { GeogProp, ReportResult } from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";

/**
 * SimpleSync component
 */
export const SimpleSync: React.FunctionComponent<GeogProp> = (props) => {
  const { t } = useTranslation();
  const [{ isCollection }] = useSketchProperties();
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });

  return (
    <ResultsCard
      title={t("SimpleSync")}
      functionName="simpleSync"
      extraParams={{
        geographyIds: ["geog1", "geog2"],
      }}
    >
      {(data: ReportResult) => {
        const paramStr = JSON.stringify(data);
        return (
          <ReportError>
            <p>
              Result:
              {paramStr}
            </p>
          </ReportError>
        );
      }}
    </ResultsCard>
  );
};
