import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '12345') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
      <div className="container2">
          <div class="circles"></div>
        <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Conbtraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Iniciar sesión</button>
            </form>
        </div>
      </div>
  );
};

export default Login;
