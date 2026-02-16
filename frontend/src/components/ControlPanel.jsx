function ControlPanel({ channels, setChannels, isPlaying, setIsPlaying }) {

  // Toggle visibility
  const toggleVisibility = (index) => {
    setChannels((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, visible: !ch.visible } : ch))
    );
  };

  // Change color
  const changeColor = (index, color) => {
    setChannels((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, color } : ch))
    );
  };

  // Change thickness
  const changeWidth = (index, width) => {
    setChannels((prev) =>
      prev.map((ch, i) => (i === index ? { ...ch, width: Number(width) } : ch))
    );
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}>
      <h3 style={{ marginTop: 0 }}>Controls</h3>

      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Stop" : "Play"}
      </button>

      <hr />

      {channels.map((ch, index) => (
        <div
          key={index}
          style={{
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {/* Channel name */}
          <span style={{ fontWeight: 500 }}>{ch.name}</span>

          {/* Visibility checkbox */}
          <label>
            <input
              type="checkbox"
              checked={ch.visible}
              onChange={() => toggleVisibility(index)}
            />{" "}
            Visible
          </label>

          {/* Color picker */}
          <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            Color:
            <input
              type="color"
              value={ch.color}
              onChange={(e) => changeColor(index, e.target.value)}
            />
          </label>

          {/* Thickness slider */}
          <label style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            Thickness:
            <input
              type="range"
              min="1"
              max="6"
              value={ch.width}
              onChange={(e) => changeWidth(index, e.target.value)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}

export default ControlPanel;
