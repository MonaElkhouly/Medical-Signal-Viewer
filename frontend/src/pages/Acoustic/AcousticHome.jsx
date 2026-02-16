// src/pages/Acoustic/AcousticHome.jsx
import { useNavigate } from "react-router-dom";

function AcousticHome() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Acoustic Signals</h1>
      <p>Select a type:</p>

      {/* Vehicle-Passing Doppler */}
      <button
        onClick={() => navigate("/acoustic/vehicle")}
        style={{ margin: "10px", padding: "1em 2em", fontSize: "1.2em" }}
      >
        Vehicle-Passing Doppler
      </button>

      {/* Drone / Submarine Detection */}
      <button
        onClick={() => navigate("/acoustic/drone")}
        style={{ margin: "10px", padding: "1em 2em", fontSize: "1.2em" }}
      >
        Drone / Submarine Detection
      </button>
    </div>
  );
}

export default AcousticHome;
