import { Link } from "react-router-dom";

function MedicalHome() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h2>Medical Signals</h2>
      <p>Select the type of signal:</p>
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <Link to="/medical/ecg">
          <button>ECG Signals</button>
        </Link>
        <Link to="/medical/eeg">
          <button>EEG Signals</button>
        </Link>
      </div>
    </div>
  );
}

export default MedicalHome;
