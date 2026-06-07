import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const haySesion = localStorage.getItem('token');

  const cerrarSesion = () => {
    // Destruimos la credencial y el carrito al salir
    localStorage.removeItem('token');
    localStorage.removeItem('carritoOronaKeys');
    navigate('/login');
  };
  
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: '#111', borderBottom: '1px solid #333' }}>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#00BFFF', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>OronaKeys</Link>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Inicio</Link>
        <Link to="/catalogo" style={{ color: '#fff', textDecoration: 'none' }}>Catálogo</Link>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        {haySesion ? (
          <>
            {/* Si HAY sesión, mostramos Carrito y Salir */}
            <Link to="/carrito" style={{ color: '#00FF88', textDecoration: 'none', padding: '8px 16px', border: '1px solid #00FF88', borderRadius: '6px' }}>
              Carrito
            </Link>
            <Link to="/perfil" style={{ color: '#00BFFF', textDecoration: 'none', padding: '8px 16px', border: '1px solid #00BFFF', borderRadius: '6px', fontWeight: 'bold' }}>
              Mi Perfil
            </Link>
            <button onClick={cerrarSesion} style={{ backgroundColor: 'transparent', color: '#ff3333', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            {/* Si NO HAY sesión, mostramos Login y Registro */}
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', padding: '8px 16px' }}>Iniciar Sesión</Link>
            <Link to="/registro" style={{ backgroundColor: '#00BFFF', color: '#000', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>Registrarse</Link>
          </>
        )}
      </div>

    </nav>
  );
}

// Estilo reutilizable para los enlaces de texto normal
const linkStyle = {
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '600',
  transition: 'color 0.2s'
};

export default Navbar;