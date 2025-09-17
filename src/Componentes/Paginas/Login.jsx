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

          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
        },
        body: JSON.stringify({
          correo: email, 
          contraseña: password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redireccionar al dashboard después de login exitoso
        navigate('/inicio');
      } else {
        setError('Credenciales incorrectas'); //feedback al usuario
      }
    } catch (err) {
      setError('Error al conectar con el servidor'); // error de red
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Bienvenido</h2>

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

