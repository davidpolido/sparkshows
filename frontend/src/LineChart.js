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
  const { data, height, width, yScaleMin, yScaleMax, yScalePadding } = props;
  const numberEpisodes = d3Max(data, xSelector);
  const validatedWidth = width <= 40 ? width + 20 : width - 30;
  // scales
  const xScale = scaleLinear({
    domain: [1, numberEpisodes],
    range: [30, validatedWidth]
  });
  const yScale = scaleLinear({
    domain: [yScaleMin, yScaleMax],
    range: [height - yScalePadding.bottom, yScalePadding.top]
  });
  const textScale = scaleLinear({
    domain: [35, 1],
    range: [12, 40]
  });
  const lineWidthScale = scaleLinear({
    domain: [400, 1],
    range: [1, 4]
  });

  const seasonSummary = tidy(
    data,
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
    <>
      <svg width={validatedWidth} height={height}>
        <g>
          {seasonSummary.map((season) =>
            props.showSeasons ? (
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
                  y={yScale.range()[0] - 10}
                  fill="#fff"
                  fontSize={`${textScale(maxSeasonNumber)}px`}
                  fontWeight="bold"
                  textAnchor="middle"
                >{`${season.episodeSeasonNumber}`}</text>
              </g>
            ) : null
          )}
          {props.showGuides ? (
            <>
              <AxisLeft
                tickClassName="axis-labels"
                scale={yScale}
                hideAxisLine
                hideTicks
                left={35}
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
                stroke="#E0E0E0"
                tickValues={[2.5, 7.5]}
                strokeDasharray={[5, 5]}
              />
              <GridRows
                scale={yScale}
                width={xScale.range()[1] - xScale.range()[0]}
                left={xScale.range()[0]}
                stroke="#E0E0E0"
                tickValues={[0, 10]}
              />
              <text
                fill="#9e9e9e"
                fontSize="15px"
                textAnchor="middle"
                transform={`translate(10, ${
                  yScale.range()[0] / 2
                }) rotate(-90)`}
              >
                Avg. Episode Rating
              </text>
              <text
                x={xScale.range()[1] - 45}
                y={height - 10}
                fill="#9e9e9e"
                fontSize="15px"
              >
                Episodes
              </text>
            </>
          ) : null}
          <LinePath
            curve={curveLinear}
            data={data}
            x={(d) => xScale(xSelector(d))}
            y={(d) => yScale(ySelector(d))}
            stroke="#000"
            strokeWidth={
              props.lineWidthOverride
                ? props.lineWidthOverride
                : lineWidthScale(d3Max(data, xSelector))
            }
            strokeOpacity={1}
          />
        </g>
      </svg>
    </>
  );
}
