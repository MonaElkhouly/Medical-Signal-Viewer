// src/pages/StockMarket.jsx
import { useState } from "react";
import Plot from "react-plotly.js";

function StockMarket() {
  const [datasets, setDatasets] = useState({
    stocks: null,
    currencies: null,
    minerals: null,
  });

  const [predictions, setPredictions] = useState({
    stocks: null,
    currencies: null,
    minerals: null,
  });

  // Handle CSV upload
  const handleUpload = (e, category) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const rows = text
        .trim()
        .split("\n")
        .map((r) => r.split(",").map((v) => Number(v)));

      // Store dataset
      setDatasets((prev) => ({ ...prev, [category]: rows }));
      // Reset prediction placeholder
      setPredictions((prev) => ({ ...prev, [category]: null }));
    };
    reader.readAsText(file);
  };

  // Placeholder for prediction
  const handlePredict = (category) => {
    // Replace this with real prediction logic later
    setPredictions((prev) => ({
      ...prev,
      [category]: "Prediction not implemented yet",
    }));
  };

  // Helper to render a plot from a dataset
  const renderPlot = (data, name) => {
    if (!data) return null;

    // Assume CSV columns = time series
    const traces = data[0].map((_, colIndex) => ({
      x: data.map((_, rowIndex) => rowIndex),
      y: data.map((row) => row[colIndex]),
      type: "scatter",
      mode: "lines",
      name: `Series ${colIndex + 1}`,
    }));

    return (
      <Plot
        data={traces}
        layout={{
          title: `${name} Visualization`,
          autosize: true,
          margin: { t: 40 },
        }}
        style={{ width: "100%", height: "400px" }}
      />
    );
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Stock Market / Trading Signals</h1>

      {/* Stocks Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Stock Market</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleUpload(e, "stocks")}
        />
        {datasets.stocks && (
          <>
            {renderPlot(datasets.stocks, "Stocks")}
            <button onClick={() => handlePredict("stocks")}>Predict</button>
            {predictions.stocks && <p>{predictions.stocks}</p>}
          </>
        )}
      </section>

      {/* Currencies Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Currencies</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleUpload(e, "currencies")}
        />
        {datasets.currencies && (
          <>
            {renderPlot(datasets.currencies, "Currencies")}
            <button onClick={() => handlePredict("currencies")}>Predict</button>
            {predictions.currencies && <p>{predictions.currencies}</p>}
          </>
        )}
      </section>

      {/* Minerals Section */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Minerals</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleUpload(e, "minerals")}
        />
        {datasets.minerals && (
          <>
            {renderPlot(datasets.minerals, "Minerals")}
            <button onClick={() => handlePredict("minerals")}>Predict</button>
            {predictions.minerals && <p>{predictions.minerals}</p>}
          </>
        )}
      </section>
    </div>
  );
}

export default StockMarket;
