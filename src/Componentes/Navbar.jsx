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
import './Navbar.css';

const CustomNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  // Datos del usuario (podrían venir de props o contexto)
  const userData = {
    name: 'Angel Fajardo',
    email: 'angel.fajardo@ejemplo.com',
    initials: 'AF',
    color: '#BFDB38'
  };

  return (
    <Navbar expand="md" className="custom-navbar">
      {/* Logo y Brand */}
      <NavbarBrand href="/" className="navbar-brand-custom">
        <i className="bi bi-people-fill me-2"></i>
        Gestión CRM
      </NavbarBrand>
      
      {/* Toggler para móviles */}
      <NavbarToggler onClick={toggle} className="navbar-toggler-custom">
        <i className="bi bi-list"></i>
      </NavbarToggler>
      
      {/* Menú colapsable */}
      <Collapse isOpen={isOpen} navbar className="navbar-collapse-custom">
        <Nav navbar className="nav-custom">
          {/* Dropdown de usuario */}
          <UncontrolledDropdown nav inNavbar className="user-dropdown">
            <DropdownToggle nav caret className="user-toggle">
              <div 
                className="user-avatar"
                style={{ backgroundColor: userData.color }}
              >
                {userData.initials}
              </div>
              <span className="user-name">{userData.name}</span>
            </DropdownToggle>
            
            <DropdownMenu end className="dropdown-menu-custom">
              <DropdownItem header className="dropdown-header-custom">
                <i className="bi bi-person-circle me-2"></i>
                {userData.email}
              </DropdownItem>
              
              <DropdownItem className="dropdown-item-custom">
                <i className="bi bi-person me-2"></i> Mi Perfil
              </DropdownItem>
              
              <DropdownItem className="dropdown-item-custom">
                <i className="bi bi-gear me-2"></i> Configuraciones
              </DropdownItem>
              
              <DropdownItem divider />
              
              <DropdownItem className="dropdown-item-custom">
                <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default CustomNavbar;