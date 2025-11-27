import React, { useEffect, useState } from "react";
import { Navbar } from "reactstrap";
import "./Navbar.css";

const CustomNavbar = () => {
  const [usuario, setUsuario] = useState(null);

  const obtenerPerfilUsuario = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/usuario/perfil", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.success) setUsuario(data.usuario);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // === Obtener foto (con fallback) ===
  const obtenerFotoPerfil = () => {
    if (usuario?.foto_perfil) {
      return usuario.foto_perfil;
    } else {
      return "http://localhost:8000/images/usuario-default.png";
    }
  };

  useEffect(() => {
    obtenerPerfilUsuario();
  }, []);

  return (
    <Navbar className="custom-navbar">
      <div className="navbar-content">
        {usuario ? (
          <div className="navbar-user-info">
            <div className="user-greeting">
              <i className="bi bi-person-fill me-2"></i>
              <span>Hola, {(usuario.nombre)}</span>
            </div>
            <img
              src={obtenerFotoPerfil()}
              alt="Foto de perfil"
              className="navbar-user-avatar"
            />
          </div>
        ) : (
          <div className="navbar-loading">
            <i className="bi bi-person-fill me-2"></i>
            <span>Cargando...</span>
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default CustomNavbar;