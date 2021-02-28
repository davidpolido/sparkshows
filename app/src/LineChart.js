import React from "react";
import { LinePath } from "@vx/shape";
import { curveLinear } from "@vx/curve";
import { scaleLinear } from "@vx/scale";
import { GridRows } from "@vx/grid";
import { AxisLeft } from "@vx/axis";
import { max as d3Max } from "d3-array";
import { tidy, groupBy, summarize, min, max, mean } from "@tidyjs/tidy";

import "./LineChart.css";

// data accessors
const xSelector = (d) => d.episodeContinuousNumber;
const ySelector = (d) => d.episodeAverageRating;
const seasonSelector = (d) => d.episodeSeasonNumber;

export default function LineChart(props) {
  const width = 800;
  const height = 300;

  // scales
  const xScale = scaleLinear({
    domain: [1, d3Max(props.data, xSelector)],
    range: [20, width - 10]
  });
  const yScale = scaleLinear({
    domain: [0, 10],
    range: [height - 10, 10]
  });
  const textScale = scaleLinear({
    domain: [35, 1],
    range: [12, 40]
  });

  const seasonSummary = tidy(
    props.data,
    groupBy("episodeSeasonNumber", [
      summarize({
        min: min("episodeContinuousNumber"),
        max: max("episodeContinuousNumber"),
        avg: mean("episodeAverageRating")
      })
    ])
  );
  const maxSeasonNumber = d3Max(seasonSummary, seasonSelector);

  return (
    <svg width={width} height={height}>
      <g>
        {seasonSummary.map((season) =>
          props.showSeason ? (
            <g key={`season-${season.episodeSeasonNumber}`}>
              <rect
                x={xScale(season.min)}
                y={yScale.range()[1]}
                width={xScale(season.max) - xScale(season.min)}
                height={yScale.range()[0] - yScale.range()[1]}
                fill="#000"
                opacity={0.15}
                rx={5}
                ry={5}
              />
              <line
                x1={xScale(season.min)}
                x2={xScale(season.max)}
                y1={yScale(season.avg)}
                y2={yScale(season.avg)}
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={
                  xScale(season.min) +
                  (xScale(season.max) - xScale(season.min)) / 2
                }
                y={height - 20}
                fill="#fff"
                fontSize={`${textScale(maxSeasonNumber)}px`}
                fontWeight="bold"
                textAnchor="middle"
              >{`${season.episodeSeasonNumber}`}</text>
            </g>
          ) : null
        )}
        <LinePath
          curve={curveLinear}
          data={props.data}
          x={(d) => xScale(xSelector(d))}
          y={(d) => yScale(ySelector(d))}
          stroke="#333"
          strokeWidth={4}
          strokeOpacity={1}
        />
        <AxisLeft
          tickClassName="axis-labels"
          scale={yScale}
          hideAxisLine
          hideTicks
          left={25}
          tickValues={[0, 5, 10]}
        />
        <GridRows
          scale={yScale}
          width={xScale.range()[1] - xScale.range()[0]}
          left={xScale.range()[0]}
          stroke="#616161"
          tickValues={[5]}
          strokeDasharray={[5, 5]}
        />
        <GridRows
          scale={yScale}
          width={xScale.range()[1] - xScale.range()[0]}
          left={xScale.range()[0]}
          stroke="#9E9E9E"
          tickValues={[0, 10]}
        />
      </g>
    </svg>
  );
}
