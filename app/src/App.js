import { useState } from "react";
import "antd/dist/antd.css";

import SingleShowView from "./SingleShowView";
import SmallMultiplesView from "./SmallMultiplesView";
import data from "./data/clean_data.json";

import "./App.css";

function App() {
  const [view, setView] = useState("single");

  function createViewButtonClass(button) {
    return button === view ? "view-button active" : "view-button";
  }

  function handleViewChange(e) {
    setView(e.target.id);
  }

  return (
    <div className="App">
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
      {view === "single" ? (
        <SingleShowView data={data} />
      ) : (
        <SmallMultiplesView data={data} />
      )}
    </div>
  );
}

export default App;
