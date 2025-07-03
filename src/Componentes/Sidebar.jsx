import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return(
        <div className="sidebar bg-light">
            <ul>
                <li>
                    <NavLink to="/inicio" className={({ isActive }) => `text-dark py-2 px-3 w-100 d-block ${isActive ? "active bg-light rounded" : "rounded"}`}><i className="bi bi-house-fill me-2"></i> Inicio</NavLink>
                </li>
                <li>
                    <NavLink to="/ventas" className={({ isActive }) => `text-dark py-2 px-3 w-100 d-block ${isActive ? "active bg-light rounded" : "rounded"}`}><i className="bi bi-bar-chart-line-fill me-2"></i> Ventas</NavLink>
                </li>
                <li>
                    <NavLink to="/planes" className={({ isActive }) => `text-dark py-2 px-3 w-100 d-block ${isActive ? "active bg-light rounded" : "rounded"}`}><i className="bi bi-clipboard2-data-fill me-2"></i> Planes</NavLink> 
                </li>
                <li>
                    <NavLink to="/usuarios" className={({ isActive }) => `text-dark py-2 px-3 w-100 d-block ${isActive ? "active bg-light rounded" : "rounded"}`}><i className="bi bi-file-person-fill me-2"></i> Usuarios</NavLink>
                </li>
                <li>
                    <NavLink to="/admin" className={({ isActive }) => `text-dark py-2 px-3 w-100 d-block ${isActive ? "active bg-light rounded" : "rounded"}`}><i className="bi bi-person-square me-2"></i> Admins</NavLink>
                </li>
                
            </ul>
        </div>
    )
}

export default Sidebar;