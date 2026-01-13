import React from "react";
import {
  Collapse,
  ResultsCard,
  ClassTable,
  Skeleton,
  KeySection,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  toPercentMetric,
  percentWithEdge,
  Metric,
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

  const overallMg = project.getMetricGroup("yapOusOverallDemog", t);
  const sectorMg = project.getMetricGroup("yapOusSectorDemog", t);
  const municipalityMg = project.getMetricGroup("yapOusMunicipalityDemog", t);
  const gearMg = project.getMetricGroup("yapOusGearDemog", t);

  const METRIC_ID = "ousPeopleCount";
  const PERC_METRIC_ID = `${overallMg.metricId}Perc`;
  const TOTAL_METRIC_ID = `${overallMg.metricId}Total`;

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
          const metrics: Metric[] = data.metrics;
          const precalcMetrics: Metric[] = precalcTotals;

          const ppl = metrics.find((m) => m.classId === "ousPeopleCount_all");
          if (!ppl) throw new Error("No overall people count metric");
          const pplFormatted = Number.format(ppl.value);

          const totalPpl = precalcTotals.find(
            (m) => m.classId === "ousPeopleCount_all",
          );
          if (!totalPpl) throw new Error("No precalc total metric");
          const totalPplFormatted = Number.format(totalPpl.value);

          const pplPerc = toPercentMetric([ppl], precalcMetrics)[0];
          const pplPercFormatted = percentWithEdge(pplPerc.value);

          const allMetrics = [
            ...metrics,
            ...toPercentMetric(metrics, precalcMetrics, {
              metricIdOverride: PERC_METRIC_ID,
            }),
          ];

          // Sector metrics
          const sectorClassIds = sectorMg.classes.map((c) => c.classId);
          const sectorTotals = precalcMetrics
            .filter((m) => m.classId && sectorClassIds.includes(m.classId))
            .map((m) => ({ ...m, metricId: TOTAL_METRIC_ID }));
          const sectorMetrics = allMetrics
            .filter((m) => m.classId && sectorClassIds.includes(m.classId))
            .concat(sectorTotals);
          const numSectors = sectorMetrics.filter(
            (m) => m.metricId === "ousPeopleCount",
          ).length;
          const numSectorsFormatted = Number.format(numSectors);

          // Municipality metrics
          const municClassIds = municipalityMg.classes.map((c) => c.classId);
          const municTotals = precalcMetrics
            .filter((m) => m.classId && municClassIds.includes(m.classId))
            .map((m) => ({ ...m, metricId: TOTAL_METRIC_ID }));
          const municMetrics = allMetrics
            .filter((m) => m.classId && municClassIds.includes(m.classId))
            .concat(municTotals);
          const numMunicipalities = municMetrics.filter(
            (m) =>
              m.metricId === "ousPeopleCount" &&
              m.classId !== "unknown-municipality",
          ).length;
          const numMunicipalitiesFormatted = Number.format(numMunicipalities);

          // Gear metrics
          const gearClassIds = gearMg.classes.map((c) => c.classId);
          const gearTotals = precalcMetrics
            .filter((m) => m.classId && gearClassIds.includes(m.classId))
            .map((m) => ({ ...m, metricId: TOTAL_METRIC_ID }));
          const gearMetrics = allMetrics
            .filter((m) => m.classId && gearClassIds.includes(m.classId))
            .concat(gearTotals);
          const numGears = gearMetrics.filter(
            (m) => m.metricId === "ousPeopleCount",
          ).length;
          const numGearsFormatted = Number.format(numGears);

          // Labels
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

              <KeySection>
                <b>{pplFormatted}</b> {t(" of the ")} <b>{totalPplFormatted}</b>
                {t(
                  " people represented by this survey use the ocean within this plan. This is ",
                )}{" "}
                <b>{pplPercFormatted}</b>
                {t(" of people represented. They come from ")}
                <b>
                  {numMunicipalitiesFormatted}
                  {t(" municipalities")}
                </b>
                {t(" across ")}
                <b>
                  {numSectorsFormatted} {t(" sector(s). ")}
                </b>
                {t("Those that fish within this plan use ")}
                <b>
                  {numGearsFormatted} {t("fishing method(s).")}
                </b>
              </KeySection>

              <ClassTable
                rows={sectorMetrics}
                metricGroup={sectorMg}
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
                  metricGroup={gearMg}
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
                  rows={municMetrics}
                  metricGroup={municipalityMg}
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
