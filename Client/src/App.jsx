import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Inicio from './pages/inicio';
import Navbar from './components/navbar';
import Login from './pages/login';
import Signup from  './pages/signup';
import Catalogo from './pages/catalogo';
import Juego from './pages/juego';
import Carrito from './pages/carrito';
import Checkout from './pages/checkout';
import Perfil from './pages/perfil';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        
        <Route path="/inicio" element={<Inicio />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/juego/:id" element={<Juego />} />
      
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;