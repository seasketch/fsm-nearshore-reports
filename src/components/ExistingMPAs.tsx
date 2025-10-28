import React from "react";
import {
  ResultsCard,
  Skeleton,
  LayerToggle,
  ToolbarCard,
  VerticalSpacer,
  KeySection,
} from "@seasketch/geoprocessing/client-ui";
import {
  percentWithEdge,
  roundLower,
  squareMeterToKilometer,
} from "@seasketch/geoprocessing/client-core";
import { useTranslation } from "react-i18next";
import { ReportProps } from "../util/ReportProp.js";
import projectClient from "../../project/projectClient.js";

export const ExistingMPAs: React.FunctionComponent<ReportProps> = () => {
  const { t } = useTranslation();
  const metricGroup = projectClient.getMetricGroup("existingMPAs");
  const title = t("Existing Protected Areas");

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard title={title} functionName="existingMPAs" useChildCard>
        {(data: { overlap: number; overlapPerc: number }) => {
          if (!data) return <Skeleton />;

          return (
            <ToolbarCard
              title={title}
              items={
                <>
                  <LayerToggle
                    label={t("Show on Map")}
                    layerId={metricGroup.layerId}
                    simple
                  />
                </>
              }
            >
              <VerticalSpacer />
              <KeySection>
                <b>
                  {percentWithEdge(data.overlapPerc)} (
                  {Number(data.overlap) !== 0
                    ? roundLower(squareMeterToKilometer(Number(data.overlap)))
                    : 0}{" "}
                  km²)
                </b>{" "}
                of this area is within existing protected areas.
              </KeySection>
            </ToolbarCard>
          );
        }}
      </ResultsCard>
    </div>
  );
};
