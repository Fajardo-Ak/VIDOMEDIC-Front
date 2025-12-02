import React, { useState, useEffect } from 'react';
import { FiPlus, FiChevronLeft, FiChevronRight, FiCalendar, FiEdit, FiTrash2, FiBell } from 'react-icons/fi';
import './Inicio.css';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, endOfWeek } from 'date-fns';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../../api/axiosConfig'; 
import { urlBase64ToUint8Array } from '../../../utils/webPush';
import AsyncCreatableSelect from 'react-select/async-creatable';

//LAVE PUBLICA PARA VAPID
const VAPID_PUBLIC_KEY = "BBp5sxQTwf2X7MjnLy3MONkT6Q1Da9Wg0rysED26QkO28CnXSQkPtp5SNxKRfqjGbQ9Vct4OipnunZNMeAtT7-k";
// --- CONFIGURACIÓN DEL LOCALIZER ---
const locales = {
  'es': es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: es }),
  getDay,
  locales,
});

// --- ESTADO INICIAL PARA EL FORMULARIO ---
const estadoInicialFormulario = {
  nombre_tratamiento: '',
  fecha_inicio: new Date().toISOString().split('T')[0],
  fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  notas: '',
  medicamentos: [
    {
      medicamento_id: null,            
      medicamento_nombre: '',         
      via_administracion: 'Oral',
      presentacion: '',
      importancia: 'media',
      es_nuevo: true,                 

      tipo_frecuencia: 'horarios_fijos',
      valor_frecuencia: 8,
      horarios_fijos: ['08:00', '14:00', '20:00'],
      dias_semana: [],
      cantidad_por_toma: '',
    }
  ]
};

const Inicio = () => {
  const [semanaActual, setSemanaActual] = useState(new Date());
  const [dosisSemana, setDosisSemana] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalTratamiento, setModalTratamiento] = useState(false);
  const [tratamientoActivo, setTratamientoActivo] = useState(null);

  const [editId, setEditId] = useState(null); 
  const [tratamientoData, setTratamientoData] = useState(estadoInicialFormulario);
  const [guardando, setGuardando] = useState(false);

  // --- 3. FUNCIÓN PARA ACTIVAR NOTIFICACIONES VAPID ---
  const activarNotificaciones = async () => {
    // A) Pedir permiso al usuario
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
        alert('Debes permitir las notificaciones para recibir alertas.');
        return;
    }

    try {
        // B) Registrar el Service Worker (sw.js)
        const registration = await navigator.serviceWorker.register('/sw.js');
        await navigator.serviceWorker.ready;

        // C) Suscribirse a Google/Mozilla
        const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
        let subscription;

        try {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            });
        } catch (error) {
            // Manejo de error por cambio de llaves (Tu lógica original mejorada)
            console.warn('Posible cambio de llave VAPID, reintentando...', error);
            const oldSubscription = await registration.pushManager.getSubscription();
            if (oldSubscription) {
                await oldSubscription.unsubscribe();
            }
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            });
        }

        // D) Enviar la suscripción a TU Backend Laravel
        // Usamos api.post para que envíe el Token de Auth automáticamente
        await api.post('/notifications/subscribe', subscription);

        alert('¡Notificaciones activadas! Ahora recibirás alertas incluso con la app cerrada.');

    } catch (error) {
        console.error('Error al activar notificaciones:', error);
        alert('Error técnico al activar. Revisa la consola (F12).');
    }
  };

  // --- OBTENER DOSIS SEMANA ---
  const obtenerDosisSemana = async (fechaInicio, fechaFin) => {
    setCargando(true);
    try {
      const params = new URLSearchParams({
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0],
      });

      const response = await api.get(`/dosis/agenda-semanal?${params}`);
      const data = response.data;

      if (data.success) {
        const eventosParseados = data.data.dosis.map(dosis => ({
          ...dosis,
          start: new Date(dosis.start),
          end: new Date(dosis.end),
        }));
        setDosisSemana(eventosParseados);

        if (tratamientoActivo === null) {
          const tratamientoResponse = await api.get('/tratamientos/verificar-activo');
          const tratamientoDataResp = tratamientoResponse.data;
          if (tratamientoDataResp.success) {
            setTratamientoActivo(tratamientoDataResp.tratamiento);
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

  useEffect(() => {
    const inicioSemana = startOfWeek(semanaActual, { locale: es });
    const finSemana = endOfWeek(semanaActual, { locale: es });
    obtenerDosisSemana(inicioSemana, finSemana);
  }, [semanaActual]);

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

  const handleNavigate = (newDate) => {
    setSemanaActual(newDate);
  };

  const handleSelectEvent = (dosis) => {
    marcarDosis(dosis.id, dosis.estado !== 'tomada');
  };

  const marcarDosis = async (dosisId, estado) => {
    try {
      const response = await api.put(`/dosis/${dosisId}/marcar`, {
        estado: estado ? 'tomada' : 'omitida',
        notas_toma: estado ? 'Tomada correctamente' : 'Omitida'
      });

      const data = response.data;

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
        alert(data.error || 'Error al marcar la dosis');
      }
    } catch (error) {
      console.error('Error' ,error);
    }
  };

  // --- MODAL: nuevo / modificar ---
  const abrirModalNuevo = () => {
    setTratamientoData(estadoInicialFormulario);
    setEditId(null);
    setModalTratamiento(true);
  };

  const abrirModalModificar = () => {
    if (!tratamientoActivo) return;

    const datosFormulario = {
      nombre_tratamiento: tratamientoActivo.nombre_tratamiento,
      fecha_inicio: tratamientoActivo.fecha_inicio ? tratamientoActivo.fecha_inicio.split('T')[0] : new Date().toISOString().split('T')[0],
      fecha_fin: tratamientoActivo.fecha_fin ? tratamientoActivo.fecha_fin.split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notas: tratamientoActivo.notas || '',
      medicamentos: (tratamientoActivo.detalle_tratamientos || []).map(det => ({
        medicamento_id: det.medicamento_id ?? null,
        medicamento_nombre: det.medicamento ? (det.medicamento.nombre || '') : '',
        via_administracion: det.medicamento ? (det.medicamento.via_administracion || 'Oral') : 'Oral',
        presentacion: det.medicamento ? (det.medicamento.presentacion || '') : '',
        importancia: det.medicamento ? (det.medicamento.importancia || 'media') : 'media',
        es_nuevo: false, 

        tipo_frecuencia: det.tipo_frecuencia,
        valor_frecuencia: det.valor_frecuencia,
        horarios_fijos: det.horarios_fijos ? (() => {
          try { return JSON.parse(det.horarios_fijos); } catch (e) { return Array.isArray(det.horarios_fijos) ? det.horarios_fijos : []; }
        })() : [],
        dias_semana: det.dias_semana ? (() => {
          try { return JSON.parse(det.dias_semana); } catch (e) { return Array.isArray(det.dias_semana) ? det.dias_semana : []; }
        })() : [],
        cantidad_por_toma: det.cantidad_por_toma,
      }))
    };

    if (!datosFormulario.medicamentos || datosFormulario.medicamentos.length === 0) {
      datosFormulario.medicamentos = estadoInicialFormulario.medicamentos;
    }

    setTratamientoData(datosFormulario);
    setEditId(tratamientoActivo.id);
    setModalTratamiento(true);
  };

  const cerrarModal = () => {
    setModalTratamiento(false);
    setEditId(null);
  };

  const guardarTratamiento = async () => {
    if (!tratamientoData.nombre_tratamiento || !tratamientoData.nombre_tratamiento.trim()) {
      alert('Por favor ingresa un nombre para el tratamiento');
      return;
    }
    if (!tratamientoData.fecha_inicio || !tratamientoData.fecha_fin) {
      alert('Por favor ingresa fechas de inicio y fin válidas');
      return;
    }
    if (!tratamientoData.medicamentos || tratamientoData.medicamentos.length === 0) {
      alert('Por favor agrega al menos un medicamento');
      return;
    }

    setGuardando(true);

    if (editId) {
      await actualizarTratamiento();
    } else {
      await crearTratamiento();
    }

    setGuardando(false);
  };

  const crearTratamiento = async () => {
    try {
      const response = await api.post('/tratamientos', tratamientoData);
      const data = response.data;

      if (data.success) {
        alert('Tratamiento creado exitosamente!');
        cerrarModal();

        const inicioSemana = startOfWeek(semanaActual, { locale: es });
        const finSemana = endOfWeek(semanaActual, { locale: es });
        await obtenerDosisSemana(inicioSemana, finSemana);

        setTratamientoActivo(data.data);
        setTratamientoData(estadoInicialFormulario);
      } else {
        alert('Error al crear tratamiento: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al guardar el tratamiento');
    }
  };

  const actualizarTratamiento = async () => {
    try {
      const response = await api.put(`/tratamientos/${editId}`, tratamientoData);
      const data = response.data;

      if (data.success) {
        alert('Tratamiento actualizado exitosamente!');
        cerrarModal();

        const inicioSemana = startOfWeek(semanaActual, { locale: es });
        const finSemana = endOfWeek(semanaActual, { locale: es });
        await obtenerDosisSemana(inicioSemana, finSemana);

        setTratamientoActivo(data.data);
      } else {
        alert('Error al actualizar tratamiento: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al actualizar el tratamiento');
    }
  };

  const eliminarTratamiento = async () => {
    if (!tratamientoActivo) return;

    if (!window.confirm('¿Estás seguro de que quieres eliminar este tratamiento? Se eliminarán todas las dosis programadas.')) {
      return;
    }

    try {
      const response = await api.delete(`/tratamientos/${tratamientoActivo.id}`);
      const data = response.data;

      if (data.success) {
        alert('Tratamiento eliminado correctamente');
        setTratamientoActivo(null);

        const inicioSemana = startOfWeek(semanaActual, { locale: es });
        const finSemana = endOfWeek(semanaActual, { locale: es });
        await obtenerDosisSemana(inicioSemana, finSemana);
      } else {
        alert('Error al eliminar tratamiento: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al eliminar el tratamiento');
    }
  };

  const loadOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }
    try {
      const response = await api.get(`/medicamentos/buscar?q=${encodeURIComponent(inputValue)}`);
      const data = response.data;

      if (data.success) {
        return data.data.map(med => ({
          value: med, 
          label: `${med.nombre}${med.presentacion ? ` (${med.presentacion})` : ''}`
        }));
      }
      return [];
    } catch (error) {
      console.error('Error buscando medicamentos:', error);
      return [];
    }
  };

  const handleMedicamentoChange = (opcionSeleccionada, index) => {
    const nuevosMedicamentos = [...tratamientoData.medicamentos];
    const medActual = nuevosMedicamentos[index] || {};

    if (!opcionSeleccionada) {
      nuevosMedicamentos[index] = {
        ...medActual,
        medicamento_id: null,
        medicamento_nombre: '',
        via_administracion: 'Oral',
        presentacion: '',
        importancia: 'media',
        es_nuevo: true,
      };
    } else if (opcionSeleccionada.__isNew__) {
      nuevosMedicamentos[index] = {
        ...medActual,
        medicamento_id: null,
        medicamento_nombre: opcionSeleccionada.label,
        via_administracion: 'Oral',
        presentacion: '',
        importancia: 'media',
        es_nuevo: true,
      };
    } else {
      const medExistente = opcionSeleccionada.value;
      nuevosMedicamentos[index] = {
        ...medActual,
        medicamento_id: medExistente.id ?? medExistente.id,
        medicamento_nombre: medExistente.nombre ?? (medExistente.nombre_completo || ''),
        via_administracion: medExistente.via_administracion ?? 'Oral',
        presentacion: medExistente.presentacion ?? '',
        importancia: medExistente.importancia ?? 'media',
        es_nuevo: false,
      };
    }

    setTratamientoData({
      ...tratamientoData,
      medicamentos: nuevosMedicamentos
    });
  };

  const actualizarMedicamento = (index, campo, valor) => {
    const nuevosMedicamentos = [...tratamientoData.medicamentos];
    nuevosMedicamentos[index] = {
      ...nuevosMedicamentos[index],
      [campo]: valor
    };
    setTratamientoData({
      ...tratamientoData,
      medicamentos: nuevosMedicamentos
    });
  };

  const agregarMedicamento = () => {
    setTratamientoData({
      ...tratamientoData,
      medicamentos: [
        ...tratamientoData.medicamentos,
        estadoInicialFormulario.medicamentos[0]
      ]
    });
  };

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

  const eventPropGetter = (event) => {
    const esTomada = event.estado === 'tomada';
    const esOmitida = event.estado === 'omitida';
    const esPasada = new Date(event.start) < new Date() && event.estado === 'pendiente';
    let backgroundColor = event.color || '#F59E0B';

    if (esTomada) {
      backgroundColor = '#9CA3AF';
    } else if (esOmitida) {
      backgroundColor = '#EF4444';
    } else if (esPasada) {
      backgroundColor = '#6B7280';
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
  const formats = {
    timeGutterFormat: (date, culture, local) => local.format(date, 'h a', culture),
    eventTimeRangeFormat: ({ start }, culture, local) => local.format(start, 'h:mm a', culture)
  };

  return (
    <div className="vidomedic-agenda">
      {/* Header */}
      <div className="agenda-header-custom">
        <div className="header-left">
          <div className="agenda-title-custom">
            <FiCalendar /> Mi Agenda de Medicamentos
          </div>
          {diasSemana.length > 0 && (
            <div className="semana-rango">
              {diasSemana[0].toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} -{' '}
              {diasSemana[6].toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
        </div>

        <div className="header-controls">
          {/* BOTÓN DE ACTIVAR NOTIFICACIONES VAPID */}
          <button 
              onClick={activarNotificaciones} 
              style={{ padding: '8px 15px', background: '#F59E0B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '10px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}
            >
             <FiBell /> Activar Alertas
          </button>
          
          <div className="nav-buttons">
            <button onClick={semanaAnterior} className="nav-btn"><FiChevronLeft /></button>
            <button onClick={irAHoy} className="today-btn">Hoy</button>
            <button onClick={semanaSiguiente} className="nav-btn"><FiChevronRight /></button>
          </div>

          {tratamientoActivo ? (
            <div className="tratamiento-activo-buttons">
              <span className="tratamiento-activo-info">
                Tratamiento activo: <strong>{tratamientoActivo.nombre_tratamiento}</strong>
              </span>
              <button className="edit-treatment-btn" onClick={abrirModalModificar}>
                <FiEdit /> Modificar
              </button>
              <button className="delete-treatment-btn" onClick={eliminarTratamiento}>
                <FiTrash2 /> Eliminar
              </button>
            </div>
          ) : (
            <button
              className="create-treatment-btn"
              onClick={abrirModalNuevo}
            >
              <FiPlus /> Nuevo Tratamiento
            </button>
          )}
        </div>
      </div>

      {/* Calendario */}
      <div className="calendar-container" style={{ height: '75vh' }}>
        <Calendar
          localizer={localizer}
          events={dosisSemana}
          startAccessor="start"
          endAccessor="end"
          culture="es"
          views={['week', 'day']}
          defaultView="week"
          date={semanaActual}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          toolbar={false}
          eventPropGetter={eventPropGetter}
          min={new Date(0, 0, 0, 0, 0, 0)}
          max={new Date(0, 0, 0, 23, 59, 0)}
          formats={formats}
        />
      </div>

      {/* Modal */}
      {modalTratamiento && (
        <div
          className="config-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cerrarModal();
            }
          }}
        >
          <div className="config-modal tratamiento-modal expanded-modal">
            <div className="config-modal-header">
              <h3>{editId ? "Modificar Tratamiento" : "Nuevo Tratamiento"}</h3>
            </div>

            <div className="tratamiento-form">
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

              {/* Medicamentos */}
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

                {tratamientoData.medicamentos.map((medicamento, index) => (
                  <div key={index} className="medicamento-row expanded-row">
                    <div className="medicamento-fields">
                      <div className="form-group">
                        <label>Medicamento *</label>
                        <AsyncCreatableSelect
                          key={`med-select-${index}`}
                          isClearable
                          value={
                            medicamento.es_nuevo || !medicamento.medicamento_id
                              ? (medicamento.medicamento_nombre ? { label: medicamento.medicamento_nombre, value: { nombre: medicamento.medicamento_nombre, id: null, presentacion: medicamento.presentacion, via_administracion: medicamento.via_administracion, importancia: medicamento.importancia } } : null)
                              : { value: { id: medicamento.medicamento_id, nombre: medicamento.medicamento_nombre, presentacion: medicamento.presentacion, via_administracion: medicamento.via_administracion, importancia: medicamento.importancia }, label: `${medicamento.medicamento_nombre}${medicamento.presentacion ? ` (${medicamento.presentacion})` : ''}` }
                          }
                          placeholder="Escribe para buscar o crear..."
                          loadOptions={loadOptions}
                          onChange={(opcion) => handleMedicamentoChange(opcion, index)}
                          formatCreateLabel={(inputValue) => `Crear "${inputValue}"`}
                        />
                      </div>

                      <div className="form-group">
                        <label>Vía de Administración *</label>
                        <select
                          className="modal-input"
                          value={medicamento.via_administracion}
                          onChange={(e) => actualizarMedicamento(index, 'via_administracion', e.target.value)}
                          disabled={!medicamento.es_nuevo}
                        >
                          <option value="Oral">Oral</option>
                          <option value="Inyectable">Inyectable</option>
                          <option value="Tópica">Tópica</option>
                          <option value="Oftálmica">Oftálmica</option>
                          <option value="Ótica">Ótica</option>
                          <option value="Nasal">Nasal</option>
                          <option value="Rectal">Rectal</option>
                          <option value="Vaginal">Vaginal</option>
                          <option value="Inhalada">Inhalada</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Presentación (ej: 500mg, 10ml)</label>
                        <input
                          type="text"
                          className="modal-input"
                          placeholder="Ej: 500mg"
                          value={medicamento.presentacion}
                          onChange={(e) => actualizarMedicamento(index, 'presentacion', e.target.value)}
                          disabled={!medicamento.es_nuevo}
                        />
                      </div>

                      <div className="form-group">
                        <label>Importancia *</label>
                        <select
                          className="modal-input"
                          value={medicamento.importancia}
                          onChange={(e) => actualizarMedicamento(index, 'importancia', e.target.value)}
                          disabled={!medicamento.es_nuevo}
                        >
                          <option value="baja">Baja</option>
                          <option value="media">Media</option>
                          <option value="alta">Alta</option>
                          <option value="critica">Crítica</option>
                        </select>
                      </div>

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

                      {(medicamento.tipo_frecuencia === 'horarios_fijos' || medicamento.tipo_frecuencia === 'semanal') && (
                        <div className="form-group full-width">
                          <label>Horarios</label>
                          <div className="horarios-input">
                            <input
                              type="text"
                              className="modal-input"
                              placeholder="Ej: 08:00,14:00,20:00"
                              value={medicamento.horarios_fijos?.join(',') || ''}
                              onChange={(e) => actualizarMedicamento(index, 'horarios_fijos', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            />
                            <small>Separar horarios con comas (formato: HH:MM)</small>
                          </div>
                        </div>
                      )}

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
                    </div>

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

              <div className="modal-buttons">
                <button
                  className="cancel-button"
                  onClick={cerrarModal}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  className="save-button"
                  onClick={guardarTratamiento}
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : (editId ? "Actualizar" : "Guardar Tratamiento")}
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