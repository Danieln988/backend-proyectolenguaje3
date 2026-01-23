import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  
  // 1. NUEVO: Creamos un estado para saber si estamos cargando
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const datosGuardados = localStorage.getItem('usuario');
    
    if (datosGuardados) {
      setUser(JSON.parse(datosGuardados));
      setIsLoading(false); // Ya tenemos usuario, dejamos de cargar
    } else {
      // No hay usuario, redirigimos
      navigate('/login');
      // NO ponemos isLoading(false) aquí, para que la pantalla siga en blanco 
      // mientras el navegador procesa la redirección.
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();    
    console.log("Sesión cerrada");
    navigate('/login');
  };

  // 2. EL GUARDIÁN VISUAL:
  // Si estamos cargando, devolvemos null (pantalla blanca) o un Spinner.
  // Esto evita que se renderice el Dashboard vacío.
  if (isLoading) {
    return null; // O puedes poner: <div>Cargando...</div>
  }

  // 3. Si llegamos aquí, es porque isLoading es false y ya tenemos usuario.
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Aquí usamos el nombre dinámico. 
            El signo '?' (optional chaining) evita errores si user aún es null */}
        <h1>¡Hola, {user?.name || 'usuario'}! 👋</h1>
        
        <h2>Bienvenido a tu Dashboard</h2>
                
        <button style={styles.button} onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    minWidth: '300px'
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#ff4757',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default Dashboard;