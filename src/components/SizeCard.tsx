import React from "react";
import {
  ReportResult,
  percentWithEdge,
  GeogProp,
  firstMatchingMetric,
  Geography,
  roundLower,
  squareMeterToKilometer,
} from "@seasketch/geoprocessing/client-core";
import {
  Collapse,
  ResultsCard,
  useSketchProperties,
  ToolbarCard,
  DataDownload,
  Card,
  VerticalSpacer,
  KeySection,
  LayerToggle,
} from "@seasketch/geoprocessing/client-ui";
import styled from "styled-components";
import project from "../../project";
import Translator from "../components/TranslatorAsync";
import { Trans, useTranslation } from "react-i18next";
import {
  genAreaGroupLevelTable,
  genAreaSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports";

export const SizeCard: React.FunctionComponent<GeogProp> = (props) => {
  const [{ isCollection }] = useSketchProperties();
  const { t } = useTranslation();

  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });
  const mg = project.getMetricGroup("boundaryAreaOverlap", t);
  const precalcMetrics = project.getPrecalcMetrics(
    mg,
    "area",
    curGeography.geographyId
  );
  const notFoundString = t("Results not found");

  return (
    <ResultsCard
      title={t("Size")}
      functionName="boundaryAreaOverlap"
      extraParams={{ geographyIds: [curGeography.geographyId] }}
      useChildCard
    >
      {(data: ReportResult) => {
        if (Object.keys(data).length === 0) throw new Error(notFoundString);

        // Get overall area of sketch metric
        const areaMetric = firstMatchingMetric(
          data.metrics,
          (m) => m.sketchId === data.sketch.properties.id && m.groupId === null
        );

        // Grab overall size precalc metric
        const totalAreaMetric = firstMatchingMetric(
          precalcMetrics,
          (m) => m.groupId === null
        );

        // Format area metrics for key section display
        const areaDisplay = roundLower(
          squareMeterToKilometer(areaMetric.value)
        );
        const percDisplay = percentWithEdge(
          areaMetric.value / totalAreaMetric.value
        );
        const areaUnitDisplay = t("km²");
        const mapLabel = t("Show Map Layer");

        return (
          <>
            {!areaMetric.value ? genWarning(curGeography) : null}
            <ToolbarCard
              title={t("Size")}
              items={
                <>
                  <DataDownload
                    filename="size"
                    data={data.metrics}
                    formats={["csv", "json"]}
                    placement="left-end"
                  />
                </>
              }
            >
              <p>
                {curGeography.display}'s{" "}
                <Trans i18nKey="SizeCard - introduction">
                  territorial sea extends from the shoreline out to 12 nautical
                  miles. This report summarizes coastal plan overlap with the
                  territorial sea.
                </Trans>
              </p>

              <KeySection>
                {t("This plan is")}{" "}
                <b>
                  {areaDisplay} {areaUnitDisplay}
                </b>
                {", "}
                {t("which is")} <b>{percDisplay}</b> {t("of ")}{" "}
                {curGeography.display}'s {t("territorial sea")}.
              </KeySection>

              <LayerToggle label={mapLabel} layerId={mg.classes[0].layerId} />
              <VerticalSpacer />

              {isCollection
                ? groupedCollectionReport(data, precalcMetrics, mg, t, {
                    showLayerToggles: false,
                  })
                : groupedSketchReport(data, precalcMetrics, mg, t, {
                    showLayerToggles: false,
                  })}

              {isCollection && (
                <>
                  <Collapse title={t("Show by Zone Type")}>
                    {genAreaGroupLevelTable(data, precalcMetrics, mg, t)}
                  </Collapse>
                  <Collapse title={t("Show by Zone")}>
                    {genAreaSketchTable(data, precalcMetrics, mg, t)}
                  </Collapse>
                </>
              )}

              <Collapse title={t("Learn more")}>
                <p>
                  <img
                    src={require("../assets/img/territorial_waters.png")}
                    style={{ maxWidth: "100%" }}
                  />
                  <a
                    target="_blank"
                    href="https://en.wikipedia.org/wiki/Territorial_waters"
                  >
                    <Trans i18nKey="SizeCard - learn more source">
                      Source: Wikipedia - Territorial Waters
                    </Trans>
                  </a>
                </p>
                <Trans i18nKey="SizeCard - learn more">
                  <p>
                    {" "}
                    This report summarizes the size and proportion of this plan
                    within these boundaries.
                  </p>
                  <p>
                    If sketch boundaries within a plan overlap with each other,
                    the overlap is only counted once.
                  </p>
                </Trans>
              </Collapse>
            </ToolbarCard>
          </>
        );
      }}
    </ResultsCard>
  );
};

// styled-components are needed here to use the ::before pseudo selector
const ErrorIndicator = styled.div`
  display: inline-block;
  font-weight: bold;
  font-size: 18px;
  line-height: 1em;
  background-color: #ea4848;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  color: white;
  text-align: center;
  margin-right: 8px;
  ::before {
    position: relative;
    bottom: -1px;
    content: "!";
  }
`;

const genWarning = (curGeography: Geography) => {
  return (
    <Card>
      <div role="alert">
        <ErrorIndicator />
        <Trans i18nKey="SizeCard - warning 1">
          This plan <b>does not</b> overlap with{" "}
        </Trans>{" "}
        {curGeography.display}
        <Trans i18nKey="SizeCard - warning 2">
          's territorial sea, please select a different planning area for useful
          report metrics.
        </Trans>
      </div>
    </Card>
  );
};

/**
 * SizeCard as a top-level report client
 */
export const SizeCardReportClient = () => {
  return (
    <Translator>
      <SizeCard />
    </Translator>
  );
};
