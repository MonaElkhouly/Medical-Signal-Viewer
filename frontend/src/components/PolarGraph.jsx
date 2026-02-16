import Plot from "react-plotly.js";
import { useState, useEffect } from "react";

function PolarGraph({ channels }) {
  const [selectedChannels, setSelectedChannels] = useState([]);

  useEffect(() => {
    if (channels.length && selectedChannels.length === 0) {
      setSelectedChannels(channels.map(ch => ch.name));
    }
  }, [channels]);

  if (!channels || channels.length === 0) return null;

  const visibleChannels = channels.filter(ch => selectedChannels.includes(ch.name));

  const traces = visibleChannels.map(ch => ({
    r: ch.data,
    theta: ch.data.map((_, i) => i),
    type: 'scatterpolar',
    mode: 'lines',
    name: ch.name,
    line: { color: ch.color },
  }));

  return (
    <div>
      <h3>Polar Graph</h3>

      {/* Dropdown to select channels */}
      <select
        multiple
        value={selectedChannels}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
          setSelectedChannels(selected);
        }}
        style={{ marginBottom: '10px', width: '100%' }}
      >
        {channels.map((ch, idx) => (
          <option key={idx} value={ch.name}>{ch.name}</option>
        ))}
      </select>

      <Plot
        data={traces}
        layout={{
          polar: { radialaxis: { visible: true } },
          height: 300,
          autosize: true,
        }}
      />
    </div>
  );
}

export default PolarGraph;
