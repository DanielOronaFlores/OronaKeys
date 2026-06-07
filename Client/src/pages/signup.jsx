import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const manejarRegistro = (e) => {
    e.preventDefault();
    
    // Empaquetamos los datos que enviaremos a Kotlin
    const nuevoUsuario = {
      nombre: nombre,
      email: email,
      contrasena: contrasena
    };

    console.log("Intentando registrar usuario:", nuevoUsuario);

    fetch('http://localhost:8080/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoUsuario)
    })
    .then(respuesta => respuesta.json())
    .then(datos => {
        if (datos.exito) {
            alert("¡Cuenta creada! Ahora puedes iniciar sesión.");
            navigate('/login'); // Lo mandamos de vuelta al login
        } else {
            alert("Error: " + datos.mensaje);
        }
    })
    .catch(error => console.error("Error en el servidor:", error));
    
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#0a0a0a', 
      backgroundImage: 'radial-gradient(circle at top left, #1a1a2e, #0a0a0a)',
      color: '#fff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: 'rgba(25, 25, 35, 0.8)', 
        borderRadius: '12px', 
        boxShadow: '0 0 20px rgba(0, 191, 255, 0.1)', 
        border: '1px solid #333',
        width: '100%', 
        maxWidth: '400px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '2rem', 
            fontWeight: '900', 
            letterSpacing: '1px',
            lineHeight: '1.2',
            paddingTop: '3px',
            paddingBottom: '3px',
            background: 'linear-gradient(90deg, #00BFFF, #00FF88)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Crear Cuenta
          </h1>
          <p style={{ color: '#888', marginTop: '5px', fontSize: '0.9rem' }}>
            Únete a OronaKeys
          </p>
        </div>
        
        <form onSubmit={manejarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ccc', fontSize: '0.9rem' }}>
              👤 Nombre Completo
            </label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. John Doe"
              required
              style={{ 
                width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', 
                backgroundColor: '#111', color: '#fff', boxSizing: 'border-box', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ccc', fontSize: '0.9rem' }}>
              🎮 Correo Electrónico
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              required
              style={{ 
                width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', 
                backgroundColor: '#111', color: '#fff', boxSizing: 'border-box', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ccc', fontSize: '0.9rem' }}>
              🔑 Contraseña
            </label>
            <input 
              type="password" 
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Crea una contraseña segura"
              required
              style={{ 
                width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', 
                backgroundColor: '#111', color: '#fff', boxSizing: 'border-box', outline: 'none'
              }}
            />
          </div>

          <button type="submit" style={{ 
            padding: '14px', 
            backgroundColor: '#00BFFF', 
            color: '#000', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: '900', 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '10px',
            transition: 'transform 0.2s, boxShadow 0.2s',
            boxShadow: '0 4px 15px rgba(0, 191, 255, 0.3)'
          }}>
            Registrarse
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: '#00FF88', textDecoration: 'none', fontWeight: 'bold' }}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Registro;