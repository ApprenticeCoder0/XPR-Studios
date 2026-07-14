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
X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LiveMap } from "./LiveMap";
import { RoleBadge } from "./RoleBadge";
import { ConfirmModal } from "./ConfirmModal";
import { AdvancedFeatures } from "./AdvancedFeatures";
import { useAuth } from "../contexts/AuthContext";
import { UserRole, TicketGrade, TicketSituation, TicketTime } from "../types";


export const AdminContext = React.createContext<{
  addSystemLog: (type: string, msg: string) => void;
  systemLogs: {time: string, type: string, msg: string}[];
}>({ addSystemLog: () => {}, systemLogs: [] });

export function AdminPanel() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("system");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [systemLogs, setSystemLogs] = useState([
    { time: "14:32:01", type: "INFO", msg: "Server instance [us-east-1] initialized." },
    { time: "14:32:05", type: "WARN", msg: "High memory usage detected on shard 3." },
    { time: "14:35:12", type: "ERROR", msg: "Failed to sync player datastore. Retrying..." },
    { time: "14:35:14", type: "INFO", msg: "Datastore sync successful." },
    { time: "14:40:00", type: "INFO", msg: "Scheduled maintenance check completed." },
  ]);

  const addSystemLog = (type: string, msg: string) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSystemLogs(prev => [{ time, type, msg }, ...prev]);
  };


  if (!user || user.role < UserRole.ADMIN) {
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
    <AdminContext.Provider value={{ addSystemLog, systemLogs }}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 sm:p-12 max-w-7xl mx-auto flex flex-col w-full"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-[#222] pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Cpu className="text-red-500" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-serif italic tracking-wide text-white/90">
              Central Command
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <p className="text-[10px] text-red-500 uppercase tracking-widest font-mono">
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
            <span className="text-[9px] text-red-500 uppercase tracking-wider">
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
              active={activeTab === "system"}
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
          </div>

          {user.role >= UserRole.STAFF_EXECUTIVE && (
            <div className="flex flex-col gap-2">
              <h3 className="text-[10px] uppercase tracking-widest text-red-500 mb-2 font-mono border-l-2 border-red-500 pl-2">
                Administration
              </h3>
              {user.role >= UserRole.PARTNERSHIP && (
                <TabButton
                  active={activeTab === "content"}
                  onClick={() => setActiveTab("content")}
                  icon={Database}
                  label="Content & Ads"
                />
              )}
              {user.role >= UserRole.STAFF_SENIOR && (
                <TabButton
                  active={activeTab === "editor"}
                  onClick={() => setActiveTab("editor")}
                  icon={Settings}
                  label="Section Editor"
                />
              )}
              {user.role >= UserRole.STAFF_HEAD && (
                <TabButton
                  active={activeTab === "staff_management"}
                  onClick={() => setActiveTab("staff_management")}
                  icon={Users}
                  label="Staff Management"
                />
              )}
              {user.role >= UserRole.STAFF_HEAD && (
                <TabButton
                  active={activeTab === "system"}
                  onClick={() => setActiveTab("system")}
                  icon={Terminal}
                  label="System Health"
                />
              )}
              {user.role >= UserRole.STAFF_SENIOR && (
                <TabButton
                  active={activeTab === "advanced"}
                  onClick={() => setActiveTab("advanced")}
                  icon={ShieldAlert}
                  label="Advanced Modules"
                />
              )}
            </div>
          )}
          
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
                  case "audit_log":
                    return <AuditLog key="audit_log" />;
                  case "live_map":
                    return <LiveMap userRole={user.role as any} />;
                  case "editor":
                    return <SectionEditor key="editor" />;
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
    </AdminContext.Provider>
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
          ? "text-red-500 bg-[#1a1a1a]"
          : "hover:bg-[#1a1a1a] text-white/60 hover:text-white/90"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeTabIndicatorStaff"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 shadow-[0_0_8px_#ef4444]"
        />
      )}
      <Icon
        size={16}
        className={`relative z-10 ${active ? "text-red-500" : "text-white/40"}`}
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
          className="text-[10px] uppercase tracking-wider text-white/50 hover:text-red-500 transition-colors flex items-center gap-2 mb-6"
        >
          <ArrowRight size={12} className="rotate-180" /> Back to Queue
        </button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h3 className="text-xl font-serif italic text-white/90">
              Player RDM at spawn area
            </h3>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[9px] uppercase tracking-wider bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20">
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
          <h4 className="text-[10px] uppercase tracking-widest text-red-500 mb-4 font-mono">
            Response Protocol
          </h4>
          <textarea
            rows={4}
            placeholder="Type your official response here..."
            className="w-full bg-[#111] border border-[#333] focus:border-red-500 outline-none rounded p-3 text-sm resize-none transition-colors"
          ></textarea>
          <div className="flex items-center justify-between mt-4">
            <select className="bg-[#111] border border-[#333] text-[10px] uppercase tracking-wider p-2 rounded outline-none focus:border-red-500 text-white/70">
              <option>Update Status to: Communication Phase</option>
              <option>Update Status to: Staff Discussion</option>
              <option>Update Status to: Resolved</option>
            </select>
            <button className="text-[10px] uppercase tracking-[0.2em] px-6 py-2.5 bg-red-500 text-black font-bold hover:bg-[#c5a230] transition-colors rounded">
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
          <span className="text-[10px] uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-1.5 rounded-full">
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
              className="w-full bg-black border border-[#333] rounded-full pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <select 
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="bg-black border border-[#333] rounded-full px-4 py-2 text-xs text-white outline-none focus:border-red-500 transition-colors appearance-none cursor-pointer hover:bg-[#1a1a1a]">
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
                  <h4 className="text-sm font-medium text-white/80 group-hover:text-red-500 transition-colors">
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
                  className="text-white/20 group-hover:text-red-500 transition-colors"
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
            className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-xs outline-none focus:border-red-500 text-white pl-8"
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
                  <button className="text-[10px] text-red-500 hover:underline mr-3">
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
  const data = [
    { name: "Mon", tickets: 24 },
    { name: "Tue", tickets: 18 },
    { name: "Wed", tickets: 35 },
    { name: "Thu", tickets: 28 },
    { name: "Fri", tickets: 42 },
    { name: "Sat", tickets: 65 },
    { name: "Sun", tickets: 55 },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif italic text-white/90">
          Staff Performance Overview
        </h3>
        <div className="flex gap-2">
          <span className="text-[10px] uppercase tracking-wider bg-red-500/10 text-red-500 px-3 py-1.5 rounded border border-red-500/30">
            Last 7 Days
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#111] border border-[#222] p-4 rounded-md">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono mb-1">
            Total Handled
          </p>
          <p className="text-2xl font-serif italic text-red-500">267</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-4 rounded-md">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono mb-1">
            Avg Response
          </p>
          <p className="text-2xl font-serif italic text-white/90">14m</p>
        </div>
        <div className="bg-[#111] border border-[#222] p-4 rounded-md">
          <p className="text-[10px] text-white/50 uppercase tracking-wider font-mono mb-1">
            Active Bans
          </p>
          <p className="text-2xl font-serif italic text-red-400">12</p>
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
  const { systemLogs: logs, addSystemLog } = React.useContext(AdminContext);
  const [isReconnecting, setIsReconnecting] = React.useState(false);
  const [dbStatus, setDbStatus] = React.useState<"Disconnected" | "Reconnecting" | "Online">("Disconnected");

  const handleForceReconnect = () => {
    if (isReconnecting || dbStatus === "Online") return;
    setIsReconnecting(true);
    setDbStatus("Reconnecting");
    addSystemLog("INFO", "FORCE_RECONNECT sequence initiated by Admin.");
    
    setTimeout(() => {
      setDbStatus("Online");
      setIsReconnecting(false);
      addSystemLog("SUCCESS", "Database connection established via fallback routing.");
    }, 4500);
  };

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
          <button 
            onClick={handleForceReconnect}
            disabled={isReconnecting || dbStatus === "Online"}
            className={`flex items-center gap-2 text-[10px] uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${dbStatus === "Online" ? "bg-green-500/10 border border-green-500/30 text-green-400 opacity-50 cursor-not-allowed" : isReconnecting ? "bg-orange-500/10 border border-orange-500/30 text-orange-400" : "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"}`}
          >
            {isReconnecting ? <RefreshCw size={12} className="animate-spin" /> : dbStatus === "Online" ? <Shield size={12} /> : <Square size={12} />} 
            {isReconnecting ? "Reconnecting..." : dbStatus === "Online" ? "Connected" : "Force Reconnect"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`bg-[#111] border rounded-md p-4 flex flex-col justify-between ${dbStatus === "Online" ? "border-green-500/30" : dbStatus === "Reconnecting" ? "border-orange-500/30" : "border-red-500/30"}`}>
          <h4 className={`text-[10px] uppercase tracking-widest font-mono mb-2 ${dbStatus === "Online" ? "text-green-400" : dbStatus === "Reconnecting" ? "text-orange-400" : "text-red-400"}`}>
            Database Status (Firebase)
          </h4>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${dbStatus === "Online" ? "bg-green-500" : dbStatus === "Reconnecting" ? "bg-orange-500 animate-pulse" : "bg-red-500 animate-pulse"}`}></span>
            <span className="text-xs text-white/70">
              {dbStatus === "Online" ? "Online - Stable Connection" : dbStatus === "Reconnecting" ? "Attempting Connection..." : "Disconnected - Using Mock Data"}
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
        <div className="text-red-500 mb-4">
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
  const { addSystemLog } = React.useContext(AdminContext);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { ads, setAds, serverState, setServerState } = useServer();

  const [config, setConfig] = useState({
    maintenanceMode: false,
    maxPlayers: "1000",
    globalMultiplier: "1.5",
  });

  const handleAddAd = () => {
    const newAd = {
      id: Date.now(),
      tag: "New Ad",
      title: "New Promotion",
      desc: "Description here.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
      link: "#",
    };
    setAds([...ads, newAd]);
  };

  const removeAd = (id: number) => {
    setAds(ads.filter(a => a.id !== id));
  };
  
  const updateAd = (id: number, field: string, value: string) => {
    setAds(ads.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleSave = () => {
    setSaving(true);
    addSystemLog("INFO", "Attempting to sync Global Config to Firebase...");
    setTimeout(() => {
      setSaving(false);
      addSystemLog("ERROR", "FIREBASE_MISSING_PERMISSIONS: The caller does not have permission to execute this operation. Configure your Firestore Security Rules in the Firebase Console to allow write access to the 'global_config' collection.");
    }, 1500);
  };

  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-serif italic text-white/90">
            Content & Ads Management
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            Update real-time variables directly to Firebase Firestore.
          </p>
        </div>
        <button 
          onClick={() => setIsConfirmOpen(true)}
          disabled={saving}
          className="text-[10px] uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-500 px-6 py-3 rounded hover:bg-red-500/20 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)] disabled:opacity-50 whitespace-nowrap"
        >
          {saving ? "Syncing..." : "Sync Config"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111] border border-[#222] rounded-md p-6 space-y-6">
          <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-2 font-mono border-b border-[#222] pb-2">Core Settings</h4>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white/90">Maintenance Mode</h4>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Prevents non-staff from logging in.</p>
            </div>
            <button 
              onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.maintenanceMode ? 'bg-red-500' : 'bg-[#333]'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${config.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="border-t border-[#222] pt-6">
            <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-3 font-mono">Max Concurrent Players</label>
            <input 
              type="number" 
              value={config.maxPlayers}
              onChange={(e) => setConfig({...config, maxPlayers: e.target.value})}
              className="bg-black border border-[#333] rounded px-4 py-2 text-sm text-white w-full focus:border-red-500/50 outline-none transition-colors"
            />
          </div>

          <div className="border-t border-[#222] pt-6">
            <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-3 font-mono">Global XP Multiplier</label>
            <input 
              type="number" 
              step="0.1"
              value={config.globalMultiplier}
              onChange={(e) => setConfig({...config, globalMultiplier: e.target.value})}
              className="bg-black border border-[#333] rounded px-4 py-2 text-sm text-white w-full focus:border-red-500/50 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-md p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#222] pb-2 mb-4">
            <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono">In-Game Advertisements</h4>
            <button onClick={handleAddAd} className="text-[10px] uppercase tracking-wider text-green-400 hover:text-green-300 transition-colors">+ Create Ad</button>
          </div>
          
          <div className="space-y-4 flex-1">
            {ads.map(ad => (
              <div key={ad.id} className="bg-black border border-[#333] rounded p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <input 
                    className="bg-transparent border-b border-[#444] text-sm text-white/90 focus:border-[#D4AF37] outline-none" 
                    value={ad.title} 
                    onChange={e => updateAd(ad.id, 'title', e.target.value)} 
                    placeholder="Ad Title"
                  />
                  <button 
                    onClick={() => removeAd(ad.id)}
                    className="text-[9px] uppercase tracking-widest px-2 py-1 rounded bg-red-500/10 text-red-500 border border-red-500/30"
                  >
                    Delete
                  </button>
                </div>
                <input 
                  className="w-full bg-[#111] border border-[#222] text-xs text-white/70 p-2 rounded outline-none focus:border-[#D4AF37]" 
                  value={ad.desc} 
                  onChange={e => updateAd(ad.id, 'desc', e.target.value)} 
                  placeholder="Ad Description"
                />
                <input 
                  className="w-full bg-[#111] border border-[#222] text-xs text-white/70 p-2 rounded outline-none focus:border-[#D4AF37]" 
                  value={ad.image} 
                  onChange={e => updateAd(ad.id, 'image', e.target.value)} 
                  placeholder="Image URL"
                />
                <div className="flex gap-2">
                   <input 
                    className="w-1/3 bg-[#111] border border-[#222] text-xs text-white/70 p-2 rounded outline-none focus:border-[#D4AF37]" 
                    value={ad.tag} 
                    onChange={e => updateAd(ad.id, 'tag', e.target.value)} 
                    placeholder="Tag (e.g. Event)"
                  />
                  <input 
                    className="flex-1 bg-[#111] border border-[#222] text-xs text-white/70 p-2 rounded outline-none focus:border-[#D4AF37]" 
                    value={ad.link} 
                    onChange={e => updateAd(ad.id, 'link', e.target.value)} 
                    placeholder="Link URL"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSave}
        title="Deploy Config?"
        description="This will instantly update the global configuration for all connected players. Incorrect values may result in server instability."
        confirmText="Deploy to Firebase"
        destructive={true}
        countdownSeconds={5}
      />
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
      <ShieldAlert size={48} className="text-red-500/50 mb-4" />
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
            className="bg-[#111] border border-[#333] rounded px-3 py-2 text-xs text-white outline-none focus:border-red-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#111] border border-[#333] rounded px-3 py-2 text-xs text-white outline-none focus:border-red-500"
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
            className="bg-[#111] border border-[#333] rounded px-3 py-2 text-xs text-white outline-none focus:border-red-500"
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
  const { addSystemLog } = React.useContext(AdminContext);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState(UserRole.STAFF_INITIATE);

  const staffMembers = [
    {
      id: 1,
      name: "Staff_Alpha",
      role: UserRole.STAFF_EXECUTIVE,
      lastActive: "2 mins ago",
    },
    {
      id: 2,
      name: "Staff_Beta",
      role: UserRole.STAFF_SENIOR,
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "Dev_Alpha",
      role: UserRole.STAFF_HEAD,
      lastActive: "Just now",
    },
    {
      id: 4,
      name: "Staff_Gamma",
      role: UserRole.STAFF_INITIATE,
      lastActive: "12 hours ago",
    },
  ];

  const handleDemote = () => {
    addSystemLog("WARN", `Requested demotion for user ${selectedStaff?.name}. Operation denied by Firebase Rules.`);
    setSelectedStaff(null);
  };

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
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="text-[10px] uppercase tracking-wider bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-2 rounded hover:bg-red-500/20 transition-colors"
        >
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
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="p-4 text-xs text-white/50">
                    {member.lastActive}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                         setSelectedStaff(member);
                         setIsConfirmOpen(true);
                      }}
                      className="text-[9px] uppercase tracking-wider text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded transition-colors"
                    >
                      Demote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDemote}
        title="Confirm Demotion?"
        description={`Are you sure you want to demote ${selectedStaff?.name}? Their access will be immediately revoked.`}
        confirmText="Demote User"
        destructive={true}
        countdownSeconds={5}
      />

      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#0C0C0C] border border-[#222] p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80"></div>
              
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-serif italic text-white/90 mb-6">Promote User to Staff</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2 font-mono">User Email</label>
                  <input
                    type="email"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-black border border-[#333] rounded px-4 py-3 text-sm text-white focus:border-red-500/50 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2 font-mono">Assign Role</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(Number(e.target.value))}
                    className="w-full bg-black border border-[#333] rounded px-4 py-3 text-sm text-white focus:border-red-500/50 outline-none transition-colors"
                  >
                    <option value={UserRole.STAFF_INITIATE}>Initiate Staff</option>
                    <option value={UserRole.STAFF_SENIOR}>Senior Staff</option>
                    <option value={UserRole.STAFF_EXECUTIVE}>Executive Staff</option>
                    <option value={UserRole.STAFF_HEAD}>Head Staff</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 text-[10px] uppercase tracking-widest border border-[#333] hover:bg-white/5 transition-colors rounded text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addSystemLog("WARN", `Attempted to promote ${newStaffEmail}. FIREBASE_MISSING_PERMISSIONS: Require ADMIN token.`);
                    setIsAddModalOpen(false);
                    setNewStaffEmail("");
                  }}
                  className="flex-1 py-3 text-[10px] uppercase tracking-widest rounded transition-colors font-bold bg-red-500 text-black hover:bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                >
                  Confirm Promotion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AuditLog() {
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("today");
  const [filterUser, setFilterUser] = useState("");

  const logs = [
    {
      id: 1,
      time: "14:32:01",
      action: "BAN_USER",
      user: "Staff_Alpha",
      target: "Player123",
      details: "Reason: Exploiting. Duration: Permanent.",
      type: "destructive",
    },
    {
      id: 2,
      time: "14:15:22",
      action: "TICKET_CLOSE",
      user: "Staff_Beta",
      target: "#TKT-1043",
      details: "Resolved player dispute in safezone.",
      type: "moderate",
    },
    {
      id: 3,
      time: "13:50:04",
      action: "UPDATE_CONFIG",
      user: "Dev_Alpha",
      target: "GLOBAL_ECONOMY",
      details: "Modified tax rate from 5% to 6%.",
      type: "administrative",
    },
    {
      id: 4,
      time: "12:22:11",
      action: "PROMOTE_STAFF",
      user: "Director_Omega",
      target: "Staff_Beta",
      details: "Promoted to Senior Staff.",
      type: "administrative",
    },
    {
      id: 5,
      time: "11:05:45",
      action: "UNBAN_USER",
      user: "Staff_Alpha",
      target: "Player777",
      details: "Appeal accepted.",
      type: "moderate",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif italic text-white/90">
          Global Audit Log
        </h3>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 bg-[#111] p-4 rounded-md border border-[#222]">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[9px] uppercase tracking-widest text-white/50 block mb-2 font-mono">
            Staff User
          </label>
          <input
            type="text"
            placeholder="Search username..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="w-full bg-black border border-[#333] rounded px-3 py-2 text-xs text-white focus:border-red-500/50 outline-none transition-colors"
          />
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-widest text-white/50 block mb-2 font-mono">
            Action Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-black border border-[#333] rounded px-3 py-2 text-xs text-white outline-none cursor-pointer focus:border-red-500/50"
          >
            <option value="all">All Actions</option>
            <option value="destructive">Destructive</option>
            <option value="moderate">Moderate</option>
            <option value="administrative">Administrative</option>
          </select>
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-widest text-white/50 block mb-2 font-mono">
            Time Range
          </label>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-black border border-[#333] rounded px-3 py-2 text-xs text-white outline-none cursor-pointer focus:border-red-500/50"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="flex-1 bg-black border border-[#222] rounded-md overflow-hidden flex flex-col font-mono text-[10px] relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10"></div>
        <div className="overflow-y-auto flex-1 p-4 relative z-20 space-y-2">
          {logs
            .filter((log) => 
               (filterType === "all" || log.type === filterType) &&
               (filterUser === "" || log.user.toLowerCase().includes(filterUser.toLowerCase()))
            )
            .map((log) => (
            <div
              key={log.id}
              className="border-b border-[#222] pb-2 mb-2 last:border-0 hover:bg-white/5 p-2 rounded transition-colors"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex gap-4 items-center">
                  <span className="text-white/40">[{log.time}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] tracking-wider ${
                    log.type === 'destructive' ? 'bg-red-500/10 text-red-500' :
                    log.type === 'administrative' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {log.action}
                  </span>
                  <span className="text-white/80">User: {log.user}</span>
                </div>
                <span className="text-white/30">ID: {log.id}</span>
              </div>
              <div className="pl-[76px]">
                <span className="text-red-400/80 mr-2">Target: {log.target}</span>
                <span className="text-white/60">|| {log.details}</span>
              </div>
            </div>
          ))}
          <div className="mt-4 text-red-500/50 animate-pulse">_ END OF LOGS</div>
        </div>
      </div>
    </motion.div>
  );
}


function SectionEditor() {
  const [selectedPage, setSelectedPage] = React.useState("Home");
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-serif italic text-white/90">
            Section Editor
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            Modify public-facing content without redeploying.
          </p>
        </div>
        <div className="flex gap-2">
           <select 
             value={selectedPage} 
             onChange={e => setSelectedPage(e.target.value)}
             className="bg-[#111] border border-[#333] text-white px-3 py-2 text-xs uppercase tracking-wider rounded outline-none focus:border-[#D4AF37]"
           >
             <option value="Home">Home Page</option>
             <option value="Rules">Server Rules</option>
             <option value="Store">Store Layout</option>
             <option value="Wiki">Wiki Index</option>
           </select>
           <button 
             onClick={() => setIsConfirmOpen(true)}
             className="text-[10px] uppercase tracking-wider bg-[#D4AF37] text-black px-4 py-2 rounded hover:bg-[#c5a230] transition-colors font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]"
           >
             Publish Changes
           </button>
        </div>
      </div>

      <div className="space-y-6">
         {/* Hero Section */}
         <div className="bg-[#111] border border-[#222] rounded p-6">
            <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 font-mono border-b border-[#222] pb-2">Hero Section</h4>
            <div className="space-y-4">
               <div>
                 <label className="text-xs text-white/70 block mb-2 font-medium">Hero Title</label>
                 <input type="text" defaultValue="Welcome to Roleplay" className="bg-black border border-[#333] rounded px-3 py-2 text-sm text-white w-full focus:border-[#D4AF37] outline-none" />
               </div>
               <div>
                 <label className="text-xs text-white/70 block mb-2 font-medium">Hero Subtitle</label>
                 <input type="text" defaultValue="Experience the ultimate life simulation." className="bg-black border border-[#333] rounded px-3 py-2 text-sm text-white w-full focus:border-[#D4AF37] outline-none" />
               </div>
               <div>
                 <label className="text-xs text-white/70 block mb-2 font-medium">Background Video URL (optional)</label>
                 <input type="text" defaultValue="https://video.example.com/bg.mp4" className="bg-black border border-[#333] rounded px-3 py-2 text-sm text-white w-full focus:border-[#D4AF37] outline-none font-mono text-xs" />
               </div>
            </div>
         </div>

         {/* Features List */}
         <div className="bg-[#111] border border-[#222] rounded p-6">
            <div className="flex items-center justify-between border-b border-[#222] pb-2 mb-4">
              <h4 className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-mono">Feature Highlights</h4>
              <button className="text-[9px] uppercase tracking-wider text-green-400 hover:text-green-300 transition-colors">+ Add Feature</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="bg-black border border-[#333] p-4 rounded group relative">
                    <button className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                    <input type="text" defaultValue={`Feature ${i}`} className="bg-transparent border-b border-[#444] text-sm text-white w-full focus:border-[#D4AF37] outline-none mb-2 pb-1 font-medium" />
                    <textarea rows={2} defaultValue="This is a description of the feature." className="bg-transparent border border-transparent text-xs text-white/70 w-full focus:border-[#444] outline-none resize-none rounded p-1"></textarea>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4 flex items-start gap-3 text-blue-400">
            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
            <div>
               <h5 className="text-xs font-bold uppercase tracking-wider mb-1">Preview Notice</h5>
               <p className="text-[10px] text-blue-400/80 leading-relaxed">Changes made here bypass the standard deployment cycle. Ensure all text and links are verified before hitting publish. Some changes may take up to 5 minutes to propagate to CDN edge nodes.</p>
            </div>
         </div>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          // show toast
        }}
        title="Publish Live Content?"
        description="Are you sure you want to push these changes to production? This action will immediately affect all users."
        confirmText="Publish"
        destructive={false}
      />
    </motion.div>
  );
}
