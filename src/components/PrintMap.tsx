import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { useTranslation } from "react-i18next";
import { FeatureCollection, SketchCollection } from "@seasketch/geoprocessing";

export const PrintMap: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard title={t("Map Overview")} functionName="printMap">
        {(props: { sketch: any; land: any }) => {
          return <Map sketch={props.sketch} land={props.land} />;
        }}
      </ResultsCard>
    </div>
  );
};

interface MapProps {
  sketch: any;
  land: any;
}

const Map: React.FC<MapProps> = (props: { sketch: any; land: any }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Define projection and path generator
    const projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitSize([300, 300], props.sketch);
    const path = d3.geoPath().projection(projection);

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

    // Add labels for sketches
    svg
      .selectAll(".label")
      .data(
        props.sketch.geometry
          ? [props.sketch]
          : (props.sketch as SketchCollection).features || []
      )
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => path.centroid(d)[0])
      .attr("y", (d) => path.centroid(d)[1])
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text((d) => d.properties.name);
  }, [props.sketch, props.land]);

  return <svg ref={svgRef} width={300} height={300}></svg>;
};
