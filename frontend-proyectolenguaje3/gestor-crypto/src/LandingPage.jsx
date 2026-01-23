import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, 
  ShieldCheck, 
  RefreshCcw, // Icono para representar intercambio/exchange
  ArrowRight, 
  TrendingUp,
  Bitcoin,
} from 'lucide-react';
// Lucide tiene iconos genéricos, usaremos círculos de colores si no
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-cyan-500 p-1.5 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">CryptoManager</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#markets" className="hover:text-cyan-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Mercados</a>
                <a href="#features" className="hover:text-cyan-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Seguridad</a>
                <Link to="/login">
                    <button className="bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-full text-sm font-medium transition-all">
                     Registro / Iniciar Sesión
                    </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-medium text-emerald-400 tracking-wide uppercase">Mercado en vivo</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
              Compra, Vende y Gestiona tus Criptomonedas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                sin complicaciones
              </span>
            </h1>
            
            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-400 mb-10">
              La plataforma más segura para acceder a los principales activos del mercado. 

              Liquidez inmediata en <strong>BTC, ETH, DOGE, USDT y XPR</strong>.
            </p>
 
            <div className="flex justify-center gap-4">
                <Link to="/login">
                    <button className="group bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25">
                     Registrarse
                     <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /> 
                    </button>
                </Link>
              <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-8 py-3 rounded-full font-semibold transition-all border border-slate-700">
                Ver Mercados
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* --- MERCADOS (COINS STRIP) --- */}
      <div className="border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4 py-8">
            <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">Activos Disponibles</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center grayscale hover:grayscale-0 transition-all duration-500">
                
                {/* BTC */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white text-xs">₿</div>
                    <span className="text-lg font-bold text-slate-300">Bitcoin</span>
                </div>

                {/* ETH */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">♦</div>
                    <span className="text-lg font-bold text-slate-300">Ethereum</span>
                </div>

                {/* DOGE */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">Ð</div>
                    <span className="text-lg font-bold text-slate-300">DOGE</span>
                </div>

                {/* USDT */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">$</div>
                    <span className="text-lg font-bold text-slate-300">USDT</span>
                </div>

                {/* XPR */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-xs">X</div>
                    <span className="text-lg font-bold text-slate-300">XPR</span>
                </div>

            </div>
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <div className="bg-cyan-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <RefreshCcw className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Intercambio Instantáneo</h3>
              <p className="text-slate-400 leading-relaxed">
                Olvídate de las esperas. Convierte tus USDT a Bitcoin o Ethereum en segundos con la mejor tasa del mercado.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <div className="bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Custodia Institucional</h3>
              <p className="text-slate-400 leading-relaxed">
                Tus activos están protegidos. Utilizamos almacenamiento en frío (Cold Storage) para garantizar la seguridad de tus fondos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <LineChart className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Gestión de Portafolio</h3>
              <p className="text-slate-400 leading-relaxed">
                Un panel de control centralizado para ver tu balance total en tiempo real, historial de órdenes y rendimiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">&copy; 2026 CryptoManager. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;