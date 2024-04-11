import React, { useRef } from "react";
import { select, geoIdentity, geoPath } from "d3";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { useTranslation } from "react-i18next";
import { FeatureCollection, SketchCollection } from "@seasketch/geoprocessing";

export const PrintMap: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const drawMap = (props: { sketch: any; land: any }) => {
    if (!svgRef.current) return;
    const svg = select(svgRef.current);

    // Define projection and path type
    const projection = geoIdentity()
      .reflectY(true)
      .fitSize([300, 300], props.sketch);
    const path = geoPath().projection(projection);

    // Draw land on map
    svg
      .selectAll(".land")
      .data(
        props.land.geometry
          ? [props.land.geometry]
          : (props.land as FeatureCollection).features || []
      )
      .join("path")
      .attr("class", "land")
      .attr("d", path)
      .attr("fill", "lightgray");

    // Draw sketch on map
    svg
      .selectAll(".sketch")
      .data(
        props.sketch.geometry
          ? [props.sketch.geometry]
          : (props.sketch as SketchCollection).features || []
      )
      .join("path")
      .attr("class", "sketch")
      .attr("d", path)
      .attr("fill", "#A19F9F");
  };

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard title={t("Map Overview")} functionName="printMap">
        {(props: { sketch: any; land: any }) => {
          drawMap(props);
          return <svg ref={svgRef} width={300} height={300}></svg>;
        }}
      </ResultsCard>
    </div>
  );
};
