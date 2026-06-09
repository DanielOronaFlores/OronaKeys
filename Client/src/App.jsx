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

import Admin from './pages/admin';
import AdminDefault from './pages/admindefault';
import AdminJuegos from './pages/adminjuegos';
import AdminDesarrolladores from './pages/admindesarrolladores';
import AdminPlataformas from './pages/adminplataformas';
import AdminOrdenes from './pages/adminpedidos';
import AdminCupones from './pages/admincupones';
import AdminUsuarios from './pages/adminusuarios';

import Vendedor from './pages/vendedor';
import Dashboard from './pages/dashboard';
import Inventario from './pages/inventario';
import Gestor from './pages/gestor';

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

        {/* === RUTAS DE ADMINISTRACIÓN PROTEGIDAS === */}
        <Route path="/admin" element={<Admin />}>
          <Route index element={<AdminDefault/>} /> 
          
          <Route path="juegos" element={<AdminJuegos />} />
          <Route path="desarrolladores" element={<AdminDesarrolladores />} />
          <Route path="plataformas" element={<AdminPlataformas />} />
          <Route path="ordenes" element={<AdminOrdenes />} />
          <Route path="cupones" element={<AdminCupones />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
        </Route>

        <Route path="/vendedor" element={<Vendedor/>}>
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="inventario" element={<Inventario />} />
          <Route path="gestor" element={<Gestor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;