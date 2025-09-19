// src/components/paginas/Inicio.jsx
import { FaEdit, FaTrash, FaPlus, FaTimes, FaBell } from 'react-icons/fa';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay, addHours, differenceInMilliseconds } from 'date-fns';
import { es } from 'date-fns/locale';


const Inicio = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [medicamentos, setMedicamentos] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    tipo: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    horaInicio: new Date()
  });
  const [editando, setEditando] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [alarmasActivas, setAlarmasActivas] = useState([]);
  const [alarmaModal, setAlarmaModal] = useState({ visible: false, medicamento: null, hora: null });
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const alarmTimeouts = useRef({});
  const audioRef = useRef(null);

  // --- Cargar medicamentos desde API ---
  useEffect(() => {
    const cargarMedicamentos = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/medicamentos', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!res.ok) throw new Error('Error al cargar medicamentos');
        const data = await res.json();
        // Convertir fechas de string a Date si vienen como ISO
        const medsConFecha = data.map(m => ({
          ...m,
          horaInicio: new Date(m.horaInicio)
        }));
        setMedicamentos(medsConFecha);
      } catch (err) {
        console.error(err);
      }
    };

    cargarMedicamentos();

    // Solicitar permisos de notificación
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") console.log("Permiso concedido");
      });
    }

    // Configurar audio
    audioRef.current = new Audio();
    audioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // --- Guardar medicamento en API ---
  const guardarMedicamento = async () => {
    try {
      let res, data;
      if (editando !== null) {
        // Editar
        res = await fetch(`http://localhost:8000/api/medicamentos/${formulario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(formulario)
        });
      } else {
        // Nuevo
        res = await fetch(`http://localhost:8000/api/medicamentos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(formulario)
        });
      }
      if (!res.ok) throw new Error('Error al guardar medicamento');
      data = await res.json();

      // Actualizar estado local
      if (editando !== null) {
        const nuevosMedicamentos = [...medicamentos];
        nuevosMedicamentos[editando] = data;
        setMedicamentos(nuevosMedicamentos);
        setEditando(null);
      } else {
        setMedicamentos([...medicamentos, data]);
      }

      // Reset formulario
      setFormulario({ nombre: '', tipo: '', dosis: '', frecuencia: '', duracion: '', horaInicio: new Date() });
      setModalAbierto(false);

    } catch (err) {
      console.error(err);
    }
  };

  // --- Eliminar medicamento en API ---
  const eliminarMedicamento = async (index) => {
    try {
      const med = medicamentos[index];
      const res = await fetch(`http://localhost:8000/api/medicamentos/${med.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Error al eliminar medicamento');

      const nuevosMedicamentos = [...medicamentos];
      nuevosMedicamentos.splice(index, 1);
      setMedicamentos(nuevosMedicamentos);
    } catch (err) {
      console.error(err);
    }
  };

  //funcion para editar el medicamento temporal
  const editarMedicamento = (medicamento) => {
  // Lógica para editar medicamento
  console.log('Editar:', medicamento);
};

//Funcion de manejo de cambios temporal
const manejarCambio = (e) => {
  const { name, value } = e.target;
  setFormulario(prev => ({ ...prev, [name]: value }));
};

//funcion manejo de hora temporal
const manejarCambioHora = (e) => {
  setFormulario(prev => ({ ...prev, hora: e.target.value }));
};
  
  // Generar eventos para el calendario basados en medicamentos
  useEffect(() => {
    const nuevosEventos = [];
    
    medicamentos.forEach(med => {
      // Crear evento principal
      nuevosEventos.push({
        title: `${med.nombre} (${med.dosis})`,
        start: med.horaInicio,
        end: addHours(med.horaInicio, 1),
        tipo: 'medicamento',
        medicamentoId: med.id
      });
      
      // Crear eventos recurrentes basados en la frecuencia
      if (med.frecuencia.includes('8')) {
        // Cada 8 horas
        for (let i = 1; i <= 3; i++) {
          nuevosEventos.push({
            title: `${med.nombre} (${med.dosis})`,
            start: addHours(med.horaInicio, i * 8),
            end: addHours(med.horaInicio, i * 8 + 1),
            tipo: 'medicamento',
            medicamentoId: med.id
          });
        }
      } else if (med.frecuencia.includes('24')) {
        // Cada 24 horas
        for (let i = 1; i <= 7; i++) {
          nuevosEventos.push({
            title: `${med.nombre} (${med.dosis})`,
            start: addHours(med.horaInicio, i * 24),
            end: addHours(med.horaInicio, i * 24 + 1),
            tipo: 'medicamento',
            medicamentoId: med.id
          });
        }
      } else if (med.frecuencia.includes('2 veces al día')) {
        // 2 veces al día (cada 12 horas)
        for (let i = 1; i <= 7; i++) {
          nuevosEventos.push({
            title: `${med.nombre} (${med.dosis})`,
            start: addHours(med.horaInicio, i * 12),
            end: addHours(med.horaInicio, i * 12 + 1),
            tipo: 'medicamento',
            medicamentoId: med.id
          });
        }
      }
    });
    
    // Agregar eventos fijos
    const eventosFijos = [
      {
        title: 'Consulta médica',
        start: new Date(2025, 6, 25, 10, 0),
        end: new Date(2025, 6, 25, 11, 0),
      },
      {
        title: 'Toma de medicamento',
        start: new Date(2025, 6, 26, 9, 0),
        end: new Date(2025, 6, 26, 9, 30),
      }
    ];
    
    setEventos([...eventosFijos, ...nuevosEventos]);
  }, [medicamentos]);
  
  // Configurar alarmas para los medicamentos
  useEffect(() => {
    // Limpiar alarmas anteriores
    Object.values(alarmTimeouts.current).forEach(timeout => clearTimeout(timeout));
    alarmTimeouts.current = {};
    
    const nuevasAlarmas = [];
    
    medicamentos.forEach(med => {
      const alarmasParaMed = [];
      
      // Función para crear alarma
      const crearAlarma = (fecha) => {
        const ahora = new Date();
        const diferencia = differenceInMilliseconds(fecha, ahora);
        
        if (diferencia > 0) {
          const timeoutId = setTimeout(() => {
            // Mostrar notificación
            if (Notification.permission === "granted") {
              new Notification(`Recordatorio de medicamento`, {
                body: `Es hora de tomar ${med.nombre} (${med.dosis})`,
                icon: '/favicon.ico',
                vibrate: [200, 100, 200]
              });
            }
            
            // Reproducir sonido de alarma
            if (audioRef.current) {
              audioRef.current.play().catch(e => console.error("Error al reproducir sonido:", e));
            }
            
            // Mostrar modal de alarma
            setAlarmaModal({
              visible: true,
              medicamento: med,
              hora: fecha
            });
            
            // Repetir alarma si es necesario
            if (med.frecuencia.includes('8 horas')) {
              crearAlarma(addHours(fecha, 8));
            } else if (med.frecuencia.includes('24 horas')) {
              crearAlarma(addHours(fecha, 24));
            } else if (med.frecuencia.includes('2 veces al día')) {
              crearAlarma(addHours(fecha, 12));
            }
          }, diferencia);
          
          alarmTimeouts.current[`${med.id}-${fecha.getTime()}`] = timeoutId;
          alarmasParaMed.push(fecha);
        }
      };
      
      // Crear alarmas basadas en la frecuencia
      crearAlarma(med.horaInicio);
      
      nuevasAlarmas.push({
        medicamento: med,
        proximaAlarma: med.horaInicio,
        alarmas: alarmasParaMed
      });
    });
    
    setAlarmasActivas(nuevasAlarmas);
    
    // Limpiar al desmontar
    return () => {
      Object.values(alarmTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, [medicamentos]);

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.header}>
        <div style={styles.registerLink} onClick={() => setModalAbierto(true)}>
          <FaPlus style={styles.addIcon} />
          <span>Registrar Medicamento</span>
        </div>
      </div>

      {/* Sección Calendario */}
      <div style={styles.calendarContainer}>
        <h2 style={styles.sectionTitle}>
          Calendario de Medicamentos
        </h2>
        <div style={styles.calendarWrapper}>
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            view={view}
            date={date}
            onView={view => setView(view)}
            onNavigate={date => setDate(date)}
            messages={{
              next: "Sig",
              previous: "Ant",
              today: "Hoy",
              month: "Mes",
              week: "Sem",
              day: "Día",
              agenda: "Agenda"
            }}
            eventPropGetter={(event) => {
              const backgroundColor = event.tipo === 'medicamento' ? '#3498db' : '#2ecc71';
              return { style: { backgroundColor } };
            }}
          />
        </div>
      </div>

      {/* Separador */}
      <div style={styles.divider} />

      {/* Secciones en columnas */}
      <div style={styles.columnsContainer}>
        {/* Columna izquierda - Contacto y Alarmas */}
        <div style={styles.leftColumn}>
          <div style={styles.section}>
            <div style={styles.contactCard}> 
              <div style={styles.contactName}>Contacto de Emergencia</div>
              <div style={styles.contactInfo}>
                <div style={styles.contactName}>Ana Torres</div>
                <div style={styles.contactPhone}>Tel: +34 612 345 678</div>
              </div>
              <div style={styles.contactNote}>
                Se le notificará a este contacto en caso de omitir la toma de medicamentos.
              </div>
            </div>
          </div>
          
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <FaBell style={styles.sectionIcon} />
              <h2 style={styles.sectionTitle}>Próximas Alarmas</h2>
            </div>
            <div style={styles.alarmsList}>
              {alarmasActivas.map((alarma, index) => (
                <div key={index} style={styles.alarmItem}>
                  <div style={styles.alarmTime}>
                    {format(alarma.proximaAlarma, "HH:mm")}
                  </div>
                  <div style={styles.alarmContent}>
                    <div style={styles.alarmMedName}>
                      {alarma.medicamento.nombre}
                    </div>
                    <div style={styles.alarmDetails}>
                      {alarma.medicamento.dosis} • {alarma.medicamento.frecuencia}
                    </div>
                  </div>
                </div>
              ))}
              
              {alarmasActivas.length === 0 && (
                <div style={styles.noAlarms}>
                  No hay alarmas programadas
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Medicamentos */}
        <div style={styles.rightColumn}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h1 style={styles.sectionTitle}>Medicamentos</h1>
            </div>
            
            {/* Vista de tarjetas para móviles */}
            <div style={styles.medicationsCards}>
              {medicamentos.map((med, index) => (
                <div key={med.id} style={styles.medCard}>
                  <div style={styles.medCardHeader}>
                    <div style={styles.medCardName}>{med.nombre}</div>
                    <div style={styles.medCardActions}>
                      <button 
                        style={styles.actionButton} 
                        onClick={() => editarMedicamento(index)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        style={styles.actionButton} 
                        onClick={() => eliminarMedicamento(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div style={styles.medCardDetails}>
                    <div><strong>Tipo:</strong> {med.tipo}</div>
                    <div><strong>Dosis:</strong> {med.dosis}</div>
                    <div><strong>Frecuencia:</strong> {med.frecuencia}</div>
                    <div><strong>Duración:</strong> {med.duracion}</div>
                    <div><strong>Próxima dosis:</strong> {format(med.horaInicio, "dd/MM HH:mm")}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Vista de tabla para escritorio */}
            <div style={styles.tableContainer}>
              <div style={styles.medicationsTable}>
                <div style={styles.tableRow}>
                  <div style={styles.tableHeader}>Medicamento</div>
                  <div style={styles.tableHeader}>Dosis</div>
                  <div style={styles.tableHeader}>Frecuencia</div>
                  <div style={styles.tableHeader}>Próxima</div>
                  <div style={styles.tableHeader}>Acciones</div>
                </div>
                
                {medicamentos.map((med, index) => (
                  <div key={med.id} style={styles.tableRow}>
                    <div style={styles.tableCell}>
                      <div style={styles.medName}>{med.nombre}</div>
                      <div style={styles.medType}>{med.tipo}</div>
                    </div>
                    <div style={styles.tableCell}>{med.dosis}</div>
                    <div style={styles.tableCell}>{med.frecuencia}</div>
                    <div style={styles.tableCell}>{format(med.horaInicio, "dd/MM HH:mm")}</div>
                    <div style={styles.actionsCell}>
                      <button 
                        style={styles.actionButton} 
                        onClick={() => editarMedicamento(index)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        style={styles.actionButton} 
                        onClick={() => eliminarMedicamento(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Agregar flotante solo para móviles */}
      <div style={styles.floatingButtonContainer}>
        <button 
          style={styles.floatingButton}
          onClick={() => setModalAbierto(true)}
        >
          <FaPlus style={styles.floatingButtonIcon} />
        </button>
      </div>
      
      {/* Modal para agregar/editar medicamentos */}
      {modalAbierto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editando !== null ? 'Editar Medicamento' : 'Nuevo Medicamento'}
              </h2>
              <button 
                style={styles.closeButton}
                onClick={() => {
                  setModalAbierto(false);
                  setEditando(null);
                  setFormulario({
                    nombre: '',
                    tipo: '',
                    dosis: '',
                    frecuencia: '',
                    duracion: '',
                    horaInicio: new Date()
                  });
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Nombre del Medicamento</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                style={styles.input}
                placeholder="Ej: Paracetamol"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Tipo</label>
              <select
                name="tipo"
                value={formulario.tipo}
                onChange={manejarCambio}
                style={styles.input}
              >
                <option value="">Seleccione un tipo</option>
                <option value="Tableta">Tableta</option>
                <option value="Cápsula">Cápsula</option>
                <option value="Jarabe">Jarabe</option>
                <option value="Inyección">Inyección</option>
                <option value="Pomada">Pomada</option>
                <option value="Supositorio">Supositorio</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Dosis</label>
              <input
                type="text"
                name="dosis"
                value={formulario.dosis}
                onChange={manejarCambio}
                style={styles.input}
                placeholder="Ej: 500 mg, 10 ml"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Frecuencia</label>
              <select
                name="frecuencia"
                value={formulario.frecuencia}
                onChange={manejarCambio}
                style={styles.input}
              >
                <option value="">Seleccione frecuencia</option>
                <option value="cada 8 horas">Cada 8 horas</option>
                <option value="cada 12 horas">Cada 12 horas</option>
                <option value="cada 24 horas">Cada 24 horas</option>
                <option value="2 veces al día">2 veces al día</option>
                <option value="3 veces al día">3 veces al día</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Duración del Tratamiento</label>
              <select
                name="duracion"
                value={formulario.duracion}
                onChange={manejarCambio}
                style={styles.input}
              >
                <option value="">Seleccione duración</option>
                <option value="3 días">3 días</option>
                <option value="5 días">5 días</option>
                <option value="7 días">7 días</option>
                <option value="10 días">10 días</option>
                <option value="14 días">14 días</option>
                <option value="Indefinido">Indefinido</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Hora de la Primera Dosis</label>
              <input
                type="datetime-local"
                value={format(formulario.horaInicio, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => manejarCambioHora(new Date(e.target.value))}
                style={styles.input}
              />
            </div>
            
            <div style={styles.modalActions}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setModalAbierto(false);
                  setEditando(null);
                  setFormulario({
                    nombre: '',
                    tipo: '',
                    dosis: '',
                    frecuencia: '',
                    duracion: '',
                    horaInicio: new Date()
                  });
                }}
              >
                Cancelar
              </button>
              <button 
                style={styles.saveButton}
                onClick={guardarMedicamento}
              >
                {editando !== null ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de alarma activa */}
      {alarmaModal.visible && (
        <div style={styles.alarmModalOverlay}>
          <div style={styles.alarmModal}>
            <div style={styles.alarmModalHeader}>
              <FaBell style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '20px' }} />
              <h2 style={styles.alarmModalTitle}>¡Recordatorio de Medicamento!</h2>
            </div>
            
            <div style={styles.alarmModalContent}>
              <div style={styles.alarmMedInfo}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {alarmaModal.medicamento.nombre}
                </div>
                <div style={{ fontSize: '1.2rem', margin: '10px 0' }}>
                  {alarmaModal.medicamento.dosis} - {alarmaModal.medicamento.tipo}
                </div>
                <div>
                  Hora programada: {format(alarmaModal.hora, "HH:mm")}
                </div>
              </div>
              
              <div style={styles.alarmActions}>
                <button 
                  style={styles.snoozeButton}
                  onClick={() => {
                    // Posponer la alarma 5 minutos
                    const nuevaHora = new Date(alarmaModal.hora);
                    nuevaHora.setMinutes(nuevaHora.getMinutes() + 5);
                    
                    // Detener sonido
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    }
                    
                    // Crear nueva alarma
                    const timeoutId = setTimeout(() => {
                      setAlarmaModal({
                        visible: true,
                        medicamento: alarmaModal.medicamento,
                        hora: nuevaHora
                      });
                    }, 5 * 60 * 1000);
                    
                    // Guardar referencia
                    alarmTimeouts.current[`${alarmaModal.medicamento.id}-snooze`] = timeoutId;
                    
                    // Cerrar modal actual
                    setAlarmaModal({ visible: false, medicamento: null, hora: null });
                  }}
                >
                  Posponer (5 min)
                </button>
                <button 
                  style={styles.dismissButton}
                  onClick={() => {
                    // Detener sonido y cerrar modal
                    if (audioRef.current) {
                      audioRef.current.pause();
                      audioRef.current.currentTime = 0;
                    }
                    setAlarmaModal({ visible: false, medicamento: null, hora: null });
                  }}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Estilos completamente responsivos
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '10px',
  },
  registerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '1rem',
    color: '#3498db',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '10px 15px',
    backgroundColor: '#e8f4fc',
    borderRadius: '30px',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#d1e8f7',
      transform: 'translateY(-2px)',
    },
  },
  addIcon: {
    fontSize: '1rem',
  },
  section: {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  sectionIcon: {
    color: '#3498db',
    fontSize: '1.5rem',
    marginRight: '10px',
  },
  sectionTitle: {
    color: '#2c3e50',
    marginTop: '0',
    fontSize: '1.3rem',
    marginBottom: '0',
  },
  divider: {
    height: '1px',
    background: '#e0e0e0',
    border: 'none',
    margin: '20px 0',
  },
  columnsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '20px',
  },
  leftColumn: {
    flex: 1,
    minWidth: 0,
  },
  rightColumn: {
    flex: 1,
    minWidth: 0,
  },
  contactCard: {
    backgroundColor: '#e8f4fc',
    padding: '20px',
    borderRadius: '12px',
    borderLeft: '4px solid #3498db',
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginBottom: '10px',
    color: '#2c3e50',
  },
  contactInfo: {
    marginBottom: '15px',
  },
  contactPhone: {
    color: '#3498db',
    fontWeight: '500',
  },
  contactNote: {
    color: '#555',
    fontSize: '0.9rem',
    lineHeight: '1.4',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#2980b9',
    },
  },
  // Estilos para alarmas
  alarmsList: {
    marginTop: '10px',
  },
  alarmItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#fff8e1',
    borderRadius: '10px',
    marginBottom: '10px',
    borderLeft: '4px solid #ffc107',
  },
  alarmTime: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#e74c3c',
    minWidth: '60px',
    textAlign: 'center',
  },
  alarmContent: {
    flex: 1,
  },
  alarmMedName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '5px',
  },
  alarmDetails: {
    color: '#555',
    fontSize: '0.9rem',
  },
  noAlarms: {
    textAlign: 'center',
    padding: '15px',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  // Vista de tarjetas para móviles
  medicationsCards: {
    display: 'block',
  },
  medCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  medCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  medCardName: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#2c3e50',
  },
  medCardActions: {
    display: 'flex',
    gap: '5px',
  },
  medCardDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '8px',
    fontSize: '0.9rem',
  },
  // Vista de tabla para escritorio
  tableContainer: {
    display: 'none',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  medicationsTable: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '600px',
  },
  tableRow: {
    display: 'flex',
    borderBottom: '1px solid #e0e0e0',
    '&:last-child': {
      borderBottom: 'none',
    },
    '&:nth-child(odd)': {
      backgroundColor: '#f9f9f9',
    },
    '&:hover': {
      backgroundColor: '#f0f8ff',
    },
  },
  tableHeader: {
    flex: 1,
    padding: '12px 15px',
    backgroundColor: '#2c3e50',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    minWidth: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.9rem',
  },
  tableCell: {
    flex: 1,
    padding: '12px 15px',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    minWidth: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '0.9rem',
  },
  medName: {
    fontWeight: 'bold',
  },
  medType: {
    fontSize: '0.8rem',
    color: '#7f8c8d',
  },
  actionsCell: {
    flex: '0 0 100px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    color: '#3498db',
    padding: '6px',
    transition: 'all 0.2s',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      color: '#2980b9',
      backgroundColor: '#f0f8ff',
    },
  },
  // Botón flotante solo para móviles
  floatingButtonContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 10,
    display: 'block',
  },
  floatingButton: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    border: 'none',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: '#2980b9',
      transform: 'scale(1.05)',
    },
  },
  floatingButtonIcon: {
    color: 'white',
    fontSize: '1.5rem',
  },
  calendarContainer: {
    marginTop: '20px',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
  },
  calendarWrapper: {
    height: '350px',
  },
  // Estilos para modales
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(3px)',
    padding: '15px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(to right, #3498db, #2ecc71)',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'rotate(90deg)',
    },
  },
  formGroup: {
    padding: '15px 20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '1rem',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'all 0.3s',
    '&:focus': {
      outline: 'none',
      borderColor: '#3498db',
      boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.2)',
    },
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '15px 20px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #eee',
    gap: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#c0392b',
    },
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#27ae60',
    },
  },
  // Estilos para el modal de alarma
  alarmModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
    backdropFilter: 'blur(5px)',
    padding: '15px',
  },
  alarmModal: {
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 0 0 10px rgba(231, 76, 60, 0.5)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    padding: '25px',
    animation: 'pulse 1.5s infinite',
  },
  alarmModalHeader: {
    marginBottom: '20px',
  },
  alarmModalTitle: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  alarmModalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  alarmMedInfo: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    border: '2px solid #ffeb3b',
  },
  alarmActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  snoozeButton: {
    padding: '10px 20px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#f57c00',
    },
  },
  dismissButton: {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  // Animación para el modal de alarma
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(231, 76, 60, 0.7)',
    },
    '70%': {
      boxShadow: '0 0 0 15px rgba(231, 76, 60, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(231, 76, 60, 0)',
    },
  },
  
  // Media Queries para diferentes tamaños de pantalla
  '@media (min-width: 576px)': {
    container: {
      padding: '20px',
    },
    section: {
      padding: '20px',
    },
    calendarContainer: {
      padding: '20px',
    },
    contactCard: {
      padding: '25px',
    },
    modal: {
      width: '500px',
    },
  },
  
  '@media (min-width: 768px)': {
    columnsContainer: {
      flexDirection: 'row',
    },
    leftColumn: {
      flex: '0 0 35%',
      maxWidth: '35%',
    },
    medicationsCards: {
      display: 'none',
    },
    tableContainer: {
      display: 'block',
    },
    floatingButtonContainer: {
      display: 'none',
    },
    calendarWrapper: {
      height: '400px',
    },
  },
  
  '@media (min-width: 992px)': {
    container: {
      padding: '25px',
    },
    calendarWrapper: {
      height: '450px',
    },
  },
  
  '@media (max-width: 576px)': {
    sectionTitle: {
      fontSize: '1.2rem',
    },
    contactName: {
      fontSize: '1.1rem',
    },
    alarmTime: {
      fontSize: '1.3rem',
    },
    alarmMedName: {
      fontSize: '1rem',
    },
    modalTitle: {
      fontSize: '1.3rem',
    },
    modalHeader: {
      padding: '15px',
    },
  },
};

// Función para aplicar media queries
const applyMediaQueries = (styles) => {
  const finalStyles = { ...styles };
  
  Object.keys(styles).forEach(key => {
    if (typeof styles[key] === 'object' && styles[key]['@media']) {
      const mediaStyles = styles[key]['@media'];
      delete finalStyles[key]['@media'];
      
      Object.keys(mediaStyles).forEach(mediaQuery => {
        const mediaStyle = mediaStyles[mediaQuery];
        if (!finalStyles[`@media ${mediaQuery}`]) {
          finalStyles[`@media ${mediaQuery}`] = {};
        }
        finalStyles[`@media ${mediaQuery}`][key] = {
          ...(finalStyles[`@media ${mediaQuery}`][key] || {}),
          ...mediaStyle
        };
      });
    }
  });
  
  return finalStyles;
};

export default Inicio;