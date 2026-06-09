import { useState, useEffect } from 'react';

function Inventario() {
  const [keys, setKeys] = useState([]);
  const [filtroJuego, setFiltroJuego] = useState('');

  useEffect(() => {
    // Obtenemos el ID del vendedor logueado
    const vId = localStorage.getItem('idUsuario');
    
    if (vId) {
      fetch(`http://localhost:8080/api/inventario?vendedorId=${vId}`)
        .then(res => {
          if (!res.ok) throw new Error("Error en el servidor");
          return res.json();
        })
        .then(data => {
          // Nos aseguramos de que sea un array antes de guardar
          setKeys(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error("Error:", err);
          setKeys([]); // Fallback a array vacío para que no explote el .filter
        });
    }
  }, []);

  const keysFiltradas = keys.filter(k => 
    k.videojuego.titulo.toLowerCase().includes(filtroJuego.toLowerCase())
  );

  const borrarKey = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta clave?")) {
      fetch(`http://localhost:8080/api/inventario/${id}`, {
        method: 'DELETE',
      })
      .then(res => {
        if (res.ok) {
          // Actualizamos la lista eliminando el elemento borrado
          setKeys(keys.filter(k => k.idClave !== id));
        } else {
          alert("No se puede borrar una clave que ya ha sido vendida.");
        }
      })
      .catch(err => console.error("Error al borrar:", err));
    }
  };

  return (
    <div style={{ padding: '25px', backgroundColor: '#111', borderRadius: '12px' }}>
      <h3 style={{ color: '#00BFFF' }}> Mis Claves Digitales</h3>
      <input 
        placeholder="Filtrar por juego..." 
        onChange={(e) => setFiltroJuego(e.target.value)}
        style={inputStyle}
      />
      <table style={{ width: '100%', marginTop: '20px', color: '#fff' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th>Juego</th>
            <th>Código</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {keysFiltradas.map(k => (
            <tr key={k.idClave} style={{ borderBottom: '1px solid #222' }}>
              {/* Juego */}
              <td style={{ padding: '15px 10px', color: '#fff' }}>{k.videojuego.titulo}</td>
              
              {/* Código */}
              <td style={{ padding: '15px 10px', fontFamily: 'monospace', color: '#00BFFF' }}>
                {k.codigo_clave}
              </td>
              
              {/* Estado */}
              <td style={{ padding: '15px 10px' }}>
                <span style={{ 
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: k.estado.toLowerCase() === 'disponible' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                    color: k.estado.toLowerCase() === 'disponible' ? '#00FF88' : '#ff4444',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                }}>
                  {k.estado.toUpperCase()}
                </span>
              </td>
              
              {/* Botón Borrar */}
              <td style={{ padding: '15px 10px' }}>
                {k.estado.toLowerCase() === 'disponible' ? (
                  <button 
                    onClick={() => borrarKey(k.idClave)}
                    style={{ 
                        backgroundColor: '#ff4444', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#cc0000'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff4444'}
                  >
                    Borrar
                  </button>
                ) : (
                  <span style={{ color: '#555', fontSize: '0.8rem' }}>No disponible</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inputStyle = { padding: '10px', width: '300px', backgroundColor: '#222', border: '1px solid #444', color: '#fff' };
export default Inventario;