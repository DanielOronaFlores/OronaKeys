import { Link, Outlet } from 'react-router-dom';

function Vendedor() {
  return (
    <div style={{ display: 'flex', minHeight: '80vh', padding: '20px', gap: '20px' }}>
      
      {/* Sidebar de navegación para Vendedor */}
      <div style={{ width: '250px', backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #333', height: 'fit-content' }}>
        <h4 style={{ color: '#aaa', marginBottom: '20px' }}>Panel de Vendedor</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link to="/vendedor/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/vendedor/inventario" style={linkStyle}>Inventario</Link>
          <Link to="/vendedor/gestor" style={linkStyle}>Gestor Keys</Link>
        </div>
      </div>

      {/* Contenido dinámico (Aquí se cargan el Dashboard o el Inventario) */}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      
    </div>
  );
}

const linkStyle = {
  color: '#00BFFF',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '600'
};

export default Vendedor;