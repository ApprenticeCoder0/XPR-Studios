import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gavel, Search, ShieldAlert, ArrowRight, X } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import { useAuth } from "../contexts/AuthContext";

const MOCK_BANS = [
  {
    id: "BAN-9021",
    user: "SniperMaster99",
    reason: "Exploiting/Cheating",
    date: "2026-07-01",
    status: "Active",
    appealable: true,
  },
  {
    id: "BAN-8910",
    user: "ToxicPlayer01",
    reason: "Severe Harassment",
    date: "2026-06-28",
    status: "Permanent",
    appealable: false,
  },
  {
    id: "BAN-8742",
    user: "RDM_King",
    reason: "Mass RDM at Spawn",
    date: "2026-06-15",
    status: "Active",
    appealable: true,
  },
];

export function BansPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedBan, setSelectedBan] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const filteredBans = MOCK_BANS.filter(
    (b) =>
      b.user.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-12 sm:p-24 max-w-6xl mx-auto w-full flex flex-col"
    >
      <div className="flex flex-col mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8 flex items-center gap-4"
        >
          <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
          Public Records
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-serif italic tracking-tighter leading-[0.9] mb-8"
        >
          Ban Database
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm leading-relaxed opacity-50 font-light tracking-wide max-w-xl mb-12"
        >
          Search the official records for disciplinary actions. Transparency is
          one of our core values. If your account is listed here and marked as
          appealable, you may submit an appeal.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-4 bg-[#111] border border-[#222] rounded-full px-6 py-4 max-w-md focus-within:border-[#D4AF37]/50 transition-colors"
        >
          <Search size={18} className="text-[#D4AF37]/50" />
          <input
            type="text"
            placeholder="Search by Username or Ban ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full placeholder-white/20"
          />
        </motion.div>
      </div>

      <div className="grid gap-4">
        {filteredBans.length > 0 ? (
          filteredBans.map((ban, i) => (
            <motion.div
              key={ban.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              onClick={() => setSelectedBan(ban)}
              className="bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#D4AF37]/30 p-6 rounded-lg cursor-pointer group transition-all duration-500 flex flex-col sm:flex-row items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <Gavel size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">
                    {ban.user}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 font-mono text-[9px] uppercase tracking-widest text-white/40">
                    <span>{ban.id}</span>
                    <span className="w-1 h-1 rounded-full bg-[#333]"></span>
                    <span>{ban.date}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-0 flex items-center gap-6 sm:text-right w-full sm:w-auto">
                <div className="flex flex-col sm:items-end">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">
                    {ban.reason}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${ban.status === "Active" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}
                    >
                      {ban.status}
                    </span>
                    {ban.appealable && (
                      <span className="text-[9px] uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                        Appealable
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-white/20 group-hover:text-[#D4AF37] transition-colors hidden sm:block"
                />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 border border-[#1A1A1A] border-dashed rounded-lg">
            <ShieldAlert size={32} className="mx-auto text-white/20 mb-4" />
            <p className="text-sm text-white/40">
              No bans found matching "{search}"
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedBan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#0C0C0C] border border-[#222] p-8 sm:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>

              <button
                onClick={() => setSelectedBan(null)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8">
                Ban Record {selectedBan.id}
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <Gavel size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif italic">
                    {selectedBan.user}
                  </h3>
                  <p className="text-[10px] text-white/40 font-mono mt-1">
                    Banned on {selectedBan.date}
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="bg-black border border-[#222] rounded-md p-4 font-mono text-[10px] sm:text-xs overflow-y-auto relative">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                  <div className="text-red-500 mb-2 border-b border-red-500/20 pb-2 flex justify-between">
                    <span>&gt; EXECUTE: fetch_report --id {selectedBan.id}</span>
                    <span className="opacity-50">v2.1.4</span>
                  </div>
                  <div className="text-white/60 mb-1">&gt; TARGET_USER: {selectedBan.user}</div>
                  <div className="text-white/60 mb-1">&gt; INCIDENT_DATE: {selectedBan.date}</div>
                  <div className="text-white/60 mb-4">&gt; INFRACTION_TYPE: {selectedBan.reason}</div>
                  
                  <div className="text-[#D4AF37] mb-2">&gt; AUTOMATED_SYSTEM_LOGS:</div>
                  <div className="text-white/40 pl-4 mb-1">[14:32:01] User reported by multiple entities.</div>
                  <div className="text-white/40 pl-4 mb-1">[14:35:44] Staff_Alpha initiated review protocol.</div>
                  <div className="text-white/40 pl-4 mb-1">[14:50:12] Evidence verified.</div>
                  <div className="text-red-400 pl-4 mb-4">[14:51:00] ACTION APPLIED: {selectedBan.status.toUpperCase()} BAN</div>
                  
                  <div className="text-green-400 mt-2 flex items-center gap-2">&gt; AWAITING_INPUT<span className="w-2 h-4 bg-green-400 animate-pulse inline-block"></span></div>
                </div>
              </div>

              {selectedBan.appealable ? (
                <div className="border-t border-[#1A1A1A] pt-8">
                  {user ? (
                    <>
<button onClick={() => setIsConfirmOpen(true)} className="w-full text-[10px] uppercase tracking-[0.2em] px-8 py-4 border border-[#D4AF37] text-black bg-[#D4AF37] hover:bg-[#c5a230] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                      Submit Appeal
                    </button>
                    
                    <ConfirmModal 
                      isOpen={isConfirmOpen}
                      onClose={() => setIsConfirmOpen(false)}
                      onConfirm={() => {
                         alert("Appeal Submitted");
                         setSelectedBan(null);
                      }}
                      title="Submit Appeal?"
                      description="You are about to submit an appeal. False appeals may result in further penalties."
                      confirmText="Submit"
                      destructive={false}
                      countdownSeconds={5}
                    />
</>
                  ) : (
                    <div className="text-center bg-[#111] border border-[#222] p-4 rounded text-xs text-white/60">
                      You must be signed in to submit an appeal.
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t border-[#1A1A1A] pt-8">
                  <div className="text-center bg-red-500/5 border border-red-500/10 p-4 rounded text-xs text-red-400/80">
                    This ban is permanent and cannot be appealed.
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
