import React from "react";
import {
  Collapse,
  ResultsCard,
  KeySection,
  ClassTable,
  ReportChartFigure,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  toPercentMetric,
  percentWithEdge,
} from "@seasketch/geoprocessing/client-core";
import precalcTotals from "../../data/bin/ousDemographicPrecalcTotals.json" with { type: "json" };
import project from "../../project/projectClient.js";
import { Trans, useTranslation } from "react-i18next";
import { ReportProps } from "../util/ReportProp.js";
import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { styled, keyframes, css } from "styled-components";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const AnimatedText = styled.text`
  opacity: 0;
  animation: ${css`
    ${fadeInAnimation} 0.5s ease-out forwards
  `};
  animation-delay: 0.7s;
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const FadeInPath = styled.path<{ delay: number }>`
  opacity: 0;
  animation: ${fadeIn} 1s ease-in-out forwards;
  animation-delay: ${(props) => props.delay}s;
`;

export const OusDemographic: React.FunctionComponent<ReportProps> = (props) => {
  const { t } = useTranslation();

  const overallMetricGroup = project.getMetricGroup(
    "ousOverallDemographicOverlap",
    t,
  );
  const sectorMetricGroup = project.getMetricGroup(
    "ousSectorDemographicOverlap",
    t,
  );
  const municipalityMetricGroup = project.getMetricGroup(
    "ousMunicipalityDemographicOverlap",
    t,
  );
  const gearMetricGroup = project.getMetricGroup(
    "ousGearDemographicOverlap",
    t,
  );
  const genderMetricGroup = project.getMetricGroup(
    "ousGenderDemographicOverlap",
    t,
  );

  const METRIC_ID = "ousPeopleCount";
  const PERC_METRIC_ID = `${overallMetricGroup.metricId}Perc`;
  const TOTAL_METRIC_ID = `${overallMetricGroup.metricId}Total`;

  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard
        title={t("Ocean Use Demographics")}
        functionName="ousDemographicOverlap"
        extraParams={{
          geographyIds: [curGeography.geographyId],
          overlapSketch: true,
        }}
      >
        {(data: ReportResult) => {
          // Filter down to people count metrics for top-level sketch
          const singlePeopleCountMetrics = data.metrics.filter(
            (m) =>
              m.sketchId === data.sketch!.properties.id &&
              m.metricId &&
              m.metricId === "ousPeopleCount",
          );

          const singlePeopleTotalCountMetrics = precalcTotals.filter(
            (m) => m.metricId === "ousPeopleCount",
          );

          const singlePeopleTotalCountMetric = precalcTotals.find(
            (m) => m.classId === "ousPeopleCount_all",
          );
          if (!singlePeopleTotalCountMetric)
            throw new Error("Expected to find total people count metric");
          const singlePeopletotalCountFormatted = Number.format(
            singlePeopleTotalCountMetric.value as number,
          );

          const singlePeopleCountMetric = singlePeopleCountMetrics.find(
            (m) => m.classId === "ousPeopleCount_all",
          );
          if (!singlePeopleCountMetric)
            throw new Error("Expected to find sketch people count metric");
          const singlePeopleCountFormatted = Number.format(
            singlePeopleCountMetric.value as number,
          );

          const singlePeopleCountPercMetric = toPercentMetric(
            [singlePeopleCountMetric],
            singlePeopleTotalCountMetrics,
          )[0];
          if (!singlePeopleCountPercMetric)
            throw new Error(
              "Expected to find sketch people count total metric",
            );
          const singlePeopleCountPercFormatted = percentWithEdge(
            singlePeopleCountPercMetric.value,
          );

          const singleFullMetrics = [
            ...singlePeopleCountMetrics,
            ...toPercentMetric(
              singlePeopleCountMetrics,
              singlePeopleTotalCountMetrics,
              { metricIdOverride: PERC_METRIC_ID },
            ),
          ];

          const sectorClassIds = sectorMetricGroup.classes.map(
            (curClass) => curClass.classId,
          );
          const sectorTotalMetrics = singlePeopleTotalCountMetrics
            .filter((m) => m.classId && sectorClassIds.includes(m.classId))
            .map((m) => ({ ...m, metricId: TOTAL_METRIC_ID }));
          const sectorMetrics = singleFullMetrics
            .filter((m) => m.classId && sectorClassIds.includes(m.classId))
            .concat(sectorTotalMetrics);
          const numSectors = sectorMetrics.filter(
            (m) => m.metricId === "ousPeopleCount",
          ).length;
          const numSectorsFormatted = Number.format(numSectors);

          const municipalityClassIds = municipalityMetricGroup.classes.map(
            (curClass) => curClass.classId,
          );
          const municipalityTotalMetrics = singlePeopleTotalCountMetrics
            .filter(
              (m) => m.classId && municipalityClassIds.includes(m.classId),
            )
            .map((m) => ({ ...m, metricId: TOTAL_METRIC_ID }));
          const municipalityMetrics = singleFullMetrics
            .filter(
              (m) => m.classId && municipalityClassIds.includes(m.classId),
            )
            .concat(municipalityTotalMetrics);
          const numMunicipalities = municipalityMetrics.filter(
            (m) =>
              m.metricId === "ousPeopleCount" &&
              m.classId !== "unknown-municipality",
          ).length;
          const numMunicipalitiesFormatted = Number.format(numMunicipalities);

          const gearClassIds = gearMetricGroup.classes.map(
            (curClass) => curClass.classId,
          );
          const gearTotalMetrics = singlePeopleTotalCountMetrics
            .filter((m) => m.classId && gearClassIds.includes(m.classId))
            .map((m) => ({ ...m, metricId: TOTAL_METRIC_ID }));
          const gearMetrics = singleFullMetrics
            .filter((m) => m.classId && gearClassIds.includes(m.classId))
            .concat(gearTotalMetrics);
          const numGears = gearMetrics.filter(
            (m) => m.metricId === "ousPeopleCount",
          ).length;
          const numGearsFormatted = Number.format(numGears);

          const genderClassIds = genderMetricGroup.classes.map(
            (curClass) => curClass.classId,
          );
          const genderTotalMetrics = singlePeopleTotalCountMetrics
            .filter((m) => m.classId && genderClassIds.includes(m.classId))
            .map((m) => ({ ...m, metricId: TOTAL_METRIC_ID }));
          const genderMetrics = singleFullMetrics
            .filter((m) => m.classId && genderClassIds.includes(m.classId))
            .concat(genderTotalMetrics);

          const sectorLabel = t("Sector");
          const gearTypeLabel = t("Gear Type");
          const municipalityLabel = t("Municipality");
          const totalPeopleLabel = t("Total People Represented In Survey");
          const totalRespondentsLabel = t("Total Respondents");
          const peopleUsingOceanLabel = t("People Using Ocean Within Plan");
          const respondentsUsingOceanLabel = t(
            "Respondents Using Ocean Within Plan",
          );
          const peopleUsingOceanPercLabel = t(
            "% People Using Ocean Within Plan",
          );
          const respondentsUsingOceanPercLabel = t(
            "% Respondents Using Ocean Within Plan",
          );

          return (
            <>
              <p>
                <Trans i18nKey="OUS Demographics - intro">
                  This report summarizes the people that use the ocean within
                  this plan, as represented by the Kosrae Ocean Use Survey.
                  Plans should consider the potential benefits and impacts to
                  these people if access or activities are restricted. This
                  demographics report includes all Ocean Use Survey responses.
                </Trans>
              </p>

              <KeySection>
                <b>{singlePeopleCountFormatted}</b>
                {t(" of the ")}
                <b>{singlePeopletotalCountFormatted}</b>
                {t(
                  " people represented by this survey use the ocean within this plan. This is ",
                )}
                <b>{singlePeopleCountPercFormatted}</b>
                {t(" of the total people represented. They come from ")}
                <b>
                  {numMunicipalitiesFormatted}
                  {t(" municipalities")}
                </b>
                {t(" across ")}
                <b>
                  {numSectorsFormatted}
                  {numSectors > 1 ? t(" sectors") : t(" sector")}
                </b>
                {t(". Those that fish within this plan use ")}
                <b>
                  {numGearsFormatted} {t("gear types.")}
                </b>
              </KeySection>

              <p>
                <Trans i18nKey="OUS Demographics - breakdown by sector">
                  What follows is a breakdown of the number of people
                  represented <b>by sector</b>.
                </Trans>
              </p>
              <ClassTable
                rows={sectorMetrics}
                metricGroup={sectorMetricGroup}
                columnConfig={[
                  {
                    columnLabel: sectorLabel,
                    type: "class",
                    width: 30,
                  },
                  {
                    columnLabel: totalPeopleLabel,
                    type: "metricValue",
                    metricId: TOTAL_METRIC_ID,
                    valueFormatter: (value) => Number.format(value as number),
                    chartOptions: {
                      showTitle: true,
                    },
                    width: 20,
                    colStyle: { textAlign: "center" },
                  },
                  {
                    columnLabel: peopleUsingOceanLabel,
                    type: "metricValue",
                    metricId: METRIC_ID,
                    valueFormatter: (value) => Number.format(value as number),
                    chartOptions: {
                      showTitle: true,
                    },
                    width: 20,
                    colStyle: { textAlign: "center" },
                  },
                  {
                    columnLabel: peopleUsingOceanPercLabel,
                    type: "metricChart",
                    metricId: PERC_METRIC_ID,
                    valueFormatter: "percent",
                    chartOptions: {
                      showTitle: true,
                    },
                    width: 30,
                  },
                ]}
              />

              <Collapse
                title={t("Show by Gear Type (Commercial Fishing)")}
                collapsed={!props.printing}
                key={String(props.printing) + "gear"}
              >
                <Trans i18nKey="OUS Demographics - breakdown by gear type">
                  <p>
                    The following is a breakdown of gear types used by
                    commercial fishers and how specific gear type usage may be
                    impacted by the plan.
                  </p>
                  <p>
                    Note that commercial fishers can and did report multiple
                    gear types within each of their areas, so these gear type
                    totals
                    <i> do not</i> sum to the total number of respondents above.
                  </p>
                </Trans>

                <ClassTable
                  rows={gearMetrics}
                  metricGroup={gearMetricGroup}
                  columnConfig={[
                    {
                      columnLabel: gearTypeLabel,
                      type: "class",
                      width: 28,
                      colStyle: { textAlign: "left" },
                    },
                    {
                      columnLabel: totalPeopleLabel,
                      type: "metricValue",
                      metricId: TOTAL_METRIC_ID,
                      valueFormatter: (value) => Number.format(value as number),
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 20,
                      colStyle: { textAlign: "center" },
                    },
                    {
                      columnLabel: peopleUsingOceanLabel,
                      type: "metricValue",
                      metricId: METRIC_ID,
                      valueFormatter: (value) => Number.format(value as number),
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 22,
                      colStyle: { textAlign: "center" },
                    },
                    {
                      columnLabel: peopleUsingOceanPercLabel,
                      type: "metricChart",
                      metricId: PERC_METRIC_ID,
                      valueFormatter: "percent",
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 30,
                    },
                  ]}
                />
              </Collapse>

              <Collapse
                title={t("Show by Municipality (All Sectors)")}
                collapsed={!props.printing}
                key={String(props.printing) + "municipality"}
              >
                <p>
                  <Trans i18nKey="OUS Demographics - breakdown by municipality">
                    The following is a breakdown of the number of people
                    represented that use the ocean within this nearshore plan{" "}
                    <b>by municipality</b>.
                  </Trans>
                </p>
                <ClassTable
                  rows={municipalityMetrics}
                  metricGroup={municipalityMetricGroup}
                  columnConfig={[
                    {
                      columnLabel: municipalityLabel,
                      type: "class",
                      width: 20,
                      colStyle: { textAlign: "left" },
                    },
                    {
                      columnLabel: totalPeopleLabel,
                      type: "metricValue",
                      metricId: TOTAL_METRIC_ID,
                      valueFormatter: (value) => Number.format(value as number),
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 25,
                      colStyle: { textAlign: "center" },
                    },
                    {
                      columnLabel: peopleUsingOceanLabel,
                      type: "metricValue",
                      metricId: METRIC_ID,
                      valueFormatter: (value) => Number.format(value as number),
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 25,
                      colStyle: { textAlign: "center" },
                    },
                    {
                      columnLabel: peopleUsingOceanPercLabel,
                      type: "metricChart",
                      metricId: PERC_METRIC_ID,
                      valueFormatter: "percent",
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 30,
                    },
                  ]}
                />
              </Collapse>

              <Collapse title={t("Show by Gender")}>
                <ReportChartFigure>
                  {(() => {
                    const totalUsers = genderMetrics
                      .filter((m) => m.metricId === METRIC_ID)
                      .reduce((sum, m) => sum + (m.value as number), 0);

                    const genderData = genderMetrics
                      .filter((m) => m.metricId === METRIC_ID)
                      .map((m) => ({
                        label:
                          m.classId === "unknown-gender"
                            ? "Unspecified"
                            : m.classId,
                        value: (m.value as number) / totalUsers,
                      }));

                    const color = scaleOrdinal<string>()
                      .domain(["Female", "Male", "Unspecified"])
                      .range(["#00A5E1", "#0073BC", "#1B427C"]);

                    const pieGenerator = pie<(typeof genderData)[0]>()
                      .value((d) => d.value)
                      .sort(null);

                    const arcGenerator = arc<
                      d3.PieArcDatum<(typeof genderData)[0]>
                    >()
                      .innerRadius(0)
                      .outerRadius(150);

                    return (
                      <div
                        key={String(props.printing)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          maxWidth: 600,
                          margin: "0 auto",
                        }}
                      >
                        <svg
                          viewBox="0 0 400 320"
                          width={400}
                          height={320}
                          style={{
                            width: "60%",
                            height: "auto",
                            minWidth: 250,
                          }}
                        >
                          <g transform="translate(200, 160)">
                            {pieGenerator(genderData).map((d, i) => {
                              const [x, y] = arcGenerator.centroid
                                ? arcGenerator.centroid(d)
                                : [0, 0];
                              return (
                                <g key={d.data.label}>
                                  <FadeInPath
                                    d={arcGenerator(d) ?? ""}
                                    fill={color(d.data.label!) ?? "#999"}
                                    stroke="#fff"
                                    strokeWidth="3"
                                    delay={i * 0.1}
                                  />
                                  <AnimatedText
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="#fff"
                                    fontSize="20"
                                    fontWeight="bold"
                                    style={{ pointerEvents: "none" }}
                                  >
                                    {percentWithEdge(d.data.value)}
                                  </AnimatedText>
                                </g>
                              );
                            })}
                          </g>
                        </svg>
                        {/* Legend */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            marginLeft: "2rem",
                          }}
                        >
                          {genderData.map((d) => (
                            <div
                              key={d.label}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <div
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: 4,
                                  background: color(d.label!) ?? "#999",
                                  border: "1px solid #ccc",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: 14,
                                  color: "#222",
                                  fontWeight: 500,
                                }}
                              >
                                {d.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </ReportChartFigure>
                <p>
                  <Trans i18nKey="OUS Demographics - gender">
                    The table below shows the number of people that were
                    represented that use the ocean within this nearshore plan{" "}
                    <b>by gender</b>. Note that gender was only collected for
                    the survey respondent, not for each person represented.
                  </Trans>
                </p>
                <ClassTable
                  rows={genderMetrics}
                  metricGroup={genderMetricGroup}
                  columnConfig={[
                    {
                      columnLabel: t("Gender"),
                      type: "class",
                      width: 20,
                      colStyle: { textAlign: "left" },
                    },
                    {
                      columnLabel: totalRespondentsLabel,
                      type: "metricValue",
                      metricId: TOTAL_METRIC_ID,
                      valueFormatter: (value) => Number.format(value as number),
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 25,
                      colStyle: { textAlign: "center" },
                    },
                    {
                      columnLabel: respondentsUsingOceanLabel,
                      type: "metricValue",
                      metricId: METRIC_ID,
                      valueFormatter: (value) => Number.format(value as number),
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 25,
                      colStyle: { textAlign: "center" },
                    },
                    {
                      columnLabel: respondentsUsingOceanPercLabel,
                      type: "metricChart",
                      metricId: PERC_METRIC_ID,
                      valueFormatter: "percent",
                      chartOptions: {
                        showTitle: true,
                      },
                      width: 30,
                    },
                  ]}
                />
              </Collapse>

              {!props.printing && (
                <Collapse title={t("Learn more")}>
                  <Trans i18nKey="OUS Demographics - learn more">
                    <p>
                      ℹ️ Overview: an Ocean Use Survey was conducted that
                      identified who is using the ocean, and where they are
                      using it.
                    </p>
                    <p>
                      This report provides a breakdown of the people that use
                      the ocean within this plan, by sector, gear type, and
                      municipality.
                    </p>
                    <p>
                      Note, this report is only representative of the
                      individuals that were surveyed and the number of people
                      they were said to represent.
                    </p>
                    <p>
                      🎯 Planning Objective: there is no specific
                      objective/target for limiting the potential impact to
                      groups of people.
                    </p>
                    <p>
                      📈 Report: Percentages are calculated by summing the
                      number of people that use the ocean within the boundaries
                      of this plan for each sector and dividing it by the total
                      number of people that use the ocean within the sector.
                    </p>
                    <p>
                      Due to the complex nature of this report and to ensure the
                      timely return of reports, sketch shorelines have been
                      simplified with a 0.00001 degree tolerance.{" "}
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
