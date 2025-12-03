import axios from "axios";

// === CAMBIO IMPORTANTE ===
// Aquí le decimos: "Si existe una variable de entorno (Vercel), úsala.
// Si no existe (estás en tu PC), usa localhost".
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// === INTERCEPTOR DE TOKEN (IMPORTANTE) ===
// Esto asegura que cuando inicies sesión, el token se envíe automáticamente
// en todas las peticiones futuras (necesario para ver /inicio, /historial, etc.)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;