import React, { useState, useEffect } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight, FiCalendar, FiCheck } from 'react-icons/fi';
import './Inicio.css';

const Inicio = () => {
  const [semanaActual, setSemanaActual] = useState(new Date());
  const [dosisSemana, setDosisSemana] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalTratamiento, setModalTratamiento] = useState(false);

  // Horario completo (24 horas)
  const horasDelDia = Array.from({ length: 24 }, (_, i) => i);

  // Función para obtener fecha actual en formato datetime-local
  const obtenerFechaActual = () => {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    
    return `${año}-${mes}-${dia}T${horas}:${minutos}`;
  };

  // Función para obtener fecha fin por defecto (7 días después)
  const obtenerFechaFinDefault = () => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 7);
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    
    return `${año}-${mes}-${dia}`;
  };

  // Obtener dosis de la semana
  const obtenerDosisSemana = async (fechaInicio = null) => {
    setCargando(true);
    try {
      const fecha = fechaInicio || semanaActual;
      const inicioSemana = new Date(fecha);
      inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
      
      const params = new URLSearchParams({
        fecha_inicio: inicioSemana.toISOString().split('T')[0]
      });

      const response = await fetch(`http://localhost:8000/api/agenda/semana?${params}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDosisSemana(data.data.dosis);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  // Navegación entre semanas
  const semanaAnterior = () => {
    const nuevaSemana = new Date(semanaActual);
    nuevaSemana.setDate(nuevaSemana.getDate() - 7);
    setSemanaActual(nuevaSemana);
    obtenerDosisSemana(nuevaSemana);
  };

  const semanaSiguiente = () => {
    const nuevaSemana = new Date(semanaActual);
    nuevaSemana.setDate(nuevaSemana.getDate() + 7);
    setSemanaActual(nuevaSemana);
    obtenerDosisSemana(nuevaSemana);
  };

  const irAHoy = () => {
    const hoy = new Date();
    setSemanaActual(hoy);
    obtenerDosisSemana(hoy);
  };

  // Marcar dosis como tomada/pendiente
  const marcarDosis = async (dosisId, tomada) => {
    try {
      const response = await fetch(`http://localhost:8000/api/dosis/${dosisId}/marcar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ tomada })
      });

      const data = await response.json();
      
      if (data.success) {
        setDosisSemana(prevDosis => 
          prevDosis.map(dosis => 
            dosis.id === dosisId ? { ...dosis, tomada } : dosis
          )
        );
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Obtener dosis por día y hora
  const getDosisPorDiaYHora = (dia, hora) => {
    return dosisSemana.filter(dosis => {
      const fechaDosis = new Date(dosis.fecha_hora);
      return fechaDosis.getDay() === dia && fechaDosis.getHours() === hora;
    });
  };

  // Generar días de la semana
  const getDiasSemana = () => {
    const dias = [];
    const inicioSemana = new Date(semanaActual);
    inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
    
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      dias.push(fecha);
    }
    return dias;
  };

  // Estados para el modal de tratamiento
  const [tratamientoData, setTratamientoData] = useState({
    fecha_inicio: obtenerFechaActual(),
    fecha_fin: obtenerFechaFinDefault(),
    importancia: 'Media',
    frecuencia: {
      tipo: 'horas',
      valor: 8,
      inicio: '08:00'
    },
    notas: '',
    medicamentos: [
      {
        nombre: '',
        cantidad_por_toma: '',
        instrucciones: ''
      }
    ]
  });

  const [guardando, setGuardando] = useState(false);
  const [medicamentosSugeridos, setMedicamentosSugeridos] = useState([]);
  const [buscandoMedicamentos, setBuscandoMedicamentos] = useState(false);

  // Función para calcular horarios en tiempo real
  const calcularHorarios = () => {
    if (!tratamientoData.fecha_inicio || !tratamientoData.frecuencia.inicio) {
      return [];
    }

    const horarios = [];
    const { tipo, valor, inicio } = tratamientoData.frecuencia;

    if (tipo === 'horas') {
      const fechaBase = new Date(tratamientoData.fecha_inicio);
      const [hora, minuto] = inicio.split(':').map(Number);
      
      fechaBase.setHours(hora, minuto, 0, 0);

      for (let i = 0; i < 4; i++) {
        const nuevaFecha = new Date(fechaBase);
        nuevaFecha.setHours(nuevaFecha.getHours() + (valor * i));
        
        horarios.push(
          nuevaFecha.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        );
      }
    }

    return horarios;
  };

  // Función para buscar medicamentos (autocomplete)
  const buscarMedicamentos = async (busqueda) => {
    if (busqueda.length < 2) {
      setMedicamentosSugeridos([]);
      return;
    }

    setBuscandoMedicamentos(true);
    try {
      const response = await fetch(`http://localhost:8000/api/medicamentos/buscar?q=${encodeURIComponent(busqueda)}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMedicamentosSugeridos(data.data);
      }
    } catch (error) {
      console.error('Error buscando medicamentos:', error);
    } finally {
      setBuscandoMedicamentos(false);
    }
  };

  // Función para guardar tratamiento completo
  const guardarTratamiento = async () => {
    if (!tratamientoData.fecha_inicio || !tratamientoData.fecha_fin) {
      alert('Por favor completa las fechas de inicio y fin');
      return;
    }

    if (tratamientoData.medicamentos.length === 0) {
      alert('Debes agregar al menos un medicamento');
      return;
    }

    const medicamentosInvalidos = tratamientoData.medicamentos.filter(med => 
      !med.nombre.trim() || !med.cantidad_por_toma.trim()
    );

    if (medicamentosInvalidos.length > 0) {
      alert('Todos los medicamentos deben tener nombre y cantidad por toma');
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
        await obtenerDosisSemana();
        
        // Limpiar formulario
        setTratamientoData({
          fecha_inicio: obtenerFechaActual(),
          fecha_fin: obtenerFechaFinDefault(),
          importancia: 'Media',
          frecuencia: {
            tipo: 'horas',
            valor: 8,
            inicio: '08:00'
          },
          notas: '',
          medicamentos: [
            {
              nombre: '',
              cantidad_por_toma: '',
              instrucciones: ''
            }
          ]
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

  // Formateadores
  const formatearDia = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { weekday: 'short' });
  };

  const formatearFecha = (fecha) => {
    return fecha.getDate();
  };

  const formatearHora = (hora) => {
    return `${hora}:00`;
  };

  const esHoy = (fecha) => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  };

  const esFinDeSemana = (fecha) => {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6;
  };

  // Cargar datos al iniciar
  useEffect(() => {
    obtenerDosisSemana();
  }, []);

  const diasSemana = getDiasSemana();

  return (
    <div className="vidomedic-agenda">
      {/* Header personalizado */}
      <div className="agenda-header-custom">
        <div className="header-left">
          <div className="agenda-title-custom">
            <FiCalendar /> Mi Agenda de Medicamentos
          </div>
          <div className="semana-rango">
            {diasSemana[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - 
            {diasSemana[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
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

          <button 
            className="create-treatment-btn"
            onClick={() => setModalTratamiento(true)}
          >
            <FiPlus /> Nuevo Tratamiento
          </button>
        </div>
      </div>

      {/* Grid del calendario*/}
      <div className="calendar-grid-custom">
        {/* Columna de horas */}
        <div className="time-column-custom">
          <div className="time-header"></div>
          {horasDelDia.map(hora => (
            <div key={hora} className="time-slot-custom">
              <span className="hour-label">{formatearHora(hora)}</span>
            </div>
          ))}
        </div>

        {/* Columnas de días */}
        {diasSemana.map((fecha, diaIndex) => (
          <div key={diaIndex} className={`day-column-custom ${esFinDeSemana(fecha) ? 'weekend-day' : ''}`}>
            {/* Header del día */}
            <div className={`day-header-custom ${esHoy(fecha) ? 'today-header' : ''}`}>
              <div className="day-name">{formatearDia(fecha)}</div>
              <div className={`day-number ${esHoy(fecha) ? 'today-number' : ''}`}>
                {formatearFecha(fecha)}
              </div>
            </div>

            {/* Celdas de tiempo */}
            {horasDelDia.map(hora => (
              <div key={hora} className="time-cell-custom">
                {/* Línea horizontal para separar horas */}
                <div className="hour-line"></div>
                
                {/* Eventos/dosis para esta celda */}
                {getDosisPorDiaYHora(diaIndex, hora).map(dosis => (
                  <div 
                    key={dosis.id}
                    className={`medication-event ${
                      dosis.tratamiento_medicamento?.tratamiento?.importancia?.toLowerCase() || 'media'
                    } ${dosis.tomada ? 'event-completed' : ''}`}
                    onClick={() => marcarDosis(dosis.id, !dosis.tomada)}
                  >
                    <div className="event-time">
                      {new Date(dosis.fecha_hora).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="event-med-name">
                      {dosis.tratamiento_medicamento?.medicamento?.nombre}
                    </div>
                    <div className="event-dosage">
                      {dosis.tratamiento_medicamento?.cantidad_por_toma}
                    </div>
                    {dosis.tomada && (
                      <div className="event-status">
                        <FiCheck />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal de Nuevo Tratamiento */}
      {modalTratamiento && (
        <div 
          className="config-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalTratamiento(false);
            }
          }}
        >
          <div className="config-modal tratamiento-modal">
            <div className="config-modal-header">
              <h3>Nuevo Tratamiento</h3>
            </div>
            
            <div className="tratamiento-form">
              {/* SECCIÓN 1: INFORMACIÓN GLOBAL */}
              <div className="form-section">
                <h4>Información del Tratamiento</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input 
                      type="datetime-local"
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
                  <div className="form-group">
                    <label>Importancia</label>
                    <select 
                      className="modal-input"
                      value={tratamientoData.importancia}
                      onChange={(e) => setTratamientoData({
                        ...tratamientoData,
                        importancia: e.target.value
                      })}
                    >
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* SECCIÓN 2: FRECUENCIA */}
              <div className="form-section">
                <h4>Frecuencia y Horarios</h4>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Frecuencia</label>
                    <select 
                      className="modal-input"
                      value={tratamientoData.frecuencia.tipo}
                      onChange={(e) => setTratamientoData({
                        ...tratamientoData,
                        frecuencia: {
                          ...tratamientoData.frecuencia,
                          tipo: e.target.value
                        }
                      })}
                    >
                      <option value="horas">Cada X horas</option>
                      <option value="dias_semana">Días específicos</option>
                    </select>
                  </div>
                </div>

                {/* FRECUENCIA POR HORAS */}
                {tratamientoData.frecuencia.tipo === 'horas' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Cada cuántas horas</label>
                      <input 
                        type="number"
                        min="1"
                        max="24"
                        className="modal-input"
                        value={tratamientoData.frecuencia.valor}
                        onChange={(e) => setTratamientoData({
                          ...tratamientoData,
                          frecuencia: {
                            ...tratamientoData.frecuencia,
                            valor: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Hora de inicio</label>
                      <input 
                        type="time"
                        className="modal-input"
                        value={tratamientoData.frecuencia.inicio}
                        onChange={(e) => setTratamientoData({
                          ...tratamientoData,
                          frecuencia: {
                            ...tratamientoData.frecuencia,
                            inicio: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                )}

                {/* VISUALIZADOR DE HORARIOS EN TIEMPO REAL */}
                <div className="horarios-preview">
                  <label>Próximas tomas calculadas:</label>
                  <div className="horarios-list">
                    {calcularHorarios().map((horario, index) => (
                      <span key={index} className="horario-item">
                        {horario}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* SECCIÓN 3: MEDICAMENTOS */}
              <div className="form-section">
                <div className="medicamentos-header">
                  <h4>Medicamentos</h4>
                  <button 
                    type="button"
                    className="add-medicamento-btn"
                    onClick={() => setTratamientoData({
                      ...tratamientoData,
                      medicamentos: [
                        ...tratamientoData.medicamentos,
                        { nombre: '', cantidad_por_toma: '', instrucciones: '' }
                      ]
                    })}
                  >
                    <FiPlus /> Agregar Medicamento
                  </button>
                </div>

                {/* LISTA DE MEDICAMENTOS */}
                {tratamientoData.medicamentos.map((medicamento, index) => {
                  const actualizarMedicamento = (campo, valor) => {
                    const nuevosMedicamentos = [...tratamientoData.medicamentos];
                    nuevosMedicamentos[index][campo] = valor;
                    setTratamientoData({
                      ...tratamientoData,
                      medicamentos: nuevosMedicamentos
                    });

                    if (campo === 'nombre' && valor.length >= 2) {
                      buscarMedicamentos(valor);
                    }
                  };

                  return (
                    <div key={index} className="medicamento-row">
                      <div className="medicamento-fields">
                        
                        {/* NOMBRE DEL MEDICAMENTO */}
                        <div className="form-group">
                          <label>Medicamento *</label>
                          <input 
                            type="text"
                            className="modal-input"
                            placeholder="Buscar o escribir nuevo medicamento..."
                            value={medicamento.nombre}
                            onChange={(e) => actualizarMedicamento('nombre', e.target.value)}
                            list="medicamentos-sugeridos"
                          />
                          <datalist id="medicamentos-sugeridos">
                            {medicamentosSugeridos.map(med => (
                              <option key={med.id} value={med.nombre}>
                                {med.presentacion ? `${med.nombre} (${med.presentacion})` : med.nombre}
                              </option>
                            ))}
                          </datalist>
                          {buscandoMedicamentos && (
                            <div className="buscando-texto">Buscando medicamentos...</div>
                          )}
                        </div>

                        {/* CANTIDAD POR TOMA */}
                        <div className="form-group">
                          <label>Cantidad por toma *</label>
                          <input 
                            type="text"
                            className="modal-input"
                            placeholder="Ej: 1 tableta, 15ml, 2 gotas"
                            value={medicamento.cantidad_por_toma}
                            onChange={(e) => actualizarMedicamento('cantidad_por_toma', e.target.value)}
                          />
                        </div>

                        {/* INSTRUCCIONES ESPECIALES */}
                        <div className="form-group">
                          <label>Instrucciones (opcional)</label>
                          <input 
                            type="text"
                            className="modal-input"
                            placeholder="Ej: Tomar con comida, No manejar..."
                            value={medicamento.instrucciones}
                            onChange={(e) => actualizarMedicamento('instrucciones', e.target.value)}
                          />
                        </div>

                      </div>

                      {/* BOTÓN ELIMINAR */}
                      {tratamientoData.medicamentos.length > 1 && (
                        <button 
                          type="button"
                          className="remove-medicamento-btn"
                          onClick={() => {
                            const nuevosMedicamentos = tratamientoData.medicamentos.filter((_, i) => i !== index);
                            setTratamientoData({
                              ...tratamientoData,
                              medicamentos: nuevosMedicamentos
                            });
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
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