import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Inicio() {
  const [juegos, setJuegos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/inicio')
      .then(respuesta => respuesta.json())
      .then(datos => {
        console.log("Catálogo recibido de MySQL:", datos); 
        
        if (Array.isArray(datos)) {
            setJuegos(datos); 
        } else {
            console.error("Kotlin no mandó una lista. Revisar backend.");
        }
      })
      .catch(error => console.error("Error al conectar con el servidor:", error));
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', 
      backgroundImage: 'radial-gradient(circle at top, #1a1a2e, #0a0a0a)',
      color: '#fff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '40px 20px'
    }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '900', 
          margin: '0 0 10px 0',
          lineHeight: '1.2',
          paddingTop: '3px',
          paddingBottom: '3px',
          background: 'linear-gradient(90deg, #00BFFF, #00FF88)', 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          OronaKeys
        </h1>
        <p style={{ color: '#888', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Tu biblioteca de videojuegos digitales. Encuentra las mejores licencias al instante.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {juegos.map((juego) => (
          <div key={juego.idVideojuego} style={{
            backgroundColor: '#111',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #333',
            transition: 'transform 0.3s, boxShadow 0.3s',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            <div style={{ position: 'relative', height: '160px' }}>
              <img 
                src={juego.imagenUrl} 
                alt={juego.titulo} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <span style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: juego.activo ? '#00BFFF' : '#ff3333',
                color: '#000',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {juego.activo ? 'Disponible' : 'Agotado'}
              </span>
            </div>

            <div style={{ padding: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: '#fff' }}>
                {juego.titulo}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#00FF88' }}>
                  ${Number(juego.precio).toFixed(2)}
                </span>
                
                <Link 
                  to={`/juego/${juego.idVideojuego}`}
                  style={{
                    display: 'inline-block', // Necesario porque ahora es un enlace
                    textDecoration: 'none',  // Quita el subrayado feo de los enlaces
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid #00BFFF',
                    color: '#00BFFF',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Ver Detalles
                </Link>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Inicio;