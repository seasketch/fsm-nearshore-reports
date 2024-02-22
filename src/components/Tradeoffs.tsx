import React from "react";
import {
  ResultsCard,
  Collapse,
  ReportError,
  LayerToggle,
  InfoStatus,
} from "@seasketch/geoprocessing/client-ui";
import {
  ReportResult,
  Metric,
  firstMatchingMetric,
  roundDecimal,
  squareMeterToKilometer,
  percentWithEdge,
  isSketchCollection,
  GroupMetricAgg,
  flattenByGroupAllClass,
  MetricGroup,
} from "@seasketch/geoprocessing/client-core";
import project from "../../project";
import { Trans, useTranslation } from "react-i18next";
import { Scatterplot } from "../util/Scatterplot";
import {
  isRasterDatasource,
  isVectorDatasource,
} from "@seasketch/geoprocessing";
import { ReportProps } from "../util/ReportProp";

export const Tradeoffs: React.FunctionComponent<ReportProps> = (props) => {
  const { t } = useTranslation();
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });
  const mg = project.getMetricGroup("tradeoffValueOverlap", t);

  // Collect precalcMetrics which can be either raster or vector
  const precalcMetrics = mg.classes.reduce<Metric[]>((acc, curClass) => {
    if (!curClass.datasourceId) throw new Error("Missing datasourceId");
    const ds = project.getDatasourceById(curClass.datasourceId);
    if (!isRasterDatasource(ds) && !isVectorDatasource(ds))
      throw new Error("Invalid datasourceId");
    return acc.concat(
      isRasterDatasource(ds)
        ? project.getPrecalcMetrics(
            { ...mg, classes: [curClass] },
            "sum",
            curGeography.geographyId
          )
        : project.getPrecalcMetrics(
            { ...mg, classes: [curClass] },
            "area",
            curGeography.geographyId
          )
    );
  }, []);

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard
        title={t("Key Benthic Habitat & Fisheries Tradeoff")}
        functionName="tradeoffValueOverlap"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
      >
        {(data: ReportResult) => {
          // Get overall area of sketch metric using 'nearshore' metrics
          const areaMetric = firstMatchingMetric(
            data.metrics,
            (m) =>
              m.sketchId === data.sketch.properties.id &&
              m.groupId === "mpa" &&
              m.classId === "nearshore"
          );
          const totalAreaMetric = firstMatchingMetric(
            precalcMetrics,
            (m) => m.groupId === null && m.classId === "nearshore"
          );
          const areaDisplay = roundDecimal(
            squareMeterToKilometer(areaMetric.value)
          );
          const areaUnitDisplay = t("km²");
          const percDisplay = percentWithEdge(
            areaMetric.value / totalAreaMetric.value
          );

          // Calculate tradeoff values for benthic/fisheries tradeoff
          const acceptedGroups = ["mpa"];
          const tradeoffClasses: { x: any; y: any } = {
            x: mg.classes.find(
              (curClass) => curClass.classId === "fisheries_tradeoff"
            ),
            y: mg.classes.find(
              (curClass) => curClass.classId === "benthic_tradeoff"
            ),
          };
          const valueFormatter = (val: number) => val * 100;
          const benthicFisheriesTradeoffs = getTradeoffs(
            data,
            precalcMetrics,
            mg,
            tradeoffClasses,
            valueFormatter,
            acceptedGroups
          );
          // Switch fisheries value to value EXCLUDED from plan
          const scatterBenthicFisheries = {
            x: {
              value: 100 - benthicFisheriesTradeoffs.x,
              label: t("Fishery Value") + " (%)",
            },
            y: {
              value: benthicFisheriesTradeoffs.y,
              label: t("Key Benthic Habitat") + " (%)",
            },
          };

          return (
            <ReportError>
              <InfoStatus
                msg={
                  <>
                    This report is in development and is currently using false
                    data for testing
                  </>
                }
              />
              <p>
                {t("This plan designates")}{" "}
                <b>
                  {areaDisplay} {areaUnitDisplay} ({percDisplay})
                </b>
                {t(" of ")} {curGeography.display}
                {t("'s territorial sea in Marine Protected Areas, protecting ")}
                <b>{percentWithEdge(benthicFisheriesTradeoffs.y / 100)}</b>
                {t(
                  " of key benthic habitats while maintaining access to areas containing "
                )}
                <b>{percentWithEdge(1 - benthicFisheriesTradeoffs.x / 100)}</b>
                {t(" of fishery value.")}
              </p>

              <LayerToggle
                label={"Show " + tradeoffClasses.x.display + " On Map"}
                layerId={tradeoffClasses.x.layerId}
                style={{ paddingBottom: 5 }}
              />
              <LayerToggle
                label={"Show " + tradeoffClasses.y.display + " On Map"}
                layerId={tradeoffClasses.y.layerId}
              />

              <Scatterplot
                data={scatterdata}
                tradeoff={scatterBenthicFisheries}
                sketchName={data.sketch.properties.name}
              />

              {!props.printing && (
                <Collapse title={t("Learn more")}>
                  <Trans i18nKey="Tradeoffs Card - learn more">
                    <p>
                      ℹ️ Overview: This plan's tradeoff is plotted against all
                      possible plans, with each grey point representing a
                      theoretical plan. The outer edge of this scatterplot is
                      defined as the "efficiency frontier," and represents the
                      most effective plans for maximizing stakeholder interests.
                    </p>
                    <p>
                      % Key benthic habitat is measured as the % of total key
                      benthic habitat area that falls within an MPA in this
                      plan. % Fishery value is measured as the % of total
                      fishery value that falls <b>outside</b> all MPAs in this
                      plan (aka, still accessible to fishers).
                    </p>
                    <p>
                      🎯 Planning Objective: No defined planning objective for
                      tradeoff analyses.
                    </p>
                    <p>
                      🗺️ Methods:{" "}
                      <a
                        href="https://www.pnas.org/doi/10.1073/pnas.1114215109"
                        target="_blank"
                      >
                        White, C., Halpern, B. S., & Kappel, C. V. (2012)
                      </a>
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

function getTradeoffs(
  data: ReportResult,
  precalcMetrics: Metric[],
  metricGroup: MetricGroup,
  tradeoffClasses: { x: any; y: any },
  valueFormatter?: (value: number) => number,
  acceptedGroups?: string[]
): { x: number; y: number } {
  // Filter to metrics which have groupIds and narrow by acceptedGroups
  const levelMetrics: Metric[] = acceptedGroups
    ? data.metrics.filter(
        (m) => m.groupId && acceptedGroups.includes(m.groupId)
      )
    : data.metrics.filter((m) => m.groupId);

  const totalsByClass = (() => {
    // Sketch Collection
    if (isSketchCollection(data.sketch)) {
      const groupLevelAggs: GroupMetricAgg[] = flattenByGroupAllClass(
        data.sketch,
        levelMetrics,
        precalcMetrics
      );

      // Filter down grouped metrics to ones that count for each class
      return metricGroup.classes.reduce<Record<string, number>>(
        (acc, curClass) => {
          const values = groupLevelAggs.map(
            (group) => group[curClass.classId] as number
          );

          return {
            ...acc,
            [curClass.classId]: values.reduce((sum, cur) => sum + cur, 0),
          };
        },
        {}
      );
    } else {
      // Sketch
      // Get total precalc areas
      const totalAreas = metricGroup.classes.reduce<Record<string, number>>(
        (acc, curClass) => {
          return {
            ...acc,
            [curClass.classId]: firstMatchingMetric(
              precalcMetrics,
              (m) => m.groupId === null && m.classId === curClass.classId
            ).value,
          };
        },
        {}
      );

      // Filter down grouped metrics to ones that count for each class
      return metricGroup.classes.reduce<Record<string, number>>(
        (acc, curClass) => {
          const classMetrics = levelMetrics.filter(
            (m) => m.classId === curClass.classId
          );
          const values = classMetrics.map(
            (group) => group.value / totalAreas[curClass.classId]
          );

          return {
            ...acc,
            [curClass.classId]: values.reduce((sum, cur) => sum + cur, 0),
          };
        },
        {}
      );
    }
  })();

  return {
    x: valueFormatter
      ? valueFormatter(totalsByClass[tradeoffClasses.x.classId])
      : totalsByClass[tradeoffClasses.x.classId],
    y: valueFormatter
      ? valueFormatter(totalsByClass[tradeoffClasses.y.classId])
      : totalsByClass[tradeoffClasses.y.classId],
  };
}

const scatterdata = [
  { x: 23, y: 20 },
  { x: 68, y: 17 },
  { x: 45, y: 36 },
  { x: 79, y: 22 },
  { x: 34, y: 48 },
  { x: 47, y: 10 },
  { x: 25, y: 15 },
  { x: 18, y: 78 },
  { x: 84, y: 4 },
  { x: 54, y: 13 },
  { x: 1, y: 33 },
  { x: 64, y: 29 },
  { x: 66, y: 52 },
  { x: 92, y: 4 },
  { x: 3, y: 55 },
  { x: 68, y: 25 },
  { x: 76, y: 6 },
  { x: 28, y: 73 },
  { x: 72, y: 40 },
  { x: 81, y: 17 },
  { x: 12, y: 25 },
  { x: 1, y: 23 },
  { x: 34, y: 49 },
  { x: 13, y: 11 },
  { x: 0, y: 71 },
  { x: 43, y: 30 },
  { x: 25, y: 23 },
  { x: 15, y: 34 },
  { x: 8, y: 90 },
  { x: 7, y: 41 },
  { x: 67, y: 36 },
  { x: 17, y: 87 },
  { x: 56, y: 32 },
  { x: 9, y: 7 },
  { x: 16, y: 77 },
  { x: 8, y: 2 },
  { x: 52, y: 50 },
  { x: 41, y: 75 },
  { x: 41, y: 69 },
  { x: 18, y: 86 },
  { x: 17, y: 5 },
  { x: 4, y: 79 },
  { x: 76, y: 4 },
  { x: 50, y: 13 },
  { x: 75, y: 21 },
  { x: 9, y: 63 },
  { x: 33, y: 57 },
  { x: 39, y: 44 },
  { x: 3, y: 38 },
  { x: 89, y: 9 },
  { x: 24, y: 15 },
  { x: 72, y: 7 },
  { x: 8, y: 24 },
  { x: 29, y: 21 },
  { x: 14, y: 52 },
  { x: 4, y: 20 },
  { x: 68, y: 15 },
  { x: 70, y: 13 },
  { x: 52, y: 68 },
  { x: 3, y: 45 },
  { x: 29, y: 41 },
  { x: 0, y: 58 },
  { x: 0, y: 67 },
  { x: 57, y: 26 },
  { x: 71, y: 13 },
  { x: 35, y: 36 },
  { x: 24, y: 63 },
  { x: 18, y: 47 },
  { x: 84, y: 23 },
  { x: 47, y: 5 },
  { x: 0, y: 5 },
  { x: 17, y: 71 },
  { x: 37, y: 17 },
  { x: 88, y: 20 },
  { x: 53, y: 58 },
  { x: 64, y: 45 },
  { x: 39, y: 66 },
  { x: 33, y: 42 },
  { x: 29, y: 42 },
  { x: 42, y: 43 },
  { x: 56, y: 63 },
  { x: 23, y: 44 },
  { x: 44, y: 57 },
  { x: 47, y: 68 },
  { x: 15, y: 82 },
  { x: 60, y: 48 },
  { x: 38, y: 34 },
  { x: 20, y: 8 },
  { x: 66, y: 15 },
  { x: 4, y: 51 },
  { x: 3, y: 22 },
  { x: 16, y: 84 },
  { x: 19, y: 7 },
  { x: 66, y: 6 },
  { x: 69, y: 37 },
  { x: 0, y: 3 },
  { x: 67, y: 46 },
  { x: 4, y: 4 },
  { x: 19, y: 56 },
  { x: 30, y: 12 },
];
