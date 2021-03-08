import { useState, useEffect } from "react";
import { tidy, filter, arrange, asc, groupBy } from "@tidyjs/tidy";
import { Switch, Select } from "antd";
import { ParentSize } from "@vx/responsive";

import "./App.css";
import "antd/dist/antd.css";

import LineChart from "./LineChart";
import sourceData from "./clean_data.json";

const { Option } = Select;

function App() {
  const [data, setData] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [showSeason, setShowSeason] = useState(false);
  const [allSeries, setAllSeries] = useState([]);
  const [view, setView] = useState("single");

  useEffect(() => {
    const singleShowData = tidy(
      sourceData,
      filter((d) => d.seriesTitle === selectedSeries),
      arrange([asc("episodeContinuousNumber")])
    );
    setData(singleShowData);

    const seriesList = tidy(
      sourceData,
      arrange(asc("seriesTitle")),
      groupBy("seriesTitle", [], groupBy.keys())
    );
    setAllSeries(seriesList);
  }, [selectedSeries]);

  function createViewButtonClass(button) {
    return button === view ? "view-button active" : "view-button";
  }

  const handleSeasonChange = (checked) => {
    setShowSeason(checked);
  };

  function onChange(value) {
    console.log(`selected ${value}`);
    setSelectedSeries(value);
  }

  function handleViewChange(e) {
    setView(e.target.id);
  }

  return (
    <div className="App">
      <>
        <header className="app-header">
          <h1 className="app-name">SparkShows</h1>
          <div className="view-buttons-area">
            <button
              id="single"
              className={createViewButtonClass("single")}
              onClick={handleViewChange}
            >
              Single Show Details
            </button>
            <button
              id="multiple"
              className={createViewButtonClass("multiple")}
              onClick={handleViewChange}
            >
              Small Multiples
            </button>
          </div>
        </header>
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
        {data.length > 0 ? (
          <div className="line-chart-card">
            <h1 className="series-title" style={{ width: 800 }}>
              {selectedSeries}
            </h1>
            <ParentSize className="line-chart">
              {(parent) => (
                <LineChart
                  data={data}
                  showSeason={showSeason}
                  parentWidth={parent.width}
                  parentHeight={parent.height}
                />
              )}
            </ParentSize>
          </div>
        ) : null}
      </>
    </div>
  );
}

export default App;
