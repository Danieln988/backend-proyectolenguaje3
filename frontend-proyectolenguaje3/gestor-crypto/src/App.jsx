import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: Cuando la URL es "/" muestra la Landing */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Ruta de login: Cuando la URL es "/login" muestra el AuthPage */}
        <Route path="/login" element={<AuthPage />} />

        {/* --- (Dashboard para usuarios normales) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
      </Route>

        {/* --- (Dashboard para Admins) --- */}
      <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
      </Route>

        {/* --- ZONA PROTEGIDA --- */}
      {/* Todo lo que pongas dentro de este Route, estará vigilado */}
        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />

          {/* Aquí podrías poner más rutas protegidas en el futuro, como /perfil, /ajustes, etc. */}

      </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;