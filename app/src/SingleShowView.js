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
  const [showSeasons, setShowSeasons] = useState(false);
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
    setShowSeasons(checked);
  };

  const handleGuidesChange = (checked) => {
    setshowGuides(checked);
  };

  return (
    <>
      <div className="ssv-control-panel-card">
        <h1 className="ssv-control-panel-label">SINGLE SHOW VIEW CONTROLS</h1>
        <div className="ssv-control-panel-inputs">
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
          </span>
        </div>
      </div>
      {seriesData.length > 0 ? (
        <div className="ssv-line-chart-card">
          <div className="ssv-line-chart-header">
            <h1 className="ssv-series-title" style={{ width: 800 }}>
              {selectedSeries}
            </h1>
            <div className="ssv-series-stats">
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
          </div>

          <ParentSize className="ssv-line-chart">
            {(parent) => (
              <LineChart
                data={seriesData}
                showSeasons={showSeasons}
                showGuides={showGuides}
                width={parent.width > 0 ? parent.width - 40 : 0}
                height={parent.height > 0 ? parent.height - 50 : 0}
                yScaleMax={10}
                yScaleMin={0}
                yScalePadding={{ top: 6, bottom: 25 }}
              />
            )}
          </ParentSize>
        </div>
      ) : null}
    </>
  );
}
