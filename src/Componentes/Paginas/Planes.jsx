// src/components/paginas/PlanBasico.jsx
import React from 'react';

const Planes = () => {
  return (
    <div style={styles.container}>
      {/* Sección de Contacto */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>Contacto</div>
        <div style={styles.field}>
          <span style={styles.label}>Nombre</span>
          <span style={styles.value}></span>   
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Email:</span>
          <span style={styles.value}>correo.ejemplo@gmail.com</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Telefono:</span>
          <span style={styles.value}>9999090909</span>
        </div>
      </div>
      
      {/* Separador */}
      <div style={styles.divider}></div>
      
      {/* Sección de Información */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>Información</div>
        <div style={styles.field}>
          <span style={styles.label}>Nombre</span>
          <span style={styles.value}></span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Apellido:</span>
          <span style={styles.value}></span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Email:</span>
          <span style={styles.value}>correo.ejemplo@gmail.com</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Género:</span>
          <span style={styles.value}>Femenino</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Edad:</span>
          <span style={styles.value}>67</span>
        </div>
        <div style={styles.field}>
          <span style={styles.label}>Contraseña:</span>
          <span style={styles.password}>**********</span>
        </div>
      </div>
    </div>
  );
};

// Estilos en línea para mantener el componente autónomo
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  section: {
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    padding: '12px 15px',
    fontSize: '18px',
    fontWeight: '600',
    borderBottom: '1px solid #e0e0e0',
  },
  field: {
    display: 'flex',
    padding: '12px 15px',
    borderBottom: '1px solid #f0f0f0',
  },
  label: {
    fontWeight: '500',
    minWidth: '120px',
    color: '#555',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  password: {
    flex: 1,
    color: '#333',
    letterSpacing: '2px',
    fontWeight: '600',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e0e0e0',
    margin: '20px 0',
    position: 'relative',
  },
};

export default Planes;