import Plot from "react-plotly.js";
import { useState, useEffect } from "react";

function XORGraph({ channels }) {
  const [selectedChannels, setSelectedChannels] = useState([]);

  useEffect(() => {
  if (channels.length && selectedChannels.length === 0) {
    setSelectedChannels(channels.map(ch => ch.name));
  }
}, [channels]);


  useEffect(() => {
    // Default: select all channels initially
    if (channels.length && selectedChannels.length === 0) {
      setSelectedChannels(channels.map(ch => ch.name));
    }
  }, [channels]);

  if (!channels || channels.length === 0) return null;

  // Filter channels based on selection
  const visibleChannels = channels.filter(ch => selectedChannels.includes(ch.name));

  // Create XOR-like data
  const traces = visibleChannels.map(ch => {
    const chunkSize = 100;
    const chunks = [];
    for (let i = 0; i < ch.data.length; i += chunkSize) {
      chunks.push(ch.data.slice(i, i + chunkSize));
    }

    // Simple XOR: keep only chunks different from previous
    const display = [];
    chunks.forEach((chunk, idx) => {
      if (idx === 0) display.push(chunk);
      else {
        const prev = display[display.length - 1];
        if (!chunk.every((v, i) => v === prev[i])) display.push(chunk);
      }
    });

    return {
      x: display.flat().map((_, i) => i),
      y: display.flat(),
      type: 'scatter',
      mode: 'lines',
      name: ch.name,
      line: { color: ch.color },
    };
  });

  return (
    <div>
      <h3>XOR Graph</h3>

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


      <Plot data={traces} layout={{ height: 300, autosize: true }} />
    </div>
  );

  
}

export default XORGraph;
