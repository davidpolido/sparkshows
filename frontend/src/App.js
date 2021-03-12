import { useState, useEffect } from "react";
import { tidy, groupBy } from "@tidyjs/tidy";
import "antd/dist/antd.css";

import Homepage from "./Homepage";
import SingleShowView from "./SingleShowView";
import SmallMultiplesView from "./SmallMultiplesView";
import data from "./data/clean_data.json";

import "./App.css";

function App() {
  const [view, setView] = useState("home");
  const [seriesList, setSeriesList] = useState([]);

  useEffect(() => {
    const newSeriesList = tidy(
      data,
      groupBy("seriesTitle", [], groupBy.keys())
    );

    setSeriesList(newSeriesList);
  }, []);

  function createViewButtonClass(button) {
    return button === view ? "view-button active" : "view-button";
  }

  function handleViewChange(e) {
    setView(e.target.id);
  }
  let ViewComponent;
  switch (view) {
    case "single":
      ViewComponent = <SingleShowView seriesList={seriesList} data={data} />;
      break;
    case "multiple":
      ViewComponent = (
        <SmallMultiplesView seriesList={seriesList} data={data} />
      );
      break;
    default:
      ViewComponent = <Homepage seriesList={seriesList} />;
  }
  return (
    <div className="App">
      <header className="app-header">
        <h1 className="app-name">SparkShows</h1>
      </header>
      <div className="view-buttons-area">
        <button
          id="home"
          className={createViewButtonClass("home")}
          onClick={handleViewChange}
        >
          Homepage
        </button>
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
      {ViewComponent}
    </div>
  );
}

export default App;
