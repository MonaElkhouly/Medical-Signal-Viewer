import { useState } from "react";
import SignalViewer from "../../components/SignalViewer";
import ControlPanel from "../../components/ControlPanel";
import AIResultCard from "../../components/AIResultCard";
import XORGraph from "../../components/XORGraph";
import PolarGraph from "../../components/PolarGraph";
import RecurrenceGraph from "../../components/RecurrenceGraph";

function EEG() {
  const [channels, setChannels] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const rows = text
        .trim()
        .split("\n")
        .map((r) =>
          r.split(",").map((v) => (isNaN(Number(v)) ? 0 : Number(v)))
        )
        .filter((row) => row.length > 0);

      if (!rows.length) return;

      const numChannels = rows[0].length;
      const newChannels = [];
      const colors = ["red", "blue", "green", "orange", "purple"];

      for (let i = 0; i < numChannels; i++) {
        const data = rows.map((row) => row[i]);
        newChannels.push({
          name: `Ch${i + 1}`,
          color: colors[i % colors.length],
          width: 2,
          visible: true,
          data,
        });
      }

      setChannels(newChannels);
    };

    reader.readAsText(file);
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Left panel */}
      <div style={{ flex: 3 }}>
        <h2>EEG Signals</h2>
        <input type="file" accept=".csv" onChange={handleFileUpload} />

        {/* Only show the plots if channels exist */}
        {channels.length > 0 && (
          <>
            <SignalViewer channels={channels} setChannels={setChannels} isPlaying={isPlaying} />
            <XORGraph channels={channels} />
            <PolarGraph channels={channels} />
            <RecurrenceGraph channels={channels} />
          </>
        )}
      </div>

      {/* Right panel: only show when a file is uploaded */}
      {channels.length > 0 && (
        <div style={{ flex: 1, marginLeft: "20px" }}>
          <ControlPanel
            channels={channels}
            setChannels={setChannels}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
          <AIResultCard />
        </div>
      )}
    </div>
  );
}

export default EEG;
