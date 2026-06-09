import { useState, useEffect } from 'react';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data));
  }, []);

  const cambiarRol = (idUsuario, nuevoIdRol) => {
    fetch(`http://localhost:8080/api/usuarios/${idUsuario}/rol/${nuevoIdRol}`, { method: 'PUT' })
      .then(() => {
        alert("Rol actualizado.");
        // Refrescamos lista
        fetch('http://localhost:8080/api/usuarios').then(res => res.json()).then(setUsuarios);
      });
  };

  return (
    <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
      <h3 style={{ color: '#00BFFF' }}>👥 Gestión de Accesos</h3>
      <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th style={{ padding: '10px' }}>Nombre</th>
            <th style={{ padding: '10px' }}>Correo</th>
            <th style={{ padding: '10px' }}>Rol Actual</th>
            <th style={{ padding: '10px' }}>Cambiar a...</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.idUsuario} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '10px' }}>{u.nombre}</td>
              <td style={{ padding: '10px' }}>{u.email}</td>
              <td style={{ padding: '10px', color: '#00FF88' }}>{u.nombreRol}</td>
              <td style={{ padding: '10px' }}>
                <select 
                  defaultValue={u.idRol} 
                  onChange={(e) => cambiarRol(u.idUsuario, e.target.value)}
                  style={{ backgroundColor: '#222', color: '#fff', padding: '5px' }}
                >
                  <option value="1">Admin</option>
                  <option value="2">Cliente</option>
                  <option value="3">Vendedor</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default AdminUsuarios;