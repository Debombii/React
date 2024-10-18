import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const ADMIN_USER =process.env.REACT_APP_ADMIN_USR;
  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
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
