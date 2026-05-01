import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create custom glowing icons
const createIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: ${color};
      width: 12px;
      height: 12px;
      border-radius: 50%;
      box-shadow: 0 0 15px 5px ${color};
      animation: pulse 1.5s infinite;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const icons = {
  Critical: createIcon('#ef4444'), // Red
  High: createIcon('#f97316'), // Orange
  Low: createIcon('#3b82f6'), // Blue
  Default: createIcon('#ef4444'),
};

// Center coordinate (simulate your "Server" location, e.g., India or US)
const SERVER_COORD = [20.5937, 78.9629]; 

const ThreatMap = ({ threats = [] }) => {
    return (
        <div style={{ position: 'relative' }}>
          <style>
            {`
              @keyframes pulse {
                0% { transform: scale(0.95); opacity: 1; }
                70% { transform: scale(1.5); opacity: 0.3; }
                100% { transform: scale(0.95); opacity: 1; }
              }
              .leaflet-container {
                background: #0f172a !important;
              }
              .leaflet-popup-content-wrapper {
                background-color: #1e293b;
                color: white;
                border: 1px solid #334155;
              }
              .leaflet-popup-tip {
                background-color: #1e293b;
              }
              .attack-line {
                animation: dash 20s linear infinite;
              }
              @keyframes dash {
                to {
                  stroke-dashoffset: -1000;
                }
              }
            `}
          </style>
          <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: "450px", width: "100%", borderRadius: "0.75rem" }}
          >
              {/* Dark Theme Map Tiles (CartoDB Dark Matter) */}
              <TileLayer 
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                attribution='&copy; OpenStreetMap contributors'
              />

              {/* Server Marker */}
              <Marker position={SERVER_COORD} icon={createIcon('#10b981')}>
                  <Popup>
                      <div className="font-bold text-emerald-400">🛡️ CORE.AI NODE</div>
                      <div className="text-xs text-slate-400">Gateway Active</div>
                  </Popup>
              </Marker>

              {threats.map((t, i) => {
                  const severity = t.severity || 'Critical';
                  const icon = icons[severity] || icons.Default;
                  const color = severity === 'Critical' ? '#ef4444' : severity === 'High' ? '#f97316' : '#3b82f6';
                  
                  return (
                      <React.Fragment key={i}>
                          <Marker position={[t.lat, t.lon]} icon={icon}>
                              <Popup>
                                  <div className="font-bold text-red-400">🚨 {severity} Attack</div>
                                  <div className="text-xs text-slate-400 font-mono">IP: {t.ip}</div>
                              </Popup>
                          </Marker>
                          {/* Animated Line from attacker to server */}
                          <Polyline 
                              positions={[[t.lat, t.lon], SERVER_COORD]} 
                              color={color} 
                              weight={2} 
                              opacity={0.5}
                              dashArray="5, 10"
                              className="attack-line"
                          />
                      </React.Fragment>
                  );
              })}
          </MapContainer>
        </div>
    );
};

export default ThreatMap;