import React, { useEffect, useRef } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";

const DASHBOARD_ID = "a62b7e75-5306-494c-a6f2-2f7e4a3f332c";

const env = (keyVite, keyCRA, fallback) => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[keyVite]) {
    return import.meta.env[keyVite];
  }
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
        const res = await fetch(`${BACKEND_URL}/superset/guest-token`);
        if (!res.ok) {
          throw new Error("No se pudo obtener guest token");
        }
        const data = await res.json();
        return data.token;
      },

      dashboardUiConfig: {
        hideTitle: false,      // Mostrar título
        hideTab: false,        // Mostrar tabs
        hideChartControls: false, // Mostrar controles de gráficos
        filters: {
          visible: true,       // Mostrar filtros
          expanded: true,      // Expandir filtros por defecto
        },
      },

      // Configuración clave para mostrar el sidebar
      uiConfig: {
        hideHeader: false,     // NO ocultar el header
        hideChartControls: false,
        hideDownload: false,   // Mostrar opción de descarga
      },

      // Parámetros URL importantes
      urlParams: {
        standalone: "0",       // NO modo standalone (importante para sidebar)
        show_filters: "1",     // Mostrar filtros
        expand_filters: "1",   // Expandir filtros
      },

      iframeSandboxExtras: [
        "allow-top-navigation",
        "allow-popups-to-escape-sandbox",
        "allow-same-origin",
        "allow-scripts",
        "allow-forms"
      ],

      referrerPolicy: "strict-origin-when-cross-origin",
    });

    // Ajustar el iframe después de cargar
    setTimeout(() => {
      const iframe = containerRef.current?.querySelector('iframe');
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.minHeight = '100vh';
      }
    }, 2000);

  }, []);

  return (
    <>
      <style>
        {`
          .superset-dashboard-container {
            width: 100% !important;
            height: 100vh !important;
            min-height: 100vh !important;
            position: relative !important;
            overflow: auto !important;
          }
          
          .superset-dashboard-container iframe {
            width: 100% !important;
            height: 100% !important;
            min-height: 100vh !important;
            border: none !important;
            display: block !important;
          }
          
          /* Asegurar que el body no tenga overflow hidden */
          body {
            overflow: auto !important;
          }
        `}
      </style>

      <div
        className="superset-dashboard-container"
        ref={containerRef}
        style={{
          width: "100%",
          height: "100vh",
          minHeight: "100vh",
          position: "relative",
          backgroundColor: "#fff",
          margin: 0,
          padding: 0,
          overflow: "auto",
        }}
      />
    </>
  );
};

export default SupersetDashboard;