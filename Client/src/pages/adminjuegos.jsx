import { useState, useEffect } from 'react';

function AdminJuegos() {
  // --- ESTADOS DE DATOS ---
  const [juegos, setJuegos] = useState([]);
  const [desarrolladores, setDesarrolladores] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- ESTADOS DEL FORMULARIO ---
  const [idEditando, setIdEditando] = useState(null); // null = Crear, número = Editar
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [activo, setActivo] = useState(true);
  const [idPlataforma, setIdPlataforma] = useState('');
  const [idDesarrollador, setIdDesarrollador] = useState('');

  // --- 1. CARGA INICIAL DE DATOS (Promise.all) ---
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/juegos').then(res => res.json()),
      fetch('http://localhost:8080/api/desarrolladores').then(res => res.json()),
      fetch('http://localhost:8080/api/plataformas').then(res => res.json())
    ])
    .then(([juegosData, desData, platData]) => {
      setJuegos(juegosData);
      setDesarrolladores(desData);
      setPlataformas(platData);
      
      // Pre-seleccionar los primeros elementos en los dropdowns por defecto
      if (platData.length > 0) setIdPlataforma(platData[0].idPlataforma);
      if (desData.length > 0) setIdDesarrollador(desData[0].idDesarrollador);
      
      setCargando(false);
    })
    .catch(err => {
      console.error("Error al cargar los datos del panel:", err);
      setCargando(false);
    });
  }, []);

  // --- 2. MANEJAR ENVÍO (CREAR O ACTUALIZAR) ---
  const manejarSubmit = (e) => {
    e.preventDefault();

    // Estructura que mapea exactamente con tu entidad Videojuego.kt en Spring Boot
    const payload = {
      idVideojuego: idEditando ? idEditando : 0, // Ayuda a Spring a saber si es nuevo
      titulo,
      descripcion,
      precio: Number(precio),
      imagenUrl,
      activo,
      plataforma: { 
        idPlataforma: Number(idPlataforma),
        nombre: "ignorado" // <-- Calma a Jackson (Hibernate solo usa el ID)
      },
      desarrollador: { 
        idDesarrollador: Number(idDesarrollador),
        nombreDesarrollador: "ignorado" // <-- Calma a Jackson
      }
    };

    const url = idEditando 
      ? `http://localhost:8080/api/juego/${idEditando}`
      : `http://localhost:8080/api/juego`;
    
    const metodo = idEditando ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async res => {
      if (!res.ok){
        const errorText = await res.text();
        console.error("MOTIVO DEL RECHAZO DE SPRING BOOT:", errorText);
        throw new Error(`Error ${res.status}: ${errorText}`);
      }
      return res.json();
    })
    .then(() => {
      fetch('http://localhost:8080/api/juegos')
        .then(res => res.json())
        .then(data => setJuegos(data));

      limpiarFormulario();
      alert(idEditando ? "¡Juego actualizado con éxito!" : "¡Juego creado con éxito!");
    })
    .catch(err => console.error("Error al guardar videojuego:", err));
  };

  // --- 3. PREPARAR EDICIÓN (Cargar datos de la tabla al formulario) ---
  const prepararEdicion = (juego) => {
    setIdEditando(juego.idVideojuego);
    setTitulo(juego.titulo);
    setPrecio(juego.precio);
    setActivo(juego.activo);
    setIdPlataforma(juego.idPlataforma || plataformas[0]?.idPlataforma);
    setIdDesarrollador(juego.idDesarrollador || desarrolladores[0]?.idDesarrollador);

    // Hacemos el fetch al juego individual que SÍ trae la descripción y la imagen
    fetch(`http://localhost:8080/api/juego/${juego.idVideojuego}`)
      .then(res => res.json())
      .then(data => {
        setDescripcion(data.descripcion || '');
        setImagenUrl(data.imagenUrl || ''); // <--- ¡Lo movimos aquí adentro!
      })
      .catch(err => console.error("Error al cargar detalles del juego:", err));
  };
  
  // --- 4. ELIMINAR JUEGO ---
  const eliminarJuego = (idVideojuego) => {
    if (!window.confirm("¿Seguro que deseas eliminar este videojuego de forma permanente? Se borrarán sus reseñas asociadas.")) return;

    fetch(`http://localhost:8080/api/juego/${idVideojuego}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error("No se pudo eliminar.");
        setJuegos(juegos.filter(j => j.idVideojuego !== idVideojuego));
      })
      .catch(err => console.error("Error al eliminar juego:", err));
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setTitulo('');
    setDescripcion('');
    setPrecio('');
    setImagenUrl('');
    setActivo(true);
    if (plataformas.length > 0) setIdPlataforma(plataformas[0].idPlataforma);
    if (desarrolladores.length > 0) setIdDesarrollador(desarrolladores[0].idDesarrollador);
  };

  if (cargando) {
    return <div style={{ color: '#00BFFF', fontSize: '1.2rem' }}>Cargando catálogo maestro...</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
      
      {/* === COLUMNA IZQUIERDA: FORMULARIO === */}
      <div style={{ width: '350px', backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333', position: 'sticky', top: '40px' }}>
        <h3 style={{ marginTop: 0, color: idEditando ? '#FFD700' : '#00FF88', marginBottom: '20px' }}>
          {idEditando ? '📝 Editar Videojuego' : '➕ Alta de Videojuego'}
        </h3>
        
        <form onSubmit={manejarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Título del juego</label>
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required style={inputStyle} placeholder="Ej. Elden Ring" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Descripción</label>
            <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} required rows="3" style={inputStyle} placeholder="Escribe los detalles del juego..." />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Precio ($)</label>
              <input type="number" step="0.01" value={precio} onChange={e => setPrecio(e.target.value)} required style={inputStyle} placeholder="59.99" />
            </div>
            <div style={{ width: '100px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Estado</label>
              <select value={activo} onChange={e => setActivo(e.target.value === 'true')} style={inputStyle}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>URL de la Imagen</label>
            <input type="url" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} style={inputStyle} placeholder="https://link-de-imagen.com/foto.jpg" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Plataforma Ecosistema</label>
            <select value={idPlataforma} onChange={e => setIdPlataforma(e.target.value)} style={inputStyle}>
              {plataformas.map(p => (
                <option key={p.idPlataforma} value={p.idPlataforma}>{p.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Desarrollador / Publisher</label>
            <select value={idDesarrollador} onChange={e => setIdDesarrollador(e.target.value)} style={inputStyle}>
              {desarrolladores.map(d => (
                <option key={d.idDesarrollador} value={d.idDesarrollador}>{d.nombreDesarrollador}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: idEditando ? '#FFD700' : '#00FF88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {idEditando ? 'Guardar Cambios' : 'Registrar Juego'}
            </button>
            {idEditando && (
              <button type="button" onClick={limpiarFormulario} style={{ padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                X
              </button>
            )}
          </div>
        </form>
      </div>

      {/* === COLUMNA DERECHA: TABLA DE INVENTARIO GENERAL === */}
      <div style={{ flex: 1, backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
        <h3 style={{ marginTop: 0, color: '#00BFFF', marginBottom: '20px' }}>📋 Catálogo de Escaparate</h3>
        
        {juegos.length === 0 ? (
          <p style={{ color: '#888' }}>No hay videojuegos registrados aún.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', color: '#888', fontSize: '0.9rem' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Título</th>
                <th style={{ padding: '12px' }}>Plataforma</th>
                <th style={{ padding: '12px' }}>Desarrollador</th>
                <th style={{ padding: '12px' }}>Precio</th>
                <th style={{ padding: '12px' }}>Visibilidad</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {juegos.map(juego => (
                <tr key={juego.idVideojuego} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', ':hover': { backgroundColor: '#161616' } }}>
                  <td style={{ padding: '12px', color: '#666', fontFamily: 'monospace' }}>#{juego.idVideojuego}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#fff' }}>{juego.titulo}</td>
                  <td style={{ padding: '12px', color: '#00BFFF' }}>{juego.plataforma}</td>
                  <td style={{ padding: '12px', color: '#ccc' }}>{juego.desarrollador}</td>
                  <td style={{ padding: '12px', color: '#00FF88', fontWeight: 'bold' }}>${juego.precio.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: juego.activo ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)', color: juego.activo ? '#00FF88' : '#ff4444' }}>
                      {juego.activo ? 'PÚBLICO' : 'OCULTO'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => prepararEdicion(juego)} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #00BFFF', color: '#00BFFF', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Editar
                    </button>
                    <button onClick={() => eliminarJuego(juego.idVideojuego)} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
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

// Estilo en común para todos los campos de entrada
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

export default AdminJuegos;