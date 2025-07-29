import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaSignOutAlt } from "react-icons/fa";
import { FiUser, FiBell } from "react-icons/fi";

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

  const styles = {
    container: {
      padding: "24px",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "24px",
    },
    actionButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      padding: "10px 15px",
      borderRadius: "30px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      transition: "all 0.3s",
    },
    section: {
      backgroundColor: "#f9f9f9",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      marginBottom: "12px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "24px",
      maxWidth: "400px",
      width: "90%",
      boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    },
    saveButton: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#3498db",
      color: "white",
      fontWeight: "bold",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.header}>
        <div
          style={{ ...styles.actionButton, backgroundColor: "#e8f4fc", color: "#3498db" }}
          onClick={() => window.history.back()}
        >
          <FaArrowLeft /> Regresar
        </div>
        <div
          style={{ ...styles.actionButton, backgroundColor: "#fdecea", color: "#e74c3c" }}
          onClick={handleCerrarSesion}
        >
          <FaSignOutAlt /> Cerrar sesión
        </div>
      </div>

      {/* Mensaje de cierre de sesión */}
      {sesionCerrada && (
        <div style={{
          backgroundColor: "#e0f7e9",
          color: "#2e7d32",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          textAlign: "center",
          fontWeight: "bold",
        }}>
          🔒 Cerrando sesión...
        </div>
      )}

      {/* Sección de cuenta */}
      <div style={styles.section} onClick={() => setModalCuentaAbierto(true)}>
        <div style={styles.sectionTitle}><FiUser /> Cuenta</div>
        <p>Nombre: <strong>{nombreUsuario || "—"}</strong></p>
        <p>Email: <strong>{emailUsuario || "—"}</strong></p>
      </div>

      {/* Sección de actualizaciones */}
      <div style={styles.section}>
        <div
          style={{ ...styles.sectionTitle, cursor: "pointer", justifyContent: "space-between" }}
          onClick={() => setMostrarActualizaciones(!mostrarActualizaciones)}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FiBell /> Actualizaciones
          </span>
          <span style={{ transform: mostrarActualizaciones ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}>▼</span>
        </div>
        {mostrarActualizaciones && (
          <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
            <p>Versión actual: <strong>v1.23.2</strong></p>
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
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3>Editar cuenta</h3>
              <button
                onClick={() => setModalCuentaAbierto(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  color: "#888",
                }}
                title="Cerrar"
              >
                ×
              </button>
            </div>
            <input
              style={styles.input}
              type="text"
              value={nombreUsuario}
              placeholder="Nombre"
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
            <input
              style={styles.input}
              type="email"
              value={emailUsuario}
              placeholder="Correo electrónico"
              onChange={(e) => setEmailUsuario(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              value={passwordConfirm}
              placeholder="Confirmar contraseña"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <button style={styles.saveButton} onClick={handleGuardarCuenta}>
              Guardar cambios
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
