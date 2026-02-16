// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Welcome to the Signal Viewer</h1>
      <p>Select a signal category:</p>

      {/* Medical */}
      <button
        onClick={() => navigate("/medical")}
        style={{ margin: "10px", padding: "1em 2em", fontSize: "1.2em" }}
      >
        Medical Signals
      </button>

      {/* Acoustic */}
      <button
        onClick={() => navigate("/acoustic")}
        style={{ margin: "10px", padding: "1em 2em", fontSize: "1.2em" }}
      >
        Acoustic Signals
      </button>

      {/* Stock Market */}
      <button
        onClick={() => navigate("/stock")}
        style={{ margin: "10px", padding: "1em 2em", fontSize: "1.2em" }}
      >
        Stock Market Signals
      </button>

      {/* Microbiome */}
      <button
        onClick={() => navigate("/microbiome")}
        style={{ margin: "10px", padding: "1em 2em", fontSize: "1.2em" }}
      >
        Microbiome Signals
      </button>
    </div>
  );
}

export default Home;
