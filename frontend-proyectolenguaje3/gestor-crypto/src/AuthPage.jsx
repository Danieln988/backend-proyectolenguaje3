import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, TrendingUp, Eye, EyeOff } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin 
        ? 'http://127.0.0.1:8000/api/token/'
        : 'http://127.0.0.1:8000/api/users/registro/';

    const payload = {
        email: formData.email,
        username: formData.email, 
        password: formData.password,
        first_name: formData.nombre        
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            if (isLogin) {
                console.log("Login exitoso");
                
                localStorage.setItem('accessToken', data.access);
                localStorage.setItem('refreshToken', data.refresh);
                
                // Django por defecto no envía el nombre, así que creamos el usuario
                // usando el email que acabamos de enviar en el formulario.
                const userData = {
                    name: formData.email.split('@')[0], // Esto es para usar la parte antes del @ como nombre
                    email: formData.email,
                    id: data.id,
                    isAdmin: data.is_staff
                };
                
                // Guardamos ese objeto que acabamos de crear
                localStorage.setItem('usuario', JSON.stringify(userData));
                localStorage.setItem('accessToken', data.access);

                console.log("🔍 DATOS RECIBIDOS:", userData);

            if (userData.isAdmin === true) {
                console.log("🚀 ES ADMIN -> Redirigiendo a /admin");
                navigate('/admin');
            } else {
                console.log("🚶 USUARIO NORMAL -> Redirigiendo a /dashboard");
                navigate('/dashboard');
            }
            
            } else {
                alert("¡Cuenta creada exitosamente! Ahora inicia sesión.");
                setIsLogin(true);
            }
        } else {
              console.error("Error del servidor:", data);
              setError('Error: ' + (data.detail || 'Verifica tus datos'));
             }
    } catch (err) {
        console.error("Error de red:", err);
        setError('No se pudo conectar con el servidor Django.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex font-sans text-slate-50 selection:bg-cyan-500 selection:text-white">
      
      {/* --- LADO IZQUIERDO (DECORATIVO) --- */}
      <div className="hidden md:flex w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px]" />
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 bg-slate-900/50 border border-slate-700 p-2 pr-4 rounded-full backdrop-blur-sm">
             <div className="bg-cyan-500 p-1.5 rounded-lg"><TrendingUp className="h-5 w-5 text-white" /></div>
             <span className="font-bold tracking-tight">CryptoManager</span>
          </div>
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">Gestiona tus activos con <span className="text-cyan-400">Seguridad Garantizada</span>.</h2>
        </div>
      </div>

      {/* --- LADO DERECHO (FORMULARIO) --- */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">{isLogin ? 'Bienvenido' : 'Crear Cuenta'}</h2>
            <p className="text-slate-400">{isLogin ? 'Ingresa tus credenciales.' : 'Completa el formulario.'}</p>
          </div>

          {/* Mensaje de Error Visual */}
          {error && <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm text-center">{error}</div>}

          {/* --- AQUÍ ESTABA EL ERROR 1: EL FORM ESTABA BLOQUEADO --- */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  {/* --- ERROR 2 CORREGIDO: SE AGREGARON NAME, VALUE Y ONCHANGE --- */}
                  <input 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                {/* --- ERROR 2 CORREGIDO --- */}
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nombre@ejemplo.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                {/* --- ERROR 2 CORREGIDO --- */}
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-10 pr-12 text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50">
              {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button onClick={() => {setIsLogin(!isLogin); setError('')}} className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
              {isLogin ? 'Regístrate gratis' : 'Inicia Sesión'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;