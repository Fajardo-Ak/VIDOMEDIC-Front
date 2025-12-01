import React, { useState, useEffect } from 'react';
import { FiBell, FiCheck, FiX, FiClock } from 'react-icons/fi';
// Asegúrate de que esta ruta apunte a tu archivo de configuración de axios
// Si este archivo está en src/components, y api en src/api, entonces '../api/axiosConfig' es correcto.
import api from '../api/axiosConfig'; 
import './Notificador.css'; // Importamos los estilos separados

const Notificador = () => {
    const [notificacion, setNotificacion] = useState(null);

    // Reproducir sonido (opcional)
    const reproducirSonido = () => {
        try {
            // Puedes poner un archivo 'alert.mp3' en tu carpeta public
            const audio = new Audio('/alert.mp3'); 
            audio.play().catch(e => console.log("Audio bloqueado por navegador (normal hasta interactuar)"));
        } catch (e) {}
    };

    // 1. CONSULTAR ALERTAS (Polling cada 60s)
    const checarNotificaciones = async () => {
        try {
            // Usamos tu instancia de API configurada
            const response = await api.get('/notificaciones/no-leidas');
            
            // Axios devuelve los datos en .data directamente
            const data = response.data;

            if (data && data.length > 0) {
                // Tomamos la más reciente
                setNotificacion(data[0]);
                reproducirSonido();

                if (navigator.vibrate) {
                    navigator.vibrate([200, 100, 200]);
                }
            }
        } catch (error) {
            // Silencioso en consola para no ensuciar, a menos que sea crítico
            // console.error("Polling notificaciones:", error);
        }
    };

    // 2. MARCAR COMO LEÍDA Y CERRAR
    const cerrarNotificacion = async (redireccionar = false) => {
        if (!notificacion) return;

        try {
            await api.put(`/notificaciones/${notificacion.id}/marcar-leida`);
            
            const accion = notificacion.data.accion;
            setNotificacion(null); // Cerrar modal visualmente

            // Si el botón presionado implica ir a la acción (ej. "/inicio")
            if (redireccionar && accion) {
                window.location.href = accion;
            }

        } catch (error) {
            console.error("Error cerrando notificación", error);
            // Aun si falla la API, cerramos el modal para no bloquear al usuario
            setNotificacion(null);
        }
    };

    // 3. LIFECYCLE
    useEffect(() => {
        checarNotificaciones(); // Checar al montar
        const intervalo = setInterval(checarNotificaciones, 60000); // Checar cada minuto
        return () => clearInterval(intervalo);
    }, []);

    if (!notificacion) return null;

    return (
        <div className="notificador-overlay">
            <div className="notificador-modal animate-pop-in">
                <div className="notificador-header">
                    <div className="icon-wrapper">
                        <FiBell className="bell-icon" />
                    </div>
                    <h3>{notificacion.data.titulo}</h3>
                    <button className="close-btn-mini" onClick={() => cerrarNotificacion(false)}>
                        <FiX />
                    </button>
                </div>
                
                <div className="notificador-body">
                    <p className="mensaje-principal">{notificacion.data.mensaje}</p>
                    <div className="hora-badge">
                        <FiClock /> 
                        <span>Programada: {notificacion.data.hora_dosis}</span>
                    </div>
                </div>

                <div className="notificador-footer">
                    <button 
                        className="btn-confirmar" 
                        onClick={() => cerrarNotificacion(true)}
                    >
                        <FiCheck /> ¡Listo, ya la tomé!
                    </button>
                    <button 
                        className="btn-posponer" 
                        onClick={() => cerrarNotificacion(false)}
                    >
                        Ver después
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notificador;