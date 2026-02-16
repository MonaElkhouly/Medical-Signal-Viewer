// src/pages/Microbiome.jsx
import { useState } from "react";
import Plot from "react-plotly.js";

function Microbiome() {
  const [dataset, setDataset] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);

  // Handle CSV upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      // Parse CSV
      const rows = text
        .trim()
        .split("\n")
        .map((r) => r.split(",").map((v) => Number(v)));

      setDataset(rows);
      setPatientProfile(null); // reset previous profile
    };
    reader.readAsText(file);
  };

  // Placeholder for patient profile estimation
  const handleEstimateProfile = () => {
    setPatientProfile("Patient profile estimation not implemented yet.");
  };

  // Render a heatmap of the microbiome dataset
  const renderHeatmap = (data) => {
    if (!data) return null;

    return (
      <Plot
        data={[
          {
            z: data,
            type: "heatmap",
            colorscale: "Viridis",
          },
        ]}
        layout={{
          title: "Microbiome Profiles Heatmap",
          autosize: true,
          margin: { t: 40 },
        }}
        style={{ width: "100%", height: "500px" }}
      />
    );
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Microbiome Signals</h1>

      <section style={{ marginBottom: "30px" }}>
        <h2>Upload Microbiome Dataset</h2>
        <input type="file" accept=".csv" onChange={handleUpload} />
      </section>

      {dataset && (
        <>
          <section style={{ marginBottom: "30px" }}>
            {renderHeatmap(dataset)}
          </section>

          <section>
            <button onClick={handleEstimateProfile}>
              Estimate Patient Profile
            </button>
            {patientProfile && <p>{patientProfile}</p>}
          </section>
        </>
      )}
    </div>
  );
}

export default Microbiome;
