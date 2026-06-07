import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetalleJuego() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [juego, setJuego] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  const [enListaDeseos, setEnListaDeseos] = useState(false);
  
  const [hayLlavesDisponibles, setHayLlavesDisponibles] = useState(false);

  useEffect(() => {
    // 1. Cargar detalles del juego
    fetch(`http://localhost:8080/api/juego/${id}`)
      .then(respuesta => {
        if (!respuesta.ok) throw new Error("Juego no encontrado");
        return respuesta.json();
      })
      .then(datos => {
        setJuego(datos);
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al cargar detalles:", error);
        setCargando(false);
      });
      
    // 2. Verificar wishlist
    const idUsuario = localStorage.getItem('idUsuarioActivo');
    if (idUsuario) {
      fetch(`http://localhost:8080/api/deseos/verificar?idUsuario=${idUsuario}&idVideojuego=${id}`)
        .then(res => res.json())
        .then(data => {
          setEnListaDeseos(data.enLista); 
        })
        .catch(err => console.error("Error al verificar wishlist:", err));
    }

    // 3. NUEVO: Verificar stock real de llaves
    fetch(`http://localhost:8080/api/juego/${id}/stock`)
      .then(res => res.json())
      .then(data => {
        setHayLlavesDisponibles(data.hayStock);
      })
      .catch(err => console.error("Error al verificar stock:", err));

  }, [id]);

  

  const agregarAlCarrito = () => {
    const haySesion = localStorage.getItem('token'); 
    
    if (!haySesion) {
      alert("¡Debes iniciar sesión para comprar llaves!");
      navigate('/login');
      return;
    }

    const carritoGuardado = JSON.parse(localStorage.getItem('carritoOronaKeys')) || [];
    const yaExiste = carritoGuardado.find(item => item.idVideojuego === juego.idVideojuego);
    
    if (yaExiste) {
      alert("Este juego ya está en tu carrito.");
    } else {
      carritoGuardado.push(juego);
      localStorage.setItem('carritoOronaKeys', JSON.stringify(carritoGuardado));
      alert("¡Juego añadido al carrito con éxito!");
    }
  };

  const manejarListaDeseos = () => {
    const idUsuario = localStorage.getItem('idUsuarioActivo'); 
    
    if (!idUsuario) {
      alert("¡Debes iniciar sesión para agregar a la lista de deseos!");
      navigate('/login');
      return;
    }

    setEnListaDeseos(!enListaDeseos);

    fetch('http://localhost:8080/api/deseos/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idUsuario: Number(idUsuario),
        idVideojuego: Number(id)
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.enLista !== undefined) {
        setEnListaDeseos(data.enLista);
      }
    })
    .catch(err => {
      console.error("Error al modificar wishlist:", err);
      setEnListaDeseos(!enListaDeseos);
    });
  };

  if (cargando) return <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', padding: '50px', textAlign: 'center' }}>Cargando...</div>;

  if (!juego) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', padding: '50px', textAlign: 'center' }}>
      <h2>Juego no encontrado</h2>
      <button onClick={() => navigate('/catalogo')} style={{ padding: '10px 20px', backgroundColor: '#00BFFF', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Volver al catálogo</button>
    </div>
  );

  // Variable para saber si el botón debe estar habilitado (El juego está activo en tienda Y hay llaves)
  const sePuedeComprar = juego.activo && hayLlavesDisponibles;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
          <img src={juego.imagenUrl} alt={juego.titulo} style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0, 191, 255, 0.2)', border: '1px solid #333' }} />
        </div>

        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column' }}>
          
          <h1 style={{ 
            fontSize: '3rem', 
            margin: '0 0 10px 0', 
            lineHeight: '1.2',
            paddingTop: '5px',
            paddingBottom: '5px',
            background: 'linear-gradient(90deg, #fff, #aaa)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
            }}>
            {juego.titulo}
          </h1>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {juego.plataforma && (juego.plataforma.nombrePlataforma || juego.plataforma.nombre) && (
              <span style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', fontSize: '0.9rem', color: '#00BFFF' }}>
                {juego.plataforma.nombrePlataforma || juego.plataforma.nombre}
              </span>
            )}
            
            {juego.desarrollador && (juego.desarrollador.nombreDesarrollador || juego.desarrollador.nombre) && (
              <span style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', fontSize: '0.9rem', color: '#00FF88' }}>
                {juego.desarrollador.nombreDesarrollador || juego.desarrollador.nombre}
              </span>
            )}
          
          {/* Tag de estado visual actualizado */}
          <span style={{ 
               backgroundColor: sePuedeComprar ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 51, 51, 0.1)', 
               color: sePuedeComprar ? '#00FF88' : '#ff3333', 
               padding: '6px 12px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' 
             }}>
              {sePuedeComprar ? 'En Stock' : 'Agotado'}
            </span>
          </div>

          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#ccc', marginBottom: '30px' }}>
            {juego.descripcion}
          </p>

          <div style={{ marginTop: 'auto', backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#00FF88' }}>
                ${Number(juego.precio).toFixed(2)}
              </div>

              <button 
                onClick={manejarListaDeseos} 
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: enListaDeseos ? '#ff66b2' : '#666',
                  transition: 'color 0.3s, transform 0.2s',
                  transform: enListaDeseos ? 'scale(1.1)' : 'scale(1)'
                }}
                title="Añadir a lista de deseos"
              >
                {enListaDeseos ? '💖' : '🤍'}
                <span style={{ fontSize: '1rem', color: '#aaa', fontWeight: 'normal' }}>
                  {enListaDeseos ? 'Guardado' : 'Deseo'}
                </span>
              </button>
            </div>
            
            <button disabled={!sePuedeComprar} onClick={agregarAlCarrito} style={{
                width: '100%', padding: '15px', fontSize: '1.2rem', fontWeight: 'bold',
                backgroundColor: sePuedeComprar ? '#00BFFF' : '#444', color: sePuedeComprar ? '#000' : '#888',
                border: 'none', borderRadius: '8px', cursor: sePuedeComprar ? 'pointer' : 'not-allowed',
                transition: 'transform 0.2s, boxShadow 0.2s', boxShadow: sePuedeComprar ? '0 4px 15px rgba(0, 191, 255, 0.4)' : 'none'
              }}>
              {sePuedeComprar ? 'Añadir al Carrito' : 'Temporalmente sin llaves'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default DetalleJuego;