import React, { useState, useEffect } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight, FiCalendar, FiCheck, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, endOfWeek } from 'date-fns';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Inicio.css';

// --- CONFIGURACIÓN DEL LOCALIZER ---
const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: es }), // Asegurar que la semana empiece en Lunes
  getDay,
  locales,
});

const Inicio = () => {
  const [semanaActual, setSemanaActual] = useState(new Date());
  const [dosisSemana, setDosisSemana] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalTratamiento, setModalTratamiento] = useState(false);
  const [tratamientoActivo, setTratamientoActivo] = useState(null);

  // --- OBTENER DOSIS ---
  const obtenerDosisSemana = async (fechaInicio, fechaFin) => {
    setCargando(true);
    try {
      const params = new URLSearchParams({
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0], 
      });
    
      const response = await fetch(`http://localhost:8000/api/dosis/agenda-semanal?${params}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Los datos ya vienen listos para el calendario
        // convertimos los "starts" y "end" que son strings
        // en objetos Date que react-big-calendar pueda entender.
        const eventosParseados = data.data.dosis.map(dosis => ({
          ...dosis, // Copia todas las propiedades (id, title, estado...)
          start: new Date(dosis.start), // Convierte el string 'start' en un objeto Date
          end: new Date(dosis.end),     // Convierte el string 'end' en un objeto Date
        }));

        setDosisSemana(eventosParseados); //guarda el array con los objetos Date correctos
        
        if (tratamientoActivo === null) { 
          const tratamientoResponse = await fetch('http://localhost:8000/api/tratamientos/verificar-activo', {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          });
          const tratamientoData = await tratamientoResponse.json();
          if (tratamientoData.success) {
            setTratamientoActivo(tratamientoData.tratamiento);
          }
        }
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  // --- USE EFFECT  ---
  // Se dispara cada vez que `semanaActual` cambia
  useEffect(() => {
    const inicioSemana = startOfWeek(semanaActual, { locale: es });
    const finSemana = endOfWeek(semanaActual, { locale: es });
    obtenerDosisSemana(inicioSemana, finSemana);
  }, [semanaActual]); 

  // Se dispara solo una vez al montar
  useEffect(() => {
    cargarMedicamentosCatalogo();
  }, []); 

  // --- NAVEGACIÓN  ---
  const semanaAnterior = () => {
    const nuevaSemana = new Date(semanaActual);
    nuevaSemana.setDate(nuevaSemana.getDate() - 7);
    setSemanaActual(nuevaSemana);
  };

  const semanaSiguiente = () => {
    const nuevaSemana = new Date(semanaActual);
    nuevaSemana.setDate(nuevaSemana.getDate() + 7);
    setSemanaActual(nuevaSemana);
  };

  const irAHoy = () => {
    setSemanaActual(new Date());
  };

  // --- HANDLERS DEL CALENDARIO  ---
  const handleNavigate = (newDate) => {
    setSemanaActual(newDate);
  };

  const handleSelectEvent = (dosis) => {
    marcarDosis(dosis.id, dosis.estado !== 'tomada');
  };

  // --- MARCAR DOSIS ---
  const marcarDosis = async (dosisId, estado) => {
    try {
      const response = await fetch(`http://localhost:8000/api/dosis/${dosisId}/marcar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ 
          estado: estado ? 'tomada' : 'omitida',
          notas_toma: estado ? 'Tomada correctamente' : 'Omitida'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDosisSemana(prevDosis => 
          prevDosis.map(dosis => 
            dosis.id === dosisId ? { 
              ...dosis, 
              estado: estado ? 'tomada' : 'omitida',
              tomada: estado 
            } : dosis
          )
        );
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --- LÓGICA DEL MODAL ---
  const [tratamientoData, setTratamientoData] = useState({
    nombre_tratamiento: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notas: '',
    medicamentos: [
      {
        medicamento_id: '',
        tipo_frecuencia: 'horarios_fijos',
        valor_frecuencia: 8,
        horarios_fijos: ['08:00', '14:00', '20:00'],
        dias_semana: [],
        cantidad_por_toma: '',
        instrucciones: ''
      }
    ]
  });

  const [guardando, setGuardando] = useState(false);
  const [medicamentosCatalogo, setMedicamentosCatalogo] = useState([]);

  const cargarMedicamentosCatalogo = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/medicamentos', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setMedicamentosCatalogo(data.data);
      }
    } catch (error) {
      console.error('Error cargando medicamentos:', error);
    }
  };

  const guardarTratamiento = async () => {
    if (!tratamientoData.nombre_tratamiento.trim()) {
      alert('Por favor ingresa un nombre para el tratamiento');
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch('http://localhost:8000/api/tratamientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(tratamientoData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Tratamiento creado exitosamente!');
        setModalTratamiento(false);
        
        // --- RECARGAR DATOS DESPUÉS DE GUARDAR ---
        // Llama a la función con el rango de la semana actual
        const inicioSemana = startOfWeek(semanaActual, { locale: es });
        const finSemana = endOfWeek(semanaActual, { locale: es });
        await obtenerDosisSemana(inicioSemana, finSemana);
        
        setTratamientoActivo(data.data); // Asumimos que el nuevo tratamiento es el activo
        
        // Limpiar formulario
        setTratamientoData({
        });
      } else {
        alert('Error al crear tratamiento: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al guardar el tratamiento');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarTratamiento = async () => {
    if (!tratamientoActivo) return;
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar este tratamiento? Se eliminarán todas las dosis programadas.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/tratamientos/${tratamientoActivo.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Tratamiento eliminado correctamente');
        setTratamientoActivo(null);
        // --- RECARGAR DATOS DESPUÉS DE ELIMINAR ---
        const inicioSemana = startOfWeek(semanaActual, { locale: es });
        const finSemana = endOfWeek(semanaActual, { locale: es });
        await obtenerDosisSemana(inicioSemana, finSemana);
      } else {
        alert('Error al eliminar tratamiento: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al eliminar el tratamiento');
    }
  };

  // Actualizar medicamento en el formulario
  const actualizarMedicamento = (index, campo, valor) => {
    const nuevosMedicamentos = [...tratamientoData.medicamentos];
    nuevosMedicamentos[index][campo] = valor;
    setTratamientoData({
      ...tratamientoData,
      medicamentos: nuevosMedicamentos
    });
  };
  
  // Agregar nuevo medicamento al formulario
  const agregarMedicamento = () => {
    setTratamientoData({
      ...tratamientoData,
      medicamentos: [
        ...tratamientoData.medicamentos,
        {
          medicamento_id: '',
          tipo_frecuencia: 'horarios_fijos',
          valor_frecuencia: 8,
          horarios_fijos: ['08:00', '14:00', '20:00'],
          dias_semana: [],
          cantidad_por_toma: '',
          instrucciones: ''
        }
      ]
    });
  };

  // Eliminar medicamento del formulario
  const eliminarMedicamento = (index) => {
    const nuevosMedicamentos = tratamientoData.medicamentos.filter((_, i) => i !== index);
    setTratamientoData({
      ...tratamientoData,
      medicamentos: nuevosMedicamentos
    });
  };

  const getDiasSemana = () => {
    const dias = [];
    const inicioSemana = startOfWeek(semanaActual, { locale: es });
    
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      dias.push(fecha);
    }
    return dias;
  };
  
  // (Para dar estilo a los eventos del calendario)
  const eventPropGetter = (event) => {
    const esTomada = event.estado === 'tomada';
    const esOmitida = event.estado === 'omitida';
    const esPasada = new Date(event.start) < new Date() && event.estado === 'pendiente';

    let backgroundColor = event.color || '#F59E0B'; // Color por defecto (importancia)
    
    if (esTomada) {
      backgroundColor = '#9CA3AF'; // Gris
    } else if (esOmitida) {
      backgroundColor = '#EF4444'; // Rojo
    } else if (esPasada) {
      backgroundColor = '#6B7280'; // Gris oscuro
    }

    return {
      style: {
        backgroundColor,
        borderColor: backgroundColor,
        opacity: esTomada ? 0.7 : 1,
      },
    };
  };

  const diasSemana = getDiasSemana();

  // 1. Definimos los formatos AM/PM
  const formats = {
    /**
     * Formato para la barra lateral (la "canaleta" de horas)
     * 'h a' = '1 am', '2 am'...
     */
    timeGutterFormat: (date, culture, local) =>
      local.format(date, 'h a', culture),

    /**
     * Formato para la hora DENTRO de un evento
     * 'h:mm a' = '1:00 PM'
     */
    eventTimeRangeFormat: ({ start }, culture, local) =>
      local.format(start, 'h:mm a', culture)
  };

  return (
    <div className="vidomedic-agenda">
      <div className="agenda-header-custom">
        <div className="header-left">
          <div className="agenda-title-custom">
            <FiCalendar /> Mi Agenda de Medicamentos
          </div>
          {/* Se asegura que diasSemana tenga datos antes de renderizar */}
          {diasSemana.length > 0 && ( 
            <div className="semana-rango">
              {diasSemana[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - 
              {diasSemana[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
        </div>
        
        <div className="header-controls">
          <div className="nav-buttons">
            <button onClick={semanaAnterior} className="nav-btn">
              <FiChevronLeft />
            </button>
            <button onClick={irAHoy} className="today-btn">
              Hoy
            </button>
            <button onClick={semanaSiguiente} className="nav-btn">
              <FiChevronRight />
            </button>
          </div>

          {tratamientoActivo ? (
            <div className="tratamiento-activo-buttons">
              <span className="tratamiento-activo-info">
                Tratamiento activo: <strong>{tratamientoActivo.nombre_tratamiento}</strong>
              </span>
              <button className="edit-treatment-btn">
                <FiEdit /> Modificar
              </button>
              <button className="delete-treatment-btn" onClick={eliminarTratamiento}>
                <FiTrash2 /> Eliminar
              </button>
            </div>
          ) : (
            <button 
              className="create-treatment-btn"
              onClick={() => setModalTratamiento(true)}
            >
              <FiPlus /> Nuevo Tratamiento
            </button>
          )}
        </div>
      </div>

      {/* 2. AÑADIMOS EL NUEVO CONTENEDOR Y CALENDARIO */}
      <div className="calendar-container" style={{ height: '75vh' }}>
        <Calendar
          localizer={localizer}
          events={dosisSemana}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          views={['week', 'day']} // Solo vista de semana y día
          defaultView="week"
          date={semanaActual} // Sincroniza la vista del calendario con el estado
          onNavigate={handleNavigate} // Se activa si el usuario navega en el calendario
          onSelectEvent={handleSelectEvent} // Se activa al hacer clic en una dosis
          toolbar={false} // ¡Oculta la barra de navegación propia del calendario!
          eventPropGetter={eventPropGetter} // Aplica estilos dinámicos
          min={new Date(0, 0, 0, 0, 0, 0)} // Opcional: Empezar el día a las 00:00 AM
          max={new Date(0, 0, 0, 23, 59, 0)} // Opcional: Terminar el día a las 23:59 PM
          formats={formats}
        />
      </div>

      {/* --- MODAL --- */}
      {modalTratamiento && (
        <div 
          className="config-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalTratamiento(false);
            }
          }}
        >
          <div className="config-modal tratamiento-modal expanded-modal">
            <div className="config-modal-header">
              <h3>Nuevo Tratamiento</h3>
            </div>
            
            <div className="tratamiento-form">
              {/* SECCIÓN 1: INFORMACIÓN GLOBAL */}
              <div className="form-section">
                <h4>Información del Tratamiento</h4>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Nombre del Tratamiento *</label>
                    <input 
                      type="text"
                      className="modal-input"
                      placeholder="Ej: Tratamiento para gripe, Control de presión..."
                      value={tratamientoData.nombre_tratamiento}
                      onChange={(e) => setTratamientoData({
                        ...tratamientoData,
                        nombre_tratamiento: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input 
                      type="date"
                      className="modal-input"
                      value={tratamientoData.fecha_inicio}
                      onChange={(e) => setTratamientoData({
                        ...tratamientoData,
                        fecha_inicio: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Fecha de Fin *</label>
                    <input 
                      type="date"
                      className="modal-input"
                      value={tratamientoData.fecha_fin}
                      onChange={(e) => setTratamientoData({
                        ...tratamientoData,
                        fecha_fin: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Notas (opcional)</label>
                    <textarea 
                      className="modal-input"
                      placeholder="Instrucciones adicionales, observaciones..."
                      value={tratamientoData.notas}
                      onChange={(e) => setTratamientoData({
                        ...tratamientoData,
                        notas: e.target.value
                      })}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              
              {/* SECCIÓN 2: MEDICAMENTOS */}
              <div className="form-section">
                <div className="medicamentos-header">
                  <h4>Medicamentos</h4>
                  <button 
                    type="button"
                    className="add-medicamento-btn"
                    onClick={agregarMedicamento}
                  >
                    <FiPlus /> Agregar Medicamento
                  </button>
                </div>

                {/* LISTA DE MEDICAMENTOS */}
                {tratamientoData.medicamentos.map((medicamento, index) => (
                  <div key={index} className="medicamento-row expanded-row">
                    <div className="medicamento-fields">
                      
                      {/* SELECCIÓN DE MEDICAMENTO */}
                      <div className="form-group">
                        <label>Medicamento *</label>
                        <select 
                          className="modal-input"
                          value={medicamento.medicamento_id}
                          onChange={(e) => actualizarMedicamento(index, 'medicamento_id', e.target.value)}
                        >
                          <option value="">Seleccionar medicamento</option>
                          {medicamentosCatalogo.map(med => (
                            <option key={med.id} value={med.id}>
                              {med.nombre} {med.presentacion ? `(${med.presentacion})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* TIPO DE FRECUENCIA */}
                      <div className="form-group">
                        <label>Tipo de Frecuencia</label>
                        <select 
                          className="modal-input"
                          value={medicamento.tipo_frecuencia}
                          onChange={(e) => actualizarMedicamento(index, 'tipo_frecuencia', e.target.value)}
                        >
                          <option value="horarios_fijos">Horarios Fijos</option>
                          <option value="horas">Cada X Horas</option>
                          <option value="dias">Cada X Días</option>
                          <option value="semanal">Días de la Semana</option>
                        </select>
                      </div>

                      {/* CONFIGURACIÓN SEGÚN TIPO DE FRECUENCIA */}
                      {medicamento.tipo_frecuencia === 'horas' && (
                        <>
                          <div className="form-group">
                            <label>Cada cuántas horas</label>
                            <input 
                              type="number"
                              min="1"
                              max="24"
                              className="modal-input"
                              value={medicamento.valor_frecuencia || 8}
                              onChange={(e) => actualizarMedicamento(index, 'valor_frecuencia', parseInt(e.target.value))}
                            />
                          </div>
                          
                          <div className="form-group">
                            <label>Hora de primera toma</label>
                            <input 
                              type="time"
                              className="modal-input"
                              value={medicamento.horarios_fijos ? (medicamento.horarios_fijos[0] || '08:00') : '08:00'}
                              onChange={(e) => actualizarMedicamento(index, 'horarios_fijos', [e.target.value])}
                            />
                          </div>
                        </>
                      )}

                      {medicamento.tipo_frecuencia === 'dias' && (
                        <div className="form-group">
                          <label>Cada cuántos días</label>
                          <input 
                            type="number"
                            min="1"
                            className="modal-input"
                            value={medicamento.valor_frecuencia || 1}
                            onChange={(e) => actualizarMedicamento(index, 'valor_frecuencia', parseInt(e.target.value))}
                          />
                        </div>
                      )}

                      {/* HORARIOS FIJOS */}
                      {(medicamento.tipo_frecuencia === 'horarios_fijos' || medicamento.tipo_frecuencia === 'semanal') && (
                        <div className="form-group full-width">
                          <label>Horarios</label>
                          <div className="horarios-input">
                            <input 
                              type="text"
                              className="modal-input"
                              placeholder="Ej: 08:00,14:00,20:00"
                              value={medicamento.horarios_fijos?.join(',') || ''}
                              onChange={(e) => actualizarMedicamento(index, 'horarios_fijos', e.target.value.split(','))}
                            />
                            <small>Separar horarios con comas (formato: HH:MM)</small>
                          </div>
                        </div>
                      )}

                      {/* DÍAS DE LA SEMANA */}
                      {medicamento.tipo_frecuencia === 'semanal' && (
                        <div className="form-group full-width">
                          <label>Días de la semana</label>
                          <div className="dias-semana-checkboxes">
                            {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(dia => (
                              <label key={dia} className="checkbox-label">
                                <input 
                                  type="checkbox"
                                  checked={medicamento.dias_semana?.includes(dia) || false}
                                  onChange={(e) => {
                                    const nuevosDias = e.target.checked
                                      ? [...(medicamento.dias_semana || []), dia]
                                      : (medicamento.dias_semana || []).filter(d => d !== dia);
                                    actualizarMedicamento(index, 'dias_semana', nuevosDias);
                                  }}
                                />
                                {dia.charAt(0).toUpperCase() + dia.slice(1)}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CANTIDAD POR TOMA */}
                      <div className="form-group">
                        <label>Cantidad por toma *</label>
                        <input 
                          type="text"
                          className="modal-input"
                          placeholder="Ej: 1 tableta, 15ml, 2 gotas"
                          value={medicamento.cantidad_por_toma}
                          onChange={(e) => actualizarMedicamento(index, 'cantidad_por_toma', e.target.value)}
                        />
                      </div>

                      {/* INSTRUCCIONES ESPECIALES */}
                      <div className="form-group full-width">
                        <label>Instrucciones (opcional)</label>
                        <input 
                          type="text"
                          className="modal-input"
                          placeholder="Ej: Tomar con comida, No manejar..."
                          value={medicamento.instrucciones}
                          onChange={(e) => actualizarMedicamento(index, 'instrucciones', e.target.value)}
                        />
                      </div>

                    </div>

                    {/* BOTÓN ELIMINAR */}
                    {tratamientoData.medicamentos.length > 1 && (
                      <button 
                        type="button"
                        className="remove-medicamento-btn"
                        onClick={() => eliminarMedicamento(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {/* BOTONES */}
              <div className="modal-buttons">
                <button 
                  className="cancel-button"
                  onClick={() => setModalTratamiento(false)}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button 
                  className="save-button" 
                  onClick={guardarTratamiento}
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar Tratamiento"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inicio;