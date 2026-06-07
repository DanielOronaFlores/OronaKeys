import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function MiPerfil() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({ historialCompras: [], listaDeseos: [] });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  
  // Objeto para recordar qué llaves están visibles { 'SMO-X7A9...': true }
  const [llavesReveladas, setLlavesReveladas] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('idUsuarioActivo');

    if (!token || !idUsuario) {
      navigate('/login');
      return;
    }

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
  }, [navigate]);

  const toggleRevelarLlave = (codigo) => {
    setLlavesReveladas(prev => ({
      ...prev,
      [codigo]: !prev[codigo] // Invierte el estado de esa llave específica
    }));
  };

  if (cargando) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#00BFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>Cargando inventario...</div>;
  }

  if (error) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ff4444', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.5rem' }}>{error}</div>;
  }

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
      // Actualizamos el estado visual eliminando el juego que acabamos de quitar
      setPerfil(prev => ({
        ...prev,
        listaDeseos: prev.listaDeseos.filter(juego => juego.idVideojuego !== idVideojuego)
      }));
    })
    .catch(err => console.error("Error al quitar deseo:", err));
  };

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
                  
                  {/* Cabecera del pedido */}
                  <div style={{ backgroundColor: '#222', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333' }}>
                    <span style={{ fontWeight: 'bold', color: '#00BFFF' }}>Orden #{pedido.idPedido}</span>
                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Total: <strong style={{ color: '#00FF88' }}>${pedido.total.toFixed(2)}</strong></span>
                  </div>

                  {/* Lista de llaves de ese pedido */}
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

        {/* === SECCIÓN: LISTA DE DESEOS (Preparada) === */}
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

      </div>
    </div>
  );
}

export default MiPerfil;