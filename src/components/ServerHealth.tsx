import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Activity, Cpu, Wifi } from "lucide-react";

export function ServerHealth() {
  const [metrics, setMetrics] = useState({
    tps: 20,
    cpu: 45,
    latency: 32,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics({
        tps: Math.max(15, Math.min(20, 20 + (Math.random() * 2 - 1))),
        cpu: Math.max(10, Math.min(95, metrics.cpu + (Math.random() * 10 - 5))),
        latency: Math.max(15, Math.min(150, metrics.latency + (Math.random() * 20 - 10))),
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [metrics]);

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6 relative overflow-hidden h-full">
      <h3 className="text-lg font-serif italic text-white/90 mb-6 flex items-center gap-2">
        <Activity size={18} className="text-[#D4AF37]" /> Server Health
      </h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">
            <span>Server TPS</span>
            <span className={metrics.tps >= 19 ? "text-green-400" : "text-yellow-400"}>{metrics.tps.toFixed(1)} / 20.0</span>
          </div>
          <div className="h-2 bg-[#222] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${metrics.tps >= 19 ? "bg-green-500" : "bg-yellow-500"}`} 
              style={{ width: `${(metrics.tps / 20) * 100}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">
            <span className="flex items-center gap-1"><Cpu size={12}/> CPU Usage</span>
            <span className={metrics.cpu < 70 ? "text-green-400" : metrics.cpu < 90 ? "text-yellow-400" : "text-red-400"}>{metrics.cpu.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-[#222] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${metrics.cpu < 70 ? "bg-green-500" : metrics.cpu < 90 ? "bg-yellow-500" : "bg-red-500"}`} 
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/50 mb-2 font-mono">
            <span className="flex items-center gap-1"><Wifi size={12}/> Network Latency</span>
            <span className={metrics.latency < 50 ? "text-green-400" : metrics.latency < 100 ? "text-yellow-400" : "text-red-400"}>{metrics.latency.toFixed(0)} ms</span>
          </div>
          <div className="h-2 bg-[#222] rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${metrics.latency < 50 ? "bg-green-500" : metrics.latency < 100 ? "bg-yellow-500" : "bg-red-500"}`} 
              style={{ width: `${Math.min(100, (metrics.latency / 150) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
