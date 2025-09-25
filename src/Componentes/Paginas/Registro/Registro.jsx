import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    nombre: '', 
    correo: '',  // Mantener "correo" para tu backend
    password: '', // Cambiar a "password" (mejor práctica)
    confirmar: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de compañera
    if (form.password !== form.confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Tu lógica de backend
    try {
      const response = await fetch("http://127.0.0.1:8000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          correo: form.correo,
          contraseña: form.password // Adaptar nombre para tu backend
        }),
      });

      if (response.ok) {
        alert("Registro exitoso");
        navigate('/login');
      } else {
        const error = await response.json();
        alert("Error: " + (error.message || "Intenta de nuevo"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión");
    }
  };

  return (
    <div className="registro-container">
      {/* Diseño de compañera */}
      <div className="top-wave"></div>
      <div className="top-wave-transparent"></div>
      
      <form className="registro-form" onSubmit={handleSubmit}>
        <img src="vidomedilogo.png" alt="Logo" className="logo" />
        <h2>Crear Cuenta</h2>

        <input 
          type="text" 
          name="nombre" 
          placeholder="Nombre de usuario" 
          value={form.nombre} 
          onChange={handleChange} 
          required 
        />

        {/* Mantener "correo" para tu backend */}
        <input 
          type="email" 
          name="correo" 
          placeholder="Correo electrónico" 
          value={form.correo} 
          onChange={handleChange} 
          required 
        />

        {/* Iconos de ojo de compañera */}
        <div className="password-wrapper">
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            placeholder="Contraseña" 
            value={form.password} 
            onChange={handleChange} 
            required 
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span>
        </div>

        <div className="password-wrapper">
          <input 
            type={showPasswordConfirm ? "text" : "password"} 
            name="confirmar" 
            placeholder="Confirmar contraseña" 
            value={form.confirmar} 
            onChange={handleChange} 
            required 
          />
          <span className="toggle-password" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
            {showPasswordConfirm ? <AiFillEye /> : <AiFillEyeInvisible />}
          </span>
        </div>

        <button type="submit">Registrarse</button>

        <div className="registro-login-button" onClick={() => navigate('/login')}>
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </form>
    </div>
  );
};

export default Registro;