import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // Logic to determine if a link is currently active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 shrink-0">
      {/* Updated Brand Logo */}
      <div className="p-6 text-2xl font-bold text-emerald-500 tracking-tight">
        COFFEE-INN.AI
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link 
          to="/" 
          className={`block px-4 py-2 rounded font-medium transition ${
            isActive('/') 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Dashboard
        </Link>

        <Link 
          to="/logs" 
          className={`block px-4 py-2 rounded font-medium transition ${
            isActive('/logs') 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Threat Logs
        </Link>

        <Link 
          to="/network" 
          className={`block px-4 py-2 rounded font-medium transition ${
            isActive('/network') 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Network Map
        </Link>

        <Link 
          to="/firewall" 
          className={`block px-4 py-2 rounded font-medium transition ${
            isActive('/firewall') 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Firewall
        </Link>

        <Link 
          to="/settings" 
          className={`block px-4 py-2 rounded font-medium transition ${
            isActive('/settings') 
            ? 'bg-slate-800 text-white' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          Alert Settings
        </Link>
      </nav>

      {/* Footer Status */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        System Status: <span className="text-emerald-500 font-bold uppercase ml-1">Secure</span>
      </div>
    </div>
  );
};

export default Sidebar;