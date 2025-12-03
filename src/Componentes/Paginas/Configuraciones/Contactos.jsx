import React, { useState, useEffect } from "react";
import { FiUsers, FiEdit2, FiTrash2, FiPlus, FiPhone, FiMail, FiUser, FiSave, FiX } from "react-icons/fi";
import api from "../../../api/axiosConfig"; // <--- IMPORTAR API
import Swal from "sweetalert2";
import { alertaExito, alertaError, alertaAdvertencia, confirmarEliminar } from "../Configuraciones/alertas";

const Contactos = () => {
  // Estados para contactos
  const [contactos, setContactos] = useState([]);
  const [cargandoContactos, setCargandoContactos] = useState(true);
  const [modalContacto, setModalContacto] = useState(false);
  const [editandoContacto, setEditandoContacto] = useState(null);
  const [datosContacto, setDatosContacto] = useState({
    nombre_contacto: "",
    telefono: "",
    correo: ""
  });
  const [guardandoContacto, setGuardandoContacto] = useState(false);

  // Obtener contactos
  const obtenerContactos = async () => {
    try {
      // CAMBIO: api.get
      const response = await api.get('/contactos');
      const data = response.data;
      
      if (data.success) {
        setContactos(data.data);
      } else {
        console.error('Error al obtener contactos:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargandoContactos(false);
    }
  };

  // Abrir modal de contacto
  const abrirModalContacto = (contacto = null) => {
    if (contacto) {
      // Modo edición
      setEditandoContacto(contacto.id);
      setDatosContacto({
        nombre_contacto: contacto.nombre_contacto,
        telefono: contacto.telefono,
        correo: contacto.correo || ""
      });
    } else {
      // Modo crear
      setEditandoContacto(null);
      setDatosContacto({
        nombre_contacto: "",
        telefono: "",
        correo: ""
      });
    }
    setModalContacto(true);
  };

  // Guardar contacto
  const guardarContacto = async () => {
    if (!datosContacto.nombre_contacto.trim() || !datosContacto.telefono.trim()) {
      //alert("Por favor, completa todos los campos requeridos");
      return alertaAdvertencia("Por favor, completa todos los campos requeridos.");
    }

    setGuardandoContacto(true);

    try {
      let response;
      if (editandoContacto) {
        // CAMBIO: api.put
        response = await api.put(`/contactos/${editandoContacto}`, datosContacto);
      } else {
        // CAMBIO: api.post
        response = await api.post('/contactos', datosContacto);
      }

      const data = response.data;

      if (data.success) {
        await obtenerContactos();
        setModalContacto(false);
        Swal.fire({
          title:"Campos incompletos",
          text: "Por favor, completa todos los campos requeridos",
          icon:"warning",
          confirmButtonColor: "#00a6a6",
        })
      } else {
        alert(data.error || "Error al guardar el contacto");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error de conexión con el servidor");
    } finally {
      setGuardandoContacto(false);
    }
  };

  // Eliminar contacto
  const eliminarContacto = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este contacto?")) return;

    try {
      // CAMBIO: api.delete
      const response = await api.delete(`/contactos/${id}`);
      const data = response.data;

      if (data.success) {
        await obtenerContactos();
        Swal.fire({
          title:"Campos incompletos",
          text: "Contacto eliminado correctamente",
          icon:"warning",
          confirmButtonColor: "#00a6a6",
        })
      } else {
        Swal(data.error || "Error al eliminar el contacto");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error de conexión con el servidor");
    }
  };

  // Cargar contactos al iniciar
  useEffect(() => {
    obtenerContactos();
  }, []);

  return (
    <div className="contactos-container">
      <div className="config-section">
        <div className="contactos-layout">
          <div className="contactos-contenido">
            <div className="section-header">
              <div>
                <div className="section-title">
                  <h2><FiUsers /> Contactos</h2>
                  {contactos.length > 0 && (
                    <span className="badge">{contactos.length}/3</span>
                  )}
                </div>
                <p className="section-subtitle">
                  Gestiona tus contactos de emergencia para situaciones importantes
                </p>
              </div>
              
              {contactos.length < 3 && (
                <button
                  className="btn-primary"
                  onClick={() => abrirModalContacto()}
                  title="Agregar nuevo contacto de emergencia"
                >
                  <FiPlus /> Agregar Contacto
                </button>
              )}
            </div>

            {cargandoContactos ? (
              <div className="estado-cargando">
                <div className="icono-vacio">
                  <FiUsers />
                </div>
                <p>Cargando contactos...</p>
              </div>
            ) : contactos.length === 0 ? (
              <div className="estado-vacio">
                <div className="icono-vacio">
                  <FiUsers />
                </div>
                <p>No tienes contactos de emergencia guardados</p>
                <p className="text-sm">Agrega contactos de emergencia para tenerlos disponibles cuando los necesites</p>
                <button
                  className="btn-primary"
                  onClick={() => abrirModalContacto()}
                  style={{ marginTop: 'var(--spacing-md)' }}
                >
                  <FiPlus /> Agregar Primer Contacto
                </button>
              </div>
            ) : (
              <div className="lista-contactos">
                {contactos.map((contacto) => (
                  <div key={contacto.id} className="contacto-item">
                    <div className="contacto-info">
                      <div className="contacto-detalles">
                        <div className="contacto-linea">
                          <FiUser className="icono-dato" />
                          <span className="contacto-label">Nombre:</span>
                          <span className="contacto-dato">
                            {contacto.nombre_contacto}
                          </span>
                        </div>
                        <div className="contacto-linea">
                          <FiPhone className="icono-dato" />
                          <span className="contacto-label">Teléfono:</span>
                          <span className="contacto-dato">
                            {contacto.telefono}
                          </span>
                        </div>
                        {contacto.correo && (
                          <div className="contacto-linea">
                            <FiMail className="icono-dato" />
                            <span className="contacto-label">Correo:</span>
                            <span className="contacto-dato">
                              {contacto.correo}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="contacto-acciones">
                      <button
                        className="btn-accion editar"
                        onClick={() => abrirModalContacto(contacto)}
                        title="Editar información del contacto"
                      >
                        <FiEdit2 /> Editar
                      </button>
                      <button
                        className="btn-accion eliminar"
                        onClick={() => eliminarContacto(contacto.id)}
                        title="Eliminar contacto"
                      >
                        <FiTrash2 /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de contacto */}
      {modalContacto && (
        <div
          className="config-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalContacto(false);
            }
          }}
        >
          <div className="config-modal">
            <div className="config-modal-header">
              <h3>
                {editandoContacto ? (
                  <>
                  Editar Contacto de Emergencia
                  </>
                ) : (
                  <>
                  Agregar Nuevo Contacto
                  </>
                )}
              </h3>
            </div>

            <div className="config-modal-content">
              <div className="modal-input-group">
                <label className="modal-label">
                Nombre Completo del Contacto *
                </label>
                <input
                  className="modal-input"
                  type="text"
                  value={datosContacto.nombre_contacto}
                  placeholder="Ingresa el nombre completo del contacto"
                  onChange={(e) =>
                    setDatosContacto({
                      ...datosContacto,
                      nombre_contacto: e.target.value,
                    })
                  }
                  disabled={guardandoContacto}
                />
              </div>

              <div className="modal-input-group">
                <label className="modal-label">
                Número de Teléfono *
                </label>
                <input
                  className="modal-input"
                  type="text"
                  value={datosContacto.telefono}
                  placeholder="Ingresa el número de teléfono"
                  onChange={(e) =>
                    setDatosContacto({ ...datosContacto, telefono: e.target.value })
                  }
                  disabled={guardandoContacto}
                />
              </div>

              <div className="modal-input-group">
                <label className="modal-label">
                Correo Electrónico (Opcional)
                </label>
                <input
                  className="modal-input"
                  type="email"
                  value={datosContacto.correo}
                  placeholder="Ingresa el correo electrónico"
                  onChange={(e) =>
                    setDatosContacto({ ...datosContacto, correo: e.target.value })
                  }
                  disabled={guardandoContacto}
                />
              </div>
            </div>

            <div className="modal-buttons">
              <button
                className="btn-cancelar"
                onClick={() => setModalContacto(false)}
                disabled={guardandoContacto}
              >
              Cancelar
              </button>

              <button
                className="btn-guardar"
                onClick={guardarContacto}
                disabled={guardandoContacto}
              >
                {guardandoContacto ? (
                  <>
                    Guardando...
                  </>
                ) : editandoContacto ? (
                  <>
                   Actualizar
                  </>
                ) : (
                  <>
                    Guardar Contacto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contactos;