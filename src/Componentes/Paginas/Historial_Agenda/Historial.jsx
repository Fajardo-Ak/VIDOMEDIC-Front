import React, { useState, useEffect } from 'react';
import { 
  FiTrash2, 
  FiFileText, 
  FiDownload, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle 
} from 'react-icons/fi';
import api from '../../../api/axiosConfig';
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
      const { data } = await api.get('/tratamientos');

      if (data.success) {
        setTratamientos(data.data);
      } else {
        alertaAdvertencia("No se pudieron cargar los tratamientos.");
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      alertaError("Ocurrió un error al cargar el historial.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarTratamiento = async (id) => {
    const confirm = await confirmarEliminar(
      "¿Eliminar historial?",
      "Esta acción no se puede deshacer."
    );

    if (!confirm.isConfirmed) return;

    try {
      const { data } = await api.delete(`/tratamientos/${id}`);

      if (data.success) {
        alertaExito("Tratamiento eliminado correctamente.");
        cargarTratamientos();
      } else {
        alertaError("Error al eliminar el tratamiento.");
      }
    } catch (error) {
      console.error(error);
      alertaError("No se pudo eliminar el tratamiento.");
    }
  };

  const descargarPDF = async (tratamiento) => {
    setDescargandoId(tratamiento.id);

    try {
      const response = await api.get(
        `/tratamientos/${tratamiento.id}/pdf`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `Historial_${tratamiento.nombre_tratamiento.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      alertaExito("PDF descargado correctamente.");
      
    } catch (error) {
      console.error("Error descargando PDF:", error);
      alertaError("No se pudo descargar el historial.");
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
        return <span className="badge-estado">{estado}</span>;
    }
  };

  return (
    <div className="historial-container">
      <h2>Historial de Tratamientos</h2>

      {cargando ? (
        <p>Cargando...</p>
      ) : tratamientos.length === 0 ? (
        <p>No hay tratamientos registrados.</p>
      ) : (
        <div className="lista-tratamientos">
          {tratamientos.map((t) => (
            <div key={t.id} className="tarjeta-tratamiento">
              
              <div className="info">
                <h3>{t.nombre_tratamiento}</h3>
                <p><FiFileText /> {t.descripcion}</p>
                {renderEstado(t.estado)}
              </div>

              <div className="acciones">
                <button 
                  className="btn-descargar"
                  onClick={() => descargarPDF(t)}
                  disabled={descargandoId === t.id}
                >
                  <FiDownload />
                  {descargandoId === t.id ? "Descargando..." : "PDF"}
                </button>

                <button 
                  className="btn-eliminar"
                  onClick={() => eliminarTratamiento(t.id)}
                >
                  <FiTrash2 /> Eliminar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Historial;
