import { useState, useEffect } from 'react';

function AdminCupones() {
  const [cupones, setCupones] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados del formulario
  const [idEditando, setIdEditando] = useState(null);
  const [codigoCupon, setCodigoCupon] = useState('');
  const [porcentajeDescuento, setPorcentajeDescuento] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState(''); // Mapeado a fecha_expiracion en tu DB
  const [activo, setActivo] = useState(true);

  // Carga inicial
  useEffect(() => {
    fetch('http://localhost:8080/api/cupones')
      .then(res => res.json())
      .then(data => {
        setCupones(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar cupones:", err);
        setCargando(false);
      });
  }, []);

  // Guardar o Actualizar
  const manejarSubmit = (e) => {
    e.preventDefault();

    const payload = {
      idCupon: idEditando ? idEditando : 0, 
      codigoCupon: codigoCupon.toUpperCase(), // Forzamos mayúsculas
      porcentajeDescuento: Number(porcentajeDescuento),
      fechaIngreso, // Spring Boot lee "YYYY-MM-DD" perfecto
      activo
    };

    const url = idEditando 
      ? `http://localhost:8080/api/cupones/${idEditando}`
      : `http://localhost:8080/api/cupones`;
    
    const metodo = idEditando ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(async res => {
      if (!res.ok) {
        const errorText = await res.text();
        console.error("🔥 Error de Spring Boot:", errorText);
        throw new Error(errorText); // Pasamos el mensaje del backend directo
      }
      return res.json();
    })
    .then(() => {
      // Refrescamos la tabla
      fetch('http://localhost:8080/api/cupones')
        .then(res => res.json())
        .then(data => setCupones(data));

      limpiarFormulario();
      alert(idEditando ? "¡Cupón actualizado!" : "¡Cupón registrado!");
    })
    .catch(err => {
      console.error("Error al guardar:", err);
      alert(`Error al guardar: ${err.message}`);
    });
  };

  const prepararEdicion = (cupon) => {
    setIdEditando(cupon.idCupon);
    setCodigoCupon(cupon.codigoCupon);
    setPorcentajeDescuento(cupon.porcentajeDescuento);
    setFechaIngreso(cupon.fechaIngreso);
    setActivo(cupon.activo);
  };

  const eliminarCupon = (idCupon) => {
    if (!window.confirm("¿Seguro que deseas eliminar este cupón?")) return;

    fetch(`http://localhost:8080/api/cupones/${idCupon}`, { method: 'DELETE' })
      .then(async res => {
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        setCupones(cupones.filter(c => c.idCupon !== idCupon));
      })
      .catch(err => {
        console.error("Error al eliminar:", err);
        alert("No se pudo eliminar el cupón.");
      });
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setCodigoCupon('');
    setPorcentajeDescuento('');
    setFechaIngreso('');
    setActivo(true);
  };

  if (cargando) {
    return <div style={{ color: '#00BFFF', fontSize: '1.2rem' }}>Cargando cupones promocionales...</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
      
      {/* FORMULARIO */}
      <div style={{ width: '350px', backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333', position: 'sticky', top: '40px' }}>
        <h3 style={{ marginTop: 0, color: idEditando ? '#FFD700' : '#00FF88', marginBottom: '20px' }}>
          {idEditando ? '📝 Editar Cupón' : '🎟️ Nuevo Cupón'}
        </h3>
        
        <form onSubmit={manejarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Código (Ej. VERANO20)</label>
            <input 
              type="text" 
              value={codigoCupon} 
              onChange={e => setCodigoCupon(e.target.value.toUpperCase())} 
              required 
              style={{ ...inputStyle, textTransform: 'uppercase', fontWeight: 'bold', color: '#00BFFF' }} 
              placeholder="VERANO20" 
              maxLength="20"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Descuento (%)</label>
              <input 
                type="number" 
                step="0.01" 
                min="0" 
                max="100"
                value={porcentajeDescuento} 
                onChange={e => setPorcentajeDescuento(e.target.value)} 
                required 
                style={inputStyle} 
                placeholder="15.00" 
              />
            </div>
            <div style={{ width: '100px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Estado</label>
              <select value={activo} onChange={e => setActivo(e.target.value === 'true')} style={inputStyle}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#aaa' }}>Fecha de Expiración</label>
            <input 
              type="date" 
              value={fechaIngreso} 
              onChange={e => setFechaIngreso(e.target.value)} 
              required 
              style={inputStyle} 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, padding: '12px', backgroundColor: idEditando ? '#FFD700' : '#00FF88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              {idEditando ? 'Guardar Cambios' : 'Registrar Cupón'}
            </button>
            {idEditando && (
              <button type="button" onClick={limpiarFormulario} style={{ padding: '12px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                X
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABLA DE CUPONES */}
      <div style={{ flex: 1, backgroundColor: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #333' }}>
        <h3 style={{ marginTop: 0, color: '#00BFFF', marginBottom: '20px' }}>📋 Cupones Activos e Inactivos</h3>
        
        {cupones.length === 0 ? (
          <p style={{ color: '#888' }}>No hay cupones registrados aún.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', color: '#888', fontSize: '0.9rem' }}>
                <th style={{ padding: '12px' }}>Código</th>
                <th style={{ padding: '12px' }}>Descuento</th>
                <th style={{ padding: '12px' }}>Expiración</th>
                <th style={{ padding: '12px' }}>Estado</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cupones.map(cupon => (
                <tr key={cupon.idCupon} style={{ borderBottom: '1px solid #222', transition: 'background 0.2s', ':hover': { backgroundColor: '#161616' } }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#00BFFF', letterSpacing: '1px' }}>{cupon.codigoCupon}</td>
                  <td style={{ padding: '12px', color: '#fff' }}>{cupon.porcentajeDescuento}%</td>
                  <td style={{ padding: '12px', color: '#ccc' }}>{cupon.fechaIngreso}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: cupon.activo ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)', color: cupon.activo ? '#00FF88' : '#ff4444' }}>
                      {cupon.activo ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => prepararEdicion(cupon)} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #00BFFF', color: '#00BFFF', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Editar
                    </button>
                    <button onClick={() => eliminarCupon(cupon.idCupon)} style={{ padding: '6px 12px', backgroundColor: 'transparent', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  backgroundColor: '#222',
  color: '#fff',
  border: '1px solid #444',
  marginTop: '2px',
  boxSizing: 'border-box'
};

export default AdminCupones;