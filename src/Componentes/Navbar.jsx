import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

function Example() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState(3);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar 
        expand="md" 
        style={{ 
          backgroundColor: '#1F7A8C',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          padding: '0.5rem 1rem'
        }}
      >
        <NavbarBrand href="/" style={{ 
          fontWeight: 600, 
          fontSize: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          color: 'white'
        }}>
          <i className="bi bi-people-fill me-2"></i>
          Gestión CRM
        </NavbarBrand>
        
        <div className="d-md-none">
          <NavbarToggler onClick={toggle} style={{ border: 'none' }}>
            <i className="bi bi-list" style={{ fontSize: '1.5rem', color: '#ffffff' }}></i>
          </NavbarToggler>
        </div>
        
        <Collapse isOpen={isOpen} navbar style={{ justifyContent: 'flex-end' }}>
          <Nav className="ms-auto" navbar style={{ alignItems: 'center' }}>

            <UncontrolledDropdown nav inNavbar className="ms-2">
              <DropdownToggle nav caret style={{ 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center',
                padding: '0.5rem 1rem'
              }}>
                <div className="user-avatar me-2" style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#BFDB38',
                  border: '2px solid #1F7A8C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1F7A8C',
                  fontWeight: 'bold'
                }}>
                  AF
                </div>
                <span className="d-none d-md-inline">Angel Fajardo</span>
              </DropdownToggle>
              <DropdownMenu end style={{ 
                borderRadius: '8px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                border: 'none',
                marginTop: '10px'
              }}>
                <DropdownItem header style={{ 
                  fontWeight: 600, 
                  color: '#1F7A8C',
                  fontSize: '0.9rem'
                }}>
                  <i className="bi bi-person-circle me-2"></i>
                  angel.fajardo@ejemplo.com
                </DropdownItem>
                <DropdownItem>
                  <i className="bi bi-person me-2"></i> Mi Perfil
                </DropdownItem>
                <DropdownItem>
                  <i className="bi bi-gear me-2"></i> Configuraciones
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>

      {/* Estilos adicionales */}
      <style jsx="true">{`
        .navbar {
          z-index: 1100;
        }

        .dropdown-item {
          padding: 0.5rem 1.25rem;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          transition: none;
        }

        .dropdown-item:hover {
          background-color: #d4edf4;
          color: #1F7A8C;
        }

        .dropdown-item:active {
          background-color: #c1e9f2;
        }

        .dropdown-menu {
          min-width: 220px;
        }

        .nav-link {
          color: white !important;
          border-radius: 4px;
          padding: 0.5rem 0.75rem;
        }

        .nav-link:hover {
          background-color: transparent;
          color: white !important;
        }

        .navbar-toggler:focus {
          box-shadow: none;
        }
      `}</style>

      {/* Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
    </div>
  );
}

export default Example;
