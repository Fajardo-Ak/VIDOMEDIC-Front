import React, { useState, useEffect } from "react";
import { FiUsers, FiEdit2, FiTrash2, FiPlus, FiPhone, FiMail, FiUser } from "react-icons/fi";
import api from "../../../api/axiosConfig";
import {
  alertaExito,
  alertaError,
  alertaAdvertencia,
  confirmarEliminar
} from "../Configuraciones/alertas";

const Contactos = () => {

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
      const response = await api.get('/contactos');
      const data = response.data;

      if (data.success) {
        setContactos(data.data);
      } else {
        alertaError("Error al obtener contactos.");
      }
    } catch (error) {
      alertaError("Error al conectar con el servidor.");
    } finally {
      setCargandoContactos(false);
    }
  };

  // Abrir modal
  const abrirModalContacto = (contacto = null) => {
    if (contacto) {
      setEditandoContacto(contacto.id);
      setDatosContacto({
        nombre_contacto: contacto.nombre_contacto,
        telefono: contacto.telefono,
        correo: contacto.correo || ""
      });
    } else {
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
      return alertaAdvertencia("Por favor, completa todos los campos requeridos.");
    }

    setGuardandoContacto(true);

    try {
      let response;

      if (editandoContacto) {
        response = await api.put(`/contactos/${editandoContacto}`, datosContacto);
      } else {
        response = await api.post('/contactos', datosContacto);
      }

      const data = response.data;

      if (data.success) {
        await obtenerContactos();
        setModalContacto(false);

        // ALERTA ÉXITO
        alertaExito(
          editandoContacto
            ? "Contacto actualizado correctamente"
            : "Contacto creado correctamente"
        );

      } else {
        alertaError(data.error || "Error al guardar el contacto.");
      }
    } catch (error) {
      alertaError("Error al conectar con el servidor.");
    } finally {
      setGuardandoContacto(false);
    }
  };

  // Eliminar contacto
  const eliminarContacto = async (id) => {

    // ALERTA DE CONFIRMACIÓN
    const confirmado = await confirmarEliminar("¿Seguro que deseas eliminar este contacto?");
    if (!confirmado) return;

    try {
      const response = await api.delete(`/contactos/${id}`);
      const data = response.data;

      if (data.success) {
        await obtenerContactos();

        // ALERTA ÉXITO
        alertaExito("Contacto eliminado correctamente");
      } else {
        alertaError(data.error || "Error al eliminar el contacto.");
      }
    } catch (error) {
      alertaError("Error al conectar con el servidor.");
    }
  };

  useEffect(() => {
    obtenerContactos();
  }, []);

  return (
    <div className="contactos-container">

      {/* ---------- HEADER ---------- */}
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
                >
                  <FiPlus /> Agregar Contacto
                </button>
              )}

            </div>

            {/* ---------- ESTADOS ---------- */}
            {cargandoContactos ? (
              <p>Cargando contactos...</p>
            ) : contactos.length === 0 ? (
              <div className="estado-vacio">
                <FiUsers />
                <p>No tienes contactos de emergencia guardados</p>
                <button className="btn-primary" onClick={() => abrirModalContacto()}>
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
                          <FiUser />
                          <span>{contacto.nombre_contacto}</span>
                        </div>

                        <div className="contacto-linea">
                          <FiPhone />
                          <span>{contacto.telefono}</span>
                        </div>

                        {contacto.correo && (
                          <div className="contacto-linea">
                            <FiMail />
                            <span>{contacto.correo}</span>
                          </div>
                        )}

                      </div>
                    </div>

                    <div className="contacto-acciones">
                      <button
                        className="btn-accion editar"
                        onClick={() => abrirModalContacto(contacto)}
                      >
                        <FiEdit2 /> Editar
                      </button>

                      <button
                        className="btn-accion eliminar"
                        onClick={() => eliminarContacto(contacto.id)}
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

      {/* ---------- MODAL ---------- */}
      {modalContacto && (
        <div
          className="config-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalContacto(false);
          }}
        >
          <div className="config-modal">

            <div className="config-modal-header">
              <h3>
                {editandoContacto ? "Editar Contacto de Emergencia" : "Agregar Nuevo Contacto"}
              </h3>
            </div>

            <div className="config-modal-content">

              <div className="modal-input-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  value={datosContacto.nombre_contacto}
                  onChange={(e) =>
                    setDatosContacto({ ...datosContacto, nombre_contacto: e.target.value })
                  }
                  disabled={guardandoContacto}
                />
              </div>

              <div className="modal-input-group">
                <label>Teléfono *</label>
                <input
                  type="text"
                  value={datosContacto.telefono}
                  onChange={(e) =>
                    setDatosContacto({ ...datosContacto, telefono: e.target.value })
                  }
                  disabled={guardandoContacto}
                />
              </div>

              <div className="modal-input-group">
                <label>Correo (Opcional)</label>
                <input
                  type="email"
                  value={datosContacto.correo}
                  onChange={(e) =>
                    setDatosContacto({ ...datosContacto, correo: e.target.value })
                  }
                  disabled={guardandoContacto}
                />
              </div>

            </div>

            <div className="modal-buttons">
              <button className="btn-cancelar" onClick={() => setModalContacto(false)}>
                Cancelar
              </button>

              <button className="btn-guardar" onClick={guardarContacto}>
                {guardandoContacto ? "Guardando..." : editandoContacto ? "Actualizar" : "Guardar Contacto"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Contactos;
