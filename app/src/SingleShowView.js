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

  const handleSeasonChange = (checked) => {
    setShowSeason(checked);
  };

  function onChange(value) {
    console.log(`selected ${value}`);
    setSelectedSeries(value);
  }

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
            onChange={onChange}
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
          <Switch
            checked={showSeason}
            checkedChildren="Seasons"
            unCheckedChildren="Seasons"
            onChange={handleSeasonChange}
            style={{ fontSize: "22px" }}
          />
        </div>
      </div>
      {seriesData.length > 0 ? (
        <div className="line-chart-card">
          <h1 className="series-title" style={{ width: 800 }}>
            {selectedSeries}
          </h1>
          <ParentSize className="line-chart">
            {(parent) => (
              <LineChart
                data={seriesData}
                showSeason={showSeason}
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
