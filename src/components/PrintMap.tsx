import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { ResultsCard } from "@seasketch/geoprocessing/client-ui";
import { useTranslation } from "react-i18next";
import { SketchCollection } from "@seasketch/geoprocessing";

export const PrintMap: React.FunctionComponent = (hidden) => {
  const { t } = useTranslation();

  return (
    <div style={{ breakInside: "avoid" }}>
      <ResultsCard title={t("Map")} functionName="printMap">
        {(sketch) => {
          return <Map sketch={sketch} />;
        }}
      </ResultsCard>
    </div>
  );
};

interface MapProps {
  sketch: any;
}

const Map: React.FC<MapProps> = ({ sketch }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  console.log("MAPPING");

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Define projection and path generator
    const projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitSize([300, 300], sketch);
    const path = d3.geoPath().projection(projection);

    // Draw sketch on map
    svg
      .selectAll("path")
      .data(
        sketch.geometry
          ? [sketch.geometry]
          : (sketch as SketchCollection).features || []
      )
      .join("path")
      .attr("d", path)
      .attr("fill", "steelblue")
      .attr("stroke", "white")
      .attr("stroke-width", 1);
  }, [sketch]);

  return <svg ref={svgRef} width={300} height={300}></svg>;
};
