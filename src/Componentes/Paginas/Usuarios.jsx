import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Personas = () => {
    // Datos iniciales con más campos
    const usuariosFalsos = [
        { 
            Id: 1, 
            NombreUsuario: "Juan Manuel", 
            Correo: "pancho@familia.com", 
            Contacto: "9994253289",
            Tipo: "Titular",
           
        },
        { 
            Id: 2, 
            NombreUsuario: "Juan Pérez", 
            Correo: "juan@familia.com", 
            Contacto: "9999132256",
            Tipo: "Familiar",
           
        },
        { 
            Id: 3, 
            NombreUsuario: "María García", 
            Correo: "maria@familia.com", 
            Contacto: "9997735423",
            Tipo: "Familiar",
           
            Rol: "Madre"
        },
        { 
            Id: 4, 
            NombreUsuario: "Carlos López", 
            Correo: "carlos@familia.com", 
            Contacto: "5535990903",
            Tipo: "Familiar",
           
            Rol: "Amigo cercano"
        }
    ];

    const [usuarios, setUsuarios] = useState(usuariosFalsos);
    const [editandoId, setEditandoId] = useState(null);
    const [usuarioEditado, setUsuarioEditado] = useState({});
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            toast.info("Datos de usuarios cargados");
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const eliminarUsuario = (Id) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
        setUsuarios(usuarios.filter(usuario => usuario.Id !== Id));
        toast.success("Usuario eliminado");
    };

    const iniciarEdicion = (usuario) => {
        setEditandoId(usuario.Id);
        setUsuarioEditado({...usuario});
        setShowModal(true);
    };

    const guardarEdicion = () => {
        setUsuarios(usuarios.map(u => u.Id === usuarioEditado.Id ? usuarioEditado : u));
        setEditandoId(null);
        setShowModal(false);
        toast.success("Cambios guardados");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuarioEditado(prev => ({...prev, [name]: value }));
    };

    return (
        <div className="container-fluid py-3 px-2 px-md-4" style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>
            <div className="card shadow-lg p-3 p-md-4" style={{ borderColor: "#1e7a8c" }}>
                <h2 className="text-center mb-4" style={{ color: "#72160D" }}>Contactos</h2>
                
                {/* Versión móvil - Cards */}
                <div className="d-block d-md-none">
                    {usuarios.map(usuario => (
                        <div key={usuario.Id} className="card mb-3">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h5 className="card-title mb-0">{usuario.NombreUsuario}</h5>
                                        <small className="text-muted">ID: {usuario.Id}</small>
                                    </div>
                                  
                                </div>
                                
                                <p className="card-text mb-1">
                                    <strong>Email:</strong> {usuario.Correo}
                                </p>
                                
                                <p className="card-text mb-1">
                                    <strong>Contacto:</strong> {usuario.Contacto}
                                </p>
                                
                                <p className="card-text mb-2">
                                    <strong>Tipo:</strong> {usuario.Tipo}
                                </p>
                                
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        className="btn btn-sm"
                                        style={{ backgroundColor: "#1e7a8c", color: "white" }}
                                        onClick={() => iniciarEdicion(usuario)}
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button
                                        className="btn btn-sm"
                                        style={{ backgroundColor: "#72160D", color: "white" }}
                                        onClick={() => eliminarUsuario(usuario.Id)}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Versión desktop - Tabla */}
                <div className="d-none d-md-block">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead style={{ backgroundColor: "#1e7a8c", color: "white" }}>
                                <tr>
                                    <th>N°</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Contacto</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map(usuario => (
                                    <tr key={usuario.Id}>
                                        <td>{usuario.Id}</td>
                                        <td>
                                            <div>
                                                <strong>{usuario.NombreUsuario}</strong>
                                                <div className="text-muted small">
                                                    {usuario.Tipo}  {usuario.Plan}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{usuario.Correo}</td>
                                        <td>{usuario.Contacto}</td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    className="btn btn-sm"
                                                    style={{ backgroundColor: "#1e7a8c", color: "white" }}
                                                    onClick={() => iniciarEdicion(usuario)}
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    className="btn btn-sm"
                                                    style={{ backgroundColor: "#72160D", color: "white" }}
                                                    onClick={() => eliminarUsuario(usuario.Id)}
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Edición */}
            {showModal && (
                <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header" style={{ backgroundColor: "#1e7a8c", color: "white" }}>
                                <h5 className="modal-title">Editar Usuario</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            name="NombreUsuario"
                                            value={usuarioEditado.NombreUsuario || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="Correo"
                                            value={usuarioEditado.Correo || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Número de Contacto</label>
                                        <input
                                            type="text"
                                            name="Contacto"
                                            value={usuarioEditado.Contacto || ""}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Tipo de Usuario</label>
                                        <select
                                            name="Tipo"
                                            value={usuarioEditado.Tipo || ""}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="Titular">Titular</option>
                                            <option value="Familiar">Familiar</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        
                                        
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Rol</label>
                                        <select
                                            name="Rol"
                                            value={usuarioEditado.Rol || ""}
                                            onChange={handleChange}
                                            className="form-select"
                                        >
                                            <option value="Padre">Adulto_M
                                                ayor</option>
                                            <option value="Padre">Padre</option>
                                            <option value="Madre">Madre</option>
                                            <option value="Hermano">Hermano</option>
                                            <option value="Hermana">Hermana</option>
                                            <option value="Amigo cercano">Amigo cercano</option>
                                            <option value="Familiar">Familiar</option>
                                            <option value="Primo">Primo</option>
                                            <option value="Tío">Tío</option>
                                            <option value="Sobrino">Sobrino</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={guardarEdicion}
                                    style={{ backgroundColor: "#1e7a8c", borderColor: "#1e7a8c" }}
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Personas;