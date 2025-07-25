import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiSun, FiMoon, FiUser, FiType, FiBell, FiLogOut } from 'react-icons/fi';

const Configuracion = () => {
  const [tamanoFuente, setTamanoFuente] = useState(() => parseInt(localStorage.getItem('fontSize')) || 2);
  const [temaOscuro, setTemaOscuro] = useState(() => localStorage.getItem('darkTheme') === 'true');
  const [mostrarActualizaciones, setMostrarActualizaciones] = useState(false);
  const [sesionCerrada, setSesionCerrada] = useState(false);

  useEffect(() => {
    const sizes = ['text-base', 'text-lg', 'text-xl'];
    document.documentElement.classList.remove(...sizes);
    document.documentElement.classList.add(sizes[tamanoFuente - 1]);
    localStorage.setItem('fontSize', tamanoFuente);

    if (temaOscuro) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
    localStorage.setItem('darkTheme', temaOscuro);
  }, [tamanoFuente, temaOscuro]);

  const handleCerrarSesion = () => {
    setSesionCerrada(true);
    setTimeout(() => {
      setSesionCerrada(false);
      alert('Sesión cerrada exitosamente');
    }, 3000);
  };

  const getSizeLabel = () => ['Normal', 'Grande', 'Extra Grande'][tamanoFuente - 1];

  return (
    <main
      role="main"
      className={`min-h-screen flex flex-col items-center py-8 px-4 transition-colors duration-500 ${
        temaOscuro ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'
      }`}
      aria-label="Configuración de usuario"
    >
      {/* Encabezado */}
      <header className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <button
            aria-label="Regresar"
            className={`flex items-center py-2 px-4 rounded-lg transition-colors ${
              temaOscuro ? 'bg-gray-800 text-blue-400 hover:bg-gray-700' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
            }`}
            onClick={() => window.history.back()}
          >
            <FiArrowLeft className="mr-2" />
            Regresar
          </button>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <FiSun className="mr-2" />
            Configuración
          </h1>
        </div>

        {sesionCerrada && (
          <div
            role="status"
            aria-live="assertive"
            className={`mb-6 p-4 rounded-lg flex items-center ${
              temaOscuro ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
            }`}
          >
            <div className="animate-pulse mr-3">🔒</div>
            <span className="font-medium">Cerrando sesión...</span>
          </div>
        )}
      </header>

      {/* CUERPO DE CONFIGURACIÓN */}
      <section className="w-full max-w-2xl space-y-6">

        {/* Cuenta */}
        <article className={`rounded-xl p-5 shadow-lg cursor-default ${
          temaOscuro ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
        }`}>
          <div className="flex items-center mb-3">
            <FiUser className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">Cuenta</h2>
          </div>
          <p className={`${temaOscuro ? 'text-gray-300' : 'text-gray-600'}`}>
            Administra tu información personal y preferencias de cuenta.
          </p>
        </article>

        {/* Tamaño de fuente */}
        <article className={`rounded-xl p-5 shadow-lg ${temaOscuro ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="flex items-center mb-4">
            <FiType className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">Tamaño de fuente</h2>
          </div>

          <label className="block mb-2 text-sm" htmlFor="sliderFuente">
            Tamaño actual: <strong>{getSizeLabel()}</strong>
          </label>

          <input
            id="sliderFuente"
            type="range"
            min={1}
            max={3}
            value={tamanoFuente}
            onChange={(e) => setTamanoFuente(parseInt(e.target.value))}
            className={`w-full h-3 rounded-lg appearance-none cursor-pointer ${
              temaOscuro ? 'accent-blue-400 bg-gray-700' : 'accent-blue-600 bg-gray-200'
            }`}
            aria-valuetext={getSizeLabel()}
            aria-label="Tamaño de fuente"
          />

          <div className="flex justify-between mt-2 text-sm">
            <span style={{ fontSize: '12px' }}>A</span>
            <span style={{ fontSize: '16px' }}>Aa</span>
            <span style={{ fontSize: '20px' }}>Aa</span>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-opacity-20" style={{
            backgroundColor: temaOscuro ? '#4B5563' : '#E5E7EB',
          }}>
            <p className="text-center">
              <span className="text-lg">Vista previa: </span>
              Este es un texto con el tamaño de fuente seleccionado.
            </p>
          </div>
        </article>

        {/* Tema */}
        <article className={`rounded-xl p-5 shadow-lg ${temaOscuro ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {temaOscuro ? <FiMoon className="mr-3 text-xl" /> : <FiSun className="mr-3 text-xl" />}
              <h2 className="text-xl font-semibold">Tema</h2>
            </div>
            <button
              onClick={() => setTemaOscuro(!temaOscuro)}
              aria-label="Cambiar tema"
              className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                temaOscuro ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              <span className="mr-2">{temaOscuro ? 'Oscuro' : 'Claro'}</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                temaOscuro ? 'bg-gray-800' : 'bg-yellow-300'
              }`}>
                {temaOscuro ? <FiMoon size={14} /> : <FiSun size={14} />}
              </div>
            </button>
          </div>
          <p className={`${temaOscuro ? 'text-gray-300' : 'text-gray-600'}`}>
            El tema {temaOscuro ? 'oscuro es ideal para entornos con poca luz' : 'claro es más visible con luz ambiental'}.
          </p>
        </article>

        {/* Actualizaciones */}
        <article
          className={`rounded-xl p-5 shadow-lg cursor-pointer transition-colors ${
            temaOscuro ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
          }`}
          onClick={() => setMostrarActualizaciones(!mostrarActualizaciones)}
          role="button"
          tabIndex={0}
          aria-expanded={mostrarActualizaciones}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="mr-3 text-xl" />
              <h2 className="text-xl font-semibold">Actualizaciones</h2>
            </div>
            <span className="text-2xl">{mostrarActualizaciones ? '▲' : '▼'}</span>
          </div>

          {mostrarActualizaciones && (
            <div className={`mt-4 pt-4 border-t ${temaOscuro ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="font-semibold mb-2">Última versión</h3>
              <div className={`p-3 rounded-lg font-mono ${temaOscuro ? 'bg-gray-700' : 'bg-gray-200'}`}>
                v1.23.2 — Estable
              </div>

              <ul className={`mt-4 space-y-2 ${temaOscuro ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>✔ Mejoras en accesibilidad</li>
                <li>✔ Recordatorios de medicamentos actualizados</li>
                <li>✔ Corrección de errores en el calendario</li>
              </ul>

              <button className={`mt-4 w-full py-2 rounded-lg font-medium ${
                temaOscuro ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}>
                Buscar actualizaciones
              </button>
            </div>
          )}
        </article>

        {/* Cerrar sesión */}
        <button
          onClick={handleCerrarSesion}
          className={`w-full flex items-center justify-center py-4 rounded-xl font-semibold text-lg shadow-lg transition-transform hover:scale-[1.02] ${
            temaOscuro ? 'bg-red-800 hover:bg-red-700 text-red-100' : 'bg-red-600 hover:bg-red-500 text-white'
          }`}
          aria-label="Cerrar sesión"
        >
          <FiLogOut className="mr-3" />
          Cerrar sesión
        </button>
      </section>

      {/* Footer */}
      <footer className={`mt-10 pt-6 text-center max-w-2xl w-full border-t ${
        temaOscuro ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
      }`}>
        <p className="mb-2">Configuración adaptada para adultos mayores o personas con baja visión.</p>
        <p>Tus preferencias se guardan automáticamente en este dispositivo.</p>
      </footer>
    </main>
  );
};

export default Configuracion;
