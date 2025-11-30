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
        "Registro de 5 medicamentos",
        "Registro de 1 contacto de confianza",
        "Seguimiento fácil de tus recetas médicas",
        "Notificaciones y alertas básicas",
        "Con anuncios"
      ],
      actual: true
    },
    {
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
      actual: false
    },
    {
      nombre: "Plan Experto",
      precio: "$299.00",
      periodo: "/mes",
      caracteristicas: [
        "Todo lo del plan Premium",
        "Medicamentos ilimitados",
        "Hasta 5 contactos"
      ],
      actual: false
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
            <div className="plan-header">
              <h3>{plan.nombre}</h3>
              <div className="price-section">
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

            {plan.actual ? (
              <button className="btn-actual" disabled>
                Plan actual
              </button>
            ) : (
              <button className="btn-elegir">
                Elegir Plan
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planes;
