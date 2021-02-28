import { useState, useEffect } from "react";
import { tidy, filter, arrange, asc } from "@tidyjs/tidy";
import { Switch } from "antd";

import "./App.css";
import "antd/dist/antd.css";

import LineChart from "./LineChart";
import sourceData from "./clean_data.json";

const SHOW_NAME = "Game of Thrones";

function App() {
  const [data, setData] = useState([]);
  const [showSeason, setShowSeason] = useState(false);

  useEffect(() => {
    const singleShowData = tidy(
      sourceData,
      filter((d) => d.seriesTitle === SHOW_NAME)
    );
    const sortedData = tidy(
      singleShowData,
      arrange([asc("episodeContinuousNumber")])
    );
    setData(sortedData);
  }, []);

  const handleSeasonChange = (checked) => {
    setShowSeason(checked);
  };

  return (
    <div className="App">
      {data ? (
        <>
          <Switch
            checked={showSeason}
            checkedChildren="Seasons"
            unCheckedChildren="Seasons"
            onChange={handleSeasonChange}
          />
          <h1>{SHOW_NAME}</h1>
          <LineChart data={data} showSeason={showSeason} />
        </>
      ) : null}
    </div>
  );
}

export default App;
