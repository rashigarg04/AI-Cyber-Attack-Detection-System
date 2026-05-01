import React from 'react';

const Settings = () => {
  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">System Settings</h1>
        <p className="text-slate-400 font-medium">Configure AI sensitivity and notification protocols</p>
      </header>

      <div className="space-y-6">
        {/* General Security Section */}
        <section className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <h2 className="text-lg font-semibold text-emerald-500 mb-4">AI Detection Engine</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-800">
              <div>
                <p className="text-white font-medium">Heuristic Analysis</p>
                <p className="text-xs text-slate-500">Detect unknown threats based on behavior patterns</p>
              </div>
              <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-800">
              <div>
                <p className="text-white font-medium">Deep Packet Inspection</p>
                <p className="text-xs text-slate-500">Analyze encrypted traffic for hidden signatures</p>
              </div>
              <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <h2 className="text-lg font-semibold text-emerald-500 mb-4">Incident Reporting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 uppercase mb-2">Alert Email</label>
              <input 
                type="email" 
                placeholder="admin@coffee-inn.ai" 
                className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded p-2 focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-500 uppercase mb-2">Sensitivity Level</label>
              <select className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded p-2 focus:border-emerald-500 outline-none">
                <option>Low (Fewer False Positives)</option>
                <option selected>Standard (Balanced)</option>
                <option>High (Strict Monitoring)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="p-6 bg-slate-900/50 border border-red-900/30 rounded-xl">
          <h2 className="text-lg font-semibold text-red-500 mb-4">System Actions</h2>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded transition">
              Purge All Logs
            </button>
            <button className="px-4 py-2 border border-slate-700 text-slate-400 hover:bg-slate-800 text-sm rounded transition">
              Reset AI Weights
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;