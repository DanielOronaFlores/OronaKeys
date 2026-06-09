import { useState, useEffect } from 'react';

function AdminDefault() {
  const [stats, setStats] = useState({ usuarios: 0, juegos: 0, pedidos: 0 });

  useEffect(() => {
    // Traemos datos rápidos para el resumen
    Promise.all([
      fetch('http://localhost:8080/api/usuarios').then(res => res.json()),
      fetch('http://localhost:8080/api/juegos').then(res => res.json()),
      fetch('http://localhost:8080/api/pedidos').then(res => res.json())
    ])
    .then(([users, games, orders]) => {
      setStats({
        usuarios: users.length,
        juegos: games.length,
        pedidos: orders.length
      });
    });
  }, []);

  return (
    <div style={{ padding: '20px', color: '#fff' }}>
      <h2 style={{ color: '#00BFFF', marginBottom: '10px' }}>¡Bienvenido de vuelta, Admin!</h2>
      <p style={{ color: '#888', marginBottom: '40px' }}>Aquí tienes un vistazo rápido al estado de OronaKeys.</p>

      <div style={{ display: 'flex', gap: '20px' }}>
        <StatCard title="Usuarios Totales" value={stats.usuarios} color="#00FF88" />
        <StatCard title="Juegos en Catálogo" value={stats.juegos} color="#00BFFF" />
        <StatCard title="Ventas Realizadas" value={stats.pedidos} color="#FFD700" />
      </div>
      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333' }}>
        <h4 style={{ color: '#aaa', marginTop: 0 }}>Acciones Rápidas</h4>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Usa el menú lateral para gestionar el catálogo, promociones o permisos de usuario. 
          El sistema está operando al 100%.
        </p>
      </div>
    </div>
  );
}

// Sub-componente para las tarjetas
function StatCard({ title, value, color }) {
  return (
    <div style={{ flex: 1, padding: '25px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #333', textAlign: 'center' }}>
      <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px' }}>{title}</div>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: color }}>{value}</div>
    </div>
  );
}

export default AdminDefault;