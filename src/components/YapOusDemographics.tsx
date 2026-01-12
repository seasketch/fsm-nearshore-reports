import React from "react";
import {
  Collapse,
  ResultsCard,
  ClassTable,
  Skeleton,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  toPercentMetric,
  percentWithEdge,
} from "@seasketch/geoprocessing/client-core";
import precalcTotals from "../../data/bin/yapOusDemographicPrecalcTotals.json" with { type: "json" };
import project from "../../project/projectClient.js";
import { Trans, useTranslation } from "react-i18next";
import { ReportProps } from "../util/ReportProp.js";

const Number = new Intl.NumberFormat("en", { style: "decimal" });

export const YapOusDemographics: React.FunctionComponent<ReportProps> = (
  props,
) => {
  const { t } = useTranslation();

  const overallMetricGroup = project.getMetricGroup(
    "yapOusOverallDemographicOverlap",
    t,
  );
  const sectorMetricGroup = project.getMetricGroup(
    "yapOusSectorDemographicOverlap",
    t,
  );
  const municipalityMetricGroup = project.getMetricGroup(
    "yapOusMunicipalityDemographicOverlap",
    t,
  );
  const gearMetricGroup = project.getMetricGroup(
    "yapOusGearDemographicOverlap",
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
        functionName="yapOusDemographics"
        extraParams={{
          geographyIds: [curGeography.geographyId],
        }}
      >
        {(data: ReportResult) => {
          if (!data || !data.metrics) return <Skeleton />;
          const [{ id }] = useSketchProperties();

          // Filter down to people count metrics for top-level sketch
          const singlePeopleCountMetrics = data.metrics.filter(
            (m) =>
              m.sketchId === id &&
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

          const sectorLabel = t("Sector");
          const gearTypeLabel = t("Fishing Method");
          const municipalityLabel = t("Municipality");
          const totalPeopleLabel = t("Total People Represented In Survey");
          const peopleUsingOceanLabel = t("People Using Ocean Within Plan");
          const peopleUsingOceanPercLabel = t(
            "% People Using Ocean Within Plan",
          );
          return (
            <>
              <p>
                <Trans i18nKey="OUS Demographics - intro">
                  This report summarizes the people that use the ocean within
                  this area, as represented by the Yap Ocean Use Survey. Plans
                  should consider the potential benefits and impacts to these
                  people if access or activities are restricted.
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

              <Collapse title={t("Show by Fishing Method")}>
                <Trans i18nKey="OUS Demographics - breakdown by gear type">
                  <p>
                    The following is a breakdown of fishing methods used by
                    fishers. Note that fishers can and did report multiple
                    fishing methods within each of their areas, so these totals{" "}
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

              <Collapse title={t("Show by Municipality")}>
                <p>
                  <Trans i18nKey="OUS Demographics - breakdown by municipality">
                    The following is a breakdown of the number of people
                    represented that use the ocean within this area{" "}
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

              <Collapse title={t("Learn more")}>
                <Trans i18nKey="OUS Demographics - learn more">
                  <p>
                    ℹ️ Overview: An Ocean Use Survey was conducted that
                    identified who is using the ocean, and where they are using
                    it.
                  </p>
                  <p>
                    This report provides a breakdown of the people that use the
                    ocean within this area by sector, fishing method, and
                    village.
                  </p>
                  <p>
                    Note, this report is only representative of the individuals
                    that were surveyed and the number of people they were said
                    to represent.
                  </p>
                  <p>
                    📈 Report: Percentages are calculated by summing the number
                    of people that use the ocean within the boundaries of this
                    area for each sector and dividing it by the total number of
                    people that use the ocean within the sector.
                  </p>
                </Trans>
              </Collapse>
            </>
          );
        }}
      </ResultsCard>
    </div>
  );
};
