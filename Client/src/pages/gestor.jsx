import { useState, useEffect } from 'react';

function Gestor() {
  const [juegos, setJuegos] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [juegoId, setJuegoId] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/juegos')
      .then(res => res.json())
      .then(setJuegos);
  }, []);

  const registrarKey = (e) => {
    e.preventDefault();
    
    if (!juegoId || juegoId === "Selecciona un juego...") {
        alert("Selecciona un juego primero");
        return;
    }

    const payload = {
        codigo_clave: codigo, 
        videojuego: { idVideojuego: parseInt(juegoId) }, // Probemos sin el título
        estado: 'disponible' // Usamos mayúsculas por si es un Enum
    };

    console.log(JSON.stringify(payload))

    fetch('http://localhost:8080/api/inventario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
        if (res.ok) {
            alert("Key registrada");
            setCodigo('');
        } else {
            alert("Error al guardar: Revisa la consola del servidor");
        }
    });
  };

  return (
    <div style={{ backgroundColor: '#111', padding: '25px', borderRadius: '12px', color: '#fff' }}>
      <h3>Agregar nueva Key</h3>
      <form onSubmit={registrarKey} style={{ display: 'flex', gap: '10px' }}>
        <select onChange={(e) => setJuegoId(e.target.value)} style={inputStyle}>
          <option>Selecciona un juego...</option>
          {juegos.map(j => <option key={j.idVideojuego} value={j.idVideojuego}>{j.titulo}</option>)}
        </select>
        
        {/* === IMPORTANTE: AÑADIMOS EL VALUE === */}
        <input 
          placeholder="Escribe el código aquí" 
          value={codigo} 
          onChange={(e) => setCodigo(e.target.value)} 
          style={inputStyle} 
        />
        
        <button type="submit" style={{ backgroundColor: '#00FF88', border: 'none', padding: '10px', borderRadius: '5px' }}>
            Guardar
        </button>
      </form>
    </div>
  );
}

const inputStyle = { padding: '10px', width: '300px', backgroundColor: '#222', border: '1px solid #444', color: '#fff' };
export default Gestor;