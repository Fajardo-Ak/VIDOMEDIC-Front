import './App.scss';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  Outlet  // <<<< AÑADE ESTO
} from "react-router-dom"; // <<<< CAMBIA ESTE IMPORT
import Navbar from './Componentes/Navbar';
import Sidebar from './Componentes/Sidebar';
import Inicio from './Componentes/Paginas/Inicio';
import Planes from './Componentes/Paginas/Planes';
import Ventas from './Componentes/Paginas/Ventas';
import Usuarios from './Componentes/Paginas/Usuarios';
import Config from './Componentes/Paginas/Config';
import Login from './Componentes/Paginas/Login.jsx';
import Registro from './Componentes/Paginas/Registro.jsx';
import NotFound from './Componentes/Paginas/NotFound'; // 👈 Importa el 404

import Home from './Componentes/Paginas/Home.jsx'; // <<<< AÑADE LA EXTENSIÓN

// Layout para rutas autenticadas (con navbar y sidebar)
const AuthenticatedLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="content w-100">
        <Navbar />
        <Outlet /> {/* Esto ahora funciona */}
      </div>
    </div>
  );
};

function App() {
  return (
      <Router>
        <Routes>
          {/* Ruta pública sin layout */}
           <Route path="/registro" element={<Registro />} />
           
          <Route path="/login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          {/* Rutas autenticadas con layout */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/contactos" element={<Usuarios />} />
            <Route path="/config" element={<Config />} />
          </Route>
          
          {/* Redirección desde raíz */}
          <Route path="/" element={<NotFound />} />

          
          {/* Redirección para rutas no encontradas */}
            <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
  );
}

export default App;