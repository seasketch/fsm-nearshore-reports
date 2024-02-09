import React from "react";
import { scaleLinear, ScaleLinear } from "d3-scale";

export type ScatterplotProps = {
  // Array of tradeoff points from Crow analysis
  data: { x: number; y: number }[];
  // Tradeoff values (0-100) and axes labels
  tradeoff: {
    x: { value: number; label?: string };
    y: { value: number; label?: string };
  };
  // Name of sketch, printed below tradeoff point
  sketchName?: string;
  margins?: { top: number; right: number; bottom: number; left: number };
  width?: number;
  height?: number;
  xDomain?: [number, number];
  yDomain?: [number, number];
};

export const Scatterplot = ({
  data,
  tradeoff,
  sketchName = "",
  margins = { top: 30, right: 60, bottom: 60, left: 60 },
  width = 480,
  height = 420,
  xDomain = [0, 100],
  yDomain = [0, 100],
}: ScatterplotProps) => {
  // Bounds (area inside the axes)
  const boundsWidth = width - margins.right - margins.left;
  const boundsHeight = height - margins.top - margins.bottom;

  // Scales
  const yScale = scaleLinear().domain(yDomain).range([boundsHeight, 0]);
  const xScale = scaleLinear().domain(xDomain).range([0, boundsWidth]);

  // Tradeoff horizon
  const tradeoffPoints = data.map((d, i) => (
    <circle
      key={i}
      r={3}
      cx={xScale(d.x)}
      cy={yScale(d.y)}
      opacity={1}
      stroke="#AFAFAF"
      fill="#AFAFAF"
      fillOpacity={1}
      strokeWidth={1}
    />
  ));

  // Tradeoff point
  const planPoint = (
    <g key="tradeoff_shape">
      {/* Point */}
      <circle
        key={"tradeoffPt"}
        r={5}
        cx={xScale(tradeoff.x.value)}
        cy={yScale(tradeoff.y.value)}
        opacity={1}
        stroke="#009cff"
        fill="#CCEDF9"
        fillOpacity={1}
        strokeWidth={1}
      />

      {/* Label */}
      <text
        x={xScale(tradeoff.x.value)}
        y={yScale(tradeoff.y.value) + 15}
        fill="white"
        fontSize="11px"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
        strokeWidth="2"
        stroke="white"
        opacity={0.8}
      >
        {sketchName}
      </text>
      <text
        x={xScale(tradeoff.x.value)}
        y={yScale(tradeoff.y.value) + 15}
        fill="#666666"
        fontSize="12px"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {sketchName}
      </text>
    </g>
  );

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[margins.left, margins.top].join(",")})`}
        >
          {/* Y axis */}
          <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />
          {tradeoff.y.label && (
            <text
              transform={`translate(${-margins.left / 1.5}, ${
                boundsHeight / 2
              }) rotate(-90)`}
              textAnchor="middle"
              fill="#777777"
              fontSize="14px"
            >
              {tradeoff.y.label}
            </text>
          )}

          {/* X axis */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
              xScale={xScale}
              pixelsPerTick={40}
              height={boundsHeight}
            />
            {tradeoff.x.label && (
              <text
                x={boundsWidth / 2}
                y={margins.bottom / 1.5}
                textAnchor="middle"
                fill="#777777"
                fontSize="14px"
              >
                {tradeoff.x.label}
              </text>
            )}
          </g>

          {/* Points */}
          {tradeoffPoints}
          {planPoint}
        </g>
      </svg>
    </div>
  );
};

type AxisLeftProps = {
  yScale: ScaleLinear<number, number>;
  pixelsPerTick: number;
  width: number;
};

type AxisBottomProps = {
  xScale: ScaleLinear<number, number>;
  pixelsPerTick: number;
  height: number;
};

const AxisLeft = ({ yScale, pixelsPerTick, width }: AxisLeftProps) => {
  const range = yScale.range();
  const tickLength = 5;

  const ticks = (() => {
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
    }));
  })();

  return (
    <>
      {/* Ticks and labels */}
      {ticks.map(({ value, yOffset }) => (
        <g
          key={value}
          transform={`translate(0, ${yOffset})`}
          shapeRendering={"crispEdges"}
        >
          {!value ? (
            <line
              x1={-tickLength}
              x2={width}
              stroke="#777777"
              strokeWidth={0.5}
            />
          ) : (
            <></>
          )}
          <line x1={-tickLength} x2={0} stroke="#777777" strokeWidth={0.5} />
          <text
            key={value}
            dominantBaseline="middle"
            style={{
              fontSize: "11px",
              textAnchor: "middle",
              transform: "translateX(-20px)",
              fill: "#777777",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};

export const AxisBottom = ({
  xScale,
  pixelsPerTick,
  height,
}: AxisBottomProps) => {
  const range = xScale.range();
  const tickLength = 5;

  const ticks = (() => {
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  })();

  return (
    <>
      {/* Ticks and labels */}
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`}
          shapeRendering={"crispEdges"}
        >
          {!value ? (
            <line y1={0} y2={-height} stroke="#777777" strokeWidth={0.5} />
          ) : (
            <></>
          )}
          <line y1={tickLength} y2={0} stroke="#777777" strokeWidth={0.5} />
          <text
            key={value}
            style={{
              fontSize: "11px",
              textAnchor: "middle",
              transform: "translateY(20px)",
              fill: "#777777",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};
