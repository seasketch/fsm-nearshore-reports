import React from "react";
import {
  Collapse,
  LayerToggle,
  ResultsCard,
  VerticalSpacer,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import { ReportResult, GeogProp } from "@seasketch/geoprocessing/client-core";
import project from "../../project";
import { Trans, useTranslation } from "react-i18next";
import Translator from "./TranslatorAsync";
import {
  genAreaGroupLevelTable,
  genAreaSketchTable,
  genSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports";

export const Habitat: React.FunctionComponent<GeogProp> = (props) => {
  const [{ isCollection }] = useSketchProperties();
  const { t } = useTranslation();
  const mg = project.getMetricGroup("habitatAreaOverlap", t);
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });
  const precalcMetrics = project.getPrecalcMetrics(
    mg,
    "area",
    curGeography.geographyId
  );

  return (
    <>
      <ResultsCard
        title={t("Key Benthic Habitat")}
        functionName="habitatAreaOverlap"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
      >
        {(data: ReportResult) => (
          <>
            <p>
              <Trans i18nKey="Habitat Card 1">
                This report summarizes the percentage of key benthic habitat
                area within
              </Trans>{" "}
              {curGeography.display}
              <Trans i18nKey="Habitat Card 2">
                's territorial sea that overlaps with this plan. Plans should
                consider protection of key benthic habitat for conservation.
              </Trans>
            </p>

            <LayerToggle label={t("Show Map Layer")} layerId={mg.layerId} />

            <Translator>
              {isCollection
                ? groupedCollectionReport(data, precalcMetrics, mg, t)
                : groupedSketchReport(data, precalcMetrics, mg, t)}

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
            </Translator>

            <Collapse title={t("Learn more")}>
              <Trans i18nKey="Habitat Card - learn more">
                <p>
                  ℹ️ Overview: Plans should ensure representative coverage of
                  key benthic habitat. The report summarizes the percentage of
                  the key habitat that fall within the plan.
                </p>
                <p>🎯 Planning Objective: TBD.</p>
                <p>🗺️ Source data: Allen Coral Atlas</p>
                <p>
                  📈 Report: The percentage of each feature type within this
                  plan is calculated by finding the overlap of each feature type
                  with the plan, summing its area, then dividing it by the total
                  area of each feature type found within the selected nearshore
                  planning area. If the plan includes multiple areas that
                  overlap, the overlap is only counted once.
                </p>
              </Trans>
            </Collapse>
          </>
        )}
      </ResultsCard>
    </>
  );
};
