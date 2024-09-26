import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Ruta de Login */}

        {/* Rutas protegidas */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <App /> {/* Ruta principal solo accesible si está autenticado */}
            </ProtectedRoute>
          } 
        />

        <Route path="/MRG" element={<Navigate to="/template_MRG.html" />} />
        <Route path="/GERP" element={<Navigate to="/template_GERP.html" />} />
        <Route path="/RUBICON" element={<Navigate to="/template_Rubi.html" />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);
