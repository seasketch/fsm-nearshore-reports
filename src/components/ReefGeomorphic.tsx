import React from "react";
import {
  Card,
  Collapse,
  LayerToggle,
  ResultsCard,
  Skeleton,
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

export const ReefGeomorphic: React.FunctionComponent<ReportProps> = (props) => {
  const [{ isCollection, childProperties }] = useSketchProperties();
  const { t } = useTranslation();
  const mg = project.getMetricGroup("reef_geomorph", t);
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
        title={t("Reef Geomorphic Zones")}
        functionName="reefGeomorphic"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
        useChildCard
      >
        {(data: ReportResult) => {
          if (!data || !data.metrics) return <Skeleton />;

          return (
            <>
              <Card title={t("Reef Geomorphic Zones")}>
                <p>
                  <Trans i18nKey="Reef Geomorphic Zones Card 1">
                    This report summarizes the percentage of reef geomorphic
                    features within
                  </Trans>{" "}
                  {curGeography.display}
                  <Trans i18nKey="Reef Geomorphic Zones Card 2">
                    's state waters that overlap with this plan.
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
                        ℹ️ Overview: This data is a modified versions of the
                        Millenium Coral Reef (MCR) data. Areas of reef mapped as
                        ‘reef extent’ by the Allen Coral Atlas and the Island
                        Atlas, were added to the original MCR data to ensure
                        full coverage of reef areas. These additional areas were
                        classified based on the class of the nearest raster cell
                        from the original MCR data. For the classification
                        process, all data was rasterized to ~5 x 5m resolution,
                        and then vectorized once complete. Some areas that ended
                        up mis-classified were subsequently reclassified, and
                        the single polygon classified as “Enclosed lagoon or
                        basin” was reclassified to “Enclosed lagoon” as
                        inspection of satellite imagery suggests all these areas
                        are similar (areas enclosed by reef).
                      </p>
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
