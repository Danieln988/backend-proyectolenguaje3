import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Al poner una función dentro de useState, 
    // React la ejecuta ANTES de renderizar el componente por primera vez.
    const [isAllowed] = useState(() => {
        const token = localStorage.getItem('accessToken');
        // Si hay token devuelve true, si no, devuelve false
        return !!token; 
    });

    // Como la decisión ya se tomó arriba, esto es inmediato.
    // Si no está permitido, lo saca antes de mostrar nada.
    if (!isAllowed) {
        return <Navigate to="/" replace />;
    }

    // Si pasa, muestra el dashboard
    return <Outlet />;
};

export default ProtectedRoute;