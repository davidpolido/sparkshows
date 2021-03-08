import React, { useState, useEffect } from "react";
import { tidy, filter, arrange, asc, groupBy } from "@tidyjs/tidy";
import { Switch, Select } from "antd";
import { ParentSize } from "@vx/responsive";

import LineChart from "./LineChart";

import "./SingleShowView.css";

const { Option } = Select;

export default function SingleShowView({ data }) {
  const [seriesData, setSeriesData] = useState([]);
  const [allSeries, setAllSeries] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [showSeason, setShowSeason] = useState(false);
  const [showGuides, setshowGuides] = useState(true);

  useEffect(() => {
    const singleShowData = tidy(
      data,
      filter((d) => d.seriesTitle === selectedSeries),
      arrange([asc("episodeContinuousNumber")])
    );
    setSeriesData(singleShowData);

    const seriesList = tidy(
      data,
      arrange(asc("seriesTitle")),
      groupBy("seriesTitle", [], groupBy.keys())
    );
    setAllSeries(seriesList);
  }, [data, selectedSeries]);

  function handleSeriesSelect(value) {
    setSelectedSeries(value);
  }
  const handleSeasonChange = (checked) => {
    setShowSeason(checked);
  };

  const handleGuidesChange = (checked) => {
    setshowGuides(checked);
  };

  return (
    <>
      <div className="control-panel-card">
        <h1 className="control-panel-label">CONTROLS</h1>
        <div className="control-panel-inputs">
          <Select
            showSearch
            style={{
              width: "50%",
              marginRight: 20,
              fontSize: "20px"
            }}
            placeholder="Select a TV Show"
            onChange={handleSeriesSelect}
            allowClear={true}
            filterOption={(input, option) =>
              option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {allSeries.map((seriesTitle) => (
              <Option key={seriesTitle} value={seriesTitle}>
                {seriesTitle}
              </Option>
            ))}
          </Select>
          <span>
            <Switch
              checked={showSeason}
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
          </span>
        </div>
      </div>
      {seriesData.length > 0 ? (
        <div className="line-chart-card">
          <div className="line-chart-header">
            <h1 className="series-title" style={{ width: 800 }}>
              {selectedSeries}
            </h1>
            <p>
              <span>{seriesData[0].seriesNumSeasons}</span>
              <br />
              Seasons
            </p>
            <p>
              <span>{seriesData[0].seriesNumEpisodes}</span>
              <br />
              Episodes
            </p>
            <p>
              <span>{seriesData[0].seriesAverageRating}</span>
              <br />
              Avg. Rating
            </p>
          </div>

          <ParentSize className="line-chart">
            {(parent) => (
              <LineChart
                data={seriesData}
                showSeason={showSeason}
                showGuides={showGuides}
                parentWidth={parent.width}
                parentHeight={parent.height}
              />
            )}
          </ParentSize>
        </div>
      ) : null}
    </>
  );
}
