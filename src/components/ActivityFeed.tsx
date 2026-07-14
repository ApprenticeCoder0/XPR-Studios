import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LogEvent {
  id: number;
  time: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}

export function ActivityFeed() {
  const [events, setEvents] = useState<LogEvent[]>([
    { id: 1, time: new Date().toLocaleTimeString(), message: "System initialized", type: "info" }
  ]);

  useEffect(() => {
    const possibleEvents = [
      { msg: "Player 'Unknown' connected", type: "success" },
      { msg: "Admin Command Executed: /giveweapon", type: "warning" },
      { msg: "Server Maintenance Started", type: "info" },
      { msg: "Connection timeout from IP 192.168.1.x", type: "error" },
      { msg: "Vehicle spawned at City Hall", type: "info" },
      { msg: "Player 'User123' disconnected", type: "info" },
    ];

    const timer = setInterval(() => {
      const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
      setEvents(prev => {
        const newEvents = [{
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          message: randomEvent.msg,
          type: randomEvent.type as any
        }, ...prev];
        return newEvents.slice(0, 8); // Keep last 8
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-6 relative overflow-hidden h-full flex flex-col">
      <h3 className="text-lg font-serif italic text-white/90 mb-4">
        Activity Feed
      </h3>
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex flex-col gap-2">
          <AnimatePresence>
            {events.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 text-[10px] font-mono"
              >
                <span className="text-white/40">{ev.time}</span>
                <span className={`px-1.5 py-0.5 rounded ${
                  ev.type === 'success' ? 'bg-green-500/10 text-green-400' :
                  ev.type === 'error' ? 'bg-red-500/10 text-red-400' :
                  ev.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {ev.type.toUpperCase()}
                </span>
                <span className="text-white/80">{ev.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
