import './App.scss';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';

import RutaPrivada from "./Componentes/Paginas/Seguridad/RutaPrivada";
import useAutoLogout from './Componentes/Paginas/Seguridad/useAutoLogout.jsx';
import Navbar from './Componentes/Navbar';
import Sidebar from './Componentes/Sidebar';
//import Notificador from './Componentes/Notificador';
import Login from './Componentes/Paginas/Login/Login.jsx';
import Registro from './Componentes/Paginas/Registro/Registro.jsx';
import NotFound from './Componentes/Paginas/NotFound.jsx';
import Home from './Componentes/Paginas/Home/Home.jsx';
import OAuthCallback from './Componentes/Paginas/OAuthCallback.jsx';

import Inicio from './Componentes/Paginas/Inicio/Inicio.jsx';
import Historial from './Componentes/Paginas/Historial_Agenda/Historial.jsx';
import Planes from './Componentes/Paginas/Planes/Planes.jsx';
import Configuracion from './Componentes/Paginas/Configuraciones/Config.jsx';
import SupersetDashboard from './Componentes/SupersetDashboard.jsx';

// 🧭 Scroll automático
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// 🧱 Layout del Dashboard
const DashboardLayout = () => {
  const { showWarning, stayLoggedIn } = useAutoLogout(120, 1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth > 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
     <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/*<Notificador />*/}
      <Sidebar onToggle={setSidebarOpen} />{/* ✅ setSidebarOpen EXISTE */}

      <div className="main-content"> {/* ✅ sidebarOpen EXISTE */}
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

        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          {/*<Route path="/medicamento" element={<Medi />} />*/}
          <Route path="/historial" element={<Historial />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/config" element={<Configuracion />} />
          <Route path="/dashboard" element={<SupersetDashboard/>} />
        </Routes>
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