// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import Acoustic from "./pages/Acoustic";
import StockMarket from "./pages/StockMarket";
import Microbiome from "./pages/Microbiome";

import ECG from "./pages/Medical/ECG";
import EEG from "./pages/Medical/EEG";



import MedicalHome from "./pages/Medical/MedicalHome";

import AcousticHome from "./pages/Acoustic/AcousticHome";
import VehicleDoppler from "./pages/Acoustic/VehicleDoppler";
import DroneSubmarine from "./pages/Acoustic/DroneSubmarine";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medical" element={<MedicalHome />} />
         <Route path="/medical/ecg" element={<ECG />} />
        <Route path="/medical/eeg" element={<EEG />} />


        
        <Route path="/stock" element={<StockMarket />} />
        <Route path="/microbiome" element={<Microbiome />} />
        
        
        <Route path="/acoustic/vehicle" element={<VehicleDoppler />} />
        <Route path="/acoustic/drone" element={<DroneSubmarine />} />
        <Route path="/acoustic" element={<AcousticHome />} />
      </Routes>
    </Router>
  );
}

export default App;
