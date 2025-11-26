import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import "./Planes.css";

const Planes = () => {
  const [temaOscuro, setTemaOscuro] = useState(() => {
    return localStorage.getItem("darkTheme") === "true";
  });

  useEffect(() => {
    const onStorageChange = (e) => {
      if (e.key === "darkTheme") {
        setTemaOscuro(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const planes = [
    {
      nombre: "Básico",
      precio: "Gratis",
      periodo: "",
      caracteristicas: [
        "Registro ilimitado de recetas",
        "Registro de 1 contacto de confianza",
        "Seguimiento fácil de tus recetas médicas",
        "Notificaciones y alertas básicas",
        "Con anuncios"
      ],
      tieneDescuento: false
    },
    {
      nombre: "Premium",
      precio: "$72.00",
      periodo: "/mes",
      caracteristicas: [
        "Todo lo del plan básico",
        "Hasta 2 contactos adicionales",
        "Registro de recetas con fotos",
        "Notificaciones y alertas avanzadas",
        "Sin anuncios"
      ],
      tieneDescuento: false
    },
    {
      nombre: "Plan Anual",
      precio: "$692.00",
      periodo: "/año",
      caracteristicas: [
        "Todo lo del plan Premium",
        "20% de descuento por pago anual",
        "Ahorro de $172 comparado con mensual",
        "Facturación anual única"
      ],
      tieneDescuento: true,
      precioOriginal: "$864.00/año"
    }
  ];

  return (
    <div className={`planes-container ${temaOscuro ? "planes-dark" : "planes-light"}`}>
      <div className="planes-header">
        <h2 className={`planes-title ${temaOscuro ? "planes-title-dark" : "planes-title-light"}`}>
          Conoce nuestros planes
        </h2>
        <p className={`planes-subtitle ${temaOscuro ? "planes-subtitle-dark" : "planes-subtitle-light"}`}>
          Elige el plan que se adapte mejor a ti.
        </p>
      </div>

      <div className="plans-grid">
        {planes.map((plan, index) => (
          <div key={index} className="plan-card">
            {plan.tieneDescuento && (
              <div className="discount-badge">
                ¡20% OFF!
              </div>
            )}
            
            <div className="plan-header">
              <h3>{plan.nombre}</h3>
              <div className="price-section">
                {plan.tieneDescuento && (
                  <span className="original-price">{plan.precioOriginal}</span>
                )}
                <div className="price">
                  {plan.precio}
                  <span className="period">{plan.periodo}</span>
                </div>
              </div>
            </div>

            <ul className="plan-features">
              {plan.caracteristicas.map((caracteristica, idx) => (
                <li key={idx}>
                  <CheckCircle size={18} />
                  {caracteristica}
                </li>
              ))}
            </ul>

            <button className="btn-elegir">
              Elegir Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planes;