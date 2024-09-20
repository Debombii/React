import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import App from "./App"; // Asegúrate de que App.js exporte tu componente ChangelogGenerator

const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/MRG" element={<Navigate to="./template_MRG.html" />} />
        <Route path="/GERP" element={<Navigate to="./template_GERP.html" />} />
        <Route path="/RUBICON" element={<Navigate to="./template_Rubi.html" />} />
        {/* Agrega más rutas según sea necesario */}
        <Route path="/" element={<App />} /> {/* Ruta principal */}
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainApp />);