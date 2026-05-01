import React, { useState, useEffect } from 'react';

const AttackGraph = () => {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const fetchGraph = () => {
      fetch('http://127.0.0.1:8000/api/graph/')
        .then(res => res.json())
        .then(data => {
            if (data.image) {
                setImgSrc(data.image);
            }
        })
        .catch(err => console.log(err));
    };

    fetchGraph();
    const interval = setInterval(fetchGraph, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-white font-semibold text-lg">Attack Frequency (Matplotlib)</h2>
          <p className="text-slate-500 text-sm font-medium">Intensity levels over last 12 hours</p>
        </div>
      </div>

      <div className="relative h-64 flex items-center justify-center overflow-hidden rounded">
        {imgSrc ? (
          <img src={imgSrc} alt="Attack Graph" className="h-full w-full object-contain" />
        ) : (
          <p className="text-slate-500 animate-pulse font-mono text-sm">Rendering Real-Time AI Plot...</p>
        )}
      </div>

    </div>
  );
};

export default AttackGraph;