import React, { useEffect, useState } from "react";
import { CheckCircle, Crown, Star, Zap } from "lucide-react";
import "./Planes.css";
import api from "../../../api/axiosConfig";
import { alertaAdvertencia, alertaExito, alertaAdvertencia } from "../Configuraciones/alertas";

const Planes = () => {
  const [temaOscuro, setTemaOscuro] = useState(false);

  useEffect(() => {
    // Verificar tema oscuro
    const darkTheme = localStorage.getItem("darkTheme") === "true";
    setTemaOscuro(darkTheme);
    
    // Aplicar clase al body
    if (darkTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    // Escuchar cambios en localStorage
    const onStorageChange = (e) => {
      if (e.key === "darkTheme") {
        const newValue = e.newValue === "true";
        setTemaOscuro(newValue);
        if (newValue) {
          document.body.classList.add("dark-theme");
        } else {
          document.body.classList.remove("dark-theme");
        }
      }
    };
    
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

    const planes = [
      {
        id: 1,
        nombre: "Básico",
        precio: "Gratis",
        periodo: "",
        caracteristicas: [
          "Registro de 5 medicamentos",
          "Registro de 1 contacto de confianza",
          "Seguimiento fácil de tus recetas médicas",
          "Notificaciones y alertas básicas",
          "Con anuncios"
        ],
        destacado: true  // este será el resaltado visual
      },
      {
        id: 2,
        nombre: "Premium",
        precio: "$72.00",
        periodo: "/mes",
        caracteristicas: [
          "Todo lo del plan básico",
          "Mas 2 medicamentos adicionales",
          "Hasta 2 contactos adicionales",
          "Registro de recetas con fotos",
          "Notificaciones y alertas avanzadas",
          "Sin anuncios"
        ],
        destacado: false
      },
      {
        id: 3,
        nombre: "Experto",
        precio: "$299.00",
        periodo: "/mes",
        caracteristicas: [
          "Todo lo del plan Premium",
          "Medicamentos ilimitados",
          "Hasta 5 contactos"
        ],
        destacado: false
      }
    ];

 const manejarSeleccionPlan = async (plan) => {
  try {
    const priceIds = {
      "Premium": "price_1SZw1lPtHtavJ0sWeFBgmqBT",
      "Experto": "price_1SZw2iPtHtavJ0sW3Gzrj0Zw"
    };

    if (plan === "Básico") {
      alertaExito("Comenzando plan gratuito con anuncios");
      return;
    }

    const response = await api.post("/create-checkout-session", {
      price_id: priceIds[plan]
    });

    window.location.href = response.data.url;

  } catch (error) {
    console.error("Error al crear sesión de pago:", error);
    if (error.response && error.response.status === 401) {
        alertaAdvertencia("Debes iniciar sesión para suscribirte.");
    } else {
        alertaError("Ocurrió un error al intentar pagar. Intenta de nuevo.");
    }
  }
};

  return (
    <div className="plans-container">
      <div className="plans-header">
        <h2 className="plans-title">
          <Crown size={20} /> Conoce nuestros planes
        </h2>
        <p className="plans-subtitle">
          Elige el plan que se adapte mejor a ti y gestiona tus tratamientos.
        </p>
      </div>

      <div className="plans-grid">
        {planes.map((plan) => (
          <div 
            key={plan.id}
            className={`plan-item ${plan.destacado ? 'plan-highlighted' : ''}`}
          >
            <div className="plan-header">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 'var(--plans-spacing-sm)', 
                marginBottom: 'var(--plans-spacing-md)' 
              }}>
                {plan.icono}
                <h3 className="plan-name">{plan.nombre}</h3>
              </div>
              <div className="price-section">
                <div className="price-main">
                  {plan.precio}
                  <span className="period-text">{plan.periodo}</span>
                </div>
                {plan.precioAnual && (
                  <div className="price-secondary">
                    {plan.precioAnual}
                  </div>
                )}
              </div>
            </div>

            <ul className="features-list">
              {plan.caracteristicas.map((caracteristica, idx) => (
                <li key={idx} className="feature-item">
                  <CheckCircle size={18} />
                  {caracteristica}
                </li>
              ))}
            </ul>

            <button 
              className="plan-select-btn"
              onClick={() => manejarSeleccionPlan(plan.nombre)}
            >
              {plan.nombre === "Básico" ? "Comenzar Gratis" : "Elegir Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planes;
