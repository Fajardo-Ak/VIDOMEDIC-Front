 import './App.scss';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import RutaPrivada from "./Componentes/Paginas/Seguridad/RutaPrivada";
import useAutoLogout from './Componentes/Paginas/Seguridad/useAutoLogout.jsx';
import Navbar from './Componentes/Navbar';
import Sidebar from './Componentes/Sidebar';

import Login from './Componentes/Paginas/Login/Login.jsx';
import Registro from './Componentes/Paginas/Registro/Registro.jsx';
import NotFound from './Componentes/Paginas/NotFound.jsx';
import Home from './Componentes/Paginas/Home/Home.jsx';
import OAuthCallback from './Componentes/Paginas/OAuthCallback.jsx';

import Inicio from './Componentes/Paginas/Inicio/Inicio.jsx';
import Medi from './Componentes/Paginas/Medicamentos/Medicamentos.jsx';
import Agend from './Componentes/Paginas/Historial_Agenda/Historial.jsx';
import Planes from './Componentes/Paginas/Planes/Planes.jsx';
import Ventas from './Componentes/Paginas/Ventas.jsx';
import Usuarios from './Componentes/Paginas/Usuarios.jsx';
import Configuracion from './Componentes/Paginas/Configuraciones/Config.jsx';

// Componente para manejar el scroll automático
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout para las rutas privadas (dashboard)
const DashboardLayout = () => {
  const { showWarning, stayLoggedIn } = useAutoLogout(120, 1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Escuchar cambios en el tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar onToggle={(open) => setIsSidebarOpen(open)} />
      
      {/* CONTENIDO PRINCIPAL - SIN position-relative */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar />

        {/* Scroll automático */}
        <ScrollToTop />

        {/* MODAL de aviso */}
        {showWarning && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "24px 32px",
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                maxWidth: "400px",
                textAlign: "center",
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>⏳ Sesión por expirar</h4>
              <p style={{ color: "#555" }}>
                Tu sesión se cerrará automáticamente en menos de un minuto.
              </p>
              <button
                onClick={stayLoggedIn}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  backgroundColor: "#00ffeeff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Seguir conectado
              </button>
            </div>
          </div>
        )}

        {/* CONTENIDO DE LAS RUTAS */}
        <div className="routes-content">
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/medicamento" element={<Medi />} />
            <Route path="/historial" element={<Agend />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/contactos" element={<Usuarios />} />
            <Route path="/config" element={<Configuracion />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas (sin layout de dashboard) */}
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />}/>
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />

        {/* Rutas privadas (con layout de dashboard) */}
        <Route
          path="/*"
          element={
            <RutaPrivada>
              <DashboardLayout />
            </RutaPrivada>            
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;