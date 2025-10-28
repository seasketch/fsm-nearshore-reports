import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Collapse,
  LayerToggle,
  ResultsCard,
  Skeleton,
  ToolbarCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import { ReportResult } from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";
import {
  genAreaGroupLevelTable,
  genAreaSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports.js";
import { ReportProps } from "../util/ReportProp.js";

/**
 * SpawnAgg component
 */
export const SpawnAgg: React.FunctionComponent<ReportProps> = (props) => {
  const [{ isCollection, childProperties }] = useSketchProperties();
  const { t } = useTranslation();
  const mg = project.getMetricGroup("spawnAgg", t);
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
        title={t("Spawning Aggregations")}
        functionName="spawnAgg"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
      >
        {(data: ReportResult) => {
          if (!data || !data.metrics) return <Skeleton />;

          return (
            <>
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
                  <Trans i18nKey="Spawning Aggregations - learn more">
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
            </>
          );
        }}
      </ResultsCard>
    </div>
  );
};
