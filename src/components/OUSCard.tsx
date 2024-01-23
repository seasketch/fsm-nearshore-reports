import React, { useState } from "react";
import {
  Collapse,
  ResultsCard,
  SketchClassTable,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  toNullSketchArray,
  flattenBySketchAllClass,
  metricsWithSketchId,
  Metric,
  MetricGroup,
  toPercentMetric,
  GeogProp,
} from "@seasketch/geoprocessing/client-core";
import project from "../../project";
import { Trans, useTranslation } from "react-i18next";
import Translator from "./TranslatorAsync";
import {
  genSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports";

export const OUSCard: React.FunctionComponent<GeogProp> = (props) => {
  const [{ isCollection }] = useSketchProperties();
  const { t, i18n } = useTranslation();
  const metricGroup = project.getMetricGroup("ousValueOverlap", t);
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });
  const precalcMetrics = project.getPrecalcMetrics(
    metricGroup,
    "sum",
    curGeography.geographyId
  );

  return (
    <>
      <ResultsCard
        title={t("Ocean Use Within Planning Area")}
        functionName="ousValueOverlap"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
      >
        {(data: ReportResult) => {
          // Single sketch or collection top-level
          const parentMetrics = metricsWithSketchId(
            toPercentMetric(
              data.metrics.filter((m) => m.metricId === metricGroup.metricId),
              precalcMetrics
            ),
            [data.sketch.properties.id]
          );

          return (
            <>
              <p>
                <Trans i18nKey="OUS Card 1">
                  This report summarizes the percentage of ocean use value
                  within
                </Trans>{" "}
                {curGeography.display}
                <Trans i18nKey="OUS Card 2">
                  's territorial sea that overlaps with this plan, as reported
                  in the Ocean Use Survey. Plans should consider the potential
                  impact to sectors if access or activities are restricted.
                </Trans>
              </p>

              <Translator>
                {isCollection
                  ? groupedCollectionReport(
                      data,
                      precalcMetrics,
                      metricGroup,
                      t
                    )
                  : groupedSketchReport(data, precalcMetrics, metricGroup, t)}

                {isCollection && (
                  <Collapse title={t("Show by Zone")}>
                    {genSketchTable(data, precalcMetrics, metricGroup)}
                  </Collapse>
                )}
              </Translator>

              <Collapse title={t("Learn more")}>
                <Trans i18nKey="OUS Card - learn more">
                  <p>
                    ℹ️ Overview: to capture the value each sector places on
                    different areas of the nearshore, an Ocean Use Survey was
                    conducted. Individuals identified the sectors they
                    participate in, and were asked to draw the areas they use
                    relative to that sector and assign a value of importance.
                    Individual responses were then combined to produce aggregate
                    heatmaps by sector. This allows the value of areas to be
                    quantified, summed, and compared to one another as more or
                    less valuable.
                  </p>
                  <p>
                    Value is then used as a proxy for measuring the potential
                    economic loss to sectors caused by the creation of protected
                    areas. This report can be used to minimize the potential
                    impact of a plan on a sector, as well as identify and reduce
                    conflict between conservation objectives and sector
                    activities. The higher the proportion of value within the
                    plan, the greater the potential impact to the fishery if
                    access or activities are restricted.
                  </p>
                  <p>
                    Note, the resulting heatmaps are only representative of the
                    individuals that were surveyed.
                  </p>
                  <p>
                    🎯 Planning Objective: there is no specific objective/target
                    for limiting the potential impact of ocean use activities.
                  </p>
                  <p>🗺️ Methods:</p>
                  <ul>
                    <li>
                      <a
                        href="https://seasketch.github.io/python-sap-map/index.html"
                        target="_blank"
                      >
                        Spatial Access Priority Mapping Overview
                      </a>
                    </li>
                  </ul>
                  <p>
                    📈 Report: Percentages are calculated by summing the areas
                    of value within the MPAs in this plan, and dividing it by
                    all sector value. If the plan includes multiple areas that
                    overlap, the overlap is only counted once.
                  </p>
                  <p>
                    This report shows the percentage of the selected nearshore
                    planning area's ocean use value that is contained by the
                    proposed plan.
                  </p>
                </Trans>
              </Collapse>
            </>
          );
        }}
      </ResultsCard>
    </>
  );
};
