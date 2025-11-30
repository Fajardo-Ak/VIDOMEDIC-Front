import React, { useState, useEffect } from "react";
import { FiUsers, FiEdit2, FiTrash2, FiPlus, FiPhone, FiMail, FiUser } from "react-icons/fi";
import api from "../../../api/axiosConfig"; // <--- IMPORTAR API

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
      alert("Por favor, completa nombre y teléfono");
      return;
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
        alert(editandoContacto ? "Contacto actualizado" : "Contacto creado");
      } else {
        alert(data.error || "Error al guardar contacto");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error de conexión");
    } finally {
      setGuardandoContacto(false);
    }
  };

  // Eliminar contacto
  const eliminarContacto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este contacto?")) return;

    try {
      // CAMBIO: api.delete
      const response = await api.delete(`/contactos/${id}`);
      const data = response.data;

      if (data.success) {
        await obtenerContactos();
        alert("Contacto eliminado");
      } else {
        alert(data.error || "Error al eliminar contacto");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error de conexión");
    }
  };

  // Cargar contactos al iniciar
  useEffect(() => {
    obtenerContactos();
  }, []);

  return (
    <div>
      <div className="config-section">
        {/* Título de la sección */}
        <div className="section-title">
          <FiUsers /> Contactos
          {contactos.length > 0 && (
            <span className="contador-contactos">({contactos.length}/3)</span>
          )}
        </div>

        {/* Botón agregar contacto */}
        {contactos.length < 3 && (
          <button
            className="btn-agregar-contacto"
            onClick={() => abrirModalContacto()}
          >
            <FiPlus className="icono-btn" /> Agregar contacto
          </button>
        )}

        {/* Lista de contactos */}
        {cargandoContactos ? (
          <div className="cargando-contactos">Cargando contactos...</div>
        ) : contactos.length === 0 ? (
          <div className="estado-vacio">No tienes contactos guardados</div>
        ) : (
          <div className="lista-contactos">
            {contactos.map((contacto) => (
              <div key={contacto.id} className="contacto-item">
                <div className="contacto-info">
                  <div className="contacto-linea">
                    <FiUser className="icono-dato" />
                    <span className="contacto-dato">{contacto.nombre_contacto}</span>
                  </div>
                  <div className="contacto-linea">
                    <FiPhone className="icono-dato" />
                    <span className="contacto-dato">{contacto.telefono}</span>
                  </div>
                  {contacto.correo && (
                    <div className="contacto-linea">
                      <FiMail className="icono-dato" />
                      <span className="contacto-dato">{contacto.correo}</span>
                    </div>
                  )}
                </div>

                <div className="contacto-acciones">
                  <button
                    className="btn-accion editar"
                    onClick={() => abrirModalContacto(contacto)}
                    title="Editar contacto"
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
              <h3>{editandoContacto ? "Editar contacto" : "Agregar contacto"}</h3>
            </div>

            <input
              className="modal-input"
              type="text"
              value={datosContacto.nombre_contacto}
              placeholder="Nombre del contacto"
              onChange={(e) =>
                setDatosContacto({
                  ...datosContacto,
                  nombre_contacto: e.target.value,
                })
              }
              disabled={guardandoContacto}
            />

            <input
              className="modal-input"
              type="text"
              value={datosContacto.telefono}
              placeholder="Teléfono"
              onChange={(e) =>
                setDatosContacto({ ...datosContacto, telefono: e.target.value })
              }
              disabled={guardandoContacto}
            />

            <input
              className="modal-input"
              type="email"
              value={datosContacto.correo}
              placeholder="Correo electrónico (opcional)"
              onChange={(e) =>
                setDatosContacto({ ...datosContacto, correo: e.target.value })
              }
              disabled={guardandoContacto}
            />

            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={() => setModalContacto(false)}
                disabled={guardandoContacto}
              >
                Cancelar
              </button>

              <button
                className="save-button"
                onClick={guardarContacto}
                disabled={guardandoContacto}
              >
                {guardandoContacto
                  ? "Guardando..."
                  : editandoContacto
                  ? "Actualizar"
                  : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contactos;