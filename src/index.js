import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './login';
import ProtectedRoute from './protectedRoute';

const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } 
        />

        <Route path="/MRG" element={<Navigate to="/template_MRG.html" />} />
        <Route path="/GERP" element={<Navigate to="/template_GERP.html" />} />
        <Route path="/RUBICON" element={<Navigate to="/template_Rubi.html" />} />
        <Route path="/GODIZ" element={<Navigate to="/template_Godiz.html" />} />
        <Route path="/GODIZ" element={<Navigate to="/template_OCC.html" />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);
