import React, { useEffect, useState } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import "./Navbar.css";

const CustomNavbar = () => {
  const [usuario, setUsuario] = useState(null);

  // === Obtener datos del usuario ===
  const obtenerPerfilUsuario = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/usuario/perfil", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsuario(data.usuario);
      } else {
        console.error("Error al obtener perfil:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // === Obtener foto (con fallback) ===
  const obtenerFotoPerfil = () => {
    if (usuario?.foto_perfil) {
      return `http://localhost:8000/${usuario.foto_perfil}`;
    } else {
      return "http://localhost:8000/images/usuario-default.png";
    }
  };

  useEffect(() => {
    obtenerPerfilUsuario();
  }, []);

  return (
    <Navbar expand="md" className="custom-navbar">
      {/* Brand o título a la izquierda */}
      <NavbarBrand href="/" className="navbar-brand-custom">
        <i className="bi bi-people-fill me-2"></i>
        Gestión CRM
      </NavbarBrand>

      {/* Info del usuario a la derecha */}
      <div className="navbar-user-section ms-auto">
        {usuario ? (
          <div className="navbar-user-info">
            <span className="navbar-user-name">{usuario.nombre}</span>
            <img
              src={obtenerFotoPerfil()}
              alt="Foto de perfil"
              className="navbar-user-avatar"
            />
            
          </div>
        ) : (
          <span className="navbar-loading">Cargando...</span>
        )}
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
