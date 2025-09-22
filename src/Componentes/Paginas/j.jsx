// src/Componentes/Paginas/Registro.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Aquí podrías guardar datos en un backend o localStorage
    console.log("Usuario registrado:", form);

    // Redirige al login
    navigate('/login');
  };

  return (
    <div className="registro-container">
      <div className="top-wave"></div>
  <div className="top-wave-transparent"></div>
      <form className="registro-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre de usuario"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmar"
          placeholder="Confirmar contraseña"
          value={form.confirmar}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrarse</button>

        <div
          type="button"
          className="registro-login-button"
          onClick={() => navigate('/login')}
        >
          ¿Ya tienes cuenta? <a href="/registro">Regístrate aquí</a>
        </div>
      </form>
    </div>
  );
};

export default Registro;
