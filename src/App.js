import './App.scss';
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Navbar from './Componentes/Navbar';
import Sidebar from './Componentes/Sidebar';
import Inicio from './Componentes/Paginas/Inicio';
// import Login from './Componentes/Login/Login';
// import Registro from './Componentes/Registro/Registro';
import Planes from './Componentes/Paginas/Planes';
import Ventas from './Componentes/Paginas/Ventas';
import Usuarios from './Componentes/Paginas/Usuarios';
import Config from './Componentes/Paginas/Config';

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="content w-100">
          <Navbar/>
          <Routes>
            <Route path="/Inicio" element={<Inicio/>}></Route>
            <Route path="/ventas" element={<Ventas/>}></Route>
            <Route path="/planes" element={<Planes/>}></Route>
            <Route path="/Contactos" element={<Usuarios/>}></Route>
            <Route path="/Config" element={<Config/>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
