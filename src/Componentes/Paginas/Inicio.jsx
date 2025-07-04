// src/components/paginas/Inicio.jsx
import React from 'react';
import { FaChevronDown, FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
        <div style={styles.calendarHeaderContainer}>
          <h1 style={styles.title}>CALENDARIO</h1>
          <div style={styles.calendarNav}>
            <button style={styles.navButton}><FaChevronLeft /></button>
            <div style={styles.monthIndicator}>Julio 2025</div>
            <button style={styles.navButton}><FaChevronRight /></button>
          </div>
        </div>
        
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
                <div style={styles.tableHeader}>Acciones</div>
              </div>
              <div style={styles.tableRow}>
                <div style={styles.tableCell}>Telmisartán</div>
                <div style={styles.tableCell}>Tableta</div>
                <div style={styles.tableCell}>8ml</div>
                <div style={styles.actionsCell}>
                  <button style={styles.actionButton}><FaEdit /></button>
                  <button style={styles.actionButton}><FaTrash /></button>
                </div>
              </div>
              <div style={styles.tableRow}>
                <div style={styles.tableCell}>Paracetamol</div>
                <div style={styles.tableCell}>Tableta</div>
                <div style={styles.tableCell}>8ml</div>
                <div style={styles.actionsCell}>
                  <button style={styles.actionButton}><FaEdit /></button>
                  <button style={styles.actionButton}><FaTrash /></button>
                </div>
              </div>
              <div style={styles.tableRow}>
                <div style={styles.tableCell}>Insulina</div>
                <div style={styles.tableCell}>Inyección</div>
                <div style={styles.tableCell}>8ml</div>
                <div style={styles.actionsCell}>
                  <button style={styles.actionButton}><FaEdit /></button>
                  <button style={styles.actionButton}><FaTrash /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Agregar en esquina inferior derecha */}
      <div style={styles.floatingButtonContainer}>
        <button style={styles.floatingButton}>
          <FaPlus style={styles.floatingButtonIcon} />
          <span style={styles.floatingButtonText}>Agregar</span>
        </button>
      </div>
    </div>
  );
};

// Estilos actualizados y mejorados
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'relative',
    minHeight: '100vh',
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
    textDecoration: 'none',
  },
  section: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  calendarHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  title: {
    color: '#2c3e50',
    paddingBottom: '10px',
    marginTop: '0',
    fontSize: '1.5rem',
    marginBottom: '15px',
    borderBottom: '2px solid #3498db',
  },
  calendarNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  monthIndicator: {
    fontWeight: 'bold',
    color: '#555',
  },
  navButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#3498db',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#e8f4fc',
    },
  },
  calendarLink: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    color: '#3498db',
    fontWeight: 'bold',
    padding: '8px 12px',
    backgroundColor: '#e8f4fc',
    borderRadius: '4px',
    width: 'fit-content',
  },
  arrowIcon: {
    marginRight: '8px',
    fontSize: '0.9rem',
  },
  calendarTable: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '15px',
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
    fontSize: '0.9rem',
  },
  calendarDay: {
    flex: 1,
    padding: '10px 5px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
    margin: '0 2px',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  divider: {
    height: '2px',
    backgroundColor: '#3498db',
    border: 'none',
    margin: '20px 0',
    opacity: '0.3',
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
    lineHeight: '1.4',
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
    fontSize: '0.95rem',
  },
  tableCell: {
    flex: 1,
    padding: '12px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.95rem',
  },
  actionsCell: {
    flex: 0.8,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '8px',
  },
  actionButton: {
    background: '#f1f8ff',
    border: '1px solid #cde0ee',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#3498db',
    padding: '8px',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#3498db',
      color: 'white',
      borderColor: '#3498db',
    },
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    zIndex: 10,
  },
  floatingButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    '&:hover': {
      backgroundColor: '#2980b9',
      transform: 'translateY(-2px)',
    },
  },
  floatingButtonIcon: {
    marginRight: '8px',
    fontSize: '1.2rem',
  },
  floatingButtonText: {
    marginLeft: '5px',
  },
};

export default Inicio;