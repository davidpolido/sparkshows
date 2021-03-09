import React, { useState, useEffect } from "react";
import {
  tidy,
  filter,
  arrange,
  asc,
  desc,
  groupBy,
  max,
  sliceHead
} from "@tidyjs/tidy";
import { Switch, Select } from "antd";
import { ParentSize } from "@vx/responsive";

import LineChart from "./LineChart";

import "./SmallMultiplesView.css";

const { Option } = Select;
const topXOptions = [5, 10, 20, 50, 100];
const sortOptions = [
  { label: "Number of Episodes", column: "seriesNumEpisodes" },
  { label: "Number of Seasons", column: "seriesNumSeasons" },
  { label: "Series Title", column: "seriesTitle" },
  { label: "Series Average Rating", column: "seriesAverageRating" }
];
const sortDirections = ["Descending", "Ascending"];

export default function SmallMultiplesView(props) {
  const [showSeasons, setShowSeasons] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  const [showJustified, setShowJustified] = useState(false);
  const [seriesList, setSeriesList] = useState([]);
  const [seriesGroupData, setseriesGroupData] = useState([]);
  const [topX, setTopX] = useState(20);
  const [sortColumn, setSortColumn] = useState(sortOptions[0].column);
  const [sortDirection, setSortDirection] = useState("Descending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sort =
      sortDirection === "Ascending" ? asc(sortColumn) : desc(sortColumn);
    const newSeriesList = tidy(
      props.data,
      arrange(sort),
      groupBy("seriesTitle", [], groupBy.keys()),
      sliceHead(topX)
    );
    setSeriesList(newSeriesList);
  }, [props.data, topX, sortColumn, sortDirection]);

  useEffect(() => {
    if (seriesList.length === 0) {
      console.log("not yet");
      return;
    }
    const filteredData = tidy(
      props.data,
      filter((d) => seriesList.indexOf(d.seriesTitle) >= 0)
    );
    setseriesGroupData(filteredData);
    setIsLoading(false);
  }, [props.data, seriesList]);

  const handleSeasonChange = (checked) => {
    setShowSeasons(checked);
  };
  const handleGuidesChange = (checked) => {
    setShowGuides(checked);
  };
  const handleJustify = (checked) => {
    setShowJustified(checked);
  };
  const handleTopX = (value) => {
    setTopX(value);
    setIsLoading(true);
  };
  const handleSortColumn = (value) => {
    setSortColumn(value);
    setIsLoading(true);
  };
  const handleSortDirection = (value) => {
    setSortDirection(value);
    setIsLoading(true);
  };

  if (isLoading) {
    return null;
  }

  const maxNumEpisodes = tidy(seriesGroupData, max("episodeContinuousNumber"));
  console.log(sortOptions, sortColumn);
  const sortColumnLabel = sortOptions.filter((o) => o.column === sortColumn)[0]
    .label;
  console.log(seriesList, seriesGroupData);

  return (
    <>
      <div className="smv-control-panel-card">
        <h1 className="smv-control-panel-label">
          SMALL MULTIPLES VIEW CONTROLS
        </h1>
        <div className="smv-control-panel-inputs">
          <p>Top</p>
          <Select
            style={{
              width: "60px",
              marginRight: 20,
              fontSize: "20px"
            }}
            defaultValue={topX}
            onChange={handleTopX}
          >
            {topXOptions.map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
          <p>Sort by</p>
          <Select
            style={{
              width: "200px",
              marginRight: 20,
              fontSize: "20px"
            }}
            defaultValue={sortColumnLabel}
            onChange={handleSortColumn}
          >
            {sortOptions.map((o) => (
              <Option key={o.column} value={o.column}>
                {o.label}
              </Option>
            ))}
          </Select>
          <Select
            style={{
              width: "120px",
              marginRight: 20,
              fontSize: "20px"
            }}
            defaultValue={sortDirection}
            onChange={handleSortDirection}
          >
            {sortDirections.map((value) => (
              <Option key={value} value={value}>
                {value}
              </Option>
            ))}
          </Select>
          <Switch
            checked={showSeasons}
            checkedChildren="Seasons"
            unCheckedChildren="Seasons"
            onChange={handleSeasonChange}
            style={{ fontSize: "22px" }}
          />
          <Switch
            checked={showGuides}
            checkedChildren="Guides"
            unCheckedChildren="Guides"
            onChange={handleGuidesChange}
            style={{ fontSize: "22px" }}
          />
          <Switch
            checked={showJustified}
            checkedChildren="Justify"
            unCheckedChildren="Justify"
            onChange={handleJustify}
            style={{ fontSize: "22px" }}
          />
        </div>
      </div>
      <>
        {seriesGroupData &&
          seriesList.map((seriesName) => {
            const seriesData = tidy(
              seriesGroupData,
              filter((d) => d.seriesTitle === seriesName),
              arrange([asc("episodeContinuousNumber")])
            );

            return (
              <div key={seriesName} className="smv-small-multiple-card">
                <div className="smv-line-chart-header">
                  <h1 className="smv-series-title" style={{ width: 800 }}>
                    {seriesName}
                  </h1>
                  <div className="smv-series-stats">
                    <p>
                      <span>{seriesData[0].seriesNumSeasons}</span>
                      Seasons
                    </p>
                    <p>
                      <span>{seriesData[0].seriesNumEpisodes}</span>
                      Episodes
                    </p>
                    <p>
                      <span>{seriesData[0].seriesAverageRating}</span>
                      Avg. Rating
                    </p>
                  </div>
                </div>
                <ParentSize>
                  {(parent) => (
                    <LineChart
                      data={seriesData}
                      showSeasons={showSeasons}
                      showGuides={showGuides}
                      width={
                        showJustified
                          ? parent.width
                          : parent.width *
                            (seriesData[0].seriesNumEpisodes / maxNumEpisodes)
                      }
                      height={100}
                      yScaleMax={10}
                      yScaleMin={0}
                      yScalePadding={{ top: 4, bottom: 4 }}
                      lineWidthOverride={1}
                    />
                  )}
                </ParentSize>
              </div>
            );
          })}
      </>
    </>
  );
}
