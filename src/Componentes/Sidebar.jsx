import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Función para toggle del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Array de items del menú para mejor mantenimiento
  const menuItems = [
    { path: '/inicio', icon: 'bi-house-fill', label: 'Inicio' },
    { path: '/planes', icon: 'bi-clipboard2-data-fill', label: 'Planes' },
    { path: '/contactos', icon: 'bi-file-person-fill', label: 'Contactos' },
    { path: '/config', icon: 'bi-person-square', label: 'Configuraciones' }
  ];

  // Verificar si una ruta está activa
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        
        {/* Header del Sidebar */}
        <div className="sidebar-header">
          {isSidebarOpen && <h3 className="sidebar-title">Panel</h3>}
          <button 
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}
          >
            <i className={`bi bi-chevron-${isSidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>
        
        {/* Menú de Navegación */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="sidebar-menu-item">
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span className="sidebar-link-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Espacio para el contenido principal */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Tu contenido principal irá aquí */}
      </div>
    </>
  );
};

export default Sidebar;