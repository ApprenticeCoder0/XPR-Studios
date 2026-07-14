import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { UserRole } from "../types";

export function LiveMap({ userRole }: { userRole?: UserRole }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState("all");

  const [players, setPlayers] = useState([
    { id: 1, name: "User123", role: "Civilian", status: "idle", x: 40, y: 30, color: "bg-blue-400", shadow: "shadow-[0_0_10px_#60a5fa]", health: 100, armor: 0, vehicle: "None", ping: 34 },
    { id: 2, name: "Suspect_44", role: "Wanted", status: "moving", x: 60, y: 45, color: "bg-red-400", shadow: "shadow-[0_0_10px_#f87171]", health: 85, armor: 50, vehicle: "Blista Compact", ping: 112 },
    { id: 3, name: "Player77", role: "Civilian", status: "idle", x: 30, y: 60, color: "bg-blue-400", shadow: "shadow-[0_0_10px_#60a5fa]", health: 100, armor: 100, vehicle: "None", ping: 45 },
    { id: 4, name: "Admin_Z", role: "Staff", status: "noclip", x: 70, y: 20, color: "bg-[#D4AF37]", shadow: "shadow-[0_0_10px_#D4AF37]", health: 100, armor: 100, vehicle: "Admin", ping: 12 },
    { id: 5, name: "GamerBoy", role: "Civilian", status: "combat", x: 50, y: 50, color: "bg-orange-400", shadow: "shadow-[0_0_10px_#fb923c]", health: 25, armor: 0, vehicle: "None", ping: 56 },
    { id: 6, name: "Cop_99", role: "PD", status: "patrol", x: 45, y: 35, color: "bg-blue-500", shadow: "shadow-[0_0_10px_#3b82f6]", health: 100, armor: 100, vehicle: "Police Cruiser", ping: 22 },
  ]);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers(current => current.map(p => {
        if (p.status === "idle") return p;
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;
        return {
          ...p,
          x: Math.max(0, Math.min(100, p.x + dx)),
          y: Math.max(0, Math.min(100, p.y + dy))
        };
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const filteredPlayers = players.filter(p => {
    if (filter === "all") return true;
    if (filter === "pd") return p.role === "PD";
    if (filter === "wanted") return p.role === "Wanted";
    if (filter === "staff") return p.role === "Staff";
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full gap-4 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 bg-[#0f0f0f]/80 backdrop-blur pb-2">
        <div>
          <h3 className="text-lg font-serif italic text-white/90">
            Live Server Map
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            Real-time entity tracking and area management.
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#111] border border-[#333] text-white px-3 py-2 text-[10px] uppercase tracking-wider rounded outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Entities</option>
            <option value="pd">Police</option>
            <option value="wanted">Wanted</option>
            <option value="staff">Staff</option>
          </select>
          <div className="flex items-center gap-1 bg-[#111] border border-[#333] rounded px-2">
            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.2))} className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white">-</button>
            <span className="text-[10px] font-mono w-8 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(3, zoom + 0.2))} className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white">+</button>
          </div>
        </div>
      </div>

      <div 
        className="flex-1 bg-[#0a0a0a] border border-[#222] rounded-md relative overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className="absolute inset-0 transition-transform duration-75 ease-linear"
          style={{ 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center"
          }}
        >
          {/* Map Grid / Topography SVG Overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#333 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M10,10 Q30,50 80,20 T90,90 Q40,80 10,60 Z" fill="#1a1a1a" stroke="#444" strokeWidth="0.5" />
             <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="#222" strokeWidth="0.2" />
          </svg>

          {filteredPlayers.map(player => (
            <div
              key={player.id}
              onClick={(e) => { e.stopPropagation(); setSelectedPlayer(player); }}
              className={`absolute w-3 h-3 rounded-full -ml-1.5 -mt-1.5 cursor-pointer ${player.color} ${player.shadow} transition-all duration-1000 ease-linear hover:scale-150 z-20`}
              style={{ left: `${player.x}%`, top: `${player.y}%` }}
            >
              {selectedPlayer?.id === player.id && (
                <div className="absolute -inset-2 border border-white/50 rounded-full animate-ping pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="absolute top-20 right-4 w-64 bg-[#111]/90 backdrop-blur border border-[#333] rounded p-4 shadow-2xl z-50">
          <div className="flex items-center justify-between border-b border-[#222] pb-2 mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedPlayer.color}`}></span>
              {selectedPlayer.name}
            </h4>
            <button onClick={() => setSelectedPlayer(null)} className="text-white/40 hover:text-white">x</button>
          </div>
          <div className="space-y-2 text-[10px] font-mono">
            <div className="flex justify-between">
              <span className="text-white/50">Role:</span>
              <span className="text-white">{selectedPlayer.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Status:</span>
              <span className="text-white">{selectedPlayer.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Health/Armor:</span>
              <span className="text-white">{selectedPlayer.health}% / {selectedPlayer.armor}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Vehicle:</span>
              <span className="text-white">{selectedPlayer.vehicle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Ping:</span>
              <span className="text-green-400">{selectedPlayer.ping}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Coordinates:</span>
              <span className="text-white">{selectedPlayer.x.toFixed(1)}, {selectedPlayer.y.toFixed(1)}</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
             <button className="bg-[#222] hover:bg-[#333] text-white py-1.5 rounded text-[9px] uppercase tracking-wider transition-colors">Teleport To</button>
             <button className="bg-[#222] hover:bg-[#333] text-white py-1.5 rounded text-[9px] uppercase tracking-wider transition-colors">Spectate</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
