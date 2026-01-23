import React, { useState, useEffect } from 'react';
import { TrendingUp, History, Wallet, ArrowRight, ArrowDownLeft, ArrowUpRight, LogOut } from 'lucide-react';

const UserDashboard = () => {
  const [criptos, setCriptos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [formData, setFormData] = useState({
    currency: '',
    type: 'buy', // 'buy' o 'sell'
    amount_crypto: ''
  });
  const [mensaje, setMensaje] = useState(null);

  // 1. Cargar datos iniciales (Monedas e Historial)
  useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            // Cargar Monedas
            const resCriptos = await fetch('http://127.0.0.1:8000/api/criptos/', { headers });
            const dataCriptos = await resCriptos.json();
            setCriptos(dataCriptos);
            if(dataCriptos.length > 0) setFormData(prev => ({...prev, currency: dataCriptos[0].id}));

            // Cargar Historial
            const resHist = await fetch('http://127.0.0.1:8000/api/transacciones/historial/', { headers });
            const dataHist = await resHist.json();
            setHistorial(Array.isArray(dataHist) ? dataHist : []);

        } catch (error) {
            console.error("Error cargando datos", error);
        }
    };
    fetchData();
  }, []);

  // 2. Para crear las transacciones
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    
    try {
        const response = await fetch('http://127.0.0.1:8000/api/transacciones/crear/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            setMensaje({ type: 'success', text: '¡Solicitud enviada con éxito!' });
            // Recargar historial para ver la nueva pendiente
            const resHist = await fetch('http://127.0.0.1:8000/api/transacciones/historial/', { 
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            setHistorial(await resHist.json());
        } else {
            setMensaje({ type: 'error', text: 'Error: Verifique los datos' });
        }
    } catch (error) {
        setMensaje({ type: 'error', text: 'Error de conexión' });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500 p-1.5 rounded-lg"><TrendingUp className="h-5 w-5 text-white" /></div>
              <span className="font-bold text-xl tracking-tight">Mi Portafolio</span>
            </div>
            <button onClick={() => { localStorage.clear(); window.location.href='/'; }} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-medium">
                <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- COLUMNA IZQUIERDA: NUEVA OPERACIÓN --- */}
            <div className="lg:col-span-1">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 shadow-xl sticky top-24">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Wallet className="text-cyan-400"/> Nueva Operación
                    </h2>
                    
                    {mensaje && (
                        <div className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${mensaje.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {mensaje.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Criptomoneda</label>
                            <select 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
                                value={formData.currency}
                                onChange={(e) => setFormData({...formData, currency: e.target.value})}
                            >
                                {criptos.map(coin => (
                                    <option key={coin.id} value={coin.id}>{coin.nombrecripto} ({coin.simbolo})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Tipo de Operación</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'buy'})}
                                    className={`p-3 rounded-lg font-bold transition-all ${formData.type === 'buy' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                                >
                                    COMPRAR
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, type: 'sell'})}
                                    className={`p-3 rounded-lg font-bold transition-all ${formData.type === 'sell' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                                >
                                    VENDER
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Cantidad</label>
                            <input 
                                type="number" 
                                step="0.00000001"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:outline-none"
                                placeholder="0.00"
                                value={formData.amount_crypto}
                                onChange={(e) => setFormData({...formData, amount_crypto: e.target.value})}
                            />
                        </div>

                        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex justify-center items-center gap-2">
                            Procesar Solicitud <ArrowRight className="h-4 w-4"/>
                        </button>
                    </form>
                </div>
            </div>

            {/* --- COLUMNA DERECHA: HISTORIAL --- */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <History className="text-cyan-400"/> Historial de Transacciones
                </h2>
                
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950/50 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Moneda</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Monto</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Total USD</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {historial.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                            tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            tx.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                            {tx.status === 'pending' ? 'PENDIENTE' : tx.status === 'approved' ? 'APROBADO' : 'RECHAZADO'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        {tx.type === 'buy' ? <ArrowDownLeft className="h-4 w-4 text-emerald-500"/> : <ArrowUpRight className="h-4 w-4 text-red-500"/>}
                                        <span className="font-bold text-slate-200">{tx.simbolo_moneda}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-300">{tx.amount_crypto}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-100">${tx.amount_usd}</td>
                                    <td className="px-6 py-4 text-right text-xs text-slate-500">
                                        {new Date(tx.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {historial.length === 0 && (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No hay movimientos aún.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;