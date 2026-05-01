import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950 pt-10 pb-6 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-slate-800/50 pb-8">
          
          {/* Brand & Status */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-500 tracking-tight flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
              COFFEE-INN.AI
            </h2>
            <p className="text-slate-500 text-sm font-medium">Next-Generation AI Intrusion Detection & Network Security Engine.</p>
            <div className="flex items-center space-x-2 bg-slate-900/80 w-max px-3 py-1.5 rounded-full border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
              <span className="uppercase tracking-widest text-[10px] font-bold text-emerald-400">Core Matrix Online</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">System Modules</h3>
            <ul className="space-y-2 text-sm text-slate-400 font-medium">
              <li>
                <Link to="/logs" className="hover:text-emerald-400 cursor-pointer transition flex items-center">
                  <span className="text-emerald-500 mr-2">▹</span> Threat Intelligence Logs
                </Link>
              </li>
              <li>
                <Link to="/network" className="hover:text-emerald-400 cursor-pointer transition flex items-center">
                  <span className="text-emerald-500 mr-2">▹</span> Global Network Map
                </Link>
              </li>
              <li>
                <Link to="/firewall" className="hover:text-emerald-400 cursor-pointer transition flex items-center">
                  <span className="text-emerald-500 mr-2">▹</span> Automated Firewall
                </Link>
              </li>
            </ul>
          </div>

          {/* Telemetry / Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Live Telemetry</h3>
            <div className="space-y-3 font-mono text-xs text-slate-500">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>SERVER_NODE</span>
                <span className="text-slate-300">IND-WEST-1</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>LATENCY</span>
                <span className="text-emerald-400">12ms</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span>MODEL_VERSION</span>
                <span className="text-slate-300">RF-NSL-KDD-v2</span>
              </div>
            </div>
          </div>

          {/* Development Team */}
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Development Team</h3>
            <div className="space-y-3 text-sm text-slate-400 font-medium">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-3 text-xs text-slate-300 font-bold">R</div>
                <span>Rashi</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-3 text-xs text-slate-300 font-bold">R</div>
                <span>Rishabh Chauhan</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-3 text-xs text-slate-300 font-bold">R</div>
                <span>Ridima</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-3 text-xs text-slate-300 font-bold">R</div>
                <span>Ritik Pathak</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mr-3 text-xs text-slate-300 font-bold">S</div>
                <span>Sandeep Kumar</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-600">
          <p>
            &copy; {new Date().getFullYear()} AI-Based Cyber Attack Prevention System. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-400 cursor-pointer transition">PRIVACY_POLICY</span>
            <span className="hover:text-slate-400 cursor-pointer transition">TERMS_OF_SERVICE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
