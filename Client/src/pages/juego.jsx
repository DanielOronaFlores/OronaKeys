import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DetalleJuego() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [juego, setJuego] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  const [enListaDeseos, setEnListaDeseos] = useState(false);
  
  const [hayLlavesDisponibles, setHayLlavesDisponibles] = useState(false);

  const [resenas, setResenas] = useState([]);
  const [textoResena, setTextoResena] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [resenaEditando, setResenaEditando] = useState(null); // Guarda el ID de la reseña si estamos editando
  

// 1. Limpieza estricta de la sesión (evita que el texto "null" rompa la lógica)
  const idActivoRaw = localStorage.getItem('idUsuarioActivo');
  const idUsuarioActivo = (idActivoRaw && idActivoRaw !== 'null' && idActivoRaw !== 'undefined') ? idActivoRaw : null;

  useEffect(() => {
    async function cargarDatos() {
      try {
        // Blindamos los fetch con .catch() para que un error en reseñas/stock no tumbe toda la página
        const [juegoRes, stockRes, catRes, resenasRes] = await Promise.all([
          fetch(`http://localhost:8080/api/juego/${id}`),
          fetch(`http://localhost:8080/api/juego/${id}/stock`).catch(() => ({ ok: false })),
          fetch(`http://localhost:8080/api/categorias/por-juego/${id}`).catch(() => ({ ok: false })),
          fetch(`http://localhost:8080/api/resenas/juego/${id}`).catch(() => ({ ok: false }))
        ]);

        if (!juegoRes || !juegoRes.ok) throw new Error("Juego no encontrado");

        const juegoData = await juegoRes.json();
        const stockData = stockRes.ok ? await stockRes.json() : { hayStock: false };
        const catData = catRes.ok ? await catRes.json() : [];
        const resenasData = resenasRes.ok ? await resenasRes.json() : []; // Si no hay reseñas, arreglo vacío seguro

        setJuego({
          ...juegoData,
          categorias: catData 
        });
        
        setHayLlavesDisponibles(stockData.hayStock);
        setResenas(resenasData);
        setCargando(false);

      } catch (error) {
        console.error("Error crítico al cargar:", error);
        setJuego(null);
        setCargando(false);
      }
    }

    cargarDatos();

    // Solo buscamos wishlist si realmente hay un usuario activo
    if (idUsuarioActivo) {
      fetch(`http://localhost:8080/api/deseos/verificar?idUsuario=${idUsuarioActivo}&idVideojuego=${id}`)
        .then(res => res.json())
        .then(data => setEnListaDeseos(data.enLista))
        .catch(err => console.error("Error wishlist:", err));
    }
  }, [id, idUsuarioActivo]);  

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

  // --- FUNCIONES DE RESEÑAS ---
  const manejarSubmitResena = (e) => {
    e.preventDefault();
    if (!idUsuarioActivo) {
      alert("¡Debes iniciar sesión para dejar una reseña!");
      return navigate('/login');
    }

    const payload = {
      idVideojuego: Number(id),
      idUsuario: Number(idUsuarioActivo),
      calificacion: Number(calificacion),
      comentario: textoResena
    };

    const url = resenaEditando 
      ? `http://localhost:8080/api/resenas/${resenaEditando}`
      : `http://localhost:8080/api/resenas`;
      
    const metodo = resenaEditando ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resenaGuardada => {
      if (resenaEditando) {
        // Actualizamos la lista local conservando el nombre de usuario
        setResenas(resenas.map(r => {
          if (r.idResena === resenaEditando) {
            return {
              ...resenaGuardada,
              nombreUsuario: r.nombreUsuario // ¡Mantenemos el nombre a salvo!
            };
          }
          return r;
        }));
      } else {
        // Al crear una nueva, como la API devuelve la pura Resena, le ponemos "Tú" temporalmente
        // hasta que el usuario recargue la página.
        setResenas([...resenas, { ...resenaGuardada, nombreUsuario: "Tú" }]);
      }
      
      // Limpiamos el formulario
      setTextoResena('');
      setCalificacion(5);
      setResenaEditando(null);
    })
    .catch(err => console.error("Error al guardar reseña:", err));
  };

  const prepararEdicion = (resena) => {
    setTextoResena(resena.comentario);
    setCalificacion(resena.calificacion);
    setResenaEditando(resena.idResena);
    // Hacer scroll hacia el formulario sería un buen toque visual aquí
  };

  const eliminarResena = (idResena) => {
    if(!window.confirm("¿Seguro que quieres borrar esta reseña?")) return;

    fetch(`http://localhost:8080/api/resenas/${idResena}`, { method: 'DELETE' })
      .then(() => {
        setResenas(resenas.filter(r => r.idResena !== idResena));
      })
      .catch(err => console.error("Error al eliminar:", err));
  };



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

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            
            {/* Plataforma */}
            {juego.plataforma && (
              <span style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', fontSize: '0.9rem', color: '#00BFFF' }}>
                {juego.plataforma}
              </span>
            )}
            
            {/* Desarrollador */}
            {juego.desarrollador && (
              <span style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', fontSize: '0.9rem', color: '#00FF88' }}>
                {juego.desarrollador}
              </span>
            )}

            {/* NUEVO: Etiquetas de Categorías dinámicas */}
            {juego.categorias && juego.categorias.map((nombre, index) => (
              <span 
                key={index} 
                style={{ 
                  backgroundColor: '#333', 
                  padding: '6px 12px', 
                  borderRadius: '4px', 
                  fontSize: '0.9rem', 
                  color: '#FFD700', 
                  border: '1px solid #555' 
                }}
              >
                {nombre}
              </span>
            ))}

            {/* Stock */}
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
        {/* SECCIÓN DE RESEÑAS */}
        <div style={{ maxWidth: '1200px', margin: '60px auto 0', borderTop: '1px solid #333', paddingTop: '40px' }}>
          <h2 style={{ color: '#00BFFF', fontSize: '2rem', marginBottom: '20px' }}>Reseñas de la Comunidad</h2>

          {/* Formulario para agregar/editar reseña */}
          {idUsuarioActivo && (
            <form onSubmit={manejarSubmitResena} style={{ backgroundColor: '#111', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #222' }}>
              <h3 style={{ margin: '0 0 15px 0' }}>{resenaEditando ? 'Editar tu reseña' : 'Escribe una reseña'}</h3>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <label>Calificación (1-5):</label>
                <select value={calificacion} onChange={e => setCalificacion(e.target.value)} style={{ padding: '5px', borderRadius: '4px', backgroundColor: '#222', color: '#fff', border: '1px solid #444' }}>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Estrellas</option>
                  ))}
                </select>
              </div>

              <textarea 
                value={textoResena} 
                onChange={e => setTextoResena(e.target.value)} 
                placeholder="¿Qué te pareció el juego?"
                required
                rows="4"
                style={{ width: '100%', padding: '10px', borderRadius: '4px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', marginBottom: '15px', resize: 'vertical' }}
              />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#00FF88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  {resenaEditando ? 'Guardar Cambios' : 'Publicar Reseña'}
                </button>
                {resenaEditando && (
                  <button type="button" onClick={() => { setResenaEditando(null); setTextoResena(''); setCalificacion(5); }} style={{ padding: '10px 20px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Lista de Reseñas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {resenas.length === 0 ? (
              <p style={{ color: '#888' }}>Aún no hay reseñas para este juego. ¡Sé el primero!</p>
            ) : (
              resenas.map(resena => (
                <div key={resena.idResena} style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #00BFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#FFD700', marginRight: '10px' }}>{resena.calificacion} ⭐</span>
                      <span style={{ color: '#888', fontSize: '0.9rem' }}>{resena.nombreUsuario}</span>
                    </div>
                    
                    {/* Controles de Edición: Solo visibles si la reseña es del usuario actual */}
                    {String(resena.idResena) === idUsuarioActivo && (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => prepararEdicion(resena)} style={{ background: 'none', border: 'none', color: '#00BFFF', cursor: 'pointer', fontSize: '0.9rem' }}>Editar</button>
                        <button onClick={() => eliminarResena(resena.idResena)} style={{ background: 'none', border: 'none', color: '#ff3333', cursor: 'pointer', fontSize: '0.9rem' }}>Eliminar</button>
                      </div>
                    )}
                  </div>
                  <p style={{ margin: 0, lineHeight: '1.5' }}>{resena.comentario}</p>
                </div>
              ))
            )}
          </div>
        </div>
    </div>
  );
}

export default DetalleJuego;