import React, { useState } from "react";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { FiUser, FiBell } from "react-icons/fi";
import "./Config.css";

export default function Configuracion() {
  const [nombreUsuario, setNombreUsuario] = useState(localStorage.getItem("userName") || "");
  const [emailUsuario, setEmailUsuario] = useState(localStorage.getItem("userEmail") || "");
  const [mostrarActualizaciones, setMostrarActualizaciones] = useState(false);
  const [modalCuentaAbierto, setModalCuentaAbierto] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [sesionCerrada, setSesionCerrada] = useState(false);

  const handleGuardarCuenta = () => {
    if (passwordConfirm.trim() === "") {
      alert("Por favor, ingresa tu contraseña para confirmar los cambios.");
      return;
    }
    localStorage.setItem("userName", nombreUsuario);
    localStorage.setItem("userEmail", emailUsuario);
    setModalCuentaAbierto(false);
    alert("Información actualizada correctamente.");
  };

  const handleCerrarSesion = () => {
    setSesionCerrada(true);
    setTimeout(() => {
      setSesionCerrada(false);
      window.location.href = "/home";
    }, 2000);
  };

  return (
    <div className="config-container">
      {/* Encabezado */}
      <div className="config-header">
        <div className="action-button back" onClick={() => window.history.back()}>
          <FaArrowLeft /> Regresar
        </div>
        <div className="action-button logout" onClick={handleCerrarSesion}>
          <FaSignOutAlt /> Cerrar sesión
        </div>
      </div>

      {/* Mensaje de cierre de sesión */}
      {sesionCerrada && (
        <div className="logout-message">Cerrando sesión</div>
      )}

      {/* Sección de cuenta */}
      <div className="config-section" onClick={() => setModalCuentaAbierto(true)}>
        <div className="section-title"><FiUser /> Cuenta</div>
        <p>Nombre: <strong>{nombreUsuario || "—"}</strong></p>
        <p>Email: <strong>{emailUsuario || "—"}</strong></p>
      </div>

      {/* Sección de actualizaciones */}
      <div className="config-section">
        <div
          className="section-title collapsible"
          onClick={() => setMostrarActualizaciones(!mostrarActualizaciones)}
        >
          <span className="title-with-icon">
            <FiBell /> Actualizaciones
          </span>
          <span className={`arrow ${mostrarActualizaciones ? "open" : ""}`}>▼</span>
        </div>
        {mostrarActualizaciones && (
          <div className="updates-content">
            <p>Versión actual: <strong>v1.0.2</strong></p>
            <ul>
              <li>✓ Accesibilidad mejorada</li>
              <li>✓ Nuevo sistema de recordatorios</li>
              <li>✓ Correcciones de errores</li>
            </ul>
          </div>
        )}
      </div>

      {/* Modal de cuenta */}
      {modalCuentaAbierto && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Editar cuenta</h3>
              <button
                onClick={() => setModalCuentaAbierto(false)}
                className="close-btn"
                title="Cerrar"
              >
                ×
              </button>
            </div>
            <input
              className="modal-input"
              type="text"
              value={nombreUsuario}
              placeholder="Nombre"
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
            <input
              className="modal-input"
              type="email"
              value={emailUsuario}
              placeholder="Correo electrónico"
              onChange={(e) => setEmailUsuario(e.target.value)}
            />
            <input
              className="modal-input"
              type="password"
              value={passwordConfirm}
              placeholder="Confirmar contraseña"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <button className="save-button" onClick={handleGuardarCuenta}>
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
