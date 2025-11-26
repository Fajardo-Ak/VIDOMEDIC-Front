import React, { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";

const Cuenta = () => {
  // Estados para datos del usuario
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    foto_perfil: null
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
      const response = await fetch('http://localhost:8000/api/usuario/perfil', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUsuario(data.usuario);
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
      alert('Por favor, selecciona una imagen válida (JPG, PNG o GIF)');
      return;
    }

    if (archivo.size > 2 * 1024 * 1024) {
      alert('La imagen es muy grande. Máximo 2MB permitido');
      return;
    }

    setArchivoSeleccionado(archivo);
    const previewURL = URL.createObjectURL(archivo);
    setPreviewFoto(previewURL);
  };

  // Funciones para guardar cambios
  const guardarCambiosPerfil = async () => {
    if (!datosEditados.nombre.trim() || !datosEditados.correo.trim()) {
      alert("Por favor, completa todos los campos");
      return;
    }

    setGuardando(true);

    try {
      const response = await fetch('http://localhost:8000/api/usuario/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(datosEditados)
      });

      const data = await response.json();

      if (data.success) {
        setUsuario({
          ...usuario,
          nombre: datosEditados.nombre,
          correo: datosEditados.correo
        });
        setModalEditando(false);
        alert("Perfil actualizado correctamente");
      } else {
        alert(data.error || "Error al actualizar perfil");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarPassword = async () => {
    if (!datosPassword.password_actual || !datosPassword.nueva_password) {
      alert("Por favor, completa todos los campos");
      return;
    }

    if (datosPassword.nueva_password !== datosPassword.confirmar_password) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    setCambiandoPassword(true);

    try {
      const response = await fetch('http://localhost:8000/api/usuario/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          password_actual: datosPassword.password_actual,
          nueva_password: datosPassword.nueva_password
        })
      });

      const data = await response.json();

      if (data.success) {
        setModalPassword(false);
        alert("Contraseña cambiada correctamente");
      } else {
        alert(data.message || "Error al cambiar contraseña");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error de conexión");
    } finally {
      setCambiandoPassword(false);
    }
  };

  const subirFoto = async () => {
    if (!archivoSeleccionado) return;

    setSubiendoFoto(true);

    try {
      const formData = new FormData();
      formData.append('foto', archivoSeleccionado);

      const response = await fetch('http://localhost:8000/api/usuario/foto', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setUsuario({
          ...usuario,
          foto_perfil: data.foto_perfil
        });
        setModalFoto(false);
        alert('Foto de perfil actualizada correctamente');
      } else {
        alert(data.message || 'Error al subir la foto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al subir la foto');
    } finally {
      setSubiendoFoto(false);
    }
  };

  // Obtener foto de perfil
  const obtenerFotoPerfil = () => {
    if (usuario.foto_perfil) {
      return usuario.foto_perfil;
    } else {
      return 'http://localhost:8000/images/usuario-default.png';
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

  return (
    <div>
      {/* Sección de cuenta con los estilos originales */}
      <div className="config-section">
        <div className="section-title">
          <FiUser /> Información de Cuenta
        </div>
        
        {/* Foto de perfil */}
        <div className="foto-perfil" onClick={abrirModalFoto}>
          <img 
            src={obtenerFotoPerfil()} 
            alt="Foto de perfil" 
            className="foto-usuario"
          />
          <p>Haz clic para cambiar foto</p>
        </div>
        
        {/* Información */}
        <p onClick={abrirModalEdicion}>
          Nombre: <strong>{usuario.nombre || "—"}</strong>
        </p>
        <p onClick={abrirModalEdicion}>
          Email: <strong>{usuario.correo || "—"}</strong>
        </p>
        <p onClick={abrirModalPassword}>
          Contraseña: <strong>••••••••</strong>
        </p>
      </div>

      {/* Modal de edición */}
      {modalEditando && (
        <div 
          className="config-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalEditando(false);
            }
          }}
        >
          <div className="config-modal">
            <div className="config-modal-header">
              <h3>Editar cuenta</h3>
            </div>
            
            <input
              className="modal-input"
              type="text"
              value={datosEditados.nombre}
              placeholder="Nombre"
              onChange={(e) => setDatosEditados({...datosEditados, nombre: e.target.value})}
              disabled={guardando}
            />
            
            <input
              className="modal-input"
              type="email"
              value={datosEditados.correo}
              placeholder="Correo electrónico"
              onChange={(e) => setDatosEditados({...datosEditados, correo: e.target.value})}
              disabled={guardando}
            />
            
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => setModalEditando(false)}
                disabled={guardando}
              >
                Cancelar
              </button>
              
              <button 
                className="save-button" 
                onClick={guardarCambiosPerfil}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cambiar contraseña */}
      {modalPassword && (
        <div 
          className="config-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalPassword(false);
            }
          }}
        >
          <div className="config-modal">
            <div className="config-modal-header">
              <h3>Cambiar contraseña</h3>
            </div>
            
            <input
              className="modal-input"
              type="password"
              value={datosPassword.password_actual}
              placeholder="Contraseña actual"
              onChange={(e) => setDatosPassword({...datosPassword, password_actual: e.target.value})}
              disabled={cambiandoPassword}
            />
            
            <input
              className="modal-input"
              type="password"
              value={datosPassword.nueva_password}
              placeholder="Nueva contraseña"
              onChange={(e) => setDatosPassword({...datosPassword, nueva_password: e.target.value})}
              disabled={cambiandoPassword}
            />
            
            <input
              className="modal-input"
              type="password"
              value={datosPassword.confirmar_password}
              placeholder="Confirmar nueva contraseña"
              onChange={(e) => setDatosPassword({...datosPassword, confirmar_password: e.target.value})}
              disabled={cambiandoPassword}
            />
            
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => setModalPassword(false)}
                disabled={cambiandoPassword}
              >
                Cancelar
              </button>
              
              <button 
                className="save-button" 
                onClick={cambiarPassword}
                disabled={cambiandoPassword}
              >
                {cambiandoPassword ? "Cambiando..." : "Cambiar contraseña"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de foto */}
      {modalFoto && (
        <div 
          className="config-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalFoto(false);
            }
          }}
        >
          <div className="config-modal">
            <div className="config-modal-header">
              <h3>Cambiar foto de perfil</h3>
            </div>
            
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
                if (archivo) {
                  manejarArchivoSeleccionado(archivo);
                }
              }}
              onClick={() => document.getElementById('input-foto').click()}
            >
              <div style={{fontSize: '48px', marginBottom: '10px'}}>🖼️</div>
              <p><strong>Arrastra tu foto aquí</strong></p>
              <p>o haz clic para seleccionar</p>
              <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                Formatos: JPG, PNG, GIF (max 2MB)
              </p>
            </div>

            {/* Preview de la imagen seleccionada */}
            {previewFoto && (
              <div className="preview-imagen">
                <p><strong>Vista previa:</strong></p>
                <img 
                  src={previewFoto} 
                  alt="Preview" 
                />
                <p className="info-archivo">
                  {archivoSeleccionado?.name} ({(archivoSeleccionado?.size / 1024).toFixed(0)} KB)
                </p>
              </div>
            )}
            
            {/* Input oculto para seleccionar archivo */}
            <input
              id="input-foto"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              style={{display: 'none'}}
              onChange={(e) => {
                const archivo = e.target.files[0];
                if (archivo) {
                  manejarArchivoSeleccionado(archivo);
                }
              }}
            />
            
            <div className="modal-buttons">
              <button 
                className="cancel-button"
                onClick={() => setModalFoto(false)}
              >
                Cancelar
              </button>
              
              <button 
                className="save-button"
                onClick={subirFoto} 
                disabled={!archivoSeleccionado || subiendoFoto}
              >
                {subiendoFoto ? "Subiendo..." : "Subir foto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cuenta;