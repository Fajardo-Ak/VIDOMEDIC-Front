import React, { useState, useEffect } from 'react';
import './Medi.css';

const Medi = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    via_administracion: 'Oral',
    via_administracion_personalizada: '',
    dosis: '',
    importancia: 'Baja'
  });
  const [editandoId, setEditandoId] = useState(null);

  // Obtener medicamentos
  const obtenerMedicamentos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/medicamentos', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (data.success) setMedicamentos(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Crear o actualizar medicamento
  const guardarMedicamento = async (e) => {
    e.preventDefault();
    
    const url = editandoId 
      ? `http://localhost:8000/api/medicamentos/${editandoId}`
      : 'http://localhost:8000/api/medicamentos';
    
    const method = editandoId ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await obtenerMedicamentos();
        limpiarFormulario();
        alert(editandoId ? 'Medicamento actualizado' : 'Medicamento creado');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Eliminar medicamento
  const eliminarMedicamento = async (id) => {
    if (!window.confirm('¿Eliminar este medicamento?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/medicamentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      if (data.success) {
        await obtenerMedicamentos();
        alert('Medicamento eliminado');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Editar medicamento
  const editarMedicamento = (medicamento) => {
    setFormData({
      nombre: medicamento.nombre,
      via_administracion: medicamento.via_administracion,
      via_administracion_personalizada: medicamento.via_administracion_personalizada || '',
      dosis: medicamento.dosis,
      importancia: medicamento.importancia
    });
    setEditandoId(medicamento.id);
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      via_administracion: 'Oral',
      via_administracion_personalizada: '',
      dosis: '',
      importancia: 'Baja'
    });
    setEditandoId(null);
  };

  // Cargar medicamentos al iniciar
  useEffect(() => {
    obtenerMedicamentos();
  }, []);

  return (
    <div className="Container">
      <h2>Gestión de Medicamentos</h2>

      {/* Formulario */}
      <form className="medi-form" onSubmit={guardarMedicamento}>
        <div>
          <label>Nombre:</label>
          <input 
            type="text" 
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            required 
          />
        </div>

        <div>
          <label>Vía de administración:</label>
          <select 
            value={formData.via_administracion}
            onChange={(e) => setFormData({...formData, via_administracion: e.target.value})}
          >
            <option value="Oral">Oral</option>
            <option value="Inyectable">Inyectable</option>
            <option value="Tópica">Tópica</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {formData.via_administracion === 'Otro' && (
          <div>
            <label>Especificar vía:</label>
            <input 
              type="text" 
              value={formData.via_administracion_personalizada}
              onChange={(e) => setFormData({...formData, via_administracion_personalizada: e.target.value})}
              required 
            />
          </div>
        )}

        <div>
          <label>Dosis:</label>
          <input 
            type="text" 
            value={formData.dosis}
            onChange={(e) => setFormData({...formData, dosis: e.target.value})}
            required 
          />
        </div>

        <div>
          <label>Importancia:</label>
          <select 
            value={formData.importancia}
            onChange={(e) => setFormData({...formData, importancia: e.target.value})}
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        <button type="submit">
          {editandoId ? 'Actualizar' : 'Crear'} Medicamento
        </button>
        
        {editandoId && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de medicamentos */}
      <div>
        <h3>Medicamentos ({medicamentos.length})</h3>
        
        {medicamentos.length === 0 ? (
          <p>No hay medicamentos registrados</p>
        ) : (
          <ul>
            {medicamentos.map(med => (
              <li key={med.id}>
                <strong>{med.nombre}</strong> - {med.dosis} 
                <br/>
                Vía: {med.via_administracion === 'Otro' 
                  ? med.via_administracion_personalizada 
                  : med.via_administracion
                } | Importancia: {med.importancia}
                
                <button onClick={() => editarMedicamento(med)}>
                  Editar
                </button>
                
                <button onClick={() => eliminarMedicamento(med.id)}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Medi;