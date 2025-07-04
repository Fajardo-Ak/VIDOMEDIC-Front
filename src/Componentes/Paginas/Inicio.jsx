import React, { useState } from 'react';

const MedicationTracker = () => {
  const [medications, setMedications] = useState([
    { id: 1, name: 'Teimisartán', type: 'Tableta', dose: '8ml' },
    { id: 2, name: 'Paracetamol', type: 'Tableta', dose: '8ml' },
    { id: 3, name: 'Insulina', type: 'Inyección', dose: '8ml' }
  ]);
  
  const [newMedication, setNewMedication] = useState({
    name: '',
    type: 'Tableta',
    dose: ''
  });
  
  const today = new Date().getDate();
  
  const handleAddMedication = () => {
    if (newMedication.name.trim() && newMedication.dose.trim()) {
      const newMed = {
        id: medications.length + 1,
        name: newMedication.name,
        type: newMedication.type,
        dose: newMedication.dose
      };
      
      setMedications([...medications, newMed]);
      setNewMedication({ name: '', type: 'Tableta', dose: '' });
    }
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.logo}>💊 GestorMed</div>
        <div style={styles.menu}>
          <button style={styles.menuBtn}>Login</button>
          <button style={styles.menuBtn}>Registrar</button>
        </div>
      </header>
      
      <div style={styles.dashboard}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>CALENDARIO</h2>
          <div style={styles.calendar}>
            <div style={styles.calendarHeader}>Julio 2023</div>
            <div style={styles.weekday}>Lu</div>
            <div style={styles.weekday}>Ma</div>
            <div style={styles.weekday}>Mi</div>
            <div style={styles.weekday}>Ju</div>
            <div style={styles.weekday}>Vi</div>
            <div style={styles.weekday}>Sa</div>
            <div style={styles.weekday}>Do</div>
            
            {[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(day => (
              <div 
                key={day} 
                style={{
                  ...styles.day,
                  ...(day === today ? styles.today : {})
                }}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Contácto</h2>
          <div style={styles.contactInfo}>
            <div style={styles.contactName}>Ana Torres</div>
            <div style={styles.contactNote}>
              Nota: Se le notificará a este contacto en caso de omitir la toma de la dosis.
            </div>
          </div>
          
          <h2 style={styles.sectionTitle}>Medicamentos</h2>
          <div style={styles.medicationsList}>
            {medications.map(med => (
              <div key={med.id} style={styles.medicationRow}>
                <div style={styles.medicationDetails}>
                  <div style={styles.medicationName}>{med.name}</div>
                  <div style={styles.medicationType}>
                    <span style={med.type === 'Tableta' ? styles.pillType : styles.injectionType}>
                      {med.type}
                    </span>
                  </div>
                </div>
                <div style={styles.medicationDose}>{med.dose}</div>
              </div>
            ))}
          </div>
          
          <div style={styles.addMedication}>
            <input
              type="text"
              style={styles.addInput}
              placeholder="Nombre del medicamento"
              value={newMedication.name}
              onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
            />
            <select
              style={styles.addInput}
              value={newMedication.type}
              onChange={(e) => setNewMedication({...newMedication, type: e.target.value})}
            >
              <option value="Tableta">Tableta</option>
              <option value="Inyección">Inyección</option>
              <option value="Cápsula">Cápsula</option>
              <option value="Jarabe">Jarabe</option>
            </select>
            <input
              type="text"
              style={styles.addInput}
              placeholder="Dosis"
              value={newMedication.dose}
              onChange={(e) => setNewMedication({...newMedication, dose: e.target.value})}
            />
            <button style={styles.addBtn} onClick={handleAddMedication}>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos en formato de objeto JavaScript
const styles = {
  app: {
    background: 'linear-gradient(135deg, #1a2a3a, #0d1b29)',
    color: '#e0e0e0',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '2px solid #00c9a7',
    marginBottom: '30px'
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#00c9a7',
    display: 'flex',
    alignItems: 'center'
  },
  menu: {
    display: 'flex',
    gap: '20px'
  },
  menuBtn: {
    background: 'transparent',
    border: '2px solid #00c9a7',
    color: '#00c9a7',
    padding: '10px 25px',
    borderRadius: '30px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      background: '#00c9a7',
      color: '#0d1b29'
    }
  },
  sectionTitle: {
    fontSize: '24px',
    color: '#00c9a7',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #2c3e50'
  },
  dashboard: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '40px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr'
    }
  },
  card: {
    background: '#1e2a38',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    border: '1px solid #2c3e50'
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '8px'
  },
  calendarHeader: {
    gridColumn: 'span 7',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#00c9a7',
    marginBottom: '10px'
  },
  weekday: {
    textAlign: 'center',
    padding: '10px',
    background: '#2c3e50',
    borderRadius: '8px',
    fontWeight: 'bold'
  },
  day: {
    textAlign: 'center',
    padding: '12px',
    background: '#253341',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      background: '#00c9a7',
      color: '#0d1b29',
      transform: 'translateY(-3px)'
    }
  },
  today: {
    background: '#00c9a7',
    color: '#0d1b29',
    fontWeight: 'bold'
  },
  contactInfo: {
    padding: '15px',
    background: '#253341',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '5px',
    color: '#00c9a7'
  },
  contactNote: {
    fontSize: '14px',
    color: '#a0aec0',
    fontStyle: 'italic'
  },
  medicationsList: {
    marginBottom: '20px'
  },
  addMedication: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
    '@media (max-width: 768px)': {
      flexDirection: 'column'
    }
  },
  addInput: {
    flex: '1',
    padding: '12px 15px',
    border: 'none',
    background: '#253341',
    color: '#e0e0e0',
    borderRadius: '8px',
    border: '1px solid #2c3e50'
  },
  addBtn: {
    background: '#00c9a7',
    color: '#0d1b29',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      background: '#00a38e',
      transform: 'translateY(-2px)'
    }
  },
  pillType: {
    background: '#00c9a7',
    color: '#0d1b29',
    padding: '3px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block'
  },
  injectionType: {
    background: '#ff6b6b',
    color: '#0d1b29',
    padding: '3px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block'
  },
  medicationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#253341',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  medicationDetails: {
    flex: '1'
  },
  medicationName: {
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  medicationType: {
    fontSize: '14px',
    color: '#a0aec0'
  },
  medicationDose: {
    fontWeight: 'bold',
    color: '#00c9a7'
  }
};

export default MedicationTracker;