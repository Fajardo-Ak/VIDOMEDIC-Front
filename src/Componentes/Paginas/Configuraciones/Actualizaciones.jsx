import React, { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";

const Actualizaciones = () => {
  const [mostrarActualizaciones, setMostrarActualizaciones] = useState(true);
  const [infoActualizaciones, setInfoActualizaciones] = useState({
    version: "v1.0.2",
    fecha: "",
    cambios: []
  });
  const [cargandoActualizaciones, setCargandoActualizaciones] = useState(false);

  // Obtener información de actualizaciones
  const obtenerActualizaciones = async () => {
    setCargandoActualizaciones(true);
    try {
      const response = await fetch('http://localhost:8000/api/actualizaciones');
      const data = await response.json();
      
      if (data.success) {
        setInfoActualizaciones(data.data);
      } else {
        console.error('Error al obtener actualizaciones:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargandoActualizaciones(false);
    }
  };

  useEffect(() => {
    obtenerActualizaciones();
  }, []);

  return (
    <div>
      <div className="config-section">
        <div
          className="section-title collapsible"
          onClick={() => setMostrarActualizaciones(!mostrarActualizaciones)}
        >
          <span className="title-with-icon">
            <FiBell /> Actualizaciones
          </span>
          <span className={`arrow ${mostrarActualizaciones ? "open" : ""}`}>▼</span>
        </div>
        
        {mostrarActualizaciones && (
          <div className="updates-content">
            {cargandoActualizaciones ? (
              <div className="cargando-actualizaciones">Cargando información...</div>
            ) : (
              <>
                <p>
                  Versión actual: <strong>{infoActualizaciones.version}</strong>
                  {infoActualizaciones.fecha && (
                    <span style={{fontSize: '12px', color: '#666', marginLeft: '10px'}}>
                      ({infoActualizaciones.fecha})
                    </span>
                  )}
                </p>
                {infoActualizaciones.cambios && infoActualizaciones.cambios.length > 0 && (
                  <div>
                    <p style={{marginBottom: '8px', fontWeight: 'bold'}}>Últimos cambios:</p>
                    <ul>
                      {infoActualizaciones.cambios.map((cambio, index) => (
                        <li key={index}>{cambio}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Actualizaciones;