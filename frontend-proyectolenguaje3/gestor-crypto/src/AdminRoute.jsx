import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    // 1. Leemos los datos para saber que tipo de usuario esta haciendo login
    const usuarioGuardado = localStorage.getItem('usuario');
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    console.log("👮‍♂️ PORTERO ADMIN REVISANDO:", usuario);

    // 2. Verificamos el tipo de usuario. 
    if (usuario && usuario.isAdmin === true) {
        console.log("Bienvenido Admin.");
        return <Outlet />;
    } else {
        console.log("Te mando al Dashboard.");
        return <Navigate to="/dashboard" replace />;
    }
};

export default AdminRoute;