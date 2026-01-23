import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft 
} from 'lucide-react';

const AdminDashboard = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Aca se cargan los datos reales de nuestro backend (Django)
const cargarTransacciones = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch('http://127.0.0.1:8000/api/admin/transacciones/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            alert("⚠️ Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
            localStorage.removeItem('accessToken'); // Borramos el token viejo
            localStorage.removeItem('usuario');
            window.location.href = '/'; // Lo mandamos a la fuerza al Login
            return;
}        
        if (response.ok) {
            const data = await response.json();
            console.log("📦 DATOS RECIBIDOS:", data);

            // LÓGICA ANTI-PAGINACIÓN:
            // Si Django envía resultados paginados, sacamos la lista de 'results'.
            if (Array.isArray(data)) {
                setTransacciones(data);
            } else if (data.results) {
                setTransacciones(data.results);
            } else {
                setTransacciones([]);
            }
        }

    } catch (error) {
        console.error("Error de red:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    cargarTransacciones();
  }, []);

  // 2. Funcion para aprobar/rechazar transacciones
  const procesarTransaccion = async (id, accion) => {
      const texto = accion === 'aprobar' ? 'APROBAR' : 'RECHAZAR';
      if (!window.confirm(`¿Estás seguro de ${texto} la transacción #${id}?`)) return;

      try {
        const token = localStorage.getItem('accessToken');
        // Llamamos al endpoint con el ID y la acción
        const response = await fetch(`http://127.0.0.1:8000/api/admin/transacciones/${id}/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ accion: accion }) // Enviamos 'aprobar' o 'rechazar'
        });

        const data = await response.json();

        if (response.ok) {
            setMensaje(`✅ ${data.message}`);
            // Recargamos la lista para quitar la que acabamos de procesar
            cargarTransacciones();
        } else {
            alert(`Error: ${data.error}`);
        }

      } catch (error) {
          console.error("Error procesando:", error);
      }
      
      setTimeout(() => setMensaje(''), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500 p-1.5 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                CryptoManager <span className="text-slate-500 text-sm font-normal ml-2">| Admin</span>
              </span>
            </div>
            
            <button 
                onClick={() => { localStorage.clear(); window.location.href='/'; }}
                className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-800"
            >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* HEADER DE SECCIÓN */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold mb-2">
                    Panel de Aprobaciones
                </h1>
                <p className="text-slate-400">
                    Gestiona las solicitudes de compra y venta en tiempo real.
                </p>
            </div>
            
            {/* Pequeña estadística (Decorativo) */}
            <div className="bg-slate-800/50 border border-slate-700/50 px-4 py-2 rounded-lg flex items-center gap-3">
                <div className="bg-orange-500/10 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-orange-400" />
                </div>
                <div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Pendientes</div>
                    <div className="text-xl font-bold text-slate-100">{transacciones.length}</div>
                </div>
            </div>
        </div>

        {/* ALERTA FLOTANTE */}
        {mensaje && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${
                mensaje.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
                {mensaje.type === 'success' ? <CheckCircle2 className="h-5 w-5"/> : <XCircle className="h-5 w-5"/>}
                <span className="font-medium">{mensaje.text}</span>
            </div>
        )}

        {/* TABLA DE TRANSACCIONES */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
            {loading ? (
                <div className="p-12 text-center text-slate-500">
                    Cargando transacciones...
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/50 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Monto Crypto</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Total USD</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {transacciones.length > 0 ? transacciones.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">#{tx.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-200">{tx.email_usuario}</div>
                                        <div className="text-xs text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                            tx.type === 'buy' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                        }`}>
                                            {tx.type === 'buy' ? <ArrowDownLeft className="h-3 w-3"/> : <ArrowUpRight className="h-3 w-3"/>}
                                            {tx.type === 'buy' ? 'COMPRA' : 'VENTA'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-300">
                                        {tx.amount_crypto} <span className="text-slate-500 ml-1">{tx.simbolo_moneda}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-100">
                                        ${tx.amount_usd}
                                    </td>
                                    <td className="px-6 py-4">
                                        
                                        <div className="flex items-center justify-center gap-2"> 
                                            <button 
                                                onClick={() => procesarTransaccion(tx.id, 'aprobar')}
                                                title="Aprobar"
                                                className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-lg transition-all border border-emerald-500/20"
                                            >
                                                <CheckCircle2 className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => procesarTransaccion(tx.id, 'rechazar')}
                                                title="Rechazar"
                                                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all border border-red-500/20"
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                                            <Search className="h-8 w-8 text-slate-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-300">Todo al día</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto mt-2">
                                            No hay transacciones pendientes de revisión en este momento.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;