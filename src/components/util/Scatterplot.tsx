import React from "react";
import { scaleLinear, ScaleLinear } from "d3-scale";
import { styled, keyframes } from "styled-components";

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

const fadeInAndMove = keyframes`
  from {
    opacity: 0;
    transform: translate(-5px, 5px); // Move the point up and left
  }
  to {
    opacity: 1;
    transform: translate(0, 0); // Move the point to its correct position
  }
`;

// Animated circle
const AnimatedCircle = styled.circle<React.SVGProps<SVGCircleElement>>`
  animation: ${fadeInAndMove} 1s ease;
`;

// Animated text beneath circle
const AnimatedText = styled.text<React.SVGProps<SVGTextElement>>`
  animation: ${fadeInAndMove} 0.5s ease;
  text-shadow: white 0 0 55px, white 0 0 5px, white 0 0 5px, white 0 0 5px;
`;

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

  // Scales for plotting axes and points
  const yScale = scaleLinear().domain(yDomain).range([boundsHeight, 0]);
  const xScale = scaleLinear().domain(xDomain).range([0, boundsWidth]);

  // Tradeoff horizon from Crow analysis
  const tradeoffPoints = data.map((d, i) => (
    <AnimatedCircle
      className="animated-scatter"
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
      <AnimatedCircle
        className="animated-scatter"
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
      <AnimatedText
        className="animated-scatter"
        x={xScale(tradeoff.x.value)}
        y={yScale(tradeoff.y.value) + 15}
        fill="#666666"
        fontSize="12px"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {sketchName}
      </AnimatedText>
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
          <AxisLeft scale={yScale} pixelsPerTick={40} length={boundsWidth} />
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
              scale={xScale}
              pixelsPerTick={40}
              length={boundsHeight}
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

type AxisProps = {
  scale: ScaleLinear<number, number>;
  pixelsPerTick: number;
  length: number;
};

const AxisLeft = ({ scale, pixelsPerTick, length }: AxisProps) => {
  const range = scale.range();
  const tickLength = 5;

  const ticks = (() => {
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: scale(value),
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
              x2={length}
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

export const AxisBottom = ({ scale, pixelsPerTick, length }: AxisProps) => {
  const range = scale.range();
  const tickLength = 5;

  const ticks = (() => {
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: scale(value),
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
            <line y1={0} y2={-length} stroke="#777777" strokeWidth={0.5} />
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
