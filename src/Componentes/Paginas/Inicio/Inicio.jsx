// src/components/paginas/Inicio.jsx
import React from 'react';
import './Inicio.css';

const Inicio = () => {
  return (
    <div className="inicio-container">
      {/* Encabezado */}
      <div className="inicio-header">
        <h1>Bienvenido a VIDOMEDI</h1>
        <p>Tu asistente personal para el cuidado de la salud</p>
      </div>

      {/* Tarjetas de características */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">💊</div>
          <h3>Gestión de Medicamentos</h3>
          <p>Organiza y controla tus medicamentos de forma sencilla</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Recordatorios Inteligentes</h3>
          <p>Never forget to take your medication with smart alerts</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Contactos de Emergencia</h3>
          <p>Mantén a tus seres queridos informados sobre tu salud</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Seguimiento de Tratamientos</h3>
          <p>Monitorea tu progreso y mejora tu adherencia al tratamiento</p>
        </div>
      </div>

      {/* Mensaje de bienvenida */}
      <div className="welcome-message">
        <h2>¿Cómo deseas comenzar?</h2>
        <p>
          Navega por el menú lateral para acceder a todas las funciones 
          de VIDOMEDI. Puedes gestionar tus medicamentos, configurar recordatorios, 
          y mucho más.
        </p>
        
        <div className="quick-actions">
          <button className="action-btn primary">
            Ir a Medicamentos
          </button>
          <button className="action-btn secondary">
            Configurar Recordatorios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inicio;