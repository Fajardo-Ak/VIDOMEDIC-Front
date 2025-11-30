import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/inicio");
      } else {
        setError("Datos incorrectos");
      }
    } catch (err) {
      setError("Error de conexión");
      console.error("Login error:", err);
    }
  };

// Función para iniciar login con OAuth
const loginWithProvider = (provider) => {
    // Redirigir directamente al endpoint del backend
    window.location.href = `http://localhost:8000/auth/${provider}/redirect`;
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
