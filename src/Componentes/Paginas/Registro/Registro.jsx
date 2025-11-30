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
      {/* Contenedor dividido */}
      <div className="registro-box">

        {/* Lado Izquierdo: Formulario */}
        <div className="registro-left">
          <form className="registro-form" onSubmit={handleSubmit}>
            <img src="logoazul.png" alt="Logo" className="logo" />
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

            <div className="registro-login-text">
              ¿Ya tienes cuenta?{" "}
              <span onClick={() => navigate('/login')}>Inicia sesión</span>
            </div>
          </form>
        </div>

        {/* Lado Derecho: Panel informativo */}
        <div className="registro-right">
          <div className="registro-info">
            <h2>Bienvenido a <span>VIDOMEDI</span></h2>
            <p>Tu salud digital más cerca de ti</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Registro;
