import React from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  ClassTable,
  Collapse,
  LayerToggle,
  ReportError,
  ResultsCard,
  Skeleton,
  SketchClassTable,
  ToolbarCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import {
  GeogProp,
  Metric,
  MetricGroup,
  ReportResult,
  SketchProperties,
  flattenBySketchAllClass,
  metricsWithSketchId,
  squareMeterToKilometer,
  toPercentMetric,
} from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";
import {
  genAreaGroupLevelTable,
  genAreaSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports.js";
import { ReportProps } from "../util/ReportProp.js";

/**
 * YapProtectedAreas
 */
export const YapProtectedAreas: React.FunctionComponent<ReportProps> = (
  props,
) => {
  const { t } = useTranslation();
  const [{ isCollection, id, childProperties }] = useSketchProperties();
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });

  // Metrics
  const mg = project.getMetricGroup("yapProtectedAreas", t);
  const precalcMetrics = project.getPrecalcMetrics(
    mg,
    "area",
    curGeography.geographyId,
  );

  // Labels
  const titleLabel = t("Protected Areas");

  return (
    <ResultsCard
      title={titleLabel}
      functionName="yapProtectedAreas"
      extraParams={{ geographyIds: [curGeography.geographyId] }}
      useChildCard
    >
      {(data: ReportResult) => {
        if (!data || !data.metrics) return <Skeleton />;
        return (
          <ReportError>
            <ToolbarCard
              title={titleLabel}
              items={
                <LayerToggle
                  label={t("Show on Map")}
                  layerId={mg.layerId}
                  simple
                />
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
                  <Trans i18nKey="YapProtectedAreas - learn more">
                    <p>
                      📈 Report: The percentage of each existing protected areas
                      within this plan is calculated by finding the area of each
                      protected area within the plan, then dividing it by the
                      total area of each protected area. If the plan includes
                      multiple areas that overlap, the overlap is only counted
                      once.
                    </p>
                  </Trans>
                </Collapse>
              )}
            </ToolbarCard>
          </ReportError>
        );
      }}
    </ResultsCard>
  );
};

const genSketchTable = (
  data: ReportResult,
  metricGroup: MetricGroup,
  precalcMetrics: Metric[],
  childProperties: SketchProperties[],
) => {
  const childSketchIds = childProperties
    ? childProperties.map((skp) => skp.id)
    : [];
  // Build agg metric objects for each child sketch in collection with percValue for each class
  const childSketchMetrics = toPercentMetric(
    metricsWithSketchId(
      data.metrics.filter((m) => m.metricId === metricGroup.metricId),
      childSketchIds,
    ),
    precalcMetrics,
  );
  const sketchRows = flattenBySketchAllClass(
    childSketchMetrics,
    metricGroup.classes,
    childProperties,
  );
  return (
    <SketchClassTable rows={sketchRows} metricGroup={metricGroup} formatPerc />
  );
};
