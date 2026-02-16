import { useState } from "react";

function VehicleDoppler() {
  const [velocity, setVelocity] = useState(50); // km/h
  const [hornFreq, setHornFreq] = useState(440); // Hz
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [uploadedAudio, setUploadedAudio] = useState(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedAudio(URL.createObjectURL(file));
  };

  // Generate synthetic sound (browser AudioContext)
  const handleGenerateSound = () => {
  // Create audio context only on click
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 2; // seconds
  const sampleRate = audioCtx.sampleRate;
  const buffer = audioCtx.createBuffer(1, duration * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const instantaneousFreq = hornFreq * (1 + (velocity / 343) * (1 - t / duration));
    data[i] = Math.sin(2 * Math.PI * instantaneousFreq * t) * 0.5;
  }

  // Only connect and start playback after click
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(audioCtx.destination);
  source.start(); // this is safe now because user clicked the button

  // Generate WAV for <audio>
  const wavBlob = bufferToWave(buffer, buffer.length);
  setGeneratedAudio(URL.createObjectURL(wavBlob));
};
  const bufferToWave = (abuffer, len) => {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    let offset = 0;

    const writeString = (s) => {
      for (let i = 0; i < s.length; i++) view.setUint8(offset++, s.charCodeAt(i));
    };

    // RIFF header
    writeString("RIFF");
    view.setUint32(offset, length - 8, true); offset += 4;
    writeString("WAVE");
    writeString("fmt ");
    view.setUint32(offset, 16, true); offset += 4;
    view.setUint16(offset, 1, true); offset += 2;
    view.setUint16(offset, numOfChan, true); offset += 2;
    view.setUint32(offset, abuffer.sampleRate, true); offset += 4;
    view.setUint32(offset, abuffer.sampleRate * 2 * numOfChan, true); offset += 4;
    view.setUint16(offset, numOfChan * 2, true); offset += 2;
    view.setUint16(offset, 16, true); offset += 2;
    writeString("data");
    view.setUint32(offset, length - offset - 4, true); offset += 4;

    // write PCM samples
    for (let i = 0; i < abuffer.length; i++) {
      for (let ch = 0; ch < numOfChan; ch++) {
        let sample = abuffer.getChannelData(ch)[i];
        sample = Math.max(-1, Math.min(1, sample));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([buffer], { type: "audio/wav" });
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Vehicle-Passing Doppler Effect</h1>

      <section style={{ marginBottom: "40px" }}>
        <h2>Generate Synthetic Car Sound</h2>
        <label>
          Velocity (km/h):
          <input type="number" value={velocity} onChange={e => setVelocity(Number(e.target.value))} style={{ marginLeft: "10px", width: "80px" }} />
        </label>
        <br />
        <label>
          Horn Frequency (Hz):
          <input type="number" value={hornFreq} onChange={e => setHornFreq(Number(e.target.value))} style={{ marginLeft: "10px", width: "80px" }} />
        </label>
        <br />
        <button onClick={handleGenerateSound} style={{ marginTop: "15px" }}>Generate Sound</button>

        {generatedAudio && (
          <div style={{ marginTop: "15px" }}>
            <audio controls src={generatedAudio}></audio>
          </div>
        )}
      </section>

      <section>
        <h2>Upload Real Vehicle-Passing Sound</h2>
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
        {uploadedAudio && (
          <div style={{ marginTop: "15px" }}>
            <audio controls src={uploadedAudio}></audio>
          </div>
        )}
      </section>
    </div>
  );
}

export default VehicleDoppler;
