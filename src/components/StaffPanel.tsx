import { useServer } from "../contexts/ServerContext";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Shield,
  BarChart3,
  Clock,
  ArrowRight,
  Settings,
  Users,
  FileText,
  Database,
  Activity,
  Terminal,
  ShieldAlert,
  Cpu,
  Map,
  Server,
  Play,
  Square,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AnimatedStat } from "./AnimatedStat";
import { LiveMap } from "./LiveMap";
import { RoleBadge } from "./RoleBadge";
import { ConfirmModal } from "./ConfirmModal";
import { AdvancedFeatures } from "./AdvancedFeatures";
import { useAuth } from "../contexts/AuthContext";
import { UserRole, TicketGrade, TicketSituation, TicketTime } from "../types";

export function StaffPanel() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("tickets");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  if (!user || user.role < UserRole.STAFF_INITIATE) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Shield size={48} className="text-red-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-serif italic text-white/80 mb-2">
          Access Denied
        </h2>
        <p className="text-sm text-white/50">
          You do not have the required permissions to view this area.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 sm:p-12 max-w-7xl mx-auto flex flex-col w-full"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-[#222] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Cpu className="text-[#D4AF37]" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-serif italic tracking-wide text-white/90">
              Central Command
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-mono">
                System Online • Level {user.role} Clearance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#111] border border-[#222] px-4 py-2 rounded-md">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-8 h-8 rounded-full border border-[#333]"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white/80">{user.name}</span>
            <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider">
              {UserRole[user.role]}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-mono border-l-2 border-white/20 pl-2">
              Staff Operations
            </h3>
            <TabButton
              active={activeTab === "tickets"}
              onClick={() => {
                setActiveTab("tickets");
                setSelectedTicket(null);
              }}
              icon={FileText}
              label="Ticket Center"
            />
            <TabButton
              active={activeTab === "action_log"}
              onClick={() => setActiveTab("action_log")}
              icon={Clock}
              label="Ticket Action Log"
            />
            {user.role >= UserRole.STAFF_INITIATE && (
              <TabButton
                active={activeTab === "live_map"}
                onClick={() => setActiveTab("live_map")}
                icon={Map}
                label="Live Map"
              />
            )}
            {user.role >= UserRole.STAFF_SENIOR && (
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                icon={BarChart3}
                label="Staff Overview"
              />
            )}
            {user.role >= UserRole.STAFF_SENIOR && (
              <TabButton
                active={activeTab === "advanced"}
                onClick={() => setActiveTab("advanced")}
                icon={Settings}
                label="Advanced Modules"
              />
            )}
          </div>

          
          
          <div className="mt-auto pt-8">
            <div className="bg-[#111] border border-[#222] p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#222] flex items-center justify-center text-xs font-medium text-white/80">
                  {user.name.charAt(0)}
                </div>
                <div>
                   <p className="text-xs text-white/90 font-medium">{user.name}</p>
                   <RoleBadge role={user.role} />
                </div>
              </div>
              <button onClick={logout} className="text-[9px] uppercase tracking-wider text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded transition-colors border border-red-500/20" title="Logout">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#0a0a0a] border border-[#1a1a1a] p-1 rounded-lg min-h-[600px] shadow-2xl relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-20"></div>

          <div className="bg-[#0f0f0f] w-full h-full rounded-md p-6 relative z-10 border border-[#222]">
            <AnimatePresence mode="wait">
              {(() => {
                switch (activeTab) {
                  case "tickets":
                    return (
                      <TicketCenter
                        key="tickets"
                        selectedTicket={selectedTicket}
                        setSelectedTicket={setSelectedTicket}
                      />
                    );
                  case "action_log":
                    return <TicketActionLog key="action_log" />;
                  case "overview":
                    return <StaffOverview key="overview" />;
                  case "content":
                    return <ContentManager key="content" />;
                  case "staff_management":
                    return <StaffManagement key="staff_management" />;
                  case "system":
                    return <SystemHealthLog key="system" />;
                  case "live_map":
                    return <LiveMap userRole={user.role as any} />;
                  case "advanced":
                    return <AdvancedFeatures userRole={user.role}  />;
                  default:
                    return null;
                }
              })()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 text-left px-4 py-3 transition-all text-xs font-medium rounded-md relative overflow-hidden ${
        active
          ? "text-[#D4AF37] bg-[#1a1a1a]"
          : "hover:bg-[#1a1a1a] text-white/60 hover:text-white/90"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeTabIndicatorStaff"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
        />
      )}
      <Icon
        size={16}
        className={`relative z-10 ${active ? "text-[#D4AF37]" : "text-white/40"}`}
      />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

function TicketCenter({
  selectedTicket,
  setSelectedTicket,
}: {
  selectedTicket: number | null;
  setSelectedTicket: (id: number | null) => void;
  key?: React.Key;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("All Categories");
  if (selectedTicket) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <button
          onClick={() => setSelectedTicket(null)}
          className="text-[10px] uppercase tracking-wider text-white/50 hover:text-[#D4AF37] transition-colors flex items-center gap-2 mb-6"
        >
          <ArrowRight size={12} className="rotate-180" /> Back to Queue
        </button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-xl font-serif italic text-white/90">
              Player RDM at spawn area
            </h3>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[9px] uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded border border-[#D4AF37]/20">
                Report User
              </span>
              <span className="text-[9px] uppercase tracking-wider text-red-400 border border-red-500/30 px-2 py-1 rounded bg-red-500/5">
                {TicketGrade.URGENT}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-blue-400 border border-blue-500/30 px-2 py-1 rounded bg-blue-500/5">
                {TicketSituation.PENDING}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-purple-400 border border-purple-500/30 px-2 py-1 rounded bg-purple-500/5">
                {TicketTime.NORMAL_TIME}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 font-mono uppercase">
              Ticket #{selectedTicket}092
            </p>
            <p className="text-[10px] text-white/40 mt-1">
              By User123 • 2 hours ago
            </p>
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-md p-4 mb-6">
          <p className="text-sm text-white/80 leading-relaxed font-light">
            I was just spawning into the server and this player named
            "Xxx_Sniper_xxX" immediately shot me before I could even move. I
            have a clip of this happening. This breaks the spawn killing rules.
          </p>
        </div>

        <div className="border-t border-[#222] pt-6 mt-auto">
          <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 font-mono">
            Response Protocol
          </h4>
          <textarea
            rows={4}
            placeholder="Type your official response here..."
            className="w-full bg-[#111] border border-[#333] focus:border-[#D4AF37] outline-none rounded p-3 text-sm resize-none transition-colors"
          ></textarea>
          <div className="flex items-center justify-between mt-4">
            <select className="bg-[#111] border border-[#333] text-[10px] uppercase tracking-wider p-2 rounded outline-none focus:border-[#D4AF37] text-white/70">
              <option>Update Status to: Communication Phase</option>
              <option>Update Status to: Staff Discussion</option>
              <option>Update Status to: Resolved</option>
            </select>
            <button className="text-[10px] uppercase tracking-[0.2em] px-6 py-2.5 bg-[#D4AF37] text-black font-bold hover:bg-[#c5a230] transition-colors rounded">
              Submit Response
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-[#222]">
            <h4 className="text-[10px] uppercase tracking-widest text-white/50 mb-3 font-mono flex items-center gap-2">
              <Clock size={12} /> Ticket Logs
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/40 bg-[#111] p-2 rounded border border-[#222]">
                <span>[14:32:01] Status updated to: STAFF DISCUSSION</span>
                <span>Staff_Alpha</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-white/40 bg-[#111] p-2 rounded border border-[#222]">
                <span>[14:15:22] Ticket Claimed</span>
                <span>Staff_Alpha</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif italic text-white/90">
          Active Support Queue
        </h3>
        <div className="flex gap-2">
          <motion.span 
            animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(239, 68, 68, 0)", "0 0 10px rgba(239, 68, 68, 0.5)", "0 0 0px rgba(239, 68, 68, 0)"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[10px] uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
            12 High Priority
          </motion.span>
          <span className="text-[10px] uppercase tracking-wider bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-3 py-1.5 rounded-full">
            45 Total Tickets
          </span>
        </div>
      </div>
      <div className="flex-1 border border-[#222] bg-[#111] rounded-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#222] flex gap-4 bg-[#1a1a1a]">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active tickets, reports or users..."
              className="w-full bg-black border border-[#333] rounded-full pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          <select 
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-black border border-[#333] rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#D4AF37] transition-colors appearance-none cursor-pointer hover:bg-[#1a1a1a]">
            <option>All Categories</option>
            <option>Report Player</option>
            <option>Bug Report</option>
            <option>Donation Issue</option>
          </select>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].filter(i => {
            if (filterCat !== "All Categories" && filterCat !== "Report Player") return false;
            if (searchQuery) return `TKT-${1042 + i}`.toLowerCase().includes(searchQuery.toLowerCase()) || "Player RDM at spawn area".toLowerCase().includes(searchQuery.toLowerCase());
            return true;
          }).map((i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01, boxShadow: "0 0 15px rgba(212, 175, 55, 0.2)", borderColor: "rgba(212, 175, 55, 0.4)" }}
              onClick={() => setSelectedTicket(i)}
              className="p-4 border-b border-[#222] hover:bg-[#1a1a1a] cursor-pointer transition-all duration-300 flex items-center justify-between group origin-center relative z-10 hover:z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                <div>
                  <h4 className="text-sm font-medium text-white/80 group-hover:text-[#D4AF37] transition-colors">
                    Player RDM at spawn area
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-white/40 uppercase">
                    <span>#TKT-{1042 + i}</span>
                    <span>•</span>
                    <span>Report Player</span>
                    <span>•</span>
                    <span>12m ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded text-white/50">
                  Awaiting Staff
                </span>
                <ArrowRight
                  size={14}
                  className="text-white/20 group-hover:text-[#D4AF37] transition-colors"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PlayerDatabase() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif italic text-white/90">
          Player Database
        </h3>
        <div className="flex gap-2 relative w-64">
          <input
            type="text"
            placeholder="Search by Username or ID..."
            className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-xs outline-none focus:border-[#D4AF37] text-white pl-8"
          />
          <Search
            size={14}
            className="absolute left-2.5 top-2.5 text-white/40"
          />
        </div>
      </div>

      <div className="flex-1 border border-[#222] bg-[#111] rounded-md overflow-hidden flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] border-b border-[#333]">
              <th className="p-4 text-[10px] uppercase tracking-wider text-white/50 font-medium">
                Player
              </th>
              <th className="p-4 text-[10px] uppercase tracking-wider text-white/50 font-medium">
                Status
              </th>
              <th className="p-4 text-[10px] uppercase tracking-wider text-white/50 font-medium">
                Playtime
              </th>
              <th className="p-4 text-[10px] uppercase tracking-wider text-white/50 font-medium">
                Warnings
              </th>
              <th className="p-4 text-[10px] uppercase tracking-wider text-white/50 font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: 1042,
                name: "Xx_Sniper_xX",
                status: "Online",
                time: "420 hrs",
                warns: 2,
              },
              {
                id: 8912,
                name: "Civilian_Bob",
                status: "Offline",
                time: "12 hrs",
                warns: 0,
              },
              {
                id: 991,
                name: "Officer_Friendly",
                status: "Online",
                time: "890 hrs",
                warns: 0,
              },
              {
                id: 4432,
                name: "Griefer2023",
                status: "Banned",
                time: "4 hrs",
                warns: 5,
              },
            ].map((p, i) => (
              <tr
                key={i}
                className="border-b border-[#222] hover:bg-[#151515] transition-colors"
              >
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-[9px] text-white/40 font-mono">
                      ID: #{p.id}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded ${p.status === "Online" ? "bg-green-500/10 text-green-400 border border-green-500/30" : p.status === "Banned" ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-white/5 text-white/40 border border-white/10"}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-xs text-white/70">{p.time}</td>
                <td className="p-4">
                  <span
                    className={`text-xs ${p.warns > 0 ? "text-red-400" : "text-white/40"}`}
                  >
                    {p.warns}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-[10px] text-[#D4AF37] hover:underline mr-3">
                    View Profile
                  </button>
                  <button className="text-[10px] text-white/40 hover:text-white transition-colors">
                    Logs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function StaffOverview() {
  const { addToast } = useToast();
  const { serverState, setServerState } = useServer();
  const data = [
    { name: "Mon", tickets: 24 },
    { name: "Tue", tickets: 18 },
    { name: "Wed", tickets: 35 },
    { name: "Thu", tickets: 28 },
    { name: "Fri", tickets: 42 },
    { name: "Sat", tickets: 65 },
    { name: "Sun", tickets: 55 },
  ];

  const updateServerState = (key: keyof typeof serverState) => {
    setServerState(prev => { const val = !prev[key]; addToast(`${String(key)} is now ${val ? "ON" : "OFF"}`, "info"); return { ...prev, [key]: val }; });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif italic text-white/90">
          Staff Performance Overview
        </h3>
        <div className="flex gap-2">
          <span className="text-[10px] uppercase tracking-wider bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded border border-[#D4AF37]/30">
            Last 7 Days
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111] border border-[#222] p-4 rounded-md">
          <div className="flex justify-between items-center mb-3">
             <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono">Server Lock</p>
             <button 
                onClick={() => updateServerState('serverLocked')}
                className={`w-10 h-5 rounded-full transition-colors relative ${serverState.serverLocked ? 'bg-red-500' : 'bg-[#333]'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all ${serverState.serverLocked ? 'left-6' : 'left-1'}`}></div>
              </button>
          </div>
          <p className="text-[10px] text-white/40">Prevents players from joining.</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-4 rounded-md">
          <div className="flex justify-between items-center mb-3">
             <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono">Whitelist</p>
             <button 
                onClick={() => updateServerState('whitelistEnforced')}
                className={`w-10 h-5 rounded-full transition-colors relative ${serverState.whitelistEnforced ? 'bg-[#D4AF37]' : 'bg-[#333]'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all ${serverState.whitelistEnforced ? 'left-6' : 'left-1'}`}></div>
              </button>
          </div>
          <p className="text-[10px] text-white/40">Only allow whitelisted users.</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-4 rounded-md">
          <div className="flex justify-between items-center mb-3">
             <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono">Global Mute</p>
             <button 
                onClick={() => updateServerState('globalChatMute')}
                className={`w-10 h-5 rounded-full transition-colors relative ${serverState.globalChatMute ? 'bg-orange-500' : 'bg-[#333]'}`}
              >
                <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all ${serverState.globalChatMute ? 'left-6' : 'left-1'}`}></div>
              </button>
          </div>
          <p className="text-[10px] text-white/40">Mute all global text chats.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111] border border-[#222] p-4 rounded-md">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono mb-1">
            Total Handled
          </p>
          <p className="text-2xl font-serif italic text-[#D4AF37]"><AnimatedStat text="267" /></p>
        </div>
        <div className="bg-[#111] border border-[#222] p-4 rounded-md">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono mb-1">
            Avg Response
          </p>
          <p className="text-2xl font-serif italic text-white/90"><AnimatedStat text="14" /><span className="text-sm">m</span></p>
        </div>
        <div className="bg-[#111] border border-[#222] p-4 rounded-md">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono mb-1">
            Active Bans
          </p>
          <p className="text-2xl font-serif italic text-red-400"><AnimatedStat text="12" /></p>
        </div>
      </div>
      <div className="flex-1 bg-[#111] border border-[#222] rounded-md p-4">
        <h4 className="text-[10px] uppercase tracking-widest text-white/50 mb-4 font-mono">
          Ticket Traffic
        </h4>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#333"
                fontSize={10}
                tickLine={false}
              />
              <YAxis stroke="#333" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  borderColor: "#333",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#D4AF37" }}
              />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="#D4AF37"
                strokeWidth={2}
                dot={{ fill: "#D4AF37", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

function SystemHealthLog() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif italic text-white/90">
          System Health & Logs
        </h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 text-[10px] uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded hover:bg-red-500/20 transition-colors">
            <Square size={12} /> Force Reconnect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#111] border border-red-500/30 rounded-md p-4 flex flex-col justify-between">
          <h4 className="text-[10px] uppercase tracking-widest text-red-400 font-mono mb-2">
            Database Status (Firebase)
          </h4>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs text-white/70">
              Disconnected - Using Mock Data
            </span>
          </div>
        </div>
        <div className="bg-[#111] border border-green-500/30 rounded-md p-4 flex flex-col justify-between">
          <h4 className="text-[10px] uppercase tracking-widest text-green-400 font-mono mb-2">
            Game Server API
          </h4>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-white/70">
              Online (Latency: 45ms)
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-black border border-[#222] rounded-md p-4 font-mono text-[10px] sm:text-xs overflow-y-auto relative custom-scrollbar mt-2">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
        <div className="text-[#D4AF37] mb-4">
          XPR_OS v3.0.0 (Attack on Titan Branch) initialized...
        </div>
        <div className="text-red-500 mb-1 bg-red-500/10 p-1 border-l-2 border-red-500">
          [WARN] FIREBASE CONNECTION FAILED - Firestore is not initialized.
        </div>
        <div className="text-yellow-400 mb-1">
          [WARN] Authentication module is using local mock states.
        </div>
        <div className="text-green-400 mb-1">
          [08:42:01] [SERVER] AoT_Main_Instance_1 spawned successfully.
        </div>
        <div className="text-blue-400 mb-1">
          [08:45:12] [AUTH] Dev_Alpha authenticated via SSO.
        </div>
        <div className="text-white/70 mb-1">
          [08:55:01] [CRON] Routing titan pathing algorithms... completed.
        </div>
        <div className="text-green-400 mt-8 animate-pulse">_</div>
      </div>
    </motion.div>
  );
}

function ContentManager() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full items-center justify-center text-center p-8"
    >
      <FileText size={48} className="text-white/20 mb-4" />
      <h3 className="text-2xl font-serif italic text-white/90 mb-2">
        Content Management
      </h3>
      <p className="text-sm text-white/50 max-w-md">
        Edit wiki articles, update community rules, and publish blog posts
        directly from this interface. (Module loading...)
      </p>
    </motion.div>
  );
}

function RoleManagement() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full items-center justify-center text-center p-8"
    >
      <ShieldAlert size={48} className="text-[#D4AF37]/50 mb-4" />
      <h3 className="text-2xl font-serif italic text-white/90 mb-2">
        Role Management
      </h3>
      <p className="text-sm text-white/50 max-w-md">
        Manage staff permissions, promote community members, and audit role
        changes. (Module loading...)
      </p>
    </motion.div>
  );
}

function TicketActionLog() {
  const [filterType, setFilterType] = React.useState("all");
  const [filterDate, setFilterDate] = React.useState("today");

  const logs = [
    {
      id: 1,
      time: "14:32:01",
      action: "Ticket Closed",
      user: "Staff_Alpha",
      ticket: "#TKT-1042",
      type: "close",
    },
    {
      id: 2,
      time: "14:15:22",
      action: "User Assigned",
      user: "Staff_Beta",
      ticket: "#TKT-1043",
      type: "assign",
    },
    {
      id: 3,
      time: "13:50:04",
      action: "Status Updated: STAFF DISCUSSION",
      user: "Dev_Alpha",
      ticket: "#TKT-1044",
      type: "status",
    },
    {
      id: 4,
      time: "12:22:11",
      action: "Ticket Claimed",
      user: "Staff_Gamma",
      ticket: "#TKT-1045",
      type: "claim",
    },
    {
      id: 5,
      time: "11:05:45",
      action: "Ticket Closed",
      user: "Staff_Alpha",
      ticket: "#TKT-1040",
      type: "close",
    },
    {
      id: 6,
      time: "10:30:12",
      action: "User Assigned",
      user: "Staff_Beta",
      ticket: "#TKT-1041",
      type: "assign",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-full"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-serif italic text-white/90">
          Ticket Action Log
        </h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search User or Ticket..."
            className="bg-[#111] border border-[#333] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#111] border border-[#333] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
          >
            <option value="all">All Actions</option>
            <option value="close">Ticket Closed</option>
            <option value="assign">User Assigned</option>
            <option value="status">Status Updated</option>
            <option value="claim">Ticket Claimed</option>
          </select>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-[#111] border border-[#333] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#D4AF37]"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>
      <div className="flex-1 border border-[#222] bg-[#111] rounded-md overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 border-b border-[#222] hover:bg-[#1a1a1a] transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded ${log.type === "close" ? "bg-red-500/10 text-red-400" : log.type === "assign" ? "bg-blue-500/10 text-blue-400" : log.type === "status" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"}`}
                >
                  <Activity size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white/80">
                    {log.action}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-white/40 uppercase">
                    <span>{log.ticket}</span>
                    <span>•</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-1 rounded text-white/50">
                  {log.user}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StaffManagement() {
  const staffMembers = [
    {
      id: 1,
      name: "Staff_Alpha",
      role: "Executive Staff",
      rank: 5,
      lastActive: "2 mins ago",
    },
    {
      id: 2,
      name: "Staff_Beta",
      role: "Senior Staff",
      rank: 4,
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "Dev_Alpha",
      role: "Head of Staff",
      rank: 6,
      lastActive: "Just now",
    },
    {
      id: 4,
      name: "Staff_Gamma",
      role: "Initiate Staff",
      rank: 3,
      lastActive: "12 hours ago",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-serif italic text-white/90">
            Staff Management
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            Promote, assign roles, and revoke permissions.
          </p>
        </div>
        <button className="text-[10px] uppercase tracking-wider bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] px-4 py-2 rounded hover:bg-[#D4AF37]/20 transition-colors">
          + Add Staff Member
        </button>
      </div>

      <div className="flex-1 bg-[#111] border border-[#222] rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a1a1a] border-b border-[#222]">
                <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-mono">
                  Member
                </th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-mono">
                  Current Role
                </th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-mono">
                  Last Active
                </th>
                <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-mono text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-[#222] hover:bg-[#151515] transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#222] flex items-center justify-center text-xs font-medium text-white/80">
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-white/90">
                        {member.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded ${member.rank === 6 ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30" : "bg-white/5 text-white/60 border border-white/10"}`}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-white/50">
                    {member.lastActive}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-[10px] uppercase tracking-wider text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                        Promote
                      </button>
                      <button className="text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
