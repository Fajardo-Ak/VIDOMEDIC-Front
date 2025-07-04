import React from "react";

const Planes = () => {
  const planes = [
    {
      nombre: "Plan Gratuito",
      precio: "$0 / mes",
      caracteristicas: [
        "Registro y Uso Básico",
        "Agregar hasta 6 medicamentos",
        "Notificaciones básicas",
        "Agregar hasta 1 familiar",
      ],
      destacado: false,
      colorBorde: "#1e7a8c",
    },
    {
      nombre: "Plan Premier",
      precio: "$9.99 / mes",
      caracteristicas: [
        "Número limitado de medicamentos hasta 10",
        "Notificaciones avanzadas",
        "Sincronización con la nube",
        "Registro de 4 familiares",
      ],
      destacado: true,
      colorBorde: "#72160D",
    },
    {
      nombre: "Plan Pro",
      precio: "$19.99 / mes",
      caracteristicas: [
        "Medicamentos ilimitados",
        "Notificaciones premium",
        "Sincronización avanzada",
        "Soporte 24/7",
      ],
      destacado: false,
      colorBorde: "#234567",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        padding: "40px 20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {planes.map((plan, index) => (
        <div
          key={index}
          style={{
            border: `3px solid ${plan.colorBorde}`,
            borderRadius: "10px",
            padding: "25px",
            width: "300px",
            backgroundColor: "white",
            position: "relative",
            boxShadow: plan.destacado ? "0 5px 15px rgba(0,0,0,0.2)" : "none",
            transform: plan.destacado ? "scale(1.05)" : "none",
            transition: "transform 0.3s ease",
            textAlign: "center",
          }}
        >
          {plan.destacado && (
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: plan.colorBorde,
                color: "white",
                padding: "5px 20px",
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              RECOMENDADO
            </div>
          )}
          <h2 style={{ color: plan.colorBorde, marginBottom: "15px" }}>
            {plan.nombre}
          </h2>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "25px",
            }}
          >
            {plan.precio}
          </p>
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
              marginBottom: "30px",
              textAlign: "left",
            }}
          >
            {plan.caracteristicas.map((carac, i) => (
              <li
                key={i}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: plan.colorBorde,
                    marginRight: "10px",
                    fontSize: "18px",
                  }}
                >
                  ✓
                </span>
                {carac}
              </li>
            ))}
          </ul>
          <button
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: plan.colorBorde,
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
            onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
          >
            {plan.nombre === "Plan Gratuito" ? "Usar Gratis" : "Contratar Ahora"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Planes;
