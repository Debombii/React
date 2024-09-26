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
      <div  class="body">
          <div class="login_circles"></div>
        <div className="login-box">
            <h2 class="login">Login</h2>
            <form onSubmit={handleLogin}>
            <input class="login"
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input class="login"
                type="password"
                placeholder="Conbtraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" class="login">Iniciar sesión</button>
            </form>
        </div>
      </div>
  );
};

export default Login;
