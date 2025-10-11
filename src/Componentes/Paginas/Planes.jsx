import React, { useEffect, useState } from "react";
import "./Planes.css";

const Planes = () => {
  const planes = [
    { nombre: "Básico", precio: "$00", caracteristicas: ["todo lo anterior", "1 cuenta Premium", "Cancela en cualquier momento", "Pago por suscripción o pago único"] },
    { nombre: "Premium", precio: "$549", caracteristicas: ["todo lo anterior", "1 cuenta Premium", "Cancela en cualquier momento", "Pago por suscripción o pago único"] },
  ];

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

  return (
    <div className={`planes-container ${temaOscuro ? "planes-dark" : "planes-light"}`}>
      {/* Título general */}
      <div className="planes-header">
        <h2 className={`planes-title ${temaOscuro ? "planes-title-dark" : "planes-title-light"}`}>
          Elige un plan
        </h2>
        <p className={`planes-subtitle ${temaOscuro ? "planes-subtitle-dark" : "planes-subtitle-light"}`}>
          Conoce nuestros planes y elige el que se adapte a tus necesidades.
        </p>
      </div>

      {/* Tarjetas */}
      <div className="planes-cards">
        {planes.map((plan, index) => (
          <div key={index} className={`plan-card ${temaOscuro ? "plan-card-dark" : "plan-card-light"}`}>
            <h3 className="plan-title">{plan.nombre}</h3>
            <p className="plan-price">{plan.precio}</p>
            <hr className={`plan-divider ${temaOscuro ? "plan-divider-dark" : ""}`} />
            <ul className={`plan-features ${temaOscuro ? "plan-features-dark" : "plan-features-light"}`}>
              {plan.caracteristicas.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <button type="button" className="plan-button">
              Obtener plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planes;
