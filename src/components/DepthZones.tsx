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

export const DepthZones: React.FunctionComponent<ReportProps> = (props) => {
  const [{ isCollection, childProperties }] = useSketchProperties();
  const { t } = useTranslation();
  const mg = project.getMetricGroup("depthZones", t);
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
        title={t("Depth Zones")}
        functionName="depthZones"
        extraParams={{ geographyIds: [curGeography.geographyId] }}
        useChildCard
      >
        {(data: ReportResult) => {
          if (!data || !data.metrics) return <Skeleton />;

          return (
            <>
              <Card title={t("Depth Zones")}>
                <p>
                  <Trans i18nKey="Depth Zones Card 1">
                    This report summarizes the percentage of depth zones within
                  </Trans>{" "}
                  {curGeography.display}
                  <Trans i18nKey="Depth Zones Card 2">
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
                        ℹ️ Overview: GEBCO ([General Bathymetric Chart of the
                        Oceans](https://www.gebco.net)) 2024 bathymetry data was
                        zoned using the following delineations: * 0 - 30m:
                        Altiphotic zone * 30 - 130m: Mesophotic zone * 130 -
                        320m: Rariphotic zone * 320 - 800m: Upper bathyal * 800
                        - 3500m: Lower bathyal * 3500 - 6500m: Abyssal This
                        mesophotic and rariphotic classification comes from work
                        done in Hawai'i, examining community structure and
                        species distribution with depth (Weijerman et al. 2019].
                        Studies in other areas (e.g. Caribbean [Baldwin et al.
                        2018]), have found similar depth breaks, but we chose
                        the Weijerman et al. zonation since it is geographically
                        the closest study to Kosrae. Although Weijerman et al.
                        further subdivide the mesophotic and rariphotic, such
                        fine scale division would likely be inaccurate without
                        local bathymetry and reef survey data. Since no term for
                        the shallow reef zone (0 - 30m) is commonly used, I
                        borrow the "Altiphotic zone" term (*altus* = high)
                        suggested by Baldwin et al. 2018. For the seafloor
                        beyond the 320m depth limit of the rariphotic, out to
                        the 12nm limit, which is the edge of our planning area,
                        the depth zonations from Watling et al. 2013 were used,
                        which are derived from several prior studies.
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
