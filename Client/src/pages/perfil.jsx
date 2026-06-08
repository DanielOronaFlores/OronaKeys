import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function MiPerfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({ historialCompras: [], listaDeseos: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  // Objeto para recordar qué llaves están visibles { 'SMO-X7A9...': true }
  const [llavesReveladas, setLlavesReveladas] = useState({});

  // === ESTADOS PARA RESEÑAS ===
  const [misResenas, setMisResenas] = useState([]);
  const [resenaEditando, setResenaEditando] = useState(null);
  const [textoResena, setTextoResena] = useState('');
  const [calificacion, setCalificacion] = useState(5);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('idUsuarioActivo');

    if (!token || !idUsuario) {
      navigate('/login');
      return;
    }

    // 1. Cargar el perfil (Compras y Wishlist)
    fetch(`http://localhost:8080/api/perfil/${idUsuario}`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudo cargar la información del servidor.");
        return res.json();
      })
      .then(data => {
        setPerfil(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error cargando perfil:", err);
        setError("Hubo un problema al cargar tu perfil.");
        setCargando(false);
      });

    // 2. Cargar las reseñas del usuario (independiente para no bloquear el perfil)
    fetch(`http://localhost:8080/api/resenas/usuario/${idUsuario}`)
      .then(res => res.json())
      .then(data => setMisResenas(data))
      .catch(err => console.error("Error al cargar reseñas:", err));

  }, [navigate]);

  const toggleRevelarLlave = (codigo) => {
    setLlavesReveladas(prev => ({
      ...prev,
      [codigo]: !prev[codigo] 
    }));
  };

  const quitarDeLista = (idVideojuego) => {
    const idUsuario = localStorage.getItem('idUsuarioActivo');
    
    fetch('http://localhost:8080/api/deseos/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idUsuario: Number(idUsuario),
        idVideojuego: Number(idVideojuego)
      })
    })
    .then(() => {
      setPerfil(prev => ({
        ...prev,
        listaDeseos: prev.listaDeseos.filter(juego => juego.idVideojuego !== idVideojuego)
      }));
    })
    .catch(err => console.error("Error al quitar deseo:", err));
  };

  // === FUNCIONES DE RESEÑAS ===
  // === ELIMINAR ===
  const eliminarResena = (idResena) => {
    if(!window.confirm("¿Seguro que quieres borrar esta reseña de tu perfil?")) return;

    fetch(`http://localhost:8080/api/resenas/${idResena}`, { 
      method: 'DELETE' 
    })
    .then(res => {
      if (!res.ok) throw new Error("El servidor rechazó la eliminación.");
      // Solo si el servidor dice OK (200 o 204), la quitamos de la pantalla
      setMisResenas(misResenas.filter(r => r.idResena !== idResena));
    })
    .catch(err => {
      console.error("Error al eliminar reseña:", err);
      alert("No se pudo eliminar la reseña. Intenta de nuevo.");
    });
  };

  // === GUARDAR EDICIÓN ===
  const guardarEdicionResena = (e) => {
    e.preventDefault();
    
    const resenaOriginal = misResenas.find(r => r.idResena === resenaEditando);

    fetch(`http://localhost:8080/api/resenas/${resenaEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idResena: resenaEditando,
        idVideojuego: resenaOriginal.idVideojuego, 
        idUsuario: resenaOriginal.idUsuario,       
        calificacion: Number(calificacion),
        comentario: textoResena
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("El servidor rechazó la actualización.");
      return res.json();
    })
    .then(resenaActualizada => {
      // AQUÍ ESTÁ LA MAGIA:
      setMisResenas(misResenas.map(r => {
        if (r.idResena === resenaEditando) {
          // Mezclamos la respuesta del servidor con los datos originales que no queremos perder
          return { 
            ...resenaActualizada, 
            tituloJuego: r.tituloJuego, 
            idVideojuego: r.idVideojuego 
          };
        }
        return r;
      }));
      setResenaEditando(null); // Cerramos el formulario
    })
    .catch(err => {
      console.error("Error al actualizar reseña:", err);
      alert("No se pudo editar la reseña. Revisa la conexión.");
    });
  };

  const prepararEdicion = (resena) => {
    setResenaEditando(resena.idResena);
    setTextoResena(resena.comentario);
    setCalificacion(resena.calificacion);
  };

  
  if (cargando) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#00BFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>Cargando inventario...</div>;
  }

  if (error) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ff4444', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>{error}</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: "'Segoe UI', sans-serif", padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#00BFFF', fontSize: '2.5rem' }}>Mi Área Personal</h1>

      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* === SECCIÓN: HISTORIAL DE COMPRAS === */}
        <section style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '20px', color: '#00FF88', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            Mis Licencias Digitales
          </h2>

          {perfil.historialCompras.length === 0 ? (
            <p style={{ color: '#aaa' }}>Aún no has realizado ninguna compra.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {perfil.historialCompras.map(pedido => (
                <div key={pedido.idPedido} style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #222', overflow: 'hidden' }}>
                  
                  <div style={{ backgroundColor: '#222', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
                    <span style={{ fontWeight: 'bold', color: '#00BFFF' }}>Orden #{pedido.idPedido}</span>
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Total: <strong style={{ color: '#00FF88' }}>${pedido.total.toFixed(2)}</strong></span>
                  </div>

                  <div style={{ padding: '20px' }}>
                    {pedido.llaves.map((llave, index) => {
                      const estaRevelada = llavesReveladas[llave.codigoClave];
                      
                      return (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: index !== pedido.llaves.length - 1 ? '15px' : '0' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{llave.tituloJuego}</span>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ 
                              padding: '8px 15px', 
                              backgroundColor: '#000', 
                              border: estaRevelada ? '1px solid #00FF88' : '1px solid #444', 
                              borderRadius: '6px', 
                              fontFamily: 'monospace', 
                              fontSize: '1.1rem',
                              color: estaRevelada ? '#00FF88' : '#666',
                              letterSpacing: '2px',
                              width: '230px',
                              textAlign: 'center'
                            }}>
                              {estaRevelada ? llave.codigoClave : '••••-••••-••••-••••'}
                            </div>
                            
                            <button 
                              onClick={() => toggleRevelarLlave(llave.codigoClave)}
                              style={{ 
                                padding: '8px 12px', 
                                backgroundColor: estaRevelada ? '#333' : '#00BFFF', 
                                color: estaRevelada ? '#fff' : '#000', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                fontWeight: 'bold',
                                transition: 'all 0.2s',
                                width: '120px'
                              }}
                            >
                              {estaRevelada ? 'Ocultar' : 'Revelar Key'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* === SECCIÓN: LISTA DE DESEOS === */}
        <section style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '20px', color: '#ff66b2', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            Mi Lista de Deseos 💖
          </h2>
          
          {perfil.listaDeseos.length === 0 ? (
            <div>
              <p style={{ color: '#aaa', marginBottom: '15px' }}>Tu lista de deseos está vacía por el momento.</p>
              <Link to="/catalogo" style={{ color: '#00BFFF', textDecoration: 'none' }}>Ir al catálogo para explorar juegos</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {perfil.listaDeseos.map(juego => (
                <div key={juego.idVideojuego} style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
                  
                  {juego.imagenUrl ? (
                    <img src={juego.imagenUrl} alt={juego.titulo} style={{ width: '100%', height: '140px', objectFit: 'cover', borderBottom: '1px solid #333' }} />
                  ) : (
                    <div style={{ width: '100%', height: '140px', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>Sin Imagen</div>
                  )}
                  
                  <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#fff' }}>{juego.titulo}</h3>
                    <span style={{ color: '#00FF88', fontWeight: 'bold', marginBottom: '15px', fontSize: '1.2rem' }}>${juego.precio.toFixed(2)}</span>
                    
                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                      <button 
                        onClick={() => navigate(`/juego/${juego.idVideojuego}`)} 
                        style={{ flex: 1, padding: '8px', backgroundColor: '#00BFFF', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#000', fontWeight: 'bold' }}>
                        Ver Juego
                      </button>
                      <button 
                        onClick={() => quitarDeLista(juego.idVideojuego)} 
                        title="Quitar de la lista"
                        style={{ padding: '8px 12px', backgroundColor: 'transparent', border: '1px solid #ff4444', borderRadius: '6px', cursor: 'pointer', color: '#ff4444', transition: 'background-color 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.1)'} 
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        💔
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* === SECCIÓN: MIS RESEÑAS (NUEVA) === */}
        <section style={{ backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
          <h2 style={{ fontSize: '1.5rem', marginTop: 0, marginBottom: '20px', color: '#FFD700', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
            Mis Reseñas ⭐
          </h2>

          {misResenas.length === 0 ? (
            <p style={{ color: '#aaa' }}>Aún no has escrito reseñas para ningún juego.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {misResenas.map(resena => (
                <div key={resena.idResena} style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #FFD700' }}>
                  
                  {/* Modo Edición */}
                  {resenaEditando === resena.idResena ? (
                    <form onSubmit={guardarEdicionResena}>
                      <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
                        <label style={{ color: '#aaa' }}>Calificación:</label>
                        <select value={calificacion} onChange={e => setCalificacion(e.target.value)} style={{ padding: '5px', borderRadius: '4px', backgroundColor: '#222', color: '#fff', border: '1px solid #444' }}>
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num} Estrellas</option>
                          ))}
                        </select>
                      </div>
                      
                      <textarea 
                        value={textoResena} 
                        onChange={e => setTextoResena(e.target.value)} 
                        required
                        rows="3"
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', marginBottom: '10px', resize: 'vertical' }}
                      />
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#00FF88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          Guardar
                        </button>
                        <button type="button" onClick={() => setResenaEditando(null)} style={{ padding: '8px 15px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Modo Vista Normal */
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div>
                          <span style={{ fontWeight: 'bold', color: '#FFD700', marginRight: '10px' }}>{resena.calificacion} ⭐</span>
                          <span style={{ color: '#888', fontSize: '0.9rem' }}>
                          Juego: <Link to={`/juego/${resena.idVideojuego}`} style={{ color: '#00BFFF', textDecoration: 'none', fontWeight: 'bold' }}>
                            {resena.tituloJuego}
                          </Link>
                        </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => prepararEdicion(resena)} style={{ background: 'none', border: 'none', color: '#00BFFF', cursor: 'pointer', fontSize: '0.9rem' }}>Editar</button>
                          <button onClick={() => eliminarResena(resena.idResena)} style={{ background: 'none', border: 'none', color: '#ff3333', cursor: 'pointer', fontSize: '0.9rem' }}>Eliminar</button>
                        </div>
                      </div>
                      <p style={{ margin: 0, lineHeight: '1.5', color: '#ccc' }}>{resena.comentario}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default MiPerfil;