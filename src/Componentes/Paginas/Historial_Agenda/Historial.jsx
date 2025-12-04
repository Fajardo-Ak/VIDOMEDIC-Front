import React, { useState, useEffect } from 'react';
import { FiTrash2, FiFileText, FiDownload, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../../../api/axiosConfig'; // <--- IMPORTANTE: Importar axios
import './Historial.css';
import { alertaExito, alertaError, alertaAdvertencia } from "../Configuraciones/alertas";


const Historial = () => {
  const [tratamientos, setTratamientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [descargandoId, setDescargandoId] = useState(null);

  useEffect(() => {
    cargarTratamientos();
  }, []);

  const cargarTratamientos = async () => {
    setCargando(true);
    try {
      // CAMBIO: api.get
      const response = await api.get('/tratamientos');
      const data = response.data;
      
      if (data.success) {
        setTratamientos(data.data);
        
      }
    } catch (error) {
      console.error("Error cargando historial:", error);

    } finally {
      setCargando(false);
    }
  };

  const eliminarTratamiento = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este historial? Esta acción no se puede deshacer.")) return;

    try {
      // CAMBIO: api.delete
      const response = await api.delete(`/tratamientos/${id}`);
      const data = response.data;

      if (data.success) {
        alert("Tratamiento eliminado correctamente");
        cargarTratamientos();
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      console.error(error);

    }
  };

  // --- LÓGICA DE DESCARGA PDF (ADAPTADA A AXIOS) ---
  const descargarPDF = async (tratamiento) => {
    setDescargandoId(tratamiento.id);

    try {
      // CAMBIO: api.get con responseType 'blob'
      const response = await api.get(`/tratamientos/${tratamiento.id}/pdf`, {
        responseType: 'blob', // Importante para que Axios sepa que es un archivo
      });

      // Con Axios, response.data YA ES el contenido del archivo
      // Creamos el Blob directamente desde response.data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Crear una URL temporal para el navegador
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `Historial_${tratamiento.nombre_tratamiento.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error descargando PDF:", error);
      alert("No se pudo descargar el historial. Intente nuevamente.");
    } finally {
      setDescargandoId(null);
    }
  };

  const renderEstado = (estado) => {
    switch (estado) {
      case 'activo': 
        return (
          <span className="badge-estado badge-active">
            <FiClock /> En Curso
          </span>
        );
      case 'completado': 
        return (
          <span className="badge-estado badge-completed">
            <FiCheckCircle /> Finalizado
          </span>
        );
      case 'cancelado': 
        return (
          <span className="badge-estado badge-cancelled">
            <FiXCircle /> Cancelado
          </span>
        );
      default: 
        return (
          <span className="badge-estado">
            {estado}
          </span>
        );
    }
  };

  return (
    <div className="historial-container">
      <div className="config-section">
        <div className="section-header">
          <div>
            <div className="section-title">
              <h2><FiFileText /> Historial de Tratamientos</h2>
            </div>
            <p className="section-subtitle">
              Consulta y descarga el registro de tus tratamientos médicos.
            </p>
          </div>
        </div>

        {cargando ? (
          <div className="cargando">
            <div className="icono-vacio">
              <FiFileText />
            </div>
            <p>Cargando historial...</p>
          </div>
        ) : tratamientos.length === 0 ? (
          <div className="estado-vacio">
            <div className="icono-vacio">
              
            </div>
            <p>No tienes tratamientos registrados aún.</p>
            <p className="text-sm">Los tratamientos aparecerán aquí una vez que hayan sido registrados</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Tratamiento</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tratamientos.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className="t-name">{t.nombre_tratamiento}</div>
                      <div className="t-meds">
                        {t.detalle_tratamientos?.length || 0} medicamento(s)
                      </div>
                    </td>
                    <td>{new Date(t.fecha_inicio).toLocaleDateString()}</td>
                    <td>{new Date(t.fecha_fin).toLocaleDateString()}</td>
                    <td>{renderEstado(t.estado)}</td>
                    <td className="actions-cell">
                      <button 
                        className="btn-icon btn-pdf" 
                        onClick={() => descargarPDF(t)}
                        disabled={descargandoId === t.id}
                        title="Descargar Receta/Historial en PDF"
                      >
                        {descargandoId === t.id ? '...' : <FiDownload />}
                        {descargandoId !== t.id && ' Descargar'}
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        onClick={() => eliminarTratamiento(t.id)}
                        title="Eliminar del historial"
                      >
                        <FiTrash2 /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historial;
