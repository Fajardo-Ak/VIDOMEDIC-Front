import React, { useState, useEffect } from 'react';
import {
  FiPlus, FiChevronLeft, FiChevronRight,
  FiCalendar, FiCheck, FiEdit, FiTrash2
} from 'react-icons/fi';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, endOfWeek } from 'date-fns';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AsyncCreatableSelect from 'react-select/async-creatable';
import './Inicio.css';

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: es }),
  getDay,
  locales,
});

const estadoInicialFormulario = {
  nombre_tratamiento: '',
  fecha_inicio: new Date().toISOString().split('T')[0],
  fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  notas: '',
  medicamentos: [{
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
  }]
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

  // === Obtener dosis semanal ===
  const obtenerDosisSemana = async (fechaInicio, fechaFin) => {
    setCargando(true);
    try {
      const params = new URLSearchParams({
        fecha_inicio: fechaInicio.toISOString().split('T')[0],
        fecha_fin: fechaFin.toISOString().split('T')[0],
      });
      const response = await fetch(`http://localhost:8000/api/dosis/agenda-semanal?${params}`, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      const data = await response.json();
      if (data.success) {
        const eventos = data.data.dosis.map(d => ({
          ...d,
          start: new Date(d.start),
          end: new Date(d.end),
        }));
        setDosisSemana(eventos);

        if (!tratamientoActivo) {
          const resp = await fetch('http://localhost:8000/api/tratamientos/verificar-activo', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
          });
          const tData = await resp.json();
          if (tData.success) setTratamientoActivo(tData.tratamiento);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const inicio = startOfWeek(semanaActual, { locale: es });
    const fin = endOfWeek(semanaActual, { locale: es });
    obtenerDosisSemana(inicio, fin);
  }, [semanaActual]);

  const semanaAnterior = () => setSemanaActual(new Date(semanaActual.setDate(semanaActual.getDate() - 7)));
  const semanaSiguiente = () => setSemanaActual(new Date(semanaActual.setDate(semanaActual.getDate() + 7)));
  const irAHoy = () => setSemanaActual(new Date());

  const marcarDosis = async (id, estado) => {
    try {
      const res = await fetch(`http://localhost:8000/api/dosis/${id}/marcar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify({
          estado: estado ? 'tomada' : 'omitida',
          notas_toma: estado ? 'Tomada correctamente' : 'Omitida'
        })
      });
      const data = await res.json();
      if (data.success) {
        setDosisSemana(prev => prev.map(d => d.id === id ? { ...d, estado: estado ? 'tomada' : 'omitida' } : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectEvent = (dosis) => marcarDosis(dosis.id, dosis.estado !== 'tomada');
  const handleNavigate = (date) => setSemanaActual(date);

  // === Modal ===
  const abrirModalNuevo = () => {
    setTratamientoData(estadoInicialFormulario);
    setEditId(null);
    setModalTratamiento(true);
  };

  const abrirModalModificar = () => {
    if (!tratamientoActivo) return;
    const det = tratamientoActivo.detalle_tratamientos || [];
    const mapped = det.map(d => ({
      medicamento_id: d.medicamento_id ?? null,
      medicamento_nombre: d.medicamento?.nombre ?? '',
      via_administracion: d.medicamento?.via_administracion ?? 'Oral',
      presentacion: d.medicamento?.presentacion ?? '',
      importancia: d.medicamento?.importancia ?? 'media',
      es_nuevo: false,
      tipo_frecuencia: d.tipo_frecuencia,
      valor_frecuencia: d.valor_frecuencia,
      horarios_fijos: JSON.parse(d.horarios_fijos || '[]'),
      dias_semana: JSON.parse(d.dias_semana || '[]'),
      cantidad_por_toma: d.cantidad_por_toma,
    }));
    setTratamientoData({
      nombre_tratamiento: tratamientoActivo.nombre_tratamiento,
      fecha_inicio: tratamientoActivo.fecha_inicio.split('T')[0],
      fecha_fin: tratamientoActivo.fecha_fin.split('T')[0],
      notas: tratamientoActivo.notas || '',
      medicamentos: mapped.length ? mapped : estadoInicialFormulario.medicamentos,
    });
    setEditId(tratamientoActivo.id);
    setModalTratamiento(true);
  };

  const cerrarModal = () => { setModalTratamiento(false); setEditId(null); };

  const loadOptions = async (input) => {
    if (input.length < 2) return [];
    try {
      const res = await fetch(`http://localhost:8000/api/medicamentos/buscar?q=${encodeURIComponent(input)}`, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      const data = await res.json();
      return data.success ? data.data.map(m => ({
        value: m, label: `${m.nombre}${m.presentacion ? ` (${m.presentacion})` : ''}`
      })) : [];
    } catch {
      return [];
    }
  };

  const handleMedicamentoChange = (op, i) => {
    const meds = [...tratamientoData.medicamentos];
    if (!op) meds[i] = estadoInicialFormulario.medicamentos[0];
    else if (op.__isNew__) meds[i] = { ...estadoInicialFormulario.medicamentos[0], medicamento_nombre: op.label };
    else {
      const m = op.value;
      meds[i] = { ...meds[i], medicamento_id: m.id, medicamento_nombre: m.nombre, presentacion: m.presentacion ?? '', importancia: m.importancia ?? 'media', via_administracion: m.via_administracion ?? 'Oral', es_nuevo: false };
    }
    setTratamientoData({ ...tratamientoData, medicamentos: meds });
  };

  const actualizarMedicamento = (i, campo, valor) => {
    const meds = [...tratamientoData.medicamentos];
    meds[i][campo] = valor;
    setTratamientoData({ ...tratamientoData, medicamentos: meds });
  };

  const agregarMedicamento = () => {
    setTratamientoData({
      ...tratamientoData,
      medicamentos: [...tratamientoData.medicamentos, estadoInicialFormulario.medicamentos[0]]
    });
  };

  const eliminarMedicamento = (i) => {
    const meds = tratamientoData.medicamentos.filter((_, idx) => idx !== i);
    setTratamientoData({ ...tratamientoData, medicamentos: meds });
  };

  const guardarTratamiento = async () => {
    if (!tratamientoData.nombre_tratamiento) return alert("Falta nombre del tratamiento");
    setGuardando(true);
    const url = editId
      ? `http://localhost:8000/api/tratamientos/${editId}`
      : 'http://localhost:8000/api/tratamientos';
    const method = editId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify(tratamientoData)
      });
      const data = await res.json();
      if (data.success) {
        alert(editId ? 'Tratamiento actualizado' : 'Tratamiento creado');
        cerrarModal();
        const inicio = startOfWeek(semanaActual, { locale: es });
        const fin = endOfWeek(semanaActual, { locale: es });
        obtenerDosisSemana(inicio, fin);
      } else alert('Error al guardar tratamiento');
    } catch (err) {
      console.error(err);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarTratamiento = async () => {
    if (!tratamientoActivo) return;
    if (!window.confirm('¿Eliminar este tratamiento y sus dosis?')) return;
    try {
      await fetch(`http://localhost:8000/api/tratamientos/${tratamientoActivo.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      alert('Tratamiento eliminado');
      setTratamientoActivo(null);
      const inicio = startOfWeek(semanaActual, { locale: es });
      const fin = endOfWeek(semanaActual, { locale: es });
      obtenerDosisSemana(inicio, fin);
    } catch (err) { console.error(err); }
  };

  const eventPropGetter = (e) => {
    const estado = e.estado;
    const imp = e.tratamiento_medicamento?.tratamiento?.importancia?.toLowerCase() || 'media';
    let bg = 'var(--medium-importance)';
    if (imp === 'alta' || imp === 'critica') bg = 'var(--high-importance)';
    if (imp === 'baja') bg = 'var(--low-importance)';
    if (estado === 'tomada') bg = '#9ca3af';
    return { style: { backgroundColor: bg, borderRadius: '10px', color: 'white', border: 'none' } };
  };

  const diasSemana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek(semanaActual, { locale: es }));
    d.setDate(d.getDate() + i);
    return d;
  });

  const formats = {
    timeGutterFormat: (date, culture, local) => local.format(date, 'HH:mm', culture),
    eventTimeRangeFormat: ({ start }, culture, local) => local.format(start, 'HH:mm', culture)
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
          <div className="nav-buttons">
            <button onClick={semanaAnterior} className="nav-btn"><FiChevronLeft /></button>
            <button onClick={irAHoy} className="today-btn">Hoy</button>
            <button onClick={semanaSiguiente} className="nav-btn"><FiChevronRight /></button>
          </div>
          {tratamientoActivo ? (
            <div className="tratamiento-activo-buttons">
              <span className="tratamiento-activo-info">
                Activo: <strong>{tratamientoActivo.nombre_tratamiento}</strong>
              </span>
              <button className="edit-treatment-btn" onClick={abrirModalModificar}><FiEdit /> Modificar</button>
              <button className="delete-treatment-btn" onClick={eliminarTratamiento}><FiTrash2 /> Eliminar</button>
            </div>
          ) : (
            <button className="create-treatment-btn" onClick={abrirModalNuevo}>
              <FiPlus /> Nuevo Tratamiento
            </button>
          )}
        </div>
      </div>

      {/* Calendario */}
      <div className="calendar-container">
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
        <div className="config-modal-overlay" onClick={(e) => e.target === e.currentTarget && cerrarModal()}>
          <div className="config-modal tratamiento-modal">
            <div className="config-modal-header">
              <h3>{editId ? 'Modificar Tratamiento' : 'Nuevo Tratamiento'}</h3>
            </div>

            <div className="tratamiento-form">
              {/* Columna izquierda */}
              <div className="form-section">
                <h4>Información General</h4>
                <label>Nombre del Tratamiento</label>
                <input
                  className="modal-input"
                  value={tratamientoData.nombre_tratamiento}
                  onChange={(e) => setTratamientoData({ ...tratamientoData, nombre_tratamiento: e.target.value })}
                />
                <label>Fecha de Inicio</label>
                <input type="date" className="modal-input"
                  value={tratamientoData.fecha_inicio}
                  onChange={(e) => setTratamientoData({ ...tratamientoData, fecha_inicio: e.target.value })} />
                <label>Fecha de Fin</label>
                <input type="date" className="modal-input"
                  value={tratamientoData.fecha_fin}
                  onChange={(e) => setTratamientoData({ ...tratamientoData, fecha_fin: e.target.value })} />
                <label>Notas</label>
                <textarea
                  className="modal-input"
                  rows="4"
                  value={tratamientoData.notas}
                  onChange={(e) => setTratamientoData({ ...tratamientoData, notas: e.target.value })}
                />
              </div>

              {/* Columna derecha */}
              <div className="form-section">
                <div className="medicamentos-header">
                  <h4>Medicamentos</h4>
                  <button className="add-medicamento-btn" onClick={agregarMedicamento}>
                    <FiPlus /> Agregar
                  </button>
                </div>

                {tratamientoData.medicamentos.map((med, i) => (
                  <div key={i} className="medicamento-row">
                    <div className="medicamento-fields">
                      <AsyncCreatableSelect
                        loadOptions={loadOptions}
                        onChange={(op) => handleMedicamentoChange(op, i)}
                        value={med.medicamento_nombre ? { label: med.medicamento_nombre, value: med } : null}
                        placeholder="Buscar o crear medicamento..."
                      />
                      <input
                        className="modal-input"
                        placeholder="Cantidad por toma"
                        value={med.cantidad_por_toma}
                        onChange={(e) => actualizarMedicamento(i, 'cantidad_por_toma', e.target.value)}
                      />
                      <select
                        className="modal-input"
                        value={med.importancia}
                        onChange={(e) => actualizarMedicamento(i, 'importancia', e.target.value)}>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                      </select>
                    </div>
                    {tratamientoData.medicamentos.length > 1 && (
                      <button className="remove-medicamento-btn" onClick={() => eliminarMedicamento(i)}>×</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-buttons">
                <button className="cancel-button" onClick={cerrarModal}>Cancelar</button>
                <button className="save-button" onClick={guardarTratamiento}>
                  {guardando ? 'Guardando...' : 'Guardar'}
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
