import React from "react";
import {
  ReportResult,
  percentWithEdge,
  firstMatchingMetric,
  Geography,
  roundDecimal,
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
  Skeleton,
  ErrorStatus,
} from "@seasketch/geoprocessing/client-ui";
import { styled } from "styled-components";
import project from "../../project/projectClient.js";
import Translator from "../components/TranslatorAsync.js";
import { Trans, useTranslation } from "react-i18next";
import {
  genAreaGroupLevelTable,
  genAreaSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports.js";
import { ReportProps } from "../util/ReportProp.js";

const formatLabel = (display: string) => {
  if (display === "Yap: Main Island") return "Yap";
  const idx = display.indexOf(":");
  if (idx === -1) return display;
  const after = display.slice(idx + 1).trim();
  return after.length ? after : display;
};

const Number = new Intl.NumberFormat("en", { style: "decimal" });

export const SizeCard: React.FunctionComponent<ReportProps> = (props) => {
  const [{ isCollection, childProperties }] = useSketchProperties();
  const { t } = useTranslation();

  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });
  const geographyLabel = formatLabel(curGeography.display);
  const mg = project.getMetricGroup("boundaryAreaOverlap", t);
  const precalcMetrics = project.getPrecalcMetrics(
    mg,
    "area",
    curGeography.geographyId,
  );
  const notFoundString = t("Results not found");

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard
        title={t("Size")}
        functionName="boundaryAreaOverlap"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
        useChildCard
      >
        {(data: ReportResult) => {
          if (!data || !data.metrics) return <Skeleton />;

          if (Object.keys(data).length === 0) throw new Error(notFoundString);

          // Get overall area of sketch metric
          const areaMetric = firstMatchingMetric(
            data.metrics,
            (m) =>
              m.sketchId === data.sketch!.properties.id && m.groupId === null,
          );

          // Grab overall size precalc metric
          const totalAreaMetric = firstMatchingMetric(
            precalcMetrics,
            (m) => m.groupId === null,
          );

          // Format area metrics for key section display
          const areaDisplayKm = areaMetric.value
            ? roundDecimal(squareMeterToKilometer(areaMetric.value), 2, {
                keepSmallValues: true,
              })
            : 0;

          const areaDisplayHa = areaMetric.value
            ? roundDecimal(areaMetric.value / 10000, 2, {
                keepSmallValues: true,
              })
            : 0;
          const percDisplay = percentWithEdge(
            areaMetric.value / totalAreaMetric.value,
          );
          const areaUnitHa = t("ha");
          const areaUnitKm = t("km²");
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
                <KeySection>
                  {t("This plan is")}{" "}
                  <b>
                    {Number.format(areaDisplayHa)} {areaUnitHa} (
                    {Number.format(areaDisplayKm)} {areaUnitKm})
                  </b>
                  {", "}
                  {t("or")} <b>{percDisplay}</b> {t("of ")} {geographyLabel}'s{" "}
                  {t("waters")}, which extend from the shoreline out to 12
                  nautical miles.
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
                    <p>
                      <img
                        src={new URL(
                          "../assets/img/territorial_waters.png",
                          import.meta.url,
                        ).toString()}
                        style={{ maxWidth: "100%" }}
                        alt={t("Territorial Waters")}
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
                        This report summarizes the size of this plan within the
                        selected nearshore planning area.
                      </p>
                    </Trans>
                  </Collapse>
                )}
              </ToolbarCard>
            </>
          );
        }}
      </ResultsCard>
    </div>
  );
};

const genWarning = (curGeography: Geography) => {
  return (
    <Card>
      <ErrorStatus
        msg={
          <>
            <Trans i18nKey="SizeCard - warning 1">
              This plan <b>does not</b> overlap with{" "}
            </Trans>{" "}
            {formatLabel(curGeography.display)}
            <Trans i18nKey="SizeCard - warning 2">
              's territorial sea, please select a different planning area for
              useful report metrics.
            </Trans>
          </>
        }
      />
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
