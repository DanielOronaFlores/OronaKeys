import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Carrito() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [autorizado, setAutorizado] = useState(false);

  // Estados matemáticos y de cupones
  const [cupon, setCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(null); // Guardará el nombre del cupón si es válido
  const [porcentajeDescuento, setPorcentajeDescuento] = useState(0); // Guardará el % que dicte Kotlin
  const [mensajeCupon, setMensajeCupon] = useState('');

  useEffect(() => {
    // 1. El Cadenero: Validar sesión
    const sesion = localStorage.getItem('token'); 
    if (!sesion) {
      setAutorizado(false);
      return; 
    }
    
    setAutorizado(true);

    // 2. Cargar datos reales del LocalStorage
    const carritoGuardado = JSON.parse(localStorage.getItem('carritoOronaKeys')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(juego => juego.idVideojuego !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carritoOronaKeys', JSON.stringify(nuevoCarrito));
  };

  // Lógica conectada a tu base de datos MySQL mediante Spring Boot
  const aplicarCupon = () => {
    if (!cupon) return;

    const codigoLimpio = cupon.trim().toUpperCase();

    fetch(`http://localhost:8080/api/cupones/validar/${codigoLimpio}`)
      .then(res => res.json().then(data => ({ status: res.status, body: data })))
      .then(({ status, body }) => {
        if (status === 200) {
          setCuponAplicado(codigoLimpio); // Guardamos el nombre real
          setPorcentajeDescuento(body.porcentajeDescuento); // 10%, 20%, 50%, etc.
          setMensajeCupon(`✅ ${body.mensaje} (-${body.porcentajeDescuento}%)`);
        } else {
          setCuponAplicado(null);
          setPorcentajeDescuento(0);
          setMensajeCupon(`❌ ${body.mensaje}`);
        }
      })
      .catch(error => {
        console.error("Error conectando con el validador de cupones:", error);
        setMensajeCupon("Error de conexión con el servidor.");
      });
  }

  // Cálculos dinámicos
  const subtotal = carrito.reduce((suma, juego) => suma + Number(juego.precio), 0);
  const descuentoAplicado = subtotal * (porcentajeDescuento / 100);
  const total = subtotal - descuentoAplicado;

  // PANTALLA DE RECHAZO
  if (!autorizado) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#ff3333' }}>Acceso Restringido</h2>
        <p style={{ marginBottom: '30px', color: '#aaa', fontSize: '1.2rem' }}>Necesitas iniciar sesión para ver tu carrito de compras.</p>
        <Link to="/login" style={{ padding: '12px 24px', backgroundColor: '#00BFFF', color: '#000', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          Ir a Iniciar Sesión
        </Link>
      </div>
    );
  }

  // PANTALLA VACÍA
  if (carrito.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Tu carrito está vacío</h2>
        <Link to="/catalogo" style={{ padding: '12px 24px', backgroundColor: '#00BFFF', color: '#000', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  // PANTALLA NORMAL
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '40px 20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px', color: '#00BFFF' }}>Tu Carrito</h1>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {carrito.map((juego) => (
            <div key={juego.idVideojuego} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#111', padding: '15px', borderRadius: '10px', border: '1px solid #333' }}>
              
              <div style={{ width: '80px', height: '80px', backgroundColor: '#222', borderRadius: '6px', marginRight: '20px', overflow: 'hidden' }}>
                {juego.imagenUrl && <img src={juego.imagenUrl} alt={juego.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{juego.titulo}</h3>
                <span style={{ color: '#00FF88', fontWeight: 'bold', fontSize: '1.1rem' }}>${Number(juego.precio).toFixed(2)}</span>
              </div>

              <button 
                onClick={() => eliminarDelCarrito(juego.idVideojuego)}
                style={{ backgroundColor: 'transparent', border: '1px solid #ff3333', color: '#ff3333', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        <div style={{ flex: '1 1 350px', backgroundColor: '#1a1a2e', padding: '30px', borderRadius: '12px', border: '1px solid #333', height: 'fit-content' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.5rem', borderBottom: '1px solid #444', paddingBottom: '15px', marginBottom: '20px' }}>Resumen de Compra</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#aaa' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Ej: BIENVENIDO10" 
                value={cupon}
                onChange={(e) => setCupon(e.target.value)}
                disabled={cuponAplicado !== null} // Bloquear si ya aplicó uno
                onKeyDown={(e) => { if (e.key === 'Enter') aplicarCupon(); }}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', textTransform: 'uppercase' }}
              />
              
              {cuponAplicado ? (
                <button 
                  onClick={() => { setCuponAplicado(null); setPorcentajeDescuento(0); setCupon(''); setMensajeCupon(''); }}
                  style={{ padding: '10px 15px', backgroundColor: '#ff4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Quitar
                </button>
              ) : (
                <button 
                  onClick={aplicarCupon}
                  style={{ padding: '10px 15px', backgroundColor: '#333', color: '#fff', border: '1px solid #555', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Aplicar
                </button>
              )}
            </div>
            {mensajeCupon && (
              <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: porcentajeDescuento > 0 ? '#00FF88' : '#ff3333' }}>
                {mensajeCupon}
              </p>
            )}
          </div>

          {porcentajeDescuento > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#00FF88' }}>
              <span>Descuento ({porcentajeDescuento}%):</span>
              <span>-${descuentoAplicado.toFixed(2)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #444', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button 
            // AQUÍ MANDAMOS EL CUPÓN A LA SIGUIENTE PANTALLA
            onClick={() => navigate('/checkout', { state: { totalConDescuento: total, cuponAplicado: cuponAplicado } })}
            style={{ width: '100%', padding: '15px', marginTop: '30px', backgroundColor: '#00FF88', color: '#000', fontSize: '1.2rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0, 255, 136, 0.3)' }}
          >
            Proceder al Pago
          </button>
        </div>

      </div>
    </div>
  );
}

export default Carrito;