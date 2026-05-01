import React from 'react';

const ThreatCard = ({ title, value, status }) => {
  const statusColor = status === 'danger' ? 'bg-red-500' : 'bg-emerald-500';
  
  return (
    <div className="p-6 bg-slate-800 border border-slate-700 rounded-lg">
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-white">{value}</span>
        <div className={`h-2 w-2 rounded-full ${statusColor} mb-2`}></div>
      </div>
    </div>
  );
};

export default ThreatCard;