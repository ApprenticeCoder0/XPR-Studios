import React from "react";
import { motion } from "motion/react";
import { Activity, Users, Server, Clock } from "lucide-react";

export function ServerStatus() {
  const servers = [
    {
      name: "Nova Roleplay #1",
      status: "online",
      players: 45,
      max: 50,
      uptime: "99.9%",
    },
    {
      name: "Nova Roleplay #2",
      status: "online",
      players: 38,
      max: 50,
      uptime: "99.8%",
    },
    {
      name: "Frontier Survive",
      status: "online",
      players: 22,
      max: 30,
      uptime: "100%",
    },
    {
      name: "Realm of Ashveil",
      status: "maintenance",
      players: 0,
      max: 40,
      uptime: "N/A",
    },
  ];

  return (
    <section className="py-24 px-12 sm:px-24 border-t border-[#1A1A1A] relative bg-[#0C0C0C]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8 flex items-center gap-4"
        >
          <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
          Live Network Status
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servers.map((server, i) => (
            <motion.div
              key={server.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#111] border border-[#222] p-6 rounded-lg hover:border-[#D4AF37]/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-white/90">
                  {server.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${server.status === "online" ? "bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" : "bg-yellow-500"}`}
                  ></span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span className="flex items-center gap-2">
                    <Users size={12} /> Players
                  </span>
                  <span>
                    {server.players} / {server.max}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37]"
                    style={{ width: `${(server.players / server.max) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-[#222]">
                  <span className="flex items-center gap-2">
                    <Clock size={12} /> Uptime
                  </span>
                  <span className="text-[#D4AF37] font-mono">
                    {server.uptime}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
