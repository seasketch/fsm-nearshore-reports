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
 * SimpleSum component
 */
export const SimpleSum: React.FunctionComponent<GeogProp> = (props) => {
  const { t } = useTranslation();
  const [{ isCollection }] = useSketchProperties();
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });

  return (
    <ResultsCard
      title={t("SimpleSum")}
      functionName="simpleSum"
      extraParams={{ geographyIds: [curGeography.geographyId] }}
    >
      {(data: ReportResult) => {
        const paramStr = JSON.stringify(data.metrics, null, 2);
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
