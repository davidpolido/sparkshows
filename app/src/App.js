import { useState, useEffect } from "react";
import { tidy, filter, arrange, asc, groupBy } from "@tidyjs/tidy";
import { Switch, Select } from "antd";

import "./App.css";
import "antd/dist/antd.css";

import LineChart from "./LineChart";
import sourceData from "./clean_data.json";

const { Option } = Select;

function App() {
  const [data, setData] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState("Game of Thrones");
  const [showSeason, setShowSeason] = useState(false);
  const [allSeries, setAllSeries] = useState([]);

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

  const handleSeasonChange = (checked) => {
    setShowSeason(checked);
  };

  function onChange(value) {
    console.log(`selected ${value}`);
    setSelectedSeries(value);
  }
  //   function onBlur() {
  //     console.log("blur");
  //   }
  //   function onFocus() {
  //     console.log("focus");
  //   }
  //   function onSearch(val) {
  //     console.log("search:", val);
  //   }

  return (
    <div className="App">
      {data ? (
        <>
          <div style={{ marginBottom: "30px" }}>
            <Select
              showSearch
              style={{ width: 400, marginRight: 20, fontSize: "24px" }}
              placeholder="Select a TV Show"
              defaultValue={selectedSeries}
              onChange={onChange}
              //   onFocus={onFocus}
              //   onBlur={onBlur}
              //   onSearch={onSearch}
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
            />
          </div>
          <LineChart data={data} showSeason={showSeason} />
        </>
      ) : null}
    </div>
  );
}

export default App;
