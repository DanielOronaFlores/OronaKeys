import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setCorreo] = useState('');
  const [contrasena, setContrasenia] = useState('');
  const navigate = useNavigate();

  const manejarLogin = (e) => {
    e.preventDefault();
    console.log("Intentando iniciar sesión con:", email, contrasena);
        const credenciales = {
        email: email,
        contrasena: contrasena
    };

        fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(credenciales) 
    })

    .then((respuestaServidor) => respuestaServidor.json())
    
    .then((datos) => {
        if (datos.exito === true) {
            localStorage.setItem('token', 'sesion-activa');
            localStorage.setItem('idUsuario', datos.usuario.idUsuario)

            console.log("ID de usuario del LocalStorage:", datos.usuario.idUsuario);
            console.log("Tipo de dato que se leyó:", typeof datos.usuario.idUsuario);
            navigate('/inicio'); 
        } else {
            alert("Credenciales incorrectas, intenta de nuevo."); 
        }
    })
    
    .catch((error) => {
        console.error("Hubo un error de conexión:", error);
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#0a0a0a', 
      backgroundImage: 'radial-gradient(circle at top right, #1a1a2e, #0a0a0a)',
      color: '#fff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ 
        padding: '40px', 
        backgroundColor: 'rgba(25, 25, 35, 0.8)', 
        borderRadius: '12px', 
        boxShadow: '0 0 20px rgba(0, 255, 128, 0.1)', 
        border: '1px solid #333',
        width: '100%', 
        maxWidth: '400px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '2.2rem', 
            fontWeight: '900', 
            letterSpacing: '2px',
            lineHeight: '1.2',
            paddingTop: '3px',
            paddingBottom: '3px',
            background: 'linear-gradient(90deg, #00FF88, #00BFFF)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            OronaKeys
          </h1>
          <p style={{ color: '#888', marginTop: '5px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Portal de Administración
          </p>
        </div>
        
        <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#ccc', fontSize: '0.9rem' }}>
              🎮 Correo Electrónico
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="admin@oronakeys.com"
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '6px', 
                border: '1px solid #444', 
                backgroundColor: '#111',
                color: '#fff',
                boxSizing: 'border-box',
                outline: 'none',
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
              onChange={(e) => setContrasenia(e.target.value)}
              placeholder="••••••••"
              required
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '6px', 
                border: '1px solid #444', 
                backgroundColor: '#111',
                color: '#fff',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" style={{ 
            padding: '14px', 
            backgroundColor: '#00FF88', 
            color: '#000', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontSize: '16px', 
            fontWeight: '900', 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '15px',
            transition: 'transform 0.2s, boxShadow 0.2s',
            boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)'
          }}>
            Iniciar Sesión
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/signup" style={{ color: '#00BFFF', textDecoration: 'none', fontWeight: 'bold' }}>
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;