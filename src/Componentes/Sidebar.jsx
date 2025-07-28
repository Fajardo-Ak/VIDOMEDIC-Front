import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const handleSave = () => {
    // Lógica para guardar aquí
    alert('¡Cambios guardados!');
  };

  return (
    <div>
      <div className="sidebar-container" style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: isSidebarOpen ? '250px' : '70px',
        backgroundColor: '#1F7A8C',
        padding: '20px 0',
        zIndex: 1000,
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden'
      }}>
        {/* Botón para ocultar/mostrar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 15px 20px',
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '15px',
          minHeight: '40px'
        }}>
          {isSidebarOpen && (
            <h3 style={{ 
              margin: 0, 
              fontSize: '1.4rem', 
              fontWeight: 500,
              transition: 'opacity 0.2s ease',
              opacity: isSidebarOpen ? 1 : 0
            }}>
              Panel
            </h3>
          )}
          <button 
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? 
              <i className="bi bi-chevron-left"></i> : 
              <i className="bi bi-chevron-right"></i>
            }
          </button>
        </div>
        
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          flexGrow: 1
        }}>
          <li style={{ margin: '5px 0' }}>
            <NavLink 
              to="/inicio" 
              className="sidebar-link"
              style={({ isActive }) => ({ 
                background: isActive ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                color: isActive ? '#1F7A8C' : 'rgba(255, 255, 255, 0.85)',
                borderLeft: isActive ? '3px solid white' : '3px solid transparent'
              })}
            >
              <i className="bi bi-house-fill" style={{ 
                fontSize: '1.2rem',
                minWidth: '30px',
                textAlign: 'center',
                marginRight: isSidebarOpen ? '10px' : '0'
              }}></i> 
              <span style={{ 
                transition: 'opacity 0.2s ease',
                opacity: isSidebarOpen ? 1 : 0 
              }}>
                Inicio
              </span>
            </NavLink>
          </li>
          <li style={{ margin: '5px 0' }}>
            <NavLink 
              to="/planes" 
              className="sidebar-link"
              style={({ isActive }) => ({ 
                background: isActive ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                color: isActive ? '#1F7A8C' : 'rgba(255, 255, 255, 0.85)',
                borderLeft: isActive ? '3px solid white' : '3px solid transparent'
              })}
            >
              <i className="bi bi-clipboard2-data-fill" style={{ 
                fontSize: '1.2rem',
                minWidth: '30px',
                textAlign: 'center',
                marginRight: isSidebarOpen ? '10px' : '0'
              }}></i> 
              <span style={{ 
                transition: 'opacity 0.2s ease',
                opacity: isSidebarOpen ? 1 : 0 
              }}>
                Planes
              </span>
            </NavLink> 
          </li>
          <li style={{ margin: '5px 0' }}>
            <NavLink 
              to="/Contactos" 
              className="sidebar-link"
              style={({ isActive }) => ({ 
                background: isActive ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                color: isActive ? '#1F7A8C' : 'rgba(255, 255, 255, 0.85)',
                borderLeft: isActive ? '3px solid white' : '3px solid transparent'
              })}
            >
              <i className="bi bi-file-person-fill" style={{ 
                fontSize: '1.2rem',
                minWidth: '30px',
                textAlign: 'center',
                marginRight: isSidebarOpen ? '10px' : '0'
              }}></i> 
              <span style={{ 
                transition: 'opacity 0.2s ease',
                opacity: isSidebarOpen ? 1 : 0 
              }}>
                Contactos
              </span>
            </NavLink>
          </li>
          <li style={{ margin: '5px 0' }}>
            <NavLink 
              to="/Config" 
              className="sidebar-link"
              style={({ isActive }) => ({ 
                background: isActive ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                color: isActive ? '#1F7A8C' : 'rgba(255, 255, 255, 0.85)',
                borderLeft: isActive ? '3px solid white' : '3px solid transparent'
              })}
            >
              <i className="bi bi-person-square" style={{ 
                fontSize: '1.2rem',
                minWidth: '30px',
                textAlign: 'center',
                marginRight: isSidebarOpen ? '10px' : '0'
              }}></i> 
              <span style={{ 
                transition: 'opacity 0.2s ease',
                opacity: isSidebarOpen ? 1 : 0 
              }}>
                Configuraciones
              </span>
            </NavLink>
          </li>
        </ul>
        
        {/* Botón de Guardar */}
        <div style={{
          padding: '15px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            
          
        </div>
      </div>

      {/* Estilos CSS en el mismo archivo */}
      <style jsx="true">{`
        .sidebar-link {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 1.05rem;
          white-space: nowrap;
        }
        
        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-left: 3px solid rgba(255, 255, 255, 0.5) !important;
        }
        
        .sidebar-link i {
          transition: all 0.3s ease;
        }
        
        .sidebar-container button:hover {
          background-color: #166477 !important;
          color: white !important;
          transform: scale(1.05);
        }
        
        .save-button:hover {
          background-color: #A8C520 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
      
      {/* Incluir Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
      
      {/* Espacio para el contenido principal */}
      <div style={{ 
        marginLeft: isSidebarOpen ? '250px' : '70px',
        transition: 'margin-left 0.3s ease',
        padding: '20px'
      }}>
        
      </div>
    </div>
  );
};

export default Sidebar;