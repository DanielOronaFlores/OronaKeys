import { useState, useEffect } from 'react';

function AdminDesarrolladores() {
  // --- ESTADOS DE DATOS ---
  const [desarrolladores, setDesarrolladores] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- ESTADOS DEL FORMULARIO ---
  const [idEditando, setIdEditando] = useState(null); // null = Crear, número = Editar
  const [nombreDesarrollador, setNombreDesarrollador] = useState('');
  const [sitioWeb, setSitioWeb] = useState('');

  // --- 1. CARGA INICIAL DE DATOS ---
  useEffect(() => {
    fetch('http://localhost:8080/api/desarrolladores')
      .then(res => res.json())
      .then(data => {
        setDesarrolladores(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar desarrolladores:", err);
        setCargando(false);
      });
  }, []);

  // --- 2. MANEJAR ENVÍO (CREAR O ACTUALIZAR) ---
  const manejarSubmit = (e) => {
    e.preventDefault();

    const payload = {
      idDesarrollador: idEditando ? idEditando : 0,
      nombreDesarrollador,
      sitioWeb: sitioWeb === '' ? null : sitioWeb // Forma más segura de mandar nulos
    };

    const url = idEditando 
      ? `http://localhost:8080/api/desarrolladores/${idEditando}`
      : `http://localhost:8080/api/desarrolladores`;
    
    const metodo = idEditando ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async res => {
      if (!res.ok) {
        const errorText = await res.text();
        console.error("🔥 Error de Spring Boot:", errorText);
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
      return res.json();
    })
    .then(() => {
      // Refrescamos la tabla
      fetch('http://localhost:8080/api/desarrolladores')
        .then(res => res.json())
        .then(data => setDesarrolladores(data));

      limpiarFormulario();
      alert(idEditando ? "¡Desarrollador actualizado!" : "¡Desarrollador registrado!");
    })
    .catch(err => {
      console.error("Error al guardar:", err);
      alert("Hubo un problema al guardar. Revisa la consola.");
    });
  };

  // --- 3. PREPARAR EDICIÓN ---
  const prepararEdicion = (dev) => {
    setIdEditando(dev.idDesarrollador);
    setNombreDesarrollador(dev.nombreDesarrollador);
    setSitioWeb(dev.sitioWeb || '');
  };

  // --- 4. ELIMINAR ---
  const eliminarDesarrollador = (idDesarrollador) => {
    if (!window.confirm("¿Seguro que deseas eliminar este desarrollador? Si tiene juegos asociados, la base de datos podría bloquear la acción.")) return;

    fetch(`http://localhost:8080/api/desarrolladores/${idDesarrollador}`, { method: 'DELETE' })
      .then(async res => {
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        setDesarrolladores(desarrolladores.filter(d => d.idDesarrollador !== idDesarrollador));
      })
      .catch(err => {
        console.error("Error al eliminar:", err);
        alert("No se pudo eliminar. Es posible que existan videojuegos asociados a este desarrollador.");
      });
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombreDesarrollador('');
    setSitioWeb('');
  };

  if (cargando) {
    return <div style={{ color: '#00BFFF', fontSize: '1.2rem' }}>Cargando directorio de estudios...</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
      
      {/* === COLUMNA IZQUIERDA: FORMULARIO === */}
      <div style={{ width: '350px', backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333', position: 'sticky', top: '40px' }}>
        <h3 style={{ marginTop: 0, color: idEditando ? '#FFD700' : '#00FF88', marginBottom: '20px' }}>
          {idEditando ? '📝 Editar Estudio' : '🏢 Nuevo Desarrollador'}
        </h3>
        
        <form onSubmit={manejarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Nombre del Estudio/Publisher</label>
            <input 
              type="text" 
              value={nombreDesarrollador} 
              onChange={e => setNombreDesarrollador(e.target.value)} 
              required 
              style={inputStyle} 
              placeholder="Ej. FromSoftware" 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Sitio Web (Opcional)</label>
            <input 
              type="url" 
              value={sitioWeb} 
              onChange={e => setSitioWeb(e.target.value)} 
              style={inputStyle} 
              placeholder="https://www.estudio.com" 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: idEditando ? '#FFD700' : '#00FF88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {idEditando ? 'Guardar Cambios' : 'Registrar Estudio'}
            </button>
            {idEditando && (
              <button type="button" onClick={limpiarFormulario} style={{ padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                X
              </button>
            )}
          </div>
        </form>
      </div>

      {/* === COLUMNA DERECHA: TABLA DE DESARROLLADORES === */}
      <div style={{ flex: 1, backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
        <h3 style={{ marginTop: 0, color: '#00BFFF', marginBottom: '20px' }}>📋 Directorio de Creadores</h3>
        
        {desarrolladores.length === 0 ? (
          <p style={{ color: '#888' }}>No hay desarrolladores registrados aún.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', color: '#888', fontSize: '0.9rem' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Nombre del Estudio</th>
                <th style={{ padding: '12px' }}>Sitio Web</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {desarrolladores.map(dev => (
                <tr key={dev.idDesarrollador} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', ':hover': { backgroundColor: '#161616' } }}>
                  <td style={{ padding: '12px', color: '#666', fontFamily: 'monospace' }}>#{dev.idDesarrollador}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#fff' }}>{dev.nombreDesarrollador}</td>
                  <td style={{ padding: '12px', color: '#00BFFF' }}>
                    {dev.sitioWeb ? (
                      <a href={dev.sitioWeb} target="_blank" rel="noopener noreferrer" style={{ color: '#00BFFF', textDecoration: 'none' }}>
                        Visitar Web 🔗
                      </a>
                    ) : (
                      <span style={{ color: '#555' }}>N/A</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => prepararEdicion(dev)} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #00BFFF', color: '#00BFFF', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Editar
                    </button>
                    <button onClick={() => eliminarDesarrollador(dev.idDesarrollador)} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

// Estilos reutilizados de la pantalla de juegos
const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  backgroundColor: '#222',
  color: '#fff',
  border: '1px solid #444',
  marginTop: '2px',
  boxSizing: 'border-box'
};

export default AdminDesarrolladores;