import './App.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from './Componentes/Navbar';
import Sidebar from './Componentes/Sidebar';

import Inicio from './Componentes/Paginas/Inicio.jsx';
import Planes from './Componentes/Paginas/Planes.jsx';
import Ventas from './Componentes/Paginas/Ventas.jsx';
import Usuarios from './Componentes/Paginas/Usuarios.jsx';
import Config from './Componentes/Paginas/Config.jsx';

import Login from './Componentes/Paginas/Login/Login.jsx';
import Registro from './Componentes/Paginas/Registro/Registro.jsx';
import NotFound from './Componentes/Paginas/NotFound.jsx';
import Home from './Componentes/Paginas/Home.jsx';

import RutaPrivada from "./Componentes/Paginas/Seguridad/RutaPrivada";

// Layout para las rutas privadas (dashboard)
const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="content w-100">
        <Navbar />
        <Routes>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/contactos" element={<Usuarios />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas (sin layout de dashboard) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />

        {/* Rutas privadas (con layout de dashboard) */}
        <Route
          path="/*"
          element={
            <RutaPrivada>
              <DashboardLayout />
            </RutaPrivada>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
