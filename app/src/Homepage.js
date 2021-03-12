import React, { useState, useEffect } from "react";

import "./Homepage.css";

export default function SingleShowView(props) {
  return (
    <>
      <div className="hp-main-card">
        <h1 className="hp-main-card-title">
          Welcome to <span style={{ fontSize: "40px" }}> SparkSeries </span>
        </h1>
        <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
          <iframe
            title="gif"
            src="https://giphy.com/embed/KfCL9Gp4WSFzO"
            width="480"
            height="360"
            class="giphy-embed"
            style={{ borderRadius: "40px", border: 0, pointerEvents: "none" }}
          ></iframe>
          <p></p>
        </div>
      </div>
    </>
  );
}
