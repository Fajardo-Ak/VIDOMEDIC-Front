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
import Medicamentos from './Componentes/Paginas/Medicamentos/Medicamentos.jsx'; // Cambié 'Medi' por 'Medicamentos'
import Agend from './Componentes/Paginas/Historial_Agenda/Historial.jsx';
import Planes from './Componentes/Paginas/Planes/Planes.jsx';
import Ventas from './Componentes/Paginas/Ventas.jsx';
import Usuarios from './Componentes/Paginas/Usuarios.jsx';
import Configuracion from './Componentes/Paginas/Configuraciones/Config.jsx';

// 🧭 Scroll automático
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// 🧱 Layout del Dashboard
const DashboardLayout = () => {
  const { showWarning, stayLoggedIn } = useAutoLogout(120, 1);
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ DEFINIDO AQUÍ

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar onToggle={setSidebarOpen} /> {/* ✅ setSidebarOpen definido */}

      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}> {/* ✅ sidebarOpen definido */}
        <Navbar />
        <ScrollToTop />

        {/* MODAL de aviso */}
        {showWarning && (
          <div className="session-modal-overlay">
            <div className="session-modal">
              <h4>⏳ Sesión por expirar</h4>
              <p>Tu sesión se cerrará automáticamente en menos de un minuto.</p>
              <button onClick={stayLoggedIn}>Seguir conectado</button>
            </div>
          </div>
        )}

        {/* RUTAS INTERNAS */}
        <div className="routes-content">
          <Routes>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/medicamento" element={<Medicamentos />} /> {/* ✅ Cambié Medi por Medicamentos */}
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
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />

        {/* Rutas privadas */}
        <Route
          path="/*"
          element={
            <RutaPrivada>
              <DashboardLayout />
            </RutaPrivada>
          }
        />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;