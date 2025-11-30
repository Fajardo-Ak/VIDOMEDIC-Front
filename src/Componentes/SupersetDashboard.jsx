import React, { useEffect, useRef } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";

const DASHBOARD_ID = "2bdaffb0-70d3-4cc7-bee1-47454cf46d1a";

// Función universal para leer variables de entorno (Vite o CRA)
const env = (keyVite, keyCRA, fallback) => {
  // Soporte seguro para Vite (no truena en CRA)
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[keyVite]) {
    return import.meta.env[keyVite];
  }

  // Soporte CRA
  if (process.env[keyCRA]) {
    return process.env[keyCRA];
  }

  return fallback;
};

const SUPERSET_URL = env("VITE_SUPERSET_URL", "REACT_APP_SUPERSET_URL", "http://localhost:8088");
const BACKEND_URL = env("VITE_BACKEND_URL", "REACT_APP_BACKEND_URL", "http://localhost:8000");

const SupersetDashboard = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    embedDashboard({
      id: DASHBOARD_ID,
      supersetDomain: SUPERSET_URL,
      mountPoint: containerRef.current,

      fetchGuestToken: async () => {
        const res = await fetch(`${BACKEND_URL}/api/superset/guest-token`);

        if (!res.ok) {
          throw new Error("No se pudo obtener guest token");
        }

        const data = await res.json();
        return data.token;
      },

      dashboardUiConfig: {
        hideTitle: false,
        hideTab: false,
        hideChartControls: true,
        filters: {
          visible: true,
          expanded: false,
        },
      },

      iframeSandboxExtras: [
        "allow-top-navigation",
        "allow-popups-to-escape-sandbox",
      ],

      referrerPolicy: "strict-origin-when-cross-origin",
    });
  }, []);

  return (
    <>
      <style>
        {`
          .superset-container iframe {
            width: 100% !important;
            height: 100% !important;
            border: none !important;
          }
        `}
      </style>

      <div
        className="superset-container"
        ref={containerRef}
        style={{
          width: "100%",
          height: "100vh",
          position: "relative",
          top: 0,
          left: 0,
          zIndex: 9999,
          backgroundColor: "#fff",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      />
    </>
  );
};

export default SupersetDashboard;
