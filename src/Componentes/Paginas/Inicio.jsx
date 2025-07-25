// src/components/paginas/Inicio.jsx
import { FaChevronDown, FaEdit, FaTrash, FaPlus, FaTimes, FaBell } from 'react-icons/fa';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import esES from 'date-fns/locale/es';
import addHours from 'date-fns/addHours';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

const Inicio = () => {
  // Estado para controlar la visibilidad del modal
  const [modalAbierto, setModalAbierto] = useState(false);
  
  // Estado para almacenar medicamentos
  const [medicamentos, setMedicamentos] = useState([
    { 
      id: 1, 
      nombre: 'Telmisartán', 
      tipo: 'Tableta', 
      dosis: '40 mg', 
      frecuencia: 'cada 24 horas', 
      duracion: '7 días',
      horaInicio: new Date(2025, 6, 25, 8, 0) // Fecha de inicio
    },
    { 
      id: 2, 
      nombre: 'Paracetamol', 
      tipo: 'Tableta', 
      dosis: '500 mg', 
      frecuencia: 'cada 8 horas', 
      duracion: '5 días',
      horaInicio: new Date(2025, 6, 25, 9, 0)
    },
    { 
      id: 3, 
      nombre: 'Insulina', 
      tipo: 'Inyección', 
      dosis: '10 UI', 
      frecuencia: '2 veces al día', 
      duracion: 'Indefinido',
      horaInicio: new Date(2025, 6, 25, 12, 0)
    },
  ]);
  
  // Estado para el formulario de medicamentos
  const [formulario, setFormulario] = useState({
    nombre: '',
    tipo: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    horaInicio: new Date()
  });
  
  // Estado para identificar si estamos editando un medicamento
  const [editando, setEditando] = useState(null);
  
  // Estado para eventos del calendario
  const [eventos, setEventos] = useState([]);
  
  // Estado para alarmas activas
  const [alarmasActivas, setAlarmasActivas] = useState([]);
  
  // Referencia para los timeouts de alarmas
  const alarmTimeouts = useRef({});
  
  // Referencia para el audio de alarma
  const audioRef = useRef(null);
  
  // Estado para mostrar modal de alarma
  const [alarmaModal, setAlarmaModal] = useState({
    visible: false,
    medicamento: null,
    hora: null
  });
  
  // Estado para el formato de vista del calendario
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  
  // Solicitar permiso para notificaciones al cargar el componente
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("Permiso para notificaciones concedido");
        }
      });
    }
    
    // Crear elemento de audio
    audioRef.current = new Audio();
    audioRef.current.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=="; // Sonido base64
    audioRef.current.loop = true;
    
    // Limpiar al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Función para manejar cambios en el formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };
  
  // Función para manejar cambio de hora
  const manejarCambioHora = (date) => {
    setFormulario(prev => ({ ...prev, horaInicio: date }));
  };
  
  // Función para guardar el medicamento
  const guardarMedicamento = () => {
    if (editando !== null) {
      // Editar medicamento existente
      const nuevosMedicamentos = [...medicamentos];
      nuevosMedicamentos[editando] = formulario;
      setMedicamentos(nuevosMedicamentos);
      setEditando(null);
    } else {
      // Agregar nuevo medicamento
      const nuevoMedicamento = {
        ...formulario,
        id: medicamentos.length > 0 ? Math.max(...medicamentos.map(m => m.id)) + 1 : 1
      };
      setMedicamentos([...medicamentos, nuevoMedicamento]);
    }
    
    // Limpiar formulario y cerrar modal
    setFormulario({
      nombre: '',
      tipo: '',
      dosis: '',
      frecuencia: '',
      duracion: '',
      horaInicio: new Date()
    });
    setModalAbierto(false);
  };
  
  // Función para editar un medicamento
  const editarMedicamento = (index) => {
    setFormulario(medicamentos[index]);
    setEditando(index);
    setModalAbierto(true);
  };
  
  // Función para eliminar un medicamento
  const eliminarMedicamento = (index) => {
    const nuevosMedicamentos = [...medicamentos];
    nuevosMedicamentos.splice(index, 1);
    setMedicamentos(nuevosMedicamentos);
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
        <div style={styles.registerLink} onClick={() => setModalAbierto(true)}>Registrar Medicamento</div>
      </div>

      {/* Sección Calendario */}
      <div style={{ height: 500, marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#2c3e50', marginTop: 0, marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #3498db' }}>
          Calendario de Medicamentos
        </h2>
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 400 }}
          view={view}
          date={date}
          onView={view => setView(view)}
          onNavigate={date => setDate(date)}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda"
          }}
          eventPropGetter={(event) => {
            const backgroundColor = event.tipo === 'medicamento' ? '#3498db' : '#2ecc71';
            return { style: { backgroundColor } };
          }}
        />
      </div>

      {/* Separador */}
      <div style={styles.divider} />

      {/* Secciones en columnas */}
      <div style={styles.columnsContainer}>
        {/* Columna izquierda - Contacto y Alarmas */}
        <div style={styles.column}>
          <div style={styles.section}>
            <div style={styles.contactName}>Contacto</div>
            <div style={styles.contactCard}> 
              <div style={styles.contactName}>Ana Torres</div>
              <div style={styles.contactNote}>
                Nota: Se le notificará a este contacto en caso de omitir la toma de la dosis.
              </div>
            </div>
          </div>
          
          <div style={{ ...styles.section, marginTop: '20px' }}>
            <h2 style={styles.title}>Próximas Alarmas</h2>
            <div style={styles.alarmsList}>
              {alarmasActivas.map((alarma, index) => (
                <div key={index} style={styles.alarmItem}>
                  <FaBell style={{ color: '#e74c3c', fontSize: '1.5rem', marginRight: '15px' }} />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {alarma.medicamento.nombre} ({alarma.medicamento.dosis})
                    </div>
                    <div>
                      {format(alarma.proximaAlarma, "dd/MM/yyyy 'a las' HH:mm")}
                    </div>
                    <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                      {alarma.medicamento.frecuencia}
                    </div>
                  </div>
                </div>
              ))}
              
              {alarmasActivas.length === 0 && (
                <div style={styles.noAlarms}>
                  No hay alarmas programadas actualmente
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Medicamentos */}
        <div style={styles.column}>
          <div style={styles.section}>
            <h1 style={styles.title}>Medicamentos Registrados</h1>
            <div style={styles.medicationsTable}>
              <div style={styles.tableRow}>
                <div style={styles.tableHeader}>Nombre</div>
                <div style={styles.tableHeader}>Tipo</div>
                <div style={styles.tableHeader}>Dosis</div>
                <div style={styles.tableHeader}>Frecuencia</div>
                <div style={styles.tableHeader}>Duración</div>
                <div style={styles.tableHeader}>Acciones</div>
              </div>
              
              {medicamentos.map((med, index) => (
                <div key={med.id} style={styles.tableRow}>
                  <div style={styles.tableCell}>{med.nombre}</div>
                  <div style={styles.tableCell}>{med.tipo}</div>
                  <div style={styles.tableCell}>{med.dosis}</div>
                  <div style={styles.tableCell}>{med.frecuencia}</div>
                  <div style={styles.tableCell}>{med.duracion}</div>
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

      {/* Botón Agregar flotante */}
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
                {editando !== null ? 'Editar Medicamento' : 'Registrar Nuevo Medicamento'}
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

const locales = { es: esES };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Estilos actualizados
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #e0e0e0',
  },
  registerLink: {
    fontSize: '1.2rem',
    color: '#3498db',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '10px 20px',
    backgroundColor: '#e8f4fc',
    borderRadius: '6px',
    transition: 'all 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#d1e8f7',
      transform: 'translateY(-2px)',
    },
  },
  section: {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.08)',
  },
  title: {
    color: '#2c3e50',
    paddingBottom: '10px',
    marginTop: '0',
    fontSize: '1.5rem',
    marginBottom: '20px',
    borderBottom: '2px solid #3498db',
  },
  divider: {
    height: '2px',
    background: 'linear-gradient(to right, #3498db, #2ecc71)',
    border: 'none',
    margin: '30px 0',
  },
  columnsContainer: {
    display: 'flex',
    gap: '30px',
    marginBottom: '30px',
  },
  column: {
    flex: 1,
  },
  contactCard: {
    backgroundColor: '#e8f4fc',
    padding: '25px',
    borderRadius: '8px',
    borderLeft: '5px solid #3498db',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: '1.4rem',
    marginBottom: '15px',
    color: '#2c3e50',
  },
  contactNote: {
    color: '#555',
    fontStyle: 'italic',
    fontSize: '1rem',
    lineHeight: '1.5',
  },
  medicationsTable: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
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
    padding: '15px',
    backgroundColor: '#2c3e50',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tableCell: {
    flex: 1,
    padding: '15px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '1rem',
  },
  actionsCell: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minWidth: '100px',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#3498db',
    padding: '8px',
    transition: 'all 0.2s',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      color: '#2980b9',
      backgroundColor: '#f0f8ff',
    },
  },
  floatingButtonContainer: {
    position: 'fixed',
    bottom: '40px',
    right: '40px',
    zIndex: 10,
  },
  floatingButton: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
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
    fontSize: '2rem',
  },
  // Estilos para alarmas
  alarmsList: {
    marginTop: '15px',
  },
  alarmItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#fff8e1',
    borderRadius: '8px',
    marginBottom: '10px',
    borderLeft: '4px solid #ffc107',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: '#ffecb3',
      transform: 'translateX(5px)',
    },
  },
  noAlarms: {
    textAlign: 'center',
    padding: '20px',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  // Estilos para el modal de medicamentos
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
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    width: '500px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '25px',
    background: 'linear-gradient(to right, #3498db, #2ecc71)',
    color: 'white',
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.8rem',
    cursor: 'pointer',
    padding: '5px',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'rotate(90deg)',
    },
  },
  formGroup: {
    padding: '20px 25px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '1.1rem',
  },
  input: {
    width: '100%',
    padding: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1.1rem',
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
    padding: '20px 25px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #eee',
    gap: '15px',
  },
  cancelButton: {
    padding: '12px 25px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#c0392b',
      transform: 'translateY(-2px)',
    },
  },
  saveButton: {
    padding: '12px 25px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#27ae60',
      transform: 'translateY(-2px)',
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
  },
  alarmModal: {
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 0 0 10px rgba(231, 76, 60, 0.5)',
    width: '450px',
    maxWidth: '90%',
    textAlign: 'center',
    padding: '30px',
    animation: 'pulse 1.5s infinite',
  },
  alarmModalHeader: {
    marginBottom: '25px',
  },
  alarmModalTitle: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  alarmMedInfo: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '25px',
    border: '2px solid #ffeb3b',
  },
  alarmActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  snoozeButton: {
    padding: '12px 25px',
    backgroundColor: '#ff9800',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#f57c00',
      transform: 'translateY(-2px)',
    },
  },
  dismissButton: {
    padding: '12px 25px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: '#388e3c',
      transform: 'translateY(-2px)',
    },
  },
  // Animación para el modal de alarma
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(231, 76, 60, 0.7)',
    },
    '70%': {
      boxShadow: '0 0 0 20px rgba(231, 76, 60, 0)',
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(231, 76, 60, 0)',
    },
  },
};

export default Inicio;