import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import './Registro.css';

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    nombre: '', 
    correo: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Usuario registrado:", data);
        alert("Registro exitoso");
        navigate('/login');
      } else {
        const error = await response.json();
        alert("Error en el registro: " + (error.message || "Intenta de nuevo"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="registro-container">
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

        <input 
          type="email" 
          name="correo" 
          placeholder="Correo electrónico" 
          value={form.correo} 
          onChange={handleChange} 
          required 
        />

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

        <button type="submit">Registrarse</button>

        <div className="registro-login-button" onClick={() => navigate('/login')}>
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </form>
    </div>
  );
};

export default Registro;
