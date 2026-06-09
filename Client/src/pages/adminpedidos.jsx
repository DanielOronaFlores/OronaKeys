import { useState, useEffect } from 'react';

function AdminOrdenes() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para los filtros
  const [filtroId, setFiltroId] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/pedidos')
      .then(res => res.json())
      .then(data => {
        setPedidos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar el historial de órdenes:", err);
        setCargando(false);
      });
  }, []);

  // Lógica de filtrado en tiempo real
  const pedidosFiltrados = pedidos.filter(pedido => {
    const coincideId = filtroId === '' || pedido.idPedido.toString().includes(filtroId);
    const coincideCliente = filtroCliente === '' || 
                            pedido.cliente.toLowerCase().includes(filtroCliente.toLowerCase()) || 
                            pedido.correo.toLowerCase().includes(filtroCliente.toLowerCase());
    const coincideFecha = filtroFecha === '' || pedido.fechaPedido.split('T')[0] === filtroFecha;

    return coincideId && coincideCliente && coincideFecha;
  });

  // Función para formatear la fecha que manda Spring Boot (LocalDateTime)
  const formatearFecha = (fechaRaw) => {
    if (!fechaRaw) return 'N/A';
    const fecha = new Date(fechaRaw);
    return fecha.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (cargando) {
    return <div style={{ color: '#00BFFF', fontSize: '1.2rem' }}>Cargando historial de ventas...</div>;
  }

  return (
    <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
      
      {/* CABECERA Y FILTROS */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0, color: '#00BFFF', marginBottom: '20px', fontSize: '1.5rem' }}>📦 Historial de Órdenes</h3>
        
        <div style={{ display: 'flex', gap: '15px', backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Buscar por ID de Orden</label>
            <input 
              type="text" 
              placeholder="# ID..." 
              value={filtroId} 
              onChange={e => setFiltroId(e.target.value)} 
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Buscar por Cliente o Correo</label>
            <input 
              type="text" 
              placeholder="Ej. Juan, juan@mail.com" 
              value={filtroCliente} 
              onChange={e => setFiltroCliente(e.target.value)} 
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>Filtrar por Fecha</label>
            <input 
              type="date" 
              value={filtroFecha} 
              onChange={e => setFiltroFecha(e.target.value)} 
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              onClick={() => { setFiltroId(''); setFiltroCliente(''); setFiltroFecha(''); }}
              style={{ padding: '10px 15px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', height: '38px' }}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      {pedidosFiltrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <p>No se encontraron órdenes que coincidan con los filtros.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333', color: '#888', fontSize: '0.9rem' }}>
              <th style={{ padding: '15px' }}>Nº Orden</th>
              <th style={{ padding: '15px' }}>Fecha y Hora</th>
              <th style={{ padding: '15px' }}>Cliente</th>
              <th style={{ padding: '15px' }}>Cupón Aplicado</th>
              <th style={{ padding: '15px', textAlign: 'right' }}>Total (MXN)</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map(pedido => (
              <tr key={pedido.idPedido} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', ':hover': { backgroundColor: '#161616' } }}>
                <td style={{ padding: '15px', color: '#00FF88', fontWeight: 'bold', fontFamily: 'monospace' }}>#{pedido.idPedido}</td>
                <td style={{ padding: '15px', color: '#ccc' }}>{formatearFecha(pedido.fechaPedido)}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ color: '#fff', fontWeight: 'bold' }}>{pedido.cliente}</div>
                  <div style={{ color: '#666', fontSize: '0.85rem' }}>{pedido.correo}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  {pedido.cupon !== 'N/A' ? (
                     <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: 'rgba(0,191,255,0.1)', color: '#00BFFF' }}>
                       {pedido.cupon}
                     </span>
                  ) : (
                    <span style={{ color: '#555' }}>—</span>
                  )}
                </td>
                <td style={{ padding: '15px', textAlign: 'right', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  ${pedido.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  backgroundColor: '#222',
  color: '#fff',
  border: '1px solid #444',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
};

export default AdminOrdenes;