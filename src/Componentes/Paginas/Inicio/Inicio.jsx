// src/components/paginas/Inicio.jsx
import { FaEdit, FaTrash, FaPlus, FaTimes, FaBell } from 'react-icons/fa';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay, addHours, differenceInMilliseconds } from 'date-fns';
import { es } from 'date-fns/locale';
import './Inicio.css'; // Importar el archivo CSS

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
    <div className="inicio-container">
      {/* Encabezado */}
      <div className="inicio-header">
        <div className="register-link" onClick={() => setModalAbierto(true)}>
          <FaPlus className="add-icon" />
          <span>Registrar Medicamento</span>
        </div>
      </div>

      {/* Sección Calendario */}
      <div className="calendar-container">
        <h2 className="section-title">
          Calendario de Medicamentos
        </h2>
        <div className="calendar-wrapper">
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
      <div className="divider" />

      {/* Secciones en columnas */}
      <div className="columns-container">
        {/* Columna izquierda - Contacto y Alarmas */}
        <div className="left-column">
          <div className="section">
            <div className="contact-card"> 
              <div className="contact-name">Contacto de Emergencia</div>
              <div className="contact-info">
                <div className="contact-name">Ana Torres</div>
                <div className="contact-phone">Tel: +34 612 345 678</div>
              </div>
              <div className="contact-note">
                Se le notificará a este contacto en caso de omitir la toma de medicamentos.
              </div>
            </div>
          </div>
          
          <div className="section">
            <div className="section-header">
              <FaBell className="section-icon" />
              <h2 className="section-title">Próximas Alarmas</h2>
            </div>
            <div className="alarms-list">
              {alarmasActivas.map((alarma, index) => (
                <div key={index} className="alarm-item">
                  <div className="alarm-time">
                    {format(alarma.proximaAlarma, "HH:mm")}
                  </div>
                  <div className="alarm-content">
                    <div className="alarm-med-name">
                      {alarma.medicamento.nombre}
                    </div>
                    <div className="alarm-details">
                      {alarma.medicamento.dosis} • {alarma.medicamento.frecuencia}
                    </div>
                  </div>
                </div>
              ))}
              
              {alarmasActivas.length === 0 && (
                <div className="no-alarms">
                  No hay alarmas programadas
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Medicamentos */}
        <div className="right-column">
          <div className="section">
            <div className="section-header">
              <h1 className="section-title">Medicamentos</h1>
            </div>
            
            {/* Vista de tarjetas para móviles */}
            <div className="medications-cards">
              {medicamentos.map((med, index) => (
                <div key={med.id} className="med-card">
                  <div className="med-card-header">
                    <div className="med-card-name">{med.nombre}</div>
                    <div className="med-card-actions">
                      <button 
                        className="action-button" 
                        onClick={() => editarMedicamento(index)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-button" 
                        onClick={() => eliminarMedicamento(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="med-card-details">
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
            <div className="table-container">
              <div className="medications-table">
                <div className="table-row">
                  <div className="table-header">Medicamento</div>
                  <div className="table-header">Dosis</div>
                  <div className="table-header">Frecuencia</div>
                  <div className="table-header">Próxima</div>
                  <div className="table-header">Acciones</div>
                </div>
                
                {medicamentos.map((med, index) => (
                  <div key={med.id} className="table-row">
                    <div className="table-cell">
                      <div className="med-name">{med.nombre}</div>
                      <div className="med-type">{med.tipo}</div>
                    </div>
                    <div className="table-cell">{med.dosis}</div>
                    <div className="table-cell">{med.frecuencia}</div>
                    <div className="table-cell">{format(med.horaInicio, "dd/MM HH:mm")}</div>
                    <div className="actions-cell">
                      <button 
                        className="action-button" 
                        onClick={() => editarMedicamento(index)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="action-button" 
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
      <div className="floating-button-container">
        <button 
          className="floating-button"
          onClick={() => setModalAbierto(true)}
        >
          <FaPlus className="floating-button-icon" />
        </button>
      </div>
      
      {/* Modal para agregar/editar medicamentos */}
      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editando !== null ? 'Editar Medicamento' : 'Nuevo Medicamento'}
              </h2>
              <button 
                className="close-button"
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
            
            <div className="form-group">
              <label className="label">Nombre del Medicamento</label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                className="input"
                placeholder="Ej: Paracetamol"
              />
            </div>
            
            <div className="form-group">
              <label className="label">Tipo</label>
              <select
                name="tipo"
                value={formulario.tipo}
                onChange={manejarCambio}
                className="input"
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
            
            <div className="form-group">
              <label className="label">Dosis</label>
              <input
                type="text"
                name="dosis"
                value={formulario.dosis}
                onChange={manejarCambio}
                className="input"
                placeholder="Ej: 500 mg, 10 ml"
              />
            </div>
            
            <div className="form-group">
              <label className="label">Frecuencia</label>
              <select
                name="frecuencia"
                value={formulario.frecuencia}
                onChange={manejarCambio}
                className="input"
              >
                <option value="">Seleccione frecuencia</option>
                <option value="cada 8 horas">Cada 8 horas</option>
                <option value="cada 12 horas">Cada 12 horas</option>
                <option value="cada 24 horas">Cada 24 horas</option>
                <option value="2 veces al día">2 veces al día</option>
                <option value="3 veces al día">3 veces al día</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="label">Duración del Tratamiento</label>
              <select
                name="duracion"
                value={formulario.duracion}
                onChange={manejarCambio}
                className="input"
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
            
            <div className="form-group">
              <label className="label">Hora de la Primera Dosis</label>
              <input
                type="datetime-local"
                value={format(formulario.horaInicio, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => manejarCambioHora(new Date(e.target.value))}
                className="input"
              />
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
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
                className="save-button"
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
        <div className="alarm-modal-overlay">
          <div className="alarm-modal">
            <div className="alarm-modal-header">
              <FaBell style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '20px' }} />
              <h2 className="alarm-modal-title">¡Recordatorio de Medicamento!</h2>
            </div>
            
            <div className="alarm-modal-content">
              <div className="alarm-med-info">
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
              
              <div className="alarm-actions">
                <button 
                  className="snooze-button"
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
                  className="dismiss-button"
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

export default Inicio;