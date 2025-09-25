// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

          //'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
        },
        body: JSON.stringify({
          correo: email, 
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token); //guarda el token
        localStorage.setItem('user', JSON.stringify(data.user)); //datos del usuario
        // Redireccionar al dashboard después de login exitoso
        navigate('/inicio');
      } else {
        setError('Datos incorrectos'); //feedback al usuario
      }
    } catch (err) {
      setError('Error de Conexion'); // error de red
      console.error('Login error:', err);
    }
  };

  return (
     //<img src="vidomedilogo.png" alt="Logo" className="logo" />

    <div className="login-container">
        <div className="top-wave"></div>
  <div className="top-wave-transparent"></div>
      <form className="login-form" onSubmit={handleSubmit}>
<img src="vidomedilogo.png" alt="Logo" className="logo" />
        <h2 className="login-title">Ingresa a tu cuenta </h2>

        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div className="error-message">{error}</div>}

        <button type="submit">Iniciar Sesión</button>

        <div className="register-link">
          ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
        </div>
      </form>
    </div>
  );
};

export default Login;

