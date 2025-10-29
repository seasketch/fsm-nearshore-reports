import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Collapse,
  ReportError,
  ResultsCard,
  Skeleton,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import { ReportResult } from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";
import { ReportProps } from "../util/ReportProp.js";
import {
  genPercGroupLevelTable,
  genSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports.js";

/**
 * Reef Monitoring component
 */
export const ReefMonitoring: React.FunctionComponent<ReportProps> = (props) => {
  const { t } = useTranslation();
  const [{ isCollection, childProperties }] = useSketchProperties();
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });

  // Metrics
  const mg = project.getMetricGroup("reefMonitoring", t);
  const precalcMetrics = project.getPrecalcMetrics(
    mg,
    "sum",
    curGeography.geographyId,
  );

  // Labels
  const titleLabel = t("Reef Monitoring");

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard
        title={titleLabel}
        functionName="reefMonitoring"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
      >
        {(data: ReportResult) => {
          if (!data || !data.metrics) return <Skeleton />;

          return (
            <ReportError>
              {isCollection
                ? groupedCollectionReport(data, precalcMetrics, mg, t)
                : groupedSketchReport(data, precalcMetrics, mg, t)}

              {isCollection && (
                <>
                  <Collapse
                    title={t("Show by Zone Type")}
                    collapsed={!props.printing}
                    key={String(props.printing) + "Zone Type"}
                  >
                    {genPercGroupLevelTable(
                      data,
                      precalcMetrics,
                      mg,
                      t,
                      props.printing,
                    )}
                  </Collapse>
                  <Collapse
                    title={t("Show by Zone")}
                    collapsed={!props.printing}
                    key={String(props.printing) + "Zone"}
                  >
                    {genSketchTable(
                      data,
                      mg,
                      precalcMetrics,
                      childProperties || [],
                      props.printing,
                    )}
                  </Collapse>
                </>
              )}

              {!props.printing && (
                <Collapse
                  title={t("Learn More")}
                  collapsed={!props.printing}
                  key={String(props.printing) + "Learn More"}
                >
                  <Trans i18nKey="ReefMonitoring - learn more">
                    <p>
                      ℹ️ Overview: Reef health scores for benthos and fish were
                      obtained from Dr Peter Houk. The fish assemblage health
                      score is derived from reef monitoring data on: fish
                      biomass, size structure, heterogeneity, evenness and
                      predcator biomass. The benthic substrate health score is
                      derived from reef monitoring data on: coral cover, coral
                      evenness, substrate ratio, and macroalgae cover. More
                      details on the monitoring website:
                      https://micronesiareefmonitoring.com The reef health score
                      was then interpolated in R, restricting the interpolation
                      to the reef extent defined as the extent of the modified
                      Millenium Coral Reef geomorphology layer (also in
                      Seasketch).
                    </p>
                    <p>
                      📈 Report: This report calculates the sum of benthic and
                      fish scores within the area. These value are divided by
                      the total value of score to obtain the % contained within
                      the area.
                    </p>
                  </Trans>
                </Collapse>
              )}
            </ReportError>
          );
        }}
      </ResultsCard>
    </div>
  );
};
