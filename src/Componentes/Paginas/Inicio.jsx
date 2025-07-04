// src/components/paginas/Inicio.jsx
import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const Inicio = () => {
  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.header}>
        <h1 style={styles.loginTitle}>Login</h1>
        <div style={styles.registerLink}>Registrar</div>
      </div>

      {/* Sección Calendario */}
      <div style={styles.section}>
        <h1 style={styles.title}>CALENDARIO</h1>
        <div style={styles.calendarLink}>
          <FaChevronDown style={styles.arrowIcon} />
          <span>Contácto</span>
        </div>
        
        <div style={styles.calendarTable}>
          <div style={styles.calendarRow}>
            <div style={styles.calendarHeader}>Lu</div>
            <div style={styles.calendarHeader}>Ma</div>
            <div style={styles.calendarHeader}>Mi</div>
            <div style={styles.calendarHeader}>Ju</div>
            <div style={styles.calendarHeader}>Vi</div>
            <div style={styles.calendarHeader}>Sa</div>
            <div style={styles.calendarHeader}>Do</div>
          </div>
          <div style={styles.calendarRow}>
            <div style={styles.calendarDay}>7</div>
            <div style={styles.calendarDay}>8</div>
            <div style={styles.calendarDay}>9</div>
            <div style={styles.calendarDay}>10</div>
            <div style={styles.calendarDay}>11</div>
            <div style={styles.calendarDay}>12</div>
            <div style={styles.calendarDay}>13</div>
          </div>
        </div>
      </div>

      {/* Separador */}
      <div style={styles.divider} />

      {/* Secciones en columnas */}
      <div style={styles.columnsContainer}>
        {/* Columna izquierda - Contacto */}
        <div style={styles.column}>
          <div style={styles.section}>
            <div style={styles.contactCard}>
              <div style={styles.contactName}>Ana Torres</div>
              <div style={styles.contactNote}>
                Nota: Se le notificará a este contacto en caso de omitir la toma de la dosis.
              </div>
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Medicamentos */}
        <div style={styles.column}>
          <div style={styles.section}>
            <h1 style={styles.title}>Medicamentos</h1>
            <div style={styles.medicationsTable}>
              <div style={styles.tableRow}>
                <div style={styles.tableHeader}>Nombre</div>
                <div style={styles.tableHeader}>Tipo</div>
                <div style={styles.tableHeader}>Dosis</div>
              </div>
              <div style={styles.tableRow}>
                <div style={styles.tableCell}>Telmisartán</div>
                <div style={styles.tableCell}>Tableta</div>
                <div style={styles.tableCell}>8ml</div>
              </div>
              <div style={styles.tableRow}>
                <div style={styles.tableCell}>Paracetamol</div>
                <div style={styles.tableCell}>Tableta</div>
                <div style={styles.tableCell}>8ml</div>
              </div>
              <div style={styles.tableRow}>
                <div style={styles.tableCell}>Insulina</div>
                <div style={styles.tableCell}>Inyección</div>
                <div style={styles.tableCell}>8ml</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Agregar */}
      <div style={styles.addButtonContainer}>
        <button style={styles.addButton}>Agregar</button>
      </div>
    </div>
  );
};

// Estilos en el mismo archivo
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e0e0e0',
  },
  loginTitle: {
    fontSize: '1.8rem',
    color: '#2c3e50',
    margin: 0,
  },
  registerLink: {
    fontSize: '1.2rem',
    color: '#3498db',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  section: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    color: '#2c3e50',
    paddingBottom: '10px',
    marginTop: '0',
    fontSize: '1.5rem',
    marginBottom: '15px',
    borderBottom: '2px solid #3498db',
  },
  calendarLink: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    color: '#3498db',
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginRight: '8px',
    fontSize: '0.9rem',
  },
  calendarTable: {
    display: 'flex',
    flexDirection: 'column',
  },
  calendarRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  calendarHeader: {
    flex: 1,
    padding: '10px 5px',
    textAlign: 'center',
    backgroundColor: '#e8f4fc',
    borderRadius: '4px',
    fontWeight: 'bold',
    border: '1px solid #cde0ee',
    margin: '0 2px',
  },
  calendarDay: {
    flex: 1,
    padding: '10px 5px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    margin: '0 2px',
  },
  divider: {
    height: '2px',
    backgroundColor: '#3498db',
    border: 'none',
    margin: '20px 0',
  },
  columnsContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  column: {
    flex: 1,
  },
  contactCard: {
    backgroundColor: '#e8f4fc',
    padding: '20px',
    borderRadius: '6px',
    borderLeft: '4px solid #3498db',
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: '1.3rem',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  contactNote: {
    color: '#555',
    fontStyle: 'italic',
    fontSize: '0.95rem',
  },
  medicationsTable: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  tableRow: {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  tableHeader: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f1f8ff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    padding: '12px',
    textAlign: 'center',
  },
  addButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
  },
  addButton: {
    padding: '12px 30px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
  },
};

export default Inicio;