import React from "react";
import {
  Card,
  Collapse,
  LayerToggle,
  ResultsCard,
  useSketchProperties,
} from "@seasketch/geoprocessing/client-ui";
import { ReportResult } from "@seasketch/geoprocessing/client-core";
import project from "../../project/projectClient.js";
import { Trans, useTranslation } from "react-i18next";
import {
  genAreaGroupLevelTable,
  genAreaSketchTable,
  groupedCollectionReport,
  groupedSketchReport,
} from "../util/ProtectionLevelOverlapReports.js";
import { ReportProps } from "../util/ReportProp.js";

export const CoralAlgae: React.FunctionComponent<ReportProps> = (props) => {
  const [{ isCollection, childProperties }] = useSketchProperties();
  const { t } = useTranslation();
  const mg = project.getMetricGroup("coralAlgae", t);
  const curGeography = project.getGeographyById(props.geographyId, {
    fallbackGroup: "default-boundary",
  });
  const precalcMetrics = project.getPrecalcMetrics(
    mg,
    "area",
    curGeography.geographyId,
  );

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard
        title={t("Coral/Algae Habitat")}
        functionName="coralAlgae"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
        useChildCard
      >
        {(data: ReportResult) => {
          const [{ id }] = useSketchProperties();

          return (
            <>
              <Card title={t("Coral/Algae Habitat")}>
                <p>
                  <Trans i18nKey="Habitat Card 1">
                    This report summarizes the percentage of coral and algae
                    habitat area within
                  </Trans>{" "}
                  {curGeography.display}
                  <Trans i18nKey="Habitat Card 2">
                    's state waters that overlap with this plan. Plans should
                    consider protection of coral and algae habitat for
                    conservation.
                  </Trans>
                </p>

                <LayerToggle label={t("Show Map Layer")} layerId={mg.layerId} />

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
                    <Trans i18nKey="Habitat Zones - learn more">
                      <p>
                        ℹ️ Overview: Habitat zones were created using Allen
                        Coral Atlas data (https://www.allencoralatlas.org/),
                        reef monitoring site data from Dr Houk at University of
                        Guam, and depth classes created from global bathymetry
                        data from GEBCO (https://www.gebco.net/). Details of the
                        process are available in a separate report. Contact:
                        Jason Flower; jflower@ucsb.edu
                      </p>
                      <p>🎯 Planning Objective: TBD.</p>
                      <p>
                        📈 Report: The percentage of each feature type within
                        this plan is calculated by finding the overlap of each
                        feature type with the plan, summing its area, then
                        dividing it by the total area of each feature type found
                        within the selected nearshore planning area. If the plan
                        includes multiple areas that overlap, the overlap is
                        only counted once.
                      </p>
                    </Trans>
                  </Collapse>
                )}
              </Card>
            </>
          );
        }}
      </ResultsCard>
    </div>
  );
};
