import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/inicio', icon: 'bi-calendar-week', label: 'Inicio' },
    //{ path: '/medicamento', icon: 'bi-capsule', label: 'Medicamentos' },
    { path: '/historial', icon: 'bi-journal-text', label: 'Historial Agendas' },
    { path: '/planes', icon: 'bi-credit-card', label: 'Planes' },
    { path: '/config', icon: 'bi-gear-fill', label: 'Configuraciones' },
  ];

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Notificar al padre cuando cambie el estado
  useEffect(() => {
    if (onToggle) {
      onToggle(isSidebarOpen);
    }
  }, [isSidebarOpen, onToggle]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const openSidebar = () => setIsSidebarOpen(true);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <>
      {/* Overlay solo en móvil cuando sidebar está abierto */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay active" onClick={closeSidebar} />
      )}

      {/* Hamburguesa para MÓVIL */}
      {isMobile && (
        <button className="sidebar-hamburger" onClick={openSidebar}>
          <FiMenu />
        </button>
      )}

      {/* Hamburguesa para WEB (cuando sidebar está cerrado) */}
      {!isMobile && !isSidebarOpen && (
        <button className="sidebar-hamburger web" onClick={openSidebar}>
          <FiMenu />
        </button>
      )}

      {/* Sidebar - comportamiento diferente en web vs móvil */}
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <img src="/logoblanco.png" alt="logo" className="logo-full" />
          {/* Botón cerrar visible en web y móvil */}
          <button className="sidebar-close-btn" onClick={closeSidebar}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map(item => (
              <li key={item.path} className="sidebar-menu-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => isMobile && closeSidebar()}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="sidebar-logout-section">
            <button className="sidebar-logout-btn" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;