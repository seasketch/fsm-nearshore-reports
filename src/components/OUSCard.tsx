import React from "react";
import {
  ClassTable,
  Collapse,
  ResultsCard,
  Skeleton,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  toPercentMetric,
} from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";
import { Trans, useTranslation } from "react-i18next";
import Translator from "./TranslatorAsync.js";
import {
  genPercGroupLevelTable,
  genSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports.js";
import { ReportProps } from "../util/ReportProp.js";

export const OUSCard: React.FunctionComponent<ReportProps> = (props) => {
  const [{ isCollection, childProperties }] = useSketchProperties();
  const { t } = useTranslation();
  const mg = project.getMetricGroup("ousValueOverlap", t);
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });
  const precalcMetrics = project.getPrecalcMetrics(
    mg,
    "sum",
    curGeography.geographyId,
  );

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard
        title={t("Ocean Use")}
        functionName="ousValueOverlap"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
      >
        {(data: ReportResult) => {
          if (!data || !data.metrics) return <Skeleton />;

          const subsectorMetricGroup = project.getMetricGroup(
            "ousSubsectorValueOverlap",
          );
          const subsectorMetrics = toPercentMetric(
            data.metrics.filter(
              (m) => m.metricId === "ousSubsectorValueOverlap",
            ),
            project.getPrecalcMetrics(
              subsectorMetricGroup,
              "sum",
              curGeography.geographyId,
            ),
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
                  in the Kosrae Ocean Use Survey. Plans should consider the
                  potential impact to sectors if access or activities are
                  restricted.
                </Trans>
              </p>

              <Translator>
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
              </Translator>

              <Collapse title={t("Show by Aquaculture Type")}>
                <ClassTable
                  rows={subsectorMetrics.filter((m) =>
                    m.classId?.startsWith("aquaculture"),
                  )}
                  metricGroup={{
                    ...subsectorMetricGroup,
                    classes: subsectorMetricGroup.classes.filter((c) =>
                      c.classId?.startsWith("aquaculture"),
                    ),
                  }}
                  columnConfig={[
                    {
                      columnLabel: "Aquaculture Type",
                      type: "class",
                      width: 30,
                    },
                    {
                      columnLabel: "% Value",
                      type: "metricChart",
                      metricId: subsectorMetricGroup.metricId,
                      valueFormatter: "percent",
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 20,
                      colStyle: { textAlign: "center" },
                    },
                  ]}
                />
              </Collapse>

              <Collapse title={t("Show by Fishing Gear")}>
                <ClassTable
                  rows={subsectorMetrics.filter((m) =>
                    m.classId?.startsWith("gear"),
                  )}
                  metricGroup={{
                    ...subsectorMetricGroup,
                    classes: subsectorMetricGroup.classes.filter((c) =>
                      c.classId?.startsWith("gear"),
                    ),
                  }}
                  columnConfig={[
                    {
                      columnLabel: "Gear Type",
                      type: "class",
                      width: 30,
                    },
                    {
                      columnLabel: "% Value",
                      type: "metricChart",
                      metricId: subsectorMetricGroup.metricId,
                      valueFormatter: "percent",
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 20,
                      colStyle: { textAlign: "center" },
                    },
                  ]}
                />
              </Collapse>

              <Collapse title={t("Show by Fishing Purpose")}>
                <ClassTable
                  rows={subsectorMetrics.filter((m) =>
                    m.classId?.startsWith("purpose"),
                  )}
                  metricGroup={{
                    ...subsectorMetricGroup,
                    classes: subsectorMetricGroup.classes.filter((c) =>
                      c.classId?.startsWith("purpose"),
                    ),
                  }}
                  columnConfig={[
                    {
                      columnLabel: "Fishing Purpose",
                      type: "class",
                      width: 30,
                    },
                    {
                      columnLabel: "% Value",
                      type: "metricChart",
                      metricId: subsectorMetricGroup.metricId,
                      valueFormatter: "percent",
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 20,
                      colStyle: { textAlign: "center" },
                    },
                  ]}
                />
              </Collapse>

              <Collapse title={t("Show by Fishing Species")}>
                <ClassTable
                  rows={subsectorMetrics.filter((m) =>
                    m.classId?.startsWith("species"),
                  )}
                  metricGroup={{
                    ...subsectorMetricGroup,
                    classes: subsectorMetricGroup.classes.filter((c) =>
                      c.classId?.startsWith("species"),
                    ),
                  }}
                  columnConfig={[
                    {
                      columnLabel: "Species",
                      type: "class",
                      width: 30,
                    },
                    {
                      columnLabel: "% Value",
                      type: "metricChart",
                      metricId: subsectorMetricGroup.metricId,
                      valueFormatter: "percent",
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 20,
                      colStyle: { textAlign: "center" },
                    },
                  ]}
                />
              </Collapse>

              <Collapse title={t("Show by Cultural Use Type")}>
                <ClassTable
                  rows={subsectorMetrics.filter((m) =>
                    m.classId?.startsWith("cultural"),
                  )}
                  metricGroup={{
                    ...subsectorMetricGroup,
                    classes: subsectorMetricGroup.classes.filter((c) =>
                      c.classId?.startsWith("cultural"),
                    ),
                  }}
                  columnConfig={[
                    {
                      columnLabel: "Cultural Use Type",
                      type: "class",
                      width: 30,
                    },
                    {
                      columnLabel: "% Value",
                      type: "metricChart",
                      metricId: subsectorMetricGroup.metricId,
                      valueFormatter: "percent",
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 20,
                      colStyle: { textAlign: "center" },
                    },
                  ]}
                />
              </Collapse>

              {!props.printing && (
                <Collapse title={t("Learn more")}>
                  <Trans i18nKey="OUS Card - learn more">
                    <p>
                      ℹ️ Overview: to capture the value each sector places on
                      different areas of the nearshore, an Ocean Use Survey was
                      conducted. Individuals identified the sectors they
                      participate in, and were asked to draw the areas they use
                      relative to that sector and assign a value of importance.
                      Individual responses were then combined to produce
                      aggregate heatmaps by sector. This allows the value of
                      areas to be quantified, summed, and compared to one
                      another as more or less valuable.
                    </p>
                    <p>
                      Value is then used as a proxy for measuring the potential
                      loss to sectors caused by the creation of protected areas.
                      This report can be used to minimize the potential impact
                      of a plan on a sector, as well as identify and reduce
                      conflict between conservation objectives and sector
                      activities. The higher the proportion of value within the
                      plan, the greater the potential impact to the activity if
                      access is restricted.
                    </p>
                    <p>
                      Note, the resulting heatmaps are only representative of
                      the individuals that were surveyed.
                    </p>
                    <p>
                      🎯 Planning Objective: there is no specific
                      objective/target for limiting the potential impact of
                      ocean use activities.
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
              )}
            </>
          );
        }}
      </ResultsCard>
    </div>
  );
};
