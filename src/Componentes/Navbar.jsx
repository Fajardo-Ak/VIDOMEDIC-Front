import React, { useEffect, useState } from "react";
import { Navbar } from "reactstrap";
import api from "../api/axiosConfig"; // Importamos la instancia configurada
import "./Navbar.css";

const CustomNavbar = () => {
  const [usuario, setUsuario] = useState(null);

  const obtenerPerfilUsuario = async () => {
    try {
      // CAMBIO: Usamos api.get
      const response = await api.get("/usuario/perfil");
      // Axios devuelve los datos en response.data
      const data = response.data;
      
      if (data.success) setUsuario(data.usuario);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // === Obtener foto (con fallback inteligente) ===
  const obtenerFotoPerfil = () => {
    if (usuario?.foto_perfil) {
      return usuario.foto_perfil;
    } else {
      // Obtenemos la URL base de axios (ej: https://...onrender.com/api)
      // Le quitamos el "/api" del final para apuntar a la carpeta pública de imágenes
      const baseUrl = api.defaults.baseURL.replace('/api', '');
      return `${baseUrl}/images/usuario-default.png`;
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