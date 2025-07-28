// src/components/Login.jsx
import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí podrías validar datos si quieres
    navigate('/inicio');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="login-title">Bienvenido</h2>
        <input type="text" placeholder="Usuario" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
