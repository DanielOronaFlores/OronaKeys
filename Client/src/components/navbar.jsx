import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const haySesion = localStorage.getItem('token');
  const rolId = Number(localStorage.getItem('idRol'));

  const esAdmin = haySesion && rolId === 1;
  const esVendedor = haySesion && rolId === 3; // Identificamos al vendedor (rol 3)

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('idUsuarioActivo');
    localStorage.removeItem('idRol');
    localStorage.removeItem('carritoOronaKeys');
    navigate('/login');
  };
  
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: '#111', borderBottom: '1px solid #333' }}>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to={esAdmin ? "/admin" : "/"} style={{ color: '#00BFFF', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>OronaKeys</Link>
        
        {/* Vistas específicas según rol */}
        {!esAdmin && !esVendedor && (
          <>
            <Link to="/" style={linkStyle}>Inicio</Link>
            <Link to="/catalogo" style={linkStyle}>Catálogo</Link>
          </>
        )}
        
        {esVendedor && (
          <>
            <Link to="/vendedor/dashboard" style={{ color: '#FFD700', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/vendedor/inventario" style={{ color: '#fff', textDecoration: 'none' }}>Inventario</Link>
            <Link to="/vendedor/gestor" style={{ color: '#442cb1', textDecoration: 'none' }}>Gestor</Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        {esAdmin || esVendedor ? (
          <button onClick={cerrarSesion} style={{ backgroundColor: 'transparent', color: '#ff3333', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            Cerrar Sesión
          </button>
        ) : haySesion ? (
          <>
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
            <Link to="/login" style={{ color: '#fff', textDecoration: 'none', padding: '8px 16px' }}>Iniciar Sesión</Link>
            <Link to="/registro" style={{ backgroundColor: '#00BFFF', color: '#000', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '600'
};

export default Navbar;