import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import api from '../api/axiosConfig'; // <--- IMPORTANTE
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { path: '/inicio', icon: 'bi-calendar-week', label: 'Inicio' },
    //{ path: '/medicamento', icon: 'bi-capsule', label: 'Medicamentos' },
    { path: '/historial', icon: 'bi-journal-text', label: 'Historial Agendas' },
    { path: '/planes', icon: 'bi-credit-card', label: 'Planes' },
    { path: '/config', icon: 'bi-gear-fill', label: 'Configuraciones' },
    { path: '/dashboard', icon: 'bi-gear-fill', label: 'Dashboard' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setOpen(!mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (onToggle) onToggle(open);
  }, [open, onToggle]);

  const handleLogout = async () => {
    try {
      // CAMBIO: Usamos la instancia api y quitamos la URL fija y headers manuales
      await api.post('/logout');
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
      {isMobile && open && <div className="sidebar-overlay active" onClick={() => setOpen(false)} />}

      {isMobile && !open && (
        <button className="sidebar-hamburger" onClick={() => setOpen(true)}>
          <FiMenu />
        </button>
      )}

      {!isMobile && !open && (
        <button className="sidebar-hamburger web" onClick={() => setOpen(true)}>
          <FiMenu />
        </button>
      )}

      <div className={`sidebar-container ${open ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <img src="/logoblanco.png" alt="logo" className="logo-full" />
          <button className="sidebar-close-btn" onClick={() => setOpen(false)}>
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
                  onClick={() => isMobile && setOpen(false)}
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