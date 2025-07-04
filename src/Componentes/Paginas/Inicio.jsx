// src/components/paginas/Inicio.jsx
import React from 'react';

const Inicio = () => {
  return (
    <div style={styles.container}>
      {/* Sección Calendario */}
      <div style={styles.section}>
        <h1 style={styles.title}>CALEINDARIO</h1>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.calendarCell}>La 7</td>
              <td style={styles.calendarCell}>Ma 8</td>
              <td style={styles.calendarCell}>Mi 9</td>
              <td style={styles.calendarCell}>Ju 10</td>
              <td style={styles.calendarCell}>Vi 11</td>
              <td style={styles.calendarCell}>Sa 12</td>
              <td style={styles.calendarCell}>Do 13</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección Medicamentos */}
      <div style={styles.section}>
        <h1 style={styles.title}>Modicamentos</h1>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nombre</th>
              <th style={styles.tableHeader}>Tipo</th>
              <th style={styles.tableHeader}>Dosis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.tableCell}>Telmisartán</td>
              <td style={styles.tableCell}>Tableta</td>
              <td style={styles.tableCell}>8ml</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Sección Características */}
      <div style={styles.section}>
        <h1 style={styles.title}>Características</h1>
        <div style={styles.checkboxContainer}>
          <div style={styles.checkboxGroup}>
            <label style={styles.checkbox}>
              <input type="checkbox" style={styles.checkboxInput} />
              Paracetamol
            </label>
            <label style={styles.checkbox}>
              <input type="checkbox" style={styles.checkboxInput} />
              Tableta
            </label>
            <label style={styles.checkbox}>
              <input type="checkbox" style={styles.checkboxInput} />
              8ml
            </label>
          </div>
          
          <div style={styles.checkboxGroup}>
            <label style={styles.checkbox}>
              <input type="checkbox" style={styles.checkboxInput} />
              Insulina
            </label>
            <label style={styles.checkbox}>
              <input type="checkbox" style={styles.checkboxInput} />
              Inyección
            </label>
            <label style={styles.checkbox}>
              <input type="checkbox" style={styles.checkboxInput} />
              8ml
            </label>
          </div>
          
          <div style={styles.buttonGroup}>
            <button style={styles.button}>Agregar</button>
            <button style={styles.button}>Login</button>
            <button style={styles.button}>Registrar</button>
          </div>
        </div>
      </div>

      {/* Sección Contacto */}
      <div style={styles.section}>
        <h1 style={styles.title}>Contacto</h1>
        <div style={styles.contactSection}>
          <h2 style={styles.contactName}>Ana Torres</h2>
          <p style={styles.note}>
            Nota: Se le notificará a este contacto en caso de omitir la toma de la dosis.
          </p>
        </div>
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
  section: {
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  title: {
    color: '#2c3e50',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
    marginTop: '0',
    fontSize: '1.8rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHeader: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    border: '1px solid #2980b9',
  },
  tableCell: {
    padding: '12px',
    border: '1px solid #ecf0f1',
  },
  calendarCell: {
    padding: '12px',
    textAlign: 'center',
    border: '1px solid #ecf0f1',
    backgroundColor: '#e8f4fc',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f1f8ff',
    borderRadius: '5px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkboxInput: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  contactSection: {
    backgroundColor: '#e8f4fc',
    padding: '15px',
    borderRadius: '5px',
    borderLeft: '4px solid #3498db',
  },
  contactName: {
    margin: '0 0 10px 0',
    color: '#2c3e50',
  },
  note: {
    margin: '0',
    fontStyle: 'italic',
    color: '#7f8c8d',
  },
};

export default Inicio;