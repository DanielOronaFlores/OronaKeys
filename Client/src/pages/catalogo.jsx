import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Catalogo() {
  const [juegos, setJuegos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  const [plataformasActivas, setPlataformasActivas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/catalogo')
      .then(respuesta => respuesta.json())
      .then(datos => {
        if (Array.isArray(datos)) {
            setJuegos(datos);
        }
      })
      .catch(error => console.error("Error al cargar el catálogo:", error));
  }, []);

  const manejarFiltro = (idPlataforma) => {
    setPlataformasActivas(estadoPrevio => {
      if (estadoPrevio.includes(idPlataforma)) {
        return estadoPrevio.filter(id => id !== idPlataforma);
      } else {
        return [...estadoPrevio, idPlataforma];
      }
    });
  };

  const juegosFiltrados = juegos.filter(juego => {
    const pasaTexto = juego.titulo.toLowerCase().includes(busqueda.toLowerCase());
    
    const idDelJuego = juego.plataforma ? juego.plataforma.idPlataforma : juego.idPlataforma;
    
    const pasaPlataforma = plataformasActivas.length === 0 || plataformasActivas.includes(idDelJuego);

    return pasaTexto && pasaPlataforma;
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#fff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex', 
      padding: '20px'
    }}>

      <aside style={{
        width: '280px',
        backgroundColor: '#111',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #333',
        marginRight: '30px',
        height: 'fit-content', 
        position: 'sticky',
        top: '90px' 
      }}>
        <h2 style={{ color: '#00BFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Filtros</h2>
        
        <div style={{ marginBottom: '25px' }}>
          <input 
            type="text" 
            placeholder="Buscar juego..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%', padding: '10px', borderRadius: '6px',
              border: '1px solid #444', backgroundColor: '#222',
              color: '#fff', outline: 'none'
            }}
          />
        </div>

        {/* ACTUALIZADO: Checkboxes con lógica conectada a los IDs reales de tu base de datos */}
        <div>
          <h3 style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '10px' }}>Plataforma</h3>
          
          <label style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              style={{ marginRight: '8px' }}
              // ID 1 = Steam en tu SQL
              onChange={() => manejarFiltro(1)} 
              checked={plataformasActivas.includes(1)}
            /> 
            Steam
          </label>

          <label style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              style={{ marginRight: '8px' }}
              // ID 2 = Nintendo Switch en tu SQL
              onChange={() => manejarFiltro(2)} 
              checked={plataformasActivas.includes(2)}
            /> 
            Nintendo Switch
          </label>

          <label style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              style={{ marginRight: '8px' }}
              // ID 3 = Epic Games en tu SQL (si tienes juegos ahí)
              onChange={() => manejarFiltro(3)} 
              checked={plataformasActivas.includes(3)}
            /> 
            Epic Games
          </label>

          <label style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              style={{ marginRight: '8px' }}
              // ID 4 = Xbox Live en tu SQL (si tienes juegos ahí)
              onChange={() => manejarFiltro(4)} 
              checked={plataformasActivas.includes(4)}
            /> 
            Xbox Live
          </label>
        </div>
      </aside>

      <main style={{ flex: 1 }}>
        <h1 style={{ fontSize: '2.5rem', marginTop: 0, marginBottom: '30px' }}>Todos los Juegos</h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '25px'
        }}>
          
          {juegosFiltrados.map((juego) => (
            <div key={juego.idVideojuego} style={{
              backgroundColor: '#1a1a2e', borderRadius: '10px',
              overflow: 'hidden', border: '1px solid #333',
              transition: 'transform 0.2s', cursor: 'pointer'
            }}>
              <div style={{ position: 'relative', height: '280px' }}> 
                <img 
                  src={juego.imagenUrl} 
                  alt={juego.titulo} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                {!juego.activo && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    color: '#ff3333', fontWeight: 'bold', fontSize: '1.2rem'
                  }}>
                    AGOTADO
                  </div>
                )}
              </div>

              <div style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {juego.titulo}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00FF88' }}>
                    ${Number(juego.precio).toFixed(2)}
                  </span>
                  
                  <Link to={`/juego/${juego.idVideojuego}`} style={{
                    backgroundColor: '#00BFFF', color: '#000',
                    padding: '6px 12px', borderRadius: '4px',
                    textDecoration: 'none', fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          ))}

        </div>
      </main>

    </div>
  );
}

export default Catalogo;