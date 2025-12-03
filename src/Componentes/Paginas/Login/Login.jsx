import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../../api/axiosConfig';
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // USAMOS api.post Y QUITAMOS LA URL FIJA
      const response = await api.post("/login", { correo: email, password });
      
      // Axios devuelve los datos en .data directamente
      const data = response.data;

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/inicio");
      } else {
        setError("Datos incorrectos");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Si el backend responde con error (400/401), entra aquí
      if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
      } else {
          setError("Error de conexión");
      }
    }
  };

// Función para iniciar login con OAuth
const loginWithProvider = (provider) => {
    // Usamos la baseURL configurada en axios (la de la nube o local según corresponda)
    const baseURL = api.defaults.baseURL; 
    // Redirigir usando la base correcta
    window.location.href = `${baseURL.replace('/api', '')}/auth/${provider}/redirect`;
};


  return (
    <div className="login-wrapper">
      <div className="login-container">

        {/* PANEL AZUL */}
        <div className="login-info">
          <div className="info-content">
            <p className="info-text">¡Hola de nuevo!</p>
            <p className="info-text" style={{ fontSize: "1rem", fontWeight: 400 }}>
              Ingresa para continuar gestionando tus recetas
            </p>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="login-form-section">
          <form onSubmit={handleSubmit} className="login-form">
            <img src="logoazul.png" alt="Logo" className="logo" />
            <h2>Inicia sesión</h2>

            <input
              type="email"
              placeholder="Correo electrónico"
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

            <button className="loguear" type="submit">
              Ingresar
            </button>

            <p className="no-cuenta">
              ¿No tienes cuenta?{" "}
              <span onClick={() => navigate("/registro")}>Regístrate</span>
            </p>

            <div className="divider">
              <span>o continuar con</span>
            </div>

            <div className="login-providers">
              <button
                type="button"
                className="access-with google" 
                onClick={() => loginWithProvider("google")}
              >
                <i className="bi bi-google"></i> Google
              </button>

              <button
                type="button"
                className="access-with microsoft"
                onClick={() => loginWithProvider("microsoft")}
              >
                <i className="bi bi-microsoft"></i> Microsoft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
