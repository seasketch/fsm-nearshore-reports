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
import project from "../../project/projectClient.js";
import { Trans, useTranslation } from "react-i18next";
import { Scatterplot } from "./util/Scatterplot.js";
import {
  isRasterDatasource,
  isVectorDatasource,
} from "@seasketch/geoprocessing";
import { ReportProps } from "../util/ReportProp.js";

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
              label: t("Fishery Value Accessible") + " (%)",
            },
            y: {
              value: benthicFisheriesTradeoffs.y,
              label: t("Key Benthic Habitat Protected") + " (%)",
            },
          };

          return (
            <ReportError>
              <InfoStatus
                msg={
                  <>
                    This report is serving as a <b>demo</b> of potential
                    tradeoff analyses SeaSketch could support.
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

// Efficiency frontier from Crow tradeoff analysis
const habitat = [
  0, 0.13305, 0.25501, 0.36133, 0.44103, 0.51099, 0.52468, 0.52727, 0.54516,
  0.59088, 0.59341, 0.62119, 0.74077, 0.7613, 0.92644, 0.94676, 0.94752,
  0.94796, 0.9521, 0.95342, 0.97769, 0.98126, 0.98377, 0.9957, 0.9974, 0.99793,
  0.9985, 0.99875, 0.99995, 0.99997, 0.99999, 1,
];
const fisheries = [
  0.62133, 0.61336, 0.60333, 0.59371, 0.58407, 0.57102, 0.56758, 0.56669,
  0.56034, 0.54342, 0.54232, 0.52898, 0.46624, 0.45471, 0.3599, 0.34792,
  0.34716, 0.34598, 0.33446, 0.33078, 0.2452, 0.23204, 0.22158, 0.15941,
  0.14899, 0.14411, 0.13516, 0.12865, 0.044706, 0.032809, 0.016694, 0,
];

const scatterdata = fisheries.map((value, index) => ({
  x: (value + 0.37867) * 100, // Fisheries on x axis, add value outside of tradeoff area
  y: habitat[index] * 100, // Habitat on y axis, all value falls within tradeoff area
}));
