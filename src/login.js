import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
const ADMIN_USER = process.env.REACT_APP_ADMIN_USER || 'admin';
const ADMIN_PASS_HASH = '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const sha256 = async (message) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Generamos el hash de la contraseña ingresada para comparar
    const inputPasswordHash = await sha256(password);
    
    if (username === ADMIN_USER && inputPasswordHash === ADMIN_PASS_HASH) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="body">
      <div className="login_circles"></div>
      <div className="login-box">
        <h2 className="login">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className="login"
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="login"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
