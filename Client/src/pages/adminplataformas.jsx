import { useState, useEffect } from 'react';

function AdminPlataformas() {
  const [plataformas, setPlataformas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados del formulario
  const [idEditando, setIdEditando] = useState(null);
  const [nombre, setNombre] = useState('');

  // Carga inicial
  useEffect(() => {
    fetch('http://localhost:8080/api/plataformas')
      .then(res => res.json())
      .then(data => {
        setPlataformas(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar plataformas:", err);
        setCargando(false);
      });
  }, []);

  // Guardar o Actualizar
  const manejarSubmit = (e) => {
    e.preventDefault();

    // Mapea exactamente con el modelo Plataforma.kt (idPlataforma y nombre)
    const payload = {
      idPlataforma: idEditando ? idEditando : 0, 
      nombre: nombre
    };

    const url = idEditando 
      ? `http://localhost:8080/api/plataformas/${idEditando}`
      : `http://localhost:8080/api/plataformas`;
    
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
      fetch('http://localhost:8080/api/plataformas')
        .then(res => res.json())
        .then(data => setPlataformas(data));

      limpiarFormulario();
      alert(idEditando ? "¡Plataforma actualizada!" : "¡Plataforma registrada!");
    })
    .catch(err => {
      console.error("Error al guardar:", err);
      alert("Hubo un problema al guardar. Revisa la consola.");
    });
  };

  const prepararEdicion = (plat) => {
    setIdEditando(plat.idPlataforma);
    setNombre(plat.nombre);
  };

  const eliminarPlataforma = (idPlataforma) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta plataforma? Si tiene juegos asociados, la base de datos podría bloquear la acción.")) return;

    fetch(`http://localhost:8080/api/plataformas/${idPlataforma}`, { method: 'DELETE' })
      .then(async res => {
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        setPlataformas(plataformas.filter(p => p.idPlataforma !== idPlataforma));
      })
      .catch(err => {
        console.error("Error al eliminar:", err);
        alert("No se pudo eliminar. Es posible que existan videojuegos asociados a esta plataforma.");
      });
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombre('');
  };

  if (cargando) {
    return <div style={{ color: '#00BFFF', fontSize: '1.2rem' }}>Cargando ecosistemas...</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
      
      {/* FORMULARIO */}
      <div style={{ width: '350px', backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333', position: 'sticky', top: '40px' }}>
        <h3 style={{ marginTop: 0, color: idEditando ? '#FFD700' : '#00FF88', marginBottom: '20px' }}>
          {idEditando ? '📝 Editar Plataforma' : '🎮 Nueva Plataforma'}
        </h3>
        
        <form onSubmit={manejarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Nombre del Ecosistema</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              required 
              style={inputStyle} 
              placeholder="Ej. Steam, Xbox, Origin..." 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: idEditando ? '#FFD700' : '#00FF88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {idEditando ? 'Guardar Cambios' : 'Registrar Plataforma'}
            </button>
            {idEditando && (
              <button type="button" onClick={limpiarFormulario} style={{ padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                X
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLA DE PLATAFORMAS */}
      <div style={{ flex: 1, backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
        <h3 style={{ marginTop: 0, color: '#00BFFF', marginBottom: '20px' }}>📋 Plataformas Soportadas</h3>
        
        {plataformas.length === 0 ? (
          <p style={{ color: '#888' }}>No hay plataformas registradas aún.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', color: '#888', fontSize: '0.9rem' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Nombre</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {plataformas.map(plat => (
                <tr key={plat.idPlataforma} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', ':hover': { backgroundColor: '#161616' } }}>
                  <td style={{ padding: '12px', color: '#666', fontFamily: 'monospace' }}>#{plat.idPlataforma}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#fff' }}>{plat.nombre}</td>
                  <td style={{ padding: '12px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => prepararEdicion(plat)} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #00BFFF', color: '#00BFFF', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Editar
                    </button>
                    <button onClick={() => eliminarPlataforma(plat.idPlataforma)} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
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

export default AdminPlataformas;