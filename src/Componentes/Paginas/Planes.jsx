import React, { useEffect, useState } from "react";

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

  const [temaOscuro, setTemaOscuro] = useState(() => {
    return localStorage.getItem("darkTheme") === "true";
  });

  useEffect(() => {
    // Escuchar cambios en localStorage para tema oscuro (cuando cambias en Configuracion)
    const onStorageChange = (e) => {
      if (e.key === "darkTheme") {
        setTemaOscuro(e.newValue === "true");
      }
    };

    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: temaOscuro ? "#0f172a" : "#fff",
        minHeight: "100vh",
      }}
    >
      {/* Título y descripción */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2
          style={{
            color: temaOscuro ? "#38bdf8" : "#23747B",
            fontSize: "28px",
            marginBottom: "10px",
          }}
        >
          Planes
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: temaOscuro ? "#a5b4fc" : "#333",
          }}
        >
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
              backgroundColor: temaOscuro ? "#1e293b" : "#23747B",
              borderRadius: "12px",
              width: "280px",
              padding: "30px 20px",
              color: temaOscuro ? "#e0e7ff" : "#fff",
              boxShadow: temaOscuro
                ? "0 4px 12px rgba(255, 255, 255, 0.1)"
                : "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: temaOscuro ? "1px solid #334155" : "none",
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                fontSize: "22px",
                marginBottom: "10px",
                fontWeight: "700",
              }}
            >
              {plan.nombre}
            </h3>
            <p
              style={{
                textAlign: "center",
                fontSize: "20px",
                marginBottom: "20px",
                fontWeight: "600",
              }}
            >
              {plan.precio}
            </p>
            <hr
              style={{
                borderColor: temaOscuro ? "#475569" : "#ddd",
                marginBottom: "20px",
              }}
            />
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: "20px",
                marginBottom: "30px",
                color: temaOscuro ? "#cbd5e1" : "#f0f0f0",
              }}
            >
              {plan.caracteristicas.map((item, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>
                  {item}
                </li>
              ))}
            </ul>
            <button
              style={{
                width: "100%",
                backgroundColor: temaOscuro ? "#334155" : "#e0e0e0",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontWeight: "bold",
                cursor: "pointer",
                color: temaOscuro ? "#a5b4fc" : "#333",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = temaOscuro
                  ? "#475569"
                  : "#cfcfcf";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = temaOscuro
                  ? "#334155"
                  : "#e0e0e0";
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
