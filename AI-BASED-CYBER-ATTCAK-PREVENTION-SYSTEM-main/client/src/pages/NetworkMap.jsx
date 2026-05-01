import React from 'react';

const NetworkMap = () => {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Network Topology</h1>
        <p className="text-slate-400 font-medium">Visualizing AI-protected nodes and traffic flow</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 min-h-[500px] flex items-center justify-center relative overflow-hidden">
        {/* Central AI Node */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
            <span className="text-slate-950 font-black text-xs">CORE.AI</span>
          </div>
          <p className="mt-4 text-emerald-500 font-mono text-xs">GATEWAY_ACTIVE</p>
        </div>

        {/* Satellite Nodes (Static Mockup) */}
        <div className="absolute top-20 left-1/4 flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded flex items-center justify-center">
            <span className="text-[10px] text-slate-400">DB_01</span>
          </div>
          <div className="h-16 w-px bg-slate-800 mt-2"></div>
        </div>

        <div className="absolute bottom-20 right-1/4 flex flex-col items-center">
          <div className="h-16 w-px bg-slate-800 mb-2"></div>
          <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded flex items-center justify-center">
            <span className="text-[10px] text-slate-400">SRV_04</span>
          </div>
        </div>

        {/* Visual Decoration for "Technical" Feel */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>
      </div>
    </div>
  );
};

export default NetworkMap;