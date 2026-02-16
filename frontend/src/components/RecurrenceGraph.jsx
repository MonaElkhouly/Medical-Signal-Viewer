import Plot from "react-plotly.js";
import { useEffect, useState } from "react";

function RecurrenceGraph({ channels }) {
  const [selectedPair, setSelectedPair] = useState(null); // current pair [i,j]
  const [pairs, setPairs] = useState([]); // list of possible pairs
  const [data, setData] = useState([]);

  // Generate all possible pairs when channels change
  useEffect(() => {
    if (!channels || channels.length < 2) return;

    const newPairs = [];
    for (let i = 0; i < channels.length; i++) {
      for (let j = i + 1; j < channels.length; j++) {
        newPairs.push([i, j]);
      }
    }
    setPairs(newPairs);
    if (newPairs.length > 0) setSelectedPair(newPairs[0]); // default first pair
  }, [channels]);

  // Update plot when selected pair changes
  useEffect(() => {
    if (!selectedPair) return;

    const [i, j] = selectedPair;
    const chX = channels[i];
    const chY = channels[j];

    if (
      !chX ||
      !chY ||
      !Array.isArray(chX.data) ||
      !Array.isArray(chY.data) ||
      chX.data.length === 0 ||
      chY.data.length === 0
    )
      return;

    const minLen = Math.min(chX.data.length, chY.data.length);
    setData([
      {
        x: chX.data.slice(0, minLen),
        y: chY.data.slice(0, minLen),
        type: "scatter",
        mode: "markers",
        name: `${chX.name} vs ${chY.name}`,
        marker: { size: 4, color: chX.color },
      },
    ]);
  }, [selectedPair, channels]);

  if (!channels || channels.length < 2) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Recurrence Graph</h3>

      {/* Dropdown to select channel pair */}
      <select
        value={selectedPair ? selectedPair.join(",") : ""}
        onChange={(e) => {
          const [i, j] = e.target.value.split(",").map(Number);
          setSelectedPair([i, j]);
        }}
        style={{ marginBottom: "10px" }}
      >
        {pairs.map(([i, j], idx) => (
          <option key={idx} value={[i, j]}>
            {channels[i].name} vs {channels[j].name}
          </option>
        ))}
      </select>

      {/* Plot */}
      <Plot
        data={data}
        layout={{ autosize: true, height: 300 }}
        style={{ width: "100%" }}
      />
    </div>
  );
}

export default RecurrenceGraph;
