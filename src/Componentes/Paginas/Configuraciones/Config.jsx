import React, { useState } from "react";
import Cuenta from "./Cuenta";
//import Contactos from "./Contactos";
import Actualizaciones from "./Actualizaciones";
import "./Config.css";
import Planes from "../Planes/Planes";

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('cuenta');

  const tabs = [
    { id: 'cuenta', label: 'Cuenta', component: <Cuenta /> },
  //  { id: 'contactos', label: 'Contactos', component: <Contactos /> },
    { id: 'Planes', label: 'Planes', component: <Planes /> },
    { id: 'actualizaciones', label: 'Actualizaciones', component: <Actualizaciones /> },
  ];

  return (
    <div className="config-container">
      {/* Contenedor de pestañas grande y visible */}
      <div className="tabs-navigation">
        <div className="tabs-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
}
