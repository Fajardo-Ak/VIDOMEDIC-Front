import React from "react";

const Planes = () => {
  const planes = [
    {
      nombre: "Básico",
      precio: "$00",
      caracteristicas: [
        "todo lo anterior",
        "1 cuenta Premium",
        "Cancela en cualquier momento",
        "Pago por suscripción o pago único",
      ],
    },
    {
      nombre: "Estándar",
      precio: "$249",
      caracteristicas: [
        "todo lo anterior",
        "1 cuenta Premium",
        "Cancela en cualquier momento",
        "Pago por suscripción o pago único",
      ],
    },
    {
      nombre: "Premium",
      precio: "$549",
      caracteristicas: [
        "todo lo anterior",
        "1 cuenta Premium",
        "Cancela en cualquier momento",
        "Pago por suscripción o pago único",
      ],
    },
  ];

  return (
    <div style={{ padding: "40px", backgroundColor: "#fff", minHeight: "100vh" }}>
      {/* Título y descripción */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ color: "#23747B", fontSize: "28px", marginBottom: "10px" }}>Planes</h2>
        <p style={{ fontSize: "16px", color: "#333" }}>
          Conoce nuestros planes y elige el que se adapte a tus necesidades
        </p>
      </div>

      {/* Contenedor de tarjetas */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        {planes.map((plan, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#23747B",
              borderRadius: "8px",
              width: "280px",
              padding: "30px 20px",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ textAlign: "center", fontSize: "22px", marginBottom: "10px" }}>
              {plan.nombre}
            </h3>
            <p style={{ textAlign: "center", fontSize: "20px", marginBottom: "20px" }}>
              {plan.precio}
            </p>
            <hr style={{ borderColor: "#ddd", marginBottom: "20px" }} />
            <ul style={{ listStyle: "disc", paddingLeft: "20px", marginBottom: "30px" }}>
              {plan.caracteristicas.map((item, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>
                  {item}
                </li>
              ))}
            </ul>
            <button
              style={{
                width: "100%",
                backgroundColor: "#e0e0e0",
                border: "none",
                borderRadius: "5px",
                padding: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Obtener plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planes;
