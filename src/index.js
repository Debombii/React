import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import App from "./App"; // Asegúrate de que App.js exporte tu componente principal

const RedirectToHTML = ({ template }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a la página HTML deseada
    window.location.href = `/template_${template}.html`;
  }, [template, navigate]);

  // Mientras se redirige, puedes mostrar un mensaje o nada
  return null;
};

const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/MRG" element={<RedirectToHTML template="MRG" />} />
        <Route path="/GERP" element={<RedirectToHTML template="GERP" />} />
        <Route path="/RUBICON" element={<RedirectToHTML template="Rubi" />} />
        {/* Agrega más rutas según sea necesario */}
        <Route path="/" element={<App />} /> {/* Ruta principal */} 
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MainApp />);
