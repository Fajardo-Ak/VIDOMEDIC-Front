import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import api from '../../../api/axiosConfig';
import './Registro.css';
import { alertaExito, alertaError, alertaAdvertencia, confirmarEliminar } from "../Configuraciones/alertas";

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
      // USAMOS api.post EN LUGAR DE FETCH DIRECTO
      const response = await api.post("/registro", form);
      
      // Axios lanza error si el status no es 200, así que si llegamos aquí, fue éxito
      console.log("Usuario registrado:", response.data);
      alertaExito("Registro exitoso");
      navigate('/login');

    } catch (err) {
      console.error("Error:", err);
      // Capturamos el mensaje de error que viene del backend o ponemos uno genérico
      const mensaje = err.response?.data?.message || "Error de conexión o datos inválidos";
      alertaError("Error en el registro: " + mensaje);
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
