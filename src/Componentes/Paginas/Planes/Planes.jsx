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
  <div className="planes-header">
    <h2 className={`planes-title ${temaOscuro ? "planes-title-dark" : "planes-title-light"}`}>
      Conoce nuestros planes
    </h2>
    <p className={`planes-subtitle ${temaOscuro ? "planes-subtitle-dark" : "planes-subtitle-light"}`}>
      Elige el plan que se adapte mejor a ti.
    </p>
  </div>

  <div className="plans-grid">
    <div className="plan-card">
      <h3>Básico</h3>
      <span className="price">Gratis</span>
      <ul>
        <li>Registro ilimitado de recetas.</li>
        <li>Registro de 1 contacto de confianza.</li>
        <li>Seguimiento fácil de tus recetas médicas.</li>
        <li>Notificaciones y alertas básicas.</li>
        <li>Con anuncios.</li>
      </ul>
      <button className="btn-elegir">Elegir</button>
    </div>

    <div className="plan-card">
      <h3>Premium</h3>
      <span className="price">$72.00/mes</span>
      <ul>
        <li>Todo lo del plan básico.</li>
        <li>Hasta 2 contactos adicionales.</li>
        <li>Registro de recetas con fotos.</li>
        <li>Notificaciones y alertas avanzadas.</li>
        <li>Sin anuncios.</li>
      </ul>
      <button className="btn-elegir">Elegir</button>
    </div>

    <div className="plan-card">
      <div className="plan-header">
        <h3>Plan Anual</h3>
        <span className="price">$692.00/año</span>
        <span className="descuento">$864.00/año</span>
      </div>
      <ul>
        <li>Todo lo del plan Premium.</li>
        <li>20% de descuento por pago anual.</li>
      </ul>
      <button className="btn-elegir">Elegir</button>
    </div>
  </div>
</div>

  );
};

export default Planes;
