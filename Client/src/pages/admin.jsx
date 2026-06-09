import { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const rolRaw = localStorage.getItem('idRol');
    const rol = Number(rolRaw);

    console.log("=== DEBUG ADMIN ===");
    console.log("Rol: ", rol);
    
    if (rol !== 1) {
      alert("Acceso denegado. No tienes permisos de administrador.");
      navigate('/login'); 
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/login');
  };

  const linkStyle = (path) => ({
    display: 'block',
    padding: '15px 20px',
    color: location.pathname.includes(path) ? '#000' : '#fff',
    backgroundColor: location.pathname.includes(path) ? '#00BFFF' : 'transparent',
    textDecoration: 'none',
    fontWeight: 'bold',
    borderRadius: '8px',
    marginBottom: '10px',
    transition: 'all 0.3s'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* MENÚ LATERAL (SIDEBAR) */}
      <aside style={{ width: '250px', backgroundColor: '#111', borderRight: '1px solid #333', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#00FF88', marginBottom: '40px', textAlign: 'center', fontSize: '1.5rem' }}>
          OronaKeys <br/><span style={{ color: '#fff', fontSize: '1rem', fontWeight: 'normal' }}>Panel de Control</span>
        </h2>

        <nav style={{ flex: 1 }}>
          <p style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Catálogo</p>
          <Link to="/admin/juegos" style={linkStyle('/admin/juegos')}>Juegos</Link>
          <Link to="/admin/desarrolladores" style={linkStyle('/admin/desarrolladores')}>Desarrolladores</Link>
          <Link to="/admin/plataformas" style={linkStyle('/admin/plataformas')}>Plataformas</Link>
          
          <p style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '30px', marginBottom: '15px' }}>Marketing & Ventas</p>
          <Link to="/admin/ordenes" style={linkStyle('/admin/ordenes')}>Órdenes</Link>
          <Link to="/admin/cupones" style={linkStyle('/admin/cupones')}>Cupones</Link>

          <p style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '30px', marginBottom: '15px' }}>Usuarios & Vendedores</p>
          <Link to="/admin/usuarios" style={linkStyle('/admin/usuarios')}>Usuarios</Link>
        </nav>

        <button 
          onClick={cerrarSesion} 
          style={{ padding: '15px', backgroundColor: '#ff3333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet /> 
      </main>
    </div>
  );
}

export default AdminLayout;