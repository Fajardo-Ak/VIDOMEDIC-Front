// src/Componentes/RutaPrivada.jsx
import { Navigate } from "react-router-dom";

const RutaPrivada = ({ children }) => {
  const token = localStorage.getItem("token"); // verifica tu token
  if (!token) {
    return <Navigate to="/login" />; // si no hay token, va al login
  }
  return children; // si hay token, muestra la página
};

export default RutaPrivada;
