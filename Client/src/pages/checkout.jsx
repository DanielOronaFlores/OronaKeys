import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para método de pago
  const [idMetodoPago, setIdMetodoPago] = useState(1); 
  const metodosPagoDisponibles = [
    { id: 1, nombre: 'Tarjeta de Crédito / Débito' },
    { id: 2, nombre: 'PayPal' },
    { id: 3, nombre: 'Oxxo Pay' },
    { id: 4, nombre: 'Transferencia SPEI' }
  ];
  
  // Rescatamos los datos que nos mandó la pantalla del Carrito
  const totalConDescuento = location.state?.totalConDescuento || 0;
  const cuponHeredado = location.state?.cuponAplicado || null;
  
  // Estados para la orden y la pantalla
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [resultadoCompra, setResultadoCompra] = useState(null);

  // Estados del formulario de pago
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [expiracion, setExpiracion] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    const sesion = localStorage.getItem('token');
    if (!sesion) {
      navigate('/login');
      return;
    }

    const carritoGuardado = JSON.parse(localStorage.getItem('carritoOronaKeys')) || [];
    if (carritoGuardado.length === 0 || totalConDescuento === 0) {
      // Si el carrito está vacío o no le pasaron el total, lo regresamos al catálogo
      navigate('/catalogo');
      return;
    }

    setCarrito(carritoGuardado);
  }, [navigate, totalConDescuento]);

  const manejarPago = (e) => {
    e.preventDefault();
    setCargando(true);

    const usuarioLogueadoId = localStorage.getItem('idUsuarioActivo');

    const datosOrden = {
      idUsuario: Number(usuarioLogueadoId) || 999, 
      totalPagado: totalConDescuento, // Mandamos el total que calculó la pantalla anterior
      idsVideojuegos: carrito.map(juego => juego.idVideojuego),
      idMetodoPago: idMetodoPago, 
      codigoCupon: cuponHeredado // Le pasamos a Kotlin el cupón que se validó en el Carrito
    };

    fetch('http://localhost:8080/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosOrden)
    })
      .then(respuesta => respuesta.json())
      .then(datos => {
        if (datos.exito) {
          setResultadoCompra(datos);
          localStorage.removeItem('carritoOronaKeys');
        } else {
          alert("Hubo un problema al procesar la transacción.");
        }
        setCargando(false);
      })
      .catch(error => {
        console.error("Error en el checkout:", error);
        alert("Error de conexión con el servidor de pagos.");
        setCargando(false);
      });
  };

  // PANTALLA DE ÉXITO
  if (resultadoCompra) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '15px', border: '2px solid #00FF88', textAlign: 'center', maxWidth: '500px', boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)' }}>
          <h1 style={{ color: '#00FF88', margin: '0 0 10px 0' }}>{resultadoCompra.mensaje}</h1>
          <p style={{ color: '#aaa', fontSize: '1.1rem' }}>Gracias por confiar en OronaKeys.</p>
          
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '8px', margin: '30px 0', textAlign: 'left' }}>
            <div style={{ marginBottom: '10px' }}><strong>Número de Orden:</strong> <span style={{ color: '#00BFFF' }}>#{resultadoCompra.numeroOrden}</span></div>
            <div><strong>Total Cobrado:</strong> <span style={{ color: '#00FF88' }}>${Number(resultadoCompra.totalCobrado).toFixed(2)}</span></div>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '30px' }}>Tus licencias digitales han sido enviadas a tu inventario.</p>
          
          <button onClick={() => navigate('/catalogo')} style={{ padding: '12px 24px', backgroundColor: '#00BFFF', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  // PANTALLA NORMAL DE CHECKOUT
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: "'Segoe UI', sans-serif", padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#00BFFF' }}>Finalizar Compra</h1>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
        
        {/* === SECCIÓN 1: MÉTODO DE PAGO === */}
        <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '20px', color: '#ccc', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Selecciona tu Método de Pago</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
          {metodosPagoDisponibles.map(metodo => (
            <label key={metodo.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', 
              borderRadius: '8px', border: idMetodoPago === metodo.id ? '1px solid #00BFFF' : '1px solid #444',
              backgroundColor: idMetodoPago === metodo.id ? 'rgba(0, 191, 255, 0.1)' : '#222',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              <input 
                type="radio" 
                name="metodoPago" 
                value={metodo.id} 
                checked={idMetodoPago === metodo.id} 
                onChange={(e) => setIdMetodoPago(Number(e.target.value))}
                style={{ accentColor: '#00BFFF' }}
              />
              <span style={{ fontSize: '0.9rem', color: idMetodoPago === metodo.id ? '#fff' : '#aaa' }}>{metodo.nombre}</span>
            </label>
          ))}
        </div>

        <form onSubmit={manejarPago}>
          {idMetodoPago === 1 && (
            <div style={{ marginBottom: '35px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Nombre en la Tarjeta</label>
                <input type="text" required value={nombreTarjeta} onChange={(e) => setNombreTarjeta(e.target.value)} placeholder="JUAN PEREZ" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Número de Tarjeta</label>
                <input type="text" required maxLength="16" value={numeroTarjeta} onChange={(e) => setNumeroTarjeta(e.target.value)} placeholder="4556 1234 5678 9012" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>Expiración</label>
                  <input type="text" required maxLength="5" value={expiracion} onChange={(e) => setExpiracion(e.target.value)} placeholder="MM/AA" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', outline: 'none', textAlign: 'center' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>CVV</label>
                  <input type="password" required maxLength="3" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', outline: 'none', textAlign: 'center' }} />
                </div>
              </div>
            </div>
          )}

          {/* === SECCIÓN DE TOTALES (Simplificada) === */}
          <div style={{ borderTop: '1px solid #333', paddingTop: '20px', marginBottom: '25px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
            
            {cuponHeredado && (
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#00FF88', fontSize: '0.9rem' }}>
               <span>Cupón Aplicado:</span>
               <span style={{ fontWeight: 'bold' }}>{cuponHeredado}</span>
             </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: cuponHeredado ? '1px dashed #444' : 'none' }}>
              <span style={{ fontSize: '1.2rem', color: '#fff' }}>Monto a cobrar:</span>
              <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#00FF88' }}>${Number(totalConDescuento).toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" disabled={cargando} style={{ width: '100%', padding: '15px', backgroundColor: '#00FF88', color: '#000', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)', transition: 'background-color 0.2s', opacity: cargando ? 0.7 : 1 }}>
            {cargando ? 'Procesando Transacción...' : 'Confirmar y Pagar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;