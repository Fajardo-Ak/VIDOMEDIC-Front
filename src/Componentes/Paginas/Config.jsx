import React, { useState, useEffect } from 'react';
import { 
  FiArrowLeft, FiUser, FiType, FiBell, FiLogOut, FiSun, FiMoon, FiMail 
} from 'react-icons/fi';

const Configuracion = () => {
  // Estados para las preferencias de usuario
  const [tamanoFuente, setTamanoFuente] = useState(() => {
    const savedSize = localStorage.getItem('fontSize');
    return savedSize ? parseInt(savedSize) : 2;
  });

  const [temaOscuro, setTemaOscuro] = useState(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    return savedTheme === 'true';
  });

  const [mostrarActualizaciones, setMostrarActualizaciones] = useState(false);
  const [sesionCerrada, setSesionCerrada] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState(localStorage.getItem('userName') || '');
  const [emailUsuario, setEmailUsuario] = useState(localStorage.getItem('userEmail') || '');

  // Nuevos estados para abrir modales
  const [modalCuenta, setModalCuenta] = useState(false);
  const [modalFuente, setModalFuente] = useState(false);
  const [modalTema, setModalTema] = useState(false);

  // Aplicar preferencias al cargar el componente
  useEffect(() => {
    // Aplicar tamaño de fuente
    const sizes = ['text-base', 'text-lg', 'text-xl'];
    document.documentElement.classList.remove('text-base', 'text-lg', 'text-xl');
    document.documentElement.classList.add(sizes[tamanoFuente - 1]);

    // Aplicar tema
    if (temaOscuro) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('color-scheme', 'light');
    }

    // Guardar preferencias
    localStorage.setItem('fontSize', tamanoFuente.toString());
    localStorage.setItem('darkTheme', temaOscuro.toString());
  }, [tamanoFuente, temaOscuro]);

  // Manejar cierre de sesión
  const handleCerrarSesion = () => {
    setSesionCerrada(true);
    setTimeout(() => {
      setSesionCerrada(false);
      alert('Sesión cerrada exitosamente');
    }, 2000);
  };

  // Guardar información de cuenta
  const handleGuardarCuenta = () => {
    localStorage.setItem('userName', nombreUsuario);
    localStorage.setItem('userEmail', emailUsuario);
  };

  // Obtener etiqueta para tamaño de fuente
  const getSizeLabel = () => {
    switch(tamanoFuente) {
      case 1: return 'Normal';
      case 2: return 'Grande';
      case 3: return 'Extra Grande';
      default: return 'Grande';
    }
  };

  // Estilos para modales y secciones
  const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: temaOscuro ? '#1e293b' : '#fff',
      color: temaOscuro ? '#e2e8f0' : '#1e293b',
      borderRadius: '1rem',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      padding: '2rem',
      position: 'relative'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'linear-gradient(to right, #1F7A8C, #25a18e)',
      color: '#fff',
      padding: '1rem',
      borderRadius: '0.75rem 0.75rem 0 0'
    },
    modalActions: {
      marginTop: '2rem',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      color: '#fff',
      cursor: 'pointer',
      transition: 'transform 0.2s ease'
    },
    sectionCard: {
      cursor: 'pointer',
      background: '#1F7A8C',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
      border: '2px solid #145e6a',
      color: '#f0f9ff',
      transition: 'background-color 0.3s ease',
      userSelect: 'none'
    },
    sectionCardHover: {
      background: '#176474',
      borderColor: '#0f454f',
    },
    sectionTitle: {
      fontWeight: '700',
      fontSize: '1.25rem',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    sectionContent: {
      marginLeft: '2.5rem',
      fontSize: '1rem'
    }
  };

  // Función para combinar estilos (para hover simple con inline)
  const combineStyles = (base, extra) => ({ ...base, ...extra });

  // Control de hover para tarjetas (opcional, aquí con hooks simples)
  const [hoverCuenta, setHoverCuenta] = useState(false);
  const [hoverFuente, setHoverFuente] = useState(false);
  const [hoverTema, setHoverTema] = useState(false);
  const [hoverActualizaciones, setHoverActualizaciones] = useState(false);

  return (
    <div className="container-fluid py-4 px-2 px-md-4 min-h-screen" style={{ backgroundColor: temaOscuro ? '#0f172a' : '#ffffff' }}>
      <div className="card shadow-lg p-3 p-md-4" style={{ borderColor: "#1e7a8c" }}>
        {/* Encabezado */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <button
              className={`flex items-center py-3 px-5 rounded-xl transition-all text-lg font-medium shadow-md mb-4 md:mb-0 ${
                temaOscuro 
                  ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' 
                  : 'bg-white text-blue-600 hover:bg-blue-100'
              }`}
              onClick={() => window.history.back()}
            >
              <FiArrowLeft className="mr-2 text-xl" />
              Regresar
            </button>

            <div className="flex items-center">
              <div className={`p-3 rounded-xl mr-3 ${temaOscuro ? 'bg-blue-900' : 'bg-blue-700'}`}>
                <FiSun className={`text-xl ${temaOscuro ? 'text-blue-300' : 'text-white'}`} />
              </div>
              <h1 className={`text-2xl md:text-3xl font-bold ${temaOscuro ? 'text-gray-100' : 'text-gray-900'}`}>
                Configuración
              </h1>
            </div>
          </div>

          {/* Feedback de sesión cerrada */}
          {sesionCerrada && (
            <div className={`mb-6 p-4 rounded-xl flex items-center shadow-md ${
              temaOscuro 
                ? 'bg-green-900 text-green-200' 
                : 'bg-green-100 text-green-800'
            }`}>
              <div className="animate-pulse mr-3 text-xl">🔒</div>
              <span className="font-medium text-lg">Cerrando sesión...</span>
            </div>
          )}
        </div>

        {/* Contenedor principal en cuadrícula */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta de Cuenta */}
          <div
            style={hoverCuenta ? combineStyles(styles.sectionCard, styles.sectionCardHover) : styles.sectionCard}
            onClick={() => setModalCuenta(true)}
            onMouseEnter={() => setHoverCuenta(true)}
            onMouseLeave={() => setHoverCuenta(false)}
          >
            <div style={styles.sectionTitle}>
              <FiUser size={24} />
              Cuenta
            </div>

            <div style={styles.sectionContent}>
              <p>Nombre: <strong>{nombreUsuario || '—'}</strong></p>
              <p>Email: <strong>{emailUsuario || '—'}</strong></p>
            </div>
          </div>

          {/* Tarjeta Tamaño de fuente */}
          <div
            style={hoverFuente ? combineStyles(styles.sectionCard, styles.sectionCardHover) : styles.sectionCard}
            onClick={() => setModalFuente(true)}
            onMouseEnter={() => setHoverFuente(true)}
            onMouseLeave={() => setHoverFuente(false)}
          >
            <div style={styles.sectionTitle}>
              <FiType size={24} />
              Tamaño de fuente
            </div>

            <div style={styles.sectionContent}>
              <p>
                Tamaño actual: <strong>{getSizeLabel()}</strong> ({tamanoFuente}/3)
              </p>
            </div>
          </div>

          {/* Tarjeta Tema */}
          <div
            style={hoverTema ? combineStyles(styles.sectionCard, styles.sectionCardHover) : styles.sectionCard}
            onClick={() => setModalTema(true)}
            onMouseEnter={() => setHoverTema(true)}
            onMouseLeave={() => setHoverTema(false)}
          >
            <div style={styles.sectionTitle}>
              {temaOscuro ? <FiMoon size={24} /> : <FiSun size={24} />}
              Tema
            </div>

            <div style={styles.sectionContent}>
              <p>
                {temaOscuro
                  ? 'Modo oscuro activado, ideal para ambientes con poca luz.'
                  : 'Modo claro activado, ideal para ambientes bien iluminados.'}
              </p>
            </div>
          </div>

          {/* Actualizaciones */}
          <div
            style={hoverActualizaciones ? combineStyles(styles.sectionCard, styles.sectionCardHover) : styles.sectionCard}
            onClick={() => setMostrarActualizaciones(!mostrarActualizaciones)}
            onMouseEnter={() => setHoverActualizaciones(true)}
            onMouseLeave={() => setHoverActualizaciones(false)}
          >
            <div style={{...styles.sectionTitle, justifyContent: 'space-between', cursor: 'pointer'}}>
              <span style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                <FiBell size={24} />
                Actualizaciones
              </span>
              <span style={{
                transform: mostrarActualizaciones ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                userSelect: 'none'
              }}>
                ▼
              </span>
            </div>

            {mostrarActualizaciones && (
              <div style={{marginLeft: '2.5rem', marginTop: '1rem', fontSize: '1rem'}}>
                <h3 style={{fontWeight: '700', marginBottom: '0.75rem'}}>Versión actual</h3>
                <div style={{backgroundColor: temaOscuro ? '#145e6a' : '#b7def0', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', color: temaOscuro ? '#c7f0f7' : '#0f496a' }}>
                  <strong>v1.23.2</strong> - Estable
                </div>

                <h3 style={{fontWeight: '700', marginBottom: '0.75rem'}}>Últimas actualizaciones</h3>
                <ul style={{listStyleType: 'disc', paddingLeft: '1.5rem', color: temaOscuro ? '#d0f1ff' : '#345a75'}}>
                  <li>Mejorada la accesibilidad para personas con visión reducida</li>
                  <li>Nuevo sistema de recordatorios de medicamentos</li>
                  <li>Corrección de errores menores en el calendario</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <div className="mt-8">
          <button
            onClick={handleCerrarSesion}
            className={`w-full flex items-center justify-center py-5 rounded-xl font-semibold text-xl shadow-lg transition-all hover:scale-[1.02] ${
              temaOscuro
                ? 'bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-red-100'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
            }`}
          >
            <FiLogOut className="mr-3 text-xl" />
            Cerrar sesión
          </button>
        </div>

        {/* Footer descriptivo */}
        <footer className={`mt-10 pt-6 text-center w-full border-t text-lg ${
          temaOscuro ? 'border-gray-800 text-gray-400' : 'border-gray-300 text-gray-600'
        }`}>
          <p className="mb-2">
            Configuración diseñada para adultos mayores y personas con visión reducida
          </p>
          <p>
            Tus preferencias se guardan automáticamente en este dispositivo
          </p>
        </footer>
      </div>

      {/* --- MODAL CUENTA --- */}
      {modalCuenta && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Editar Cuenta</h2>
              <button 
                style={styles.closeButton}
                onClick={() => setModalCuenta(false)}
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-medium">Name :</label>
              <input
                type="text"
                value={nombreUsuario}
                onChange={e => setNombreUsuario(e.target.value)}
                className={`w-full p-3 rounded-lg mb-4 ${
                  temaOscuro ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                }`}
                placeholder="Ingresa tu nombre"
              />
              <br />   

              <label className="block mb-2 font-medium">Email      :</label>
              <input
                type="email"
                value={emailUsuario}
                onChange={e => setEmailUsuario(e.target.value)}
                className={`w-full p-3 rounded-lg ${
                  temaOscuro ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                }`}
                placeholder="Ingresa tu email"
              />

              <div style={styles.modalActions}>
                <button 
                  onClick={() => setModalCuenta(false)}
                  className={`px-5 py-2 rounded-lg font-medium ${
                    temaOscuro ? 'bg-gray-600 text-gray-200' : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    handleGuardarCuenta();
                    setModalCuenta(false);
                  }}
                  className="bg-[#1F7A8C] text-white px-5 py-2 rounded-lg font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TAMAÑO DE FUENTE --- */}
      {modalFuente && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Tamaño de Fuente</h2>
              <button 
                style={styles.closeButton}
                onClick={() => setModalFuente(false)}
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <p className={`text-lg ${temaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
                Ajusta el tamaño de fuente para facilitar la lectura:
              </p>

              {[1,2,3].map(size => (
                <button
                  key={size}
                  onClick={() => setTamanoFuente(size)}
                  className={`w-full py-3 rounded-lg text-center font-semibold transition-colors ${
                    tamanoFuente === size 
                      ? 'bg-[#1F7A8C] text-white' 
                      : temaOscuro
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size === 1 ? 'Normal' : size === 2 ? 'Grande' : 'Extra Grande'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TEMA --- */}
      {modalTema && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2>Configuración de Tema</h2>
              <button 
                style={styles.closeButton}
                onClick={() => setModalTema(false)}
                title="Cerrar"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <center><p className={`text-lg ${temaOscuro ? 'text-gray-300' : 'text-gray-700'}`}>
                Selecciona el modo visual que prefieras:
              </p>
              </center>
<center>
              <button
                onClick={() => setTemaOscuro(false)}
                className={`w-full py-3 rounded-lg text-center font-semibold transition-colors ${
                  !temaOscuro
                    ? 'bg-[#1F7A8C] text-white' 
                    : temaOscuro
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Modo Claro <FiSun className="inline ml-2" />
              </button>

              <button
                onClick={() => setTemaOscuro(true)}
                className={`w-full py-3 rounded-lg text-center font-semibold transition-colors ${
                  temaOscuro
                    ? 'bg-[#1F7A8C] text-white' 
                    : temaOscuro
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Modo Oscuro <FiMoon className="inline ml-2" />
              </button>
              </center>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracion;
