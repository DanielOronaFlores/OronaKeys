import { useEffect, useState } from 'react';

function App() {
  const [desarrolladores, setDesarrolladores] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/desarrolladores')
      .then((respuesta) => respuesta.json())
      .then((datos) => setDesarrolladores(datos))
      .catch((error) => console.error("Error conectando al servidor:", error));
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Panel Admin - Desarrolladores</h1>
      
      {desarrolladores.length === 0 ? (
        <p>Cargando datos o no hay desarrolladores registrados...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Sitio Web</th>
            </tr>
          </thead>
          <tbody>
            {desarrolladores.map((dev) => (
              <tr key={dev.idDesarrollador}>
                <td>{dev.idDesarrollador}</td>
                <td>{dev.nombreDesarrollador}</td>
                <td>{dev.sitioWeb || 'Sin sitio web'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;