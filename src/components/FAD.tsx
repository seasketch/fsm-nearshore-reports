import React from "react";
import {
  ResultsCard,
  Skeleton,
  ObjectiveStatus,
  Card,
  LayerToggle,
} from "@seasketch/geoprocessing/client-ui";
import {
  OBJECTIVE_NO,
  OBJECTIVE_YES,
  Metric,
} from "@seasketch/geoprocessing/client-core";
import { useTranslation } from "react-i18next";
import { ReportProps } from "../util/ReportProp.js";
import projectClient from "../../project/projectClient.js";

export const FAD: React.FunctionComponent<ReportProps> = () => {
  const { t } = useTranslation();
  const metricGroup = projectClient.getMetricGroup("fad");

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard title={t("FAD")} functionName="fad" useChildCard>
        {(data: Metric) => {
          if (!data) return <Skeleton />;
          const value = data.value;

          return (
            <Card>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ flex: "0 0 90%" }}>
                  <ObjectiveStatus
                    status={value === 0 ? OBJECTIVE_YES : OBJECTIVE_NO}
                    msg={
                      value === 0 ? (
                        <>This area does not overlap with the Sroac FAD</>
                      ) : (
                        <>This area overlaps with the Sroac FAD</>
                      )
                    }
                  />
                </div>
                <LayerToggle label="" layerId={metricGroup.layerId} simple />
              </div>
            </Card>
          );
        }}
      </ResultsCard>
    </div>
  );
};
