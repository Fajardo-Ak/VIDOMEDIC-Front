import React, { useState } from 'react';
import './App.css';

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
    <div className="app">
      <header>
        <div className="logo">💊 GestorMed</div>
        <div className="menu">
          <button className="menu-btn">Login</button>
          <button className="menu-btn">Registrar</button>
        </div>
      </header>
      
      <div className="dashboard">
        <div className="card">
          <h2 className="section-title">CALENDARIO</h2>
          <div className="calendar">
            <div className="calendar-header">Julio 2023</div>
            <div className="weekday">Lu</div>
            <div className="weekday">Ma</div>
            <div className="weekday">Mi</div>
            <div className="weekday">Ju</div>
            <div className="weekday">Vi</div>
            <div className="weekday">Sa</div>
            <div className="weekday">Do</div>
            
            {[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(day => (
              <div 
                key={day} 
                className={`day ${day === today ? 'today' : ''}`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h2 className="section-title">Contácto</h2>
          <div className="contact-info">
            <div className="contact-name">Ana Torres</div>
            <div className="contact-note">
              Nota: Se le notificará a este contacto en caso de omitir la toma de la dosis.
            </div>
          </div>
          
          <h2 className="section-title">Medicamentos</h2>
          <div className="medications-list">
            {medications.map(med => (
              <div key={med.id} className="medication-row">
                <div className="medication-details">
                  <div className="medication-name">{med.name}</div>
                  <div className="medication-type">
                    <span className={`${med.type === 'Tableta' ? 'pill-type' : 'injection-type'}`}>
                      {med.type}
                    </span>
                  </div>
                </div>
                <div className="medication-dose">{med.dose}</div>
              </div>
            ))}
          </div>
          
          <div className="add-medication">
            <input
              type="text"
              className="add-input"
              placeholder="Nombre del medicamento"
              value={newMedication.name}
              onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
            />
            <select
              className="add-input"
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
              className="add-input"
              placeholder="Dosis"
              value={newMedication.dose}
              onChange={(e) => setNewMedication({...newMedication, dose: e.target.value})}
            />
            <button className="add-btn" onClick={handleAddMedication}>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationTracker;