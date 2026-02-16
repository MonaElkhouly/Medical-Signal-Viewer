// src/pages/Acoustic/DroneSubmarine.jsx
import { useState } from "react";

function DroneSubmarine() {
  const [uploadedAudio, setUploadedAudio] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);

  // Handle audio file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedAudio(URL.createObjectURL(file));
      setDetectionResult(null); // reset previous result
    }
  };

  // Placeholder function for detection (to be implemented later)
  const handleDetectSound = () => {
    // For now, just a placeholder message
    setDetectionResult("Detection logic not implemented yet.");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Drones / Submarine Sound Detection</h1>

      {/* Section 1: Upload audio */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Upload Vehicle Sound</h2>
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
        {uploadedAudio && (
          <div style={{ marginTop: "15px" }}>
            <audio controls src={uploadedAudio}></audio>
            <br />
            <button onClick={handleDetectSound} style={{ marginTop: "10px" }}>
              Detect Sound
            </button>
          </div>
        )}
      </section>

      {/* Section 2: Detection Result */}
      {detectionResult && (
        <section style={{ marginTop: "30px" }}>
          <h2>Detection Result</h2>
          <p>{detectionResult}</p>
        </section>
      )}
    </div>
  );
}

export default DroneSubmarine;
