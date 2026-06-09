import { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({ disponibles: 0, vendidas: 0 });

  useEffect(() => {
    const vId = localStorage.getItem('idUsuario');
    console.log("=== DEBUG INVENTARIO ===");
    console.log("Id Vendedor: ", vId);

    // Solo hacemos el fetch si el ID realmente existe
    if (vId) {
      fetch(`http://localhost:8080/api/inventario?vendedorId=${vId}`)
        .then(res => {
          if (!res.ok) throw new Error("Error en servidor");
          return res.json();
        })
        .then(data => {
          // Aseguramos que 'data' sea un array antes de procesarlo
          const lista = Array.isArray(data) ? data : [];
          
          const disp = lista.filter(k => k.estado === 'disponible').length;
          const vend = lista.filter(k => k.estado === 'vendida').length;
          setStats({ disponibles: disp, vendidas: vend });
        })
        .catch(err => {
          console.error("Error cargando dashboard:", err);
          setStats({ disponibles: 0, vendidas: 0 }); // Reset ante error
        });
    }
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={cardStyle}>
        <h4>Disponibles</h4>
        <div style={{ fontSize: '2rem', color: '#00FF88' }}>{stats.disponibles}</div>
      </div>
      <div style={cardStyle}>
        <h4>Vendidas</h4>
        <div style={{ fontSize: '2rem', color: '#FFD700' }}>{stats.vendidas}</div>
      </div>
    </div>
  );
}

const cardStyle = { padding: '20px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '10px', flex: 1, textAlign: 'center' };
export default Dashboard;