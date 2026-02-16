import Plot from "react-plotly.js";
import { useEffect, useState, useRef } from "react";

function SignalViewer({ channels, isPlaying }) {
  const [plotData, setPlotData] = useState([]);
  const indexRef = useRef(0);
  const [windowSize, setWindowSize] = useState(200); // zoom window
  const intervalMs = 200;

  useEffect(() => {
    updatePlot();

    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        indexRef.current += 1;
        const maxLen = Math.max(...channels.map((ch) => ch.data?.length || 0));
        if (indexRef.current > maxLen - windowSize) indexRef.current = 0;
        updatePlot();
      }, intervalMs);
    }

    return () => clearInterval(interval);
  }, [channels, isPlaying, windowSize]);

  function updatePlot() {
    const newData = channels
      .filter((ch) => ch.visible && Array.isArray(ch.data))
      .map((ch) => {
        const start = indexRef.current;
        const y = ch.data.slice(start, start + windowSize);
        const x = y.map((_, i) => start + i);
        return {
          x,
          y,
          type: "scatter",
          mode: "lines",
          name: ch.name,
          line: { color: ch.color, width: ch.width },
        };
      });

    setPlotData(newData);
  }

  // Zoom / pan functions
  const zoomIn = () => setWindowSize((prev) => Math.max(10, prev - 20));
  const zoomOut = () => setWindowSize((prev) => prev + 20);

  const panLeft = () => {
    indexRef.current = Math.max(0, indexRef.current - 20);
    updatePlot(); // <--- update immediately
  };

  const panRight = () => {
    const maxLen = Math.max(...channels.map((ch) => ch.data?.length || 0));
    indexRef.current = Math.min(maxLen - windowSize, indexRef.current + 20);
    updatePlot(); // <--- update immediately
  };

  if (!channels || channels.length === 0) return null;

  return (
    <div>
      <h3 style={{ marginBottom: "10px" }}>Signal Viewer</h3>

      {/* Zoom & Pan Controls */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
        <button onClick={panLeft}>◀ Pan Left</button>
        <button onClick={panRight}>Pan Right ▶</button>
      </div>

      <Plot
        data={plotData}
        layout={{
          title: "Signal Viewer",
          autosize: true,
          margin: { t: 40 },
        }}
        style={{ width: "100%", height: "400px" }}
      />
    </div>
  );
}

export default SignalViewer;
