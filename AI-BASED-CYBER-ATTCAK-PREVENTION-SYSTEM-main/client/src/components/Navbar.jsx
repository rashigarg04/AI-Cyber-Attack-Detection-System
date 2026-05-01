import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const username = localStorage.getItem("username") || "Admin";
  const initial = username.charAt(0).toUpperCase();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock Notifications for presentation
  const notifications = [
    { id: 1, type: "CRITICAL", event: "Neptune Protocol Attack", ip: "192.168.1.105", time: "Just now" },
    { id: 2, type: "HIGH", event: "DDoS Attempt", ip: "10.0.0.42", time: "5 mins ago" },
    { id: 3, type: "CRITICAL", event: "Port Scan Detected", ip: "172.16.0.8", time: "12 mins ago" }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 relative z-50">
      {/* Search Bar Area */}
      <div className="relative w-96">
        <input 
          type="text" 
          placeholder="Search network logs or IP addresses..." 
          className="w-full bg-slate-950 border border-slate-700 text-slate-300 text-sm rounded-md py-2 px-4 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      {/* Action Icons & Profile */}
      <div className="flex items-center space-x-6">
        {/* Connection Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            AI Engine: Online
          </span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 transition rounded-full ${isNotifOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full animate-pulse"></span>
          </button>

          {/* Dropdown Menu */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex justify-between items-center">
                <h3 className="text-white font-semibold text-sm">Security Alerts</h3>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="divide-y divide-slate-700 max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 hover:bg-slate-700/50 transition cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        notif.type === 'CRITICAL' ? 'bg-red-900/50 text-red-200 border-red-800' : 'bg-orange-900/50 text-orange-200 border-orange-800'
                      }`}>
                        {notif.type}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-200 font-medium group-hover:text-white">{notif.event}</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">IP: {notif.ip}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-700 text-center bg-slate-900/50 hover:bg-slate-800 transition cursor-pointer">
                <Link to="/logs" className="text-emerald-500 text-xs font-semibold hover:text-emerald-400 transition block w-full h-full">View All Threat Logs</Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l border-slate-700 pl-6">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{username}</p>
            <p className="text-xs text-slate-500">Security Lead</p>
          </div>
          <div className="h-10 w-10 bg-slate-800 border border-slate-700 rounded-md flex items-center justify-center text-emerald-500 font-bold uppercase">
            {initial}
          </div>
          <button 
            onClick={() => {
              const token = localStorage.getItem("token");
              fetch("http://127.0.0.1:8000/api/logout/", {
                method: "POST",
                headers: {
                  "Authorization": `Token ${token}`
                }
              }).finally(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.href = "/login";
              });
            }}
            className="ml-4 px-4 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs rounded transition font-medium border border-red-500/20 hover:border-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;