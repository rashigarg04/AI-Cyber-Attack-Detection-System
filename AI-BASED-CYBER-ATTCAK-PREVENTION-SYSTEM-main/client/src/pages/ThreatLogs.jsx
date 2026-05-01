import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const ThreatMap = ({ threats }) => {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {threats.map((t, i) => (
        <Marker key={i} position={[t.lat, t.lon]}>
          <Popup>
            🚨 Attack Detected <br />
            IP: {t.ip}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const ThreatLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveActive, setIsLiveActive] = useState(false);

  // 1. Fetch Real Logs from Django Database
  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/logs/');
      setLogs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let ws;
    if (isLiveActive) {
      ws = new WebSocket("ws://127.0.0.1:8000/ws/threat/");
      ws.onmessage = (event) => {
        const newLog = JSON.parse(event.data);
        if (newLog.error) return;
        setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 15));
      };
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [isLiveActive]);

  const toggleLive = () => {
    setIsLiveActive(!isLiveActive);
  };

  // 2. Sample Data for Testing (NSL-KDD formatted 41 features)
  const simulateAttack = async () => {
    // Example: A simulated 'Neptune' attack packet features
    const samplePacket = [
      0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 229, 10,
      1.0, 1.0, 0.0, 0.0, 0.04, 0.06, 0.0, 255, 10, 0.04, 0.06, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0
    ];

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/detect/', {
        features: samplePacket
      });

      if (response.data.status === "ATTACK") {
        if (response.data.confidence > 0.9) {
          alert("🚨 Critical Attack Detected!");
        } else {
          alert(`⚠️ AI ALERT: ${response.data.status} detected with ${Math.round(response.data.confidence * 100)}% confidence!`);
        }
        fetchLogs(); // Refresh the table to show the new log
      } else {
        alert("✅ Traffic Analysis: Normal");
      }
    } catch (error) {
      alert("Backend Connection Error. Is Django running?");
    }
  };

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Threat Intelligence Logs</h1>
          <p className="text-slate-400 font-medium">Real-time AI-monitored network anomalies</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={toggleLive}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition shadow-lg flex items-center space-x-2 ${isLiveActive
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
              }`}
          >
            <span className="relative flex h-2 w-2">
              {isLiveActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveActive ? 'bg-white' : 'bg-emerald-200'}`}></span>
            </span>
            <span>{isLiveActive ? 'Stop Live Scan' : 'Start Live Scan'}</span>
          </button>
          <button
            onClick={simulateAttack}
            className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition shadow-lg"
          >
            Inject Threat
          </button>
        </div>
      </header>

      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded text-sm hover:bg-slate-700 transition">
            Export JSON
          </button>
        </div>
        <div className={`font-mono text-sm self-center flex items-center ${isLiveActive ? 'text-emerald-500' : 'text-slate-500'}`}>
          <span className="relative flex h-2 w-2 mr-2">
            {isLiveActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveActive ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
          </span>
          {isLiveActive ? 'AI Live Feed Active' : 'Live Feed Paused'}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 border-b border-slate-800">
              <th className="p-4 text-slate-300 font-semibold text-sm">Timestamp</th>
              <th className="p-4 text-slate-300 font-semibold text-sm">Event Type</th>
              <th className="p-4 text-slate-300 font-semibold text-sm">Severity</th>
              <th className="p-4 text-slate-300 font-semibold text-sm">Confidence</th>
              <th className="p-4 text-slate-300 font-semibold text-sm">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="p-10 text-center text-slate-500 animate-pulse">Initializing Security Handshake...</td>
              </tr>
            ) : logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition group">
                <td className="p-4 text-slate-400 font-mono text-xs">{log.time}</td>
                <td className="p-4 text-white font-medium group-hover:text-emerald-400 transition">{log.event}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${log.severity === 'Critical' ? 'bg-red-900/50 text-red-200 border border-red-800' :
                    log.severity === 'High' ? 'bg-orange-900/50 text-orange-200 border border-orange-800' :
                      'bg-blue-900/50 text-blue-200 border border-blue-800'
                    }`}>
                    {log.severity}
                  </span>
                </td>
                <td className="p-4 text-slate-400 font-mono text-xs">{(log.confidence * 100).toFixed(2)}%</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`h-1.5 w-1.5 rounded-full ${log.status === 'Blocked' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-500'}`}></div>
                    <span className="text-slate-400 text-sm">{log.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-slate-900 border-t border-slate-800 text-center text-slate-500 text-xs italic">
          AI Analysis Engine: Random Forest v2.4 | NSL-KDD Pattern Matching
        </div>
      </div>
    </div>
  );
};

export default ThreatLogs;