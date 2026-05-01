import React, { useEffect, useState } from "react";
import axios from "axios";

const Firewall = () => {
    const [ips, setIps] = useState([]);
    const [manualIp, setManualIp] = useState("");

    const fetchIPs = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/blocked/");
            setIps(res.data);
        } catch (e) {
            console.error("Failed to fetch blocked IPs");
        }
    };

    const unblock = async (ip) => {
        await axios.post("http://127.0.0.1:8000/api/unblock/", { ip });
        fetchIPs();
    };

    const blockManual = async (e) => {
        e.preventDefault();
        if (!manualIp) return;
        await axios.post("http://127.0.0.1:8000/api/block_manual/", { ip: manualIp });
        setManualIp("");
        fetchIPs();
    };

    useEffect(() => {
        fetchIPs();
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <span className="bg-red-500/20 text-red-500 p-2 rounded-lg mr-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </span>
                        Firewall Control Center
                    </h1>
                    <p className="text-slate-400 font-medium mt-2">Manage blocked IPs and configure network security rules</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Global Status</p>
                    <p className="text-emerald-500 font-bold flex items-center justify-end">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></span> ENFORCING
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Col - Stats & Manual Entry */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Firewall Metrics</h2>
                        <div className="flex items-end space-x-4">
                            <div className="text-5xl font-black text-red-500">{ips.length}</div>
                            <div className="text-slate-500 font-medium mb-1">Active Blocks</div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Manual IP Ban</h2>
                        <form onSubmit={blockManual} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-slate-500 mb-2">TARGET IPv4 ADDRESS</label>
                                <input 
                                    type="text" 
                                    value={manualIp}
                                    onChange={(e) => setManualIp(e.target.value)}
                                    placeholder="e.g. 192.168.1.50" 
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded p-3 focus:border-red-500 outline-none font-mono text-sm"
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-lg shadow-red-900/20 transition flex items-center justify-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                ENFORCE BAN
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Col - Blocklist Table */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-hidden flex flex-col min-h-[400px]">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Active Blocklist</h2>
                    
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800 text-xs font-mono text-slate-500 uppercase tracking-wider">
                                    <th className="p-3 font-medium">IP Address</th>
                                    <th className="p-3 font-medium">Reason</th>
                                    <th className="p-3 font-medium">Timestamp</th>
                                    <th className="p-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {ips.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-500 font-mono text-sm">
                                            No active firewall rules.
                                        </td>
                                    </tr>
                                ) : ips.map((ip, i) => (
                                    <tr key={i} className="hover:bg-slate-800/30 transition group">
                                        <td className="p-3 font-mono text-sm text-white flex items-center">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2"></span>
                                            {ip.ip}
                                        </td>
                                        <td className="p-3 text-sm">
                                            <span className="px-2 py-1 bg-red-900/30 text-red-400 border border-red-800/50 rounded text-xs font-medium whitespace-nowrap">
                                                {ip.reason}
                                            </span>
                                        </td>
                                        <td className="p-3 text-slate-400 font-mono text-xs whitespace-nowrap">{ip.time}</td>
                                        <td className="p-3 text-right">
                                            <button
                                                onClick={() => unblock(ip.ip)}
                                                className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 rounded transition opacity-0 group-hover:opacity-100"
                                            >
                                                PARDON
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Firewall;