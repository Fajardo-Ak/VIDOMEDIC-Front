import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const Configuracion = () => {
  const [tamanoFuente, setTamanoFuente] = useState(2);
  const [mostrarActualizaciones, setMostrarActualizaciones] = useState(false);

  const handleCerrarSesion = () => {
    alert('Sesión cerrada exitosamente');
    // lógica real de cerrar sesión
  };

  const handleSliderChange = (e) => {
    setTamanoFuente(e.target.value);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-8 px-4">
      {/* Botón regresar */}
      <button
        className="flex items-center text-blue-600 hover:underline mb-4 self-start"
        onClick={() => window.history.back()}
      >
        <FiArrowLeft className="mr-1" />
        regresar
      </button>

      {/* Título */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Configuración</h1>

      <div className="w-full max-w-md space-y-4">
        {/* Cuenta */}
        <div className="bg-gray-50 rounded-md px-4 py-3 shadow-sm flex items-center justify-between">
          <span className="text-gray-800 font-medium">Cuenta</span>
          <span className="text-gray-400 text-xl">{'>'}</span>
        </div>

        {/* Tamaño de fuente */}
        <div className="bg-gray-50 rounded-md px-4 py-3 shadow-sm">
          <div className="flex items-center mb-3">
            <span className="text-gray-800 font-medium flex-1">Tamaño de fuente</span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            value={tamanoFuente}
            onChange={handleSliderChange}
            className="w-full accent-gray-700"
          />
        </div>

        {/* Actualizaciones */}
        <div className="bg-gray-50 rounded-md px-4 py-3 shadow-sm">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setMostrarActualizaciones(!mostrarActualizaciones)}
          >
            <span className="text-gray-800 font-medium">Actualizaciones</span>
            <span className="text-gray-400 text-xl">{mostrarActualizaciones ? '˄' : '˅'}</span>
          </div>
          {mostrarActualizaciones && (
            <div className="mt-2 text-sm text-gray-600">
              <p>version 1.23.2</p>
            </div>
          )}
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={handleCerrarSesion}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md mt-4"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Configuracion;
