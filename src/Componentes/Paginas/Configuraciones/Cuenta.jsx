import React, { useState, useEffect } from "react";
import { FiUser, FiEdit2, FiImage, FiMail, FiLock } from "react-icons/fi";
import api from "../../../api/axiosConfig"; // <--- IMPORTAR API
import { alertaExito, alertaError, alertaAdvertencia } from "../Configuraciones/alertas";


const Cuenta = () => {
  // Estados para datos del usuario
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    foto_perfil: null,
    plan_actual: null,
  });
  const [cargando, setCargando] = useState(true);

  // Estados para modales
  const [modalEditando, setModalEditando] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [modalFoto, setModalFoto] = useState(false);

  // Estados para formularios
  const [datosEditados, setDatosEditados] = useState({ nombre: "", correo: "" });
  const [datosPassword, setDatosPassword] = useState({
    password_actual: "",
    nueva_password: "",
    confirmar_password: ""
  });
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  // Estados para loading
  const [guardando, setGuardando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  // Obtener perfil del usuario
  const obtenerPerfilUsuario = async () => {
    try {
      // CAMBIO: api.get
      const response = await api.get('/usuario/perfil');
      const data = response.data;
      
       if (data.success) {
        setUsuario({
          ...data.usuario,
          plan_actual: data.usuario.plan_actual || "Básico" // <-- Añadir plan
        });
      } else {
        console.error('Error al obtener perfil:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  // Abrir modales
  const abrirModalEdicion = () => {
    setDatosEditados({
      nombre: usuario.nombre,
      correo: usuario.correo
    });
    setModalEditando(true);
  };

  const abrirModalPassword = () => {
    setDatosPassword({
      password_actual: "",
      nueva_password: "",
      confirmar_password: ""
    });
    setModalPassword(true);
  };

  const abrirModalFoto = () => {
    setArchivoSeleccionado(null);
    setPreviewFoto(null);
    setModalFoto(true);
  };

  // Manejar archivos de foto
  const manejarArchivoSeleccionado = (archivo) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
    if (!tiposPermitidos.includes(archivo.type)) {
      alertaAdvertencia('Por favor, selecciona una imagen válida (JPG, PNG o GIF)');
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      alertaAdvertencia('La imagen es muy grande. Máximo 2MB permitido');
      return;
    }

    setArchivoSeleccionado(archivo);
    const previewURL = URL.createObjectURL(archivo);
    setPreviewFoto(previewURL);
  };

  // Funciones para guardar cambios
  const guardarCambiosPerfil = async () => {
    if (!datosEditados.nombre.trim() || !datosEditados.correo.trim()) {
      alertaAdvertencia("Por favor, completa todos los campos");
      return;
    }

    setGuardando(true);

    try {
      // CAMBIO: api.put
      const response = await api.put('/usuario/perfil', datosEditados);
      const data = response.data;

      if (data.success) {
        setUsuario({
          ...usuario,
          nombre: datosEditados.nombre,
          correo: datosEditados.correo
        });
        setModalEditando(false);
        alertaExito("Perfil actualizado correctamente");
      } else {
        alertaError(data.error || "Error al actualizar perfil");
      }
    } catch (error) {
      console.error('Error:', error);
      alertaError("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarPassword = async () => {
    if (!datosPassword.password_actual || !datosPassword.nueva_password) {
      alertaAdvertencia("Por favor, completa todos los campos");
      return;
    }

    if (datosPassword.nueva_password !== datosPassword.confirmar_password) {
      alertaAdvertencia("Las contraseñas nuevas no coinciden");
      return;
    }

    setCambiandoPassword(true);

    try {
      // CAMBIO: api.put
      const response = await api.put('/usuario/password', {
        password_actual: datosPassword.password_actual,
        nueva_password: datosPassword.nueva_password
      });

      const data = response.data;

      if (data.success) {
        setModalPassword(false);
        alertaExito("Contraseña cambiada correctamente");
      } else {
        alertaError(data.message || "Error al cambiar contraseña");
      }
    } catch (error) {
      alertaError("Error de conexión");
    } finally {
      setCambiandoPassword(false);
    }
  };

  const subirFoto = async () => {
      if (!archivoSeleccionado) {
    alertaAdvertencia("Sin imagen", "Debes seleccionar una foto antes de subir");
    return;
  }
    setSubiendoFoto(true);

    try {
      const formData = new FormData();
      formData.append('foto', archivoSeleccionado);

      // Sobrescribimos el header 'Content-Type' a undefined.
      // Esto obliga al navegador a detectar que es un archivo y 
      // poner automáticamente el "boundary" correcto.
      const response = await api.post('/usuario/foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      });
      
      const data = response.data;

      if (data.success) {
        setUsuario({
          ...usuario,
          foto_perfil: data.foto_perfil
        });
        setModalFoto(false);
        alertaExito('Foto de perfil actualizada correctamente');
      } else {
        alertaError(data.message || 'Error al subir la foto');
      }
    } catch (error) {
      //console.error('Error:', error);
      // Mostramos el mensaje exacto que nos da el servidor si existe
      const mensaje = error.response?.data?.message || 'Error al subir la foto';
      alertaError("Error", mensaje);
    } finally {
      setSubiendoFoto(false);
    }
  };

  // Obtener foto de perfil (con corrección de URL)
  const obtenerFotoPerfil = () => {
    if (usuario.foto_perfil) {
      return usuario.foto_perfil;
    } else {
      // Usamos la URL base de axios para la imagen default
      const baseUrl = api.defaults.baseURL.replace('/api', '');
      return `${baseUrl}/images/usuario-default.png`;
    }
  };

    const obtenerIconoPlan = () => {
    switch(usuario.plan_actual?.toLowerCase()) {
      case 'premium':
        return <FiStar className="plan-icon" />;
      case 'experto':
        return <FiCrown className="plan-icon" />;
      default:
        return <FiZap className="plan-icon" />; // Básico
    }
  };

  // Función para obtener clase CSS según el plan
  const obtenerClasePlan = () => {
    switch(usuario.plan_actual?.toLowerCase()) {
      case 'premium':
        return 'plan-badge premium';
      case 'experto':
        return 'plan-badge experto';
      default:
        return 'plan-badge basico';
    }
  };

  // Cargar datos al iniciar
  useEffect(() => {
    obtenerPerfilUsuario();
  }, []);

  if (cargando) {
    return (
      <div className="config-section">
        <div className="cargando">Cargando información de cuenta...</div>
      </div>
    );
  }

  // (El return es exactamente el mismo, solo cambia la lógica de arriba)
  return (
    <div>
      {/* === SECCIÓN PRINCIPAL DE CUENTA === */}
      <div className="config-section cuenta-layout">
        <div className="section-header">
          <div>
            <div className="section-title">
              <h2><FiUser /> Información de Cuenta</h2>
            </div>
            <p className="section-subtitle">
              Gestiona tu información personal y configuración de cuenta
            </p>
          </div>
        </div>

        <div className="cuenta-contenido">
          <div className="cuenta-foto" onClick={abrirModalFoto}>
            <img 
              src={obtenerFotoPerfil()} 
              alt="Foto de perfil" 
              className="foto-usuario"
            />
            <button className="cambiar-foto">
              <FiImage/> Cambiar foto
            </button>

             <div className={`${obtenerClasePlan()}`}>
              <span className="plan-badge-content">
                {obtenerIconoPlan()}
                <span className="plan-text">
                  Plan {usuario.plan_actual || "Básico"}
                </span>
              </span>
            </div>

          </div>

          <div className="cuenta-datos">
            <div className="dato-lista">
              {/* Card combinada para Nombre y Email */}
              <div className="dato-card-combinada">
                <div className="datos-combinados">
                  {/* Nombre */}
                  <div className="dato-linea">
                    <div className="dato-icono">
                      <FiUser />
                    </div>
                    <div className="dato-contenido">
                      <div className="dato-label">Nombre</div>
                      <div className="dato-valor">{usuario.nombre || "—"}</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="dato-linea">
                    <div className="dato-icono">
                      <FiMail />
                    </div>
                    <div className="dato-contenido">
                      <div className="dato-label">Email</div>
                      <div className="dato-valor">{usuario.correo || "—"}</div>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="btn-editar-combinado"
                  onClick={abrirModalEdicion}
                >
                  <FiEdit2 /> Editar
                </button>
              </div>

              {/* Contraseña (card individual) */}
              <div className="dato-item">
                <div className="dato-info">
                  <div className="dato-icono">
                    <FiLock />
                  </div>
                  <div className="dato-contenidoc">
                    <div className="dato-label">Contraseña</div>
                    <div className="dato-valor">••••••••</div>
                  </div>
                </div>
                <button 
                  className="btn-accion editar"
                  onClick={abrirModalPassword}
                >
                  <FiEdit2 /> Cambiar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === MODAL: EDITAR PERFIL === */}
      {modalEditando && (
        <div 
          className="config-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModalEditando(false)}
        >
          <div className="config-modal">
            <div className="config-modal-header">
              <h3> Editar Información de Cuenta</h3>
            </div>

            <div className="config-modal-content">
              <div className="modal-input-group">
                <label className="modal-label">
                  Nombre Completo
                </label>
                <input
                  className="modal-input"
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  value={datosEditados.nombre}
                  onChange={(e) => setDatosEditados({...datosEditados, nombre: e.target.value})}
                  disabled={guardando}
                />
              </div>

              <div className="modal-input-group">
                <label className="modal-label">
                  Correo Electrónico
                </label>
                <input
                  className="modal-input"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={datosEditados.correo}
                  onChange={(e) => setDatosEditados({...datosEditados, correo: e.target.value})}
                  disabled={guardando}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="modal-buttons">
              <button 
                className="btn-cancelar"
                onClick={() => setModalEditando(false)}
                disabled={guardando}
              >
                Cancelar
              </button>
              <button 
                className="btn-guardar"
                onClick={guardarCambiosPerfil}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL: CAMBIAR CONTRASEÑA === */}
      {modalPassword && (
        <div 
          className="config-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModalPassword(false)}
        >
          <div className="config-modal">
            <div className="config-modal-header">
              <h3><FiLock /> Cambiar Contraseña</h3>
            </div>

            <div className="config-modal-content">
              <div className="modal-input-group">
                <label className="modal-label">Contraseña Actual</label>
                <input
                  className="modal-input"
                  type="password"
                  placeholder="Ingresa tu contraseña actual"
                  value={datosPassword.password_actual}
                  onChange={(e) => setDatosPassword({...datosPassword, password_actual: e.target.value})}
                  disabled={cambiandoPassword}
                />
              </div>

              <div className="modal-input-group">
                <label className="modal-label">Nueva Contraseña</label>
                <input
                  className="modal-input"
                  type="password"
                  placeholder="Ingresa tu nueva contraseña"
                  value={datosPassword.nueva_password}
                  onChange={(e) => setDatosPassword({...datosPassword, nueva_password: e.target.value})}
                  disabled={cambiandoPassword}
                />
              </div>

              <div className="modal-input-group">
                <label className="modal-label">Confirmar Nueva Contraseña</label>
                <input
                  className="modal-input"
                  type="password"
                  placeholder="Confirma tu nueva contraseña"
                  value={datosPassword.confirmar_password}
                  onChange={(e) => setDatosPassword({...datosPassword, confirmar_password: e.target.value})}
                  disabled={cambiandoPassword}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="modal-buttons">
              <button 
                className="btn-cancelar"
                onClick={() => setModalPassword(false)}
                disabled={cambiandoPassword}
              >
                Cancelar
              </button>
              <button 
                className="btn-guardar"
                onClick={cambiarPassword}
                disabled={cambiandoPassword}
              >
                {cambiandoPassword ? "Cambiando..." : "Cambiar Contraseña"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL: CAMBIAR FOTO === */}
      {modalFoto && (
        <div 
          className="config-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setModalFoto(false)}
        >
          <div className="config-modal">
            <div className="config-modal-header">
              <h3><FiImage /> Cambiar Foto de Perfil</h3>
            </div>

            <div className="config-modal-content">
              {/* INTERCAMBIO: Muestra preview O área de subida, no ambos */}
              {previewFoto ? (
                <div className="preview-imagen">
                  <p><strong>Vista previa de tu nueva foto:</strong></p>
                  <img src={previewFoto} alt="Preview" />
                  <p className="info-archivo">
                    {archivoSeleccionado?.name} ({(archivoSeleccionado?.size / 1024).toFixed(0)} KB)
                  </p>
                  <button 
                    className="btn-cancelar-foto"
                    onClick={() => {
                      setPreviewFoto(null);
                      setArchivoSeleccionado(null);
                    }}
                    style={{ marginTop: '15px' }}
                  >
                    Elegir otra foto
                  </button>
                </div>
              ) : (
                <div 
                  className="area-subida"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.backgroundColor = '#f9f9f9';
                    const archivo = e.dataTransfer.files[0];
                    if (archivo) manejarArchivoSeleccionado(archivo);
                  }}
                  onClick={() => document.getElementById('input-foto').click()}
                >
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>🖼️</div>
                  <p><strong>Arrastra tu foto aquí</strong></p>
                  <p>o haz clic para seleccionar</p>
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    Formatos: JPG, PNG, GIF (max 2MB)
                  </p>
                </div>
              )}

              <input
                id="input-foto"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const archivo = e.target.files[0];
                  if (archivo) manejarArchivoSeleccionado(archivo);
                }}
              />
            </div>

            {/* Botones */}
            <div className="modal-buttons">
              <button 
                className="btn-cancelar"
                onClick={() => setModalFoto(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-guardar"
                onClick={subirFoto}
                disabled={!archivoSeleccionado || subiendoFoto}
              >
                {subiendoFoto ? "Subiendo..." : "Subir Foto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cuenta;