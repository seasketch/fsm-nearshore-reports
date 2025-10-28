import React from "react";
import {
  ToolbarCard,
  Collapse,
  LayerToggle,
  ResultsCard,
  Skeleton,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import { ReportResult } from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";
import { Trans, useTranslation } from "react-i18next";
import {
  genAreaGroupLevelTable,
  genAreaSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports.js";
import { ReportProps } from "../util/ReportProp.js";

export const Mangroves: React.FunctionComponent<ReportProps> = (props) => {
  const [{ isCollection, childProperties }] = useSketchProperties();
  const { t } = useTranslation();
  const mg = project.getMetricGroup("mangroves", t);
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });
  const precalcMetrics = project.getPrecalcMetrics(
    mg,
    "area",
    curGeography.geographyId,
  );

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard
        title={t("Mangroves")}
        functionName="mangroves"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
        useChildCard
      >
        {(data: ReportResult) => {
          if (!data || !data.metrics) return <Skeleton />;

          return (
            <ToolbarCard
              title={t("Mangroves")}
              items={
                <>
                  <LayerToggle
                    label={t("Show on Map")}
                    layerId={mg.layerId}
                    simple
                  />
                </>
              }
            >
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
                    {genAreaGroupLevelTable(
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
                    {genAreaSketchTable(
                      data,
                      precalcMetrics,
                      mg,
                      t,
                      childProperties || [],
                      props.printing,
                    )}
                  </Collapse>
                </>
              )}

              {!props.printing && (
                <Collapse title={t("Learn more")}>
                  <Trans i18nKey="Mangroves - learn more">
                    <p>
                      ℹ️ Data source: Mangrove distribution data subset from the
                      full vegetation map created by USGS in 2008. USGS
                      description: “detailed vegetation map for Kosrae of FSM
                      derived from high resolution QuickBird
                      pansharpened-natural color image”
                    </p>
                    <p>
                      📈 Report: The percentage of each feature type within this
                      plan is calculated by finding the overlap of each feature
                      type with the plan, summing its area, then dividing it by
                      the total area of each feature type found within the
                      selected nearshore planning area. If the plan includes
                      multiple areas that overlap, the overlap is only counted
                      once.
                    </p>
                  </Trans>
                </Collapse>
              )}
            </ToolbarCard>
          );
        }}
      </ResultsCard>
    </div>
  );
};
