import React, { useState, useEffect } from 'react';
import { FiTrash2, FiFileText, FiDownload, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './Historial.css';

const Historial = () => {
  const [tratamientos, setTratamientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [descargandoId, setDescargandoId] = useState(null); // Para mostrar spinner en el botón específico

  useEffect(() => {
    cargarTratamientos();
  }, []);

  const cargarTratamientos = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:8000/api/tratamientos', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
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
      const response = await fetch(`http://localhost:8000/api/tratamientos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      if (data.success) {
        alert("Tratamiento eliminado correctamente");
        cargarTratamientos(); // Recargar lista
      } else {
        alert("Error al eliminar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- LÓGICA DE DESCARGA PDF ---
  const descargarPDF = async (tratamiento) => {
    setDescargandoId(tratamiento.id);
    try {
      const response = await fetch(`http://localhost:8000/api/tratamientos/${tratamiento.id}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'), // Importante: Enviar token
          'Accept': 'application/pdf'
        }
      });

      if (!response.ok) throw new Error('Error al generar PDF');

      // Convertir la respuesta a un Blob (archivo binario)
      const blob = await response.blob();
      
      // Crear una URL temporal para el navegador
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Nombre del archivo que se descargará
      a.download = `Historial_${tratamiento.nombre_tratamiento.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a); // Necesario para Firefox
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Limpiar memoria

    } catch (error) {
      console.error("Error descargando PDF:", error);
      alert("No se pudo descargar el historial. Intente nuevamente.");
    } finally {
      setDescargandoId(null);
    }
  };

  // Renderizado de estado (badge)
  const renderEstado = (estado) => {
    switch (estado) {
      case 'activo': return <span className="badge badge-active"><FiClock /> En Curso</span>;
      case 'completado': return <span className="badge badge-completed"><FiCheckCircle /> Finalizado</span>;
      case 'cancelado': return <span className="badge badge-cancelled"><FiXCircle /> Cancelado</span>;
      default: return <span className="badge">{estado}</span>;
    }
  };

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h2><FiFileText /> Historial de Tratamientos</h2>
        <p>Consulta y descarga el registro de tus tratamientos médicos pasados y actuales.</p>
      </div>

      {cargando ? (
        <div className="loading">Cargando historial...</div>
      ) : tratamientos.length === 0 ? (
        <div className="empty-state">No tienes tratamientos registrados aún.</div>
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
                    </button>
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => eliminarTratamiento(t.id)}
                      title="Eliminar del historial"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Historial;