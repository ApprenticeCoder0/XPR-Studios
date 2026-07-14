
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserRole } from "../types";
import { Shield, Zap, Terminal, Database, Server, Users, Settings, Activity, Lock, Cpu, Globe, Key, FileText, Bell, MessageSquare, Briefcase, Command, Compass, Archive, Codesandbox, Box, Layout, Crosshair, Radar, Wifi, Layers, Video, ShieldAlert, Clock, RefreshCw, X } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";

export function AdvancedFeatures({ userRole }: { userRole: UserRole }) {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionState, setActionState] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOpen = (feat: any) => {
    setSelectedFeature(feat);
    setActionState({});
    setShowSuccess(false);
    setIsModalOpen(true);
  };

  const handleExecute = () => {
    // Simulate real action
    setShowSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 1500);
  };

  const features = [
    // Senior Staff (5)
    { id: "sen1", name: "User Mute Override", role: UserRole.STAFF_SENIOR, icon: MessageSquare, category: "Moderation", type: "input", label: "User ID to Mute", action: "Apply Mute" },
    { id: "sen2", name: "Quick Warn System", role: UserRole.STAFF_SENIOR, icon: ShieldAlert, category: "Moderation", type: "input", label: "User ID & Reason", action: "Send Warning" },
    { id: "sen3", name: "Chat Filters", role: UserRole.STAFF_SENIOR, icon: FileText, category: "Filters", type: "toggle", label: "Strict Profanity Filter", action: "Update Filters" },
    { id: "sen4", name: "Spectate History", role: UserRole.STAFF_SENIOR, icon: Video, category: "Audit", type: "log", label: "Recent Spectate Sessions", action: "Refresh" },
    { id: "sen5", name: "Ticket Metrics", role: UserRole.STAFF_SENIOR, icon: Activity, category: "Metrics", type: "stats", label: "Daily Resolution Rate", action: "Export Data" },

    // Executive Staff (10)
    { id: "exec1", name: "Global Announcement", role: UserRole.STAFF_EXECUTIVE, icon: Bell, category: "Comms", type: "textarea", label: "Announcement Text", action: "Broadcast" },
    { id: "exec2", name: "Spawn Management", role: UserRole.STAFF_EXECUTIVE, icon: Compass, category: "Game World", type: "select", options: ["City Hall", "Airport", "Hospital"], label: "Default Spawn", action: "Set Spawn" },
    { id: "exec3", name: "Economy Logs", role: UserRole.STAFF_EXECUTIVE, icon: Database, category: "Audit", type: "log", label: "High Value Transactions", action: "Download" },
    { id: "exec4", name: "Vehicle Spawner Config", role: UserRole.STAFF_EXECUTIVE, icon: Box, category: "Game World", type: "toggle", label: "Allow Exotic Vehicles", action: "Save Config" },
    { id: "exec5", name: "Inventory Wipes", role: UserRole.STAFF_EXECUTIVE, icon: Archive, category: "Moderation", type: "input", label: "Target User ID", action: "Wipe Inventory", destructive: true },
    { id: "exec6", name: "Whitelist Controls", role: UserRole.STAFF_EXECUTIVE, icon: Lock, category: "Access", type: "toggle", label: "Enable Global Whitelist", action: "Update Access" },
    { id: "exec7", name: "Faction Overrides", role: UserRole.STAFF_EXECUTIVE, icon: Users, category: "Management", type: "input", label: "Faction ID to Disband", action: "Force Disband", destructive: true },
    { id: "exec8", name: "Priority Queue Toggle", role: UserRole.STAFF_EXECUTIVE, icon: Layers, category: "Access", type: "toggle", label: "Queue Priority for VIPs", action: "Save Settings" },
    { id: "exec9", name: "Weather Controls", role: UserRole.STAFF_EXECUTIVE, icon: Globe, category: "Game World", type: "select", options: ["Clear", "Rain", "Thunderstorm", "Snow", "Fog"], label: "Force Weather State", action: "Apply Weather" },
    { id: "exec10", name: "Time Sync Admin", role: UserRole.STAFF_EXECUTIVE, icon: Clock, category: "Game World", type: "select", options: ["Morning", "Noon", "Evening", "Midnight"], label: "Force Time of Day", action: "Sync Time" },

    // Head Staff (15)
    { id: "head1", name: "Senior Staff Audit", role: UserRole.STAFF_HEAD, icon: Shield, category: "Audit", type: "log", label: "Staff Action Logs", action: "View Full Audit" },
    { id: "head2", name: "Promotion Automation", role: UserRole.STAFF_HEAD, icon: Briefcase, category: "Management", type: "toggle", label: "Auto-promote via Playtime", action: "Update Rules" },
    { id: "head3", name: "Server Rules Editor", role: UserRole.STAFF_HEAD, icon: FileText, category: "Content", type: "textarea", label: "Rule Appendments", action: "Publish Rules" },
    { id: "head4", name: "Discord Sync Hooks", role: UserRole.STAFF_HEAD, icon: Server, category: "Integration", type: "toggle", label: "Sync Bans to Discord", action: "Save Hooks" },
    { id: "head5", name: "Anticheat Thresholds", role: UserRole.STAFF_HEAD, icon: Crosshair, category: "Security", type: "select", options: ["Low", "Medium", "Aggressive", "Paranoid"], label: "Sensitivity Level", action: "Apply AC Thresholds" },
    { id: "head6", name: "Network Blacklist", role: UserRole.STAFF_HEAD, icon: Wifi, category: "Security", type: "input", label: "IP/Subnet to Blacklist", action: "Add to Blacklist", destructive: true },
    { id: "head7", name: "Job Payout Configs", role: UserRole.STAFF_HEAD, icon: Database, category: "Economy", type: "input", label: "Global Multiplier (e.g. 1.5)", action: "Update Economy" },
    { id: "head8", name: "Bypass MFA Tokens", role: UserRole.STAFF_HEAD, icon: Key, category: "Access", type: "input", label: "Admin ID to Bypass", action: "Generate Token", destructive: true },
    { id: "head9", name: "Global Wipes", role: UserRole.STAFF_HEAD, icon: Archive, category: "Database", type: "toggle", label: "Confirm Full DB Wipe", action: "INITIATE WIPE", destructive: true },
    { id: "head10", name: "Server Event Triggers", role: UserRole.STAFF_HEAD, icon: Zap, category: "Game World", type: "select", options: ["Airdrop", "Purge Mode", "Double XP Weekend"], label: "Launch Event", action: "Trigger Event" },
    { id: "head11", name: "Database Snapshots", role: UserRole.STAFF_HEAD, icon: Database, category: "Database", type: "log", label: "Available Snapshots", action: "Create New Snapshot" },
    { id: "head12", name: "Live Query Tool", role: UserRole.STAFF_HEAD, icon: Terminal, category: "Database", type: "textarea", label: "SQL/NoSQL Command", action: "Execute Query", destructive: true },
    { id: "head13", name: "Custom Loadouts", role: UserRole.STAFF_HEAD, icon: Box, category: "Game World", type: "input", label: "Loadout JSON String", action: "Inject Loadout" },
    { id: "head14", name: "Area Lockdowns", role: UserRole.STAFF_HEAD, icon: ShieldAlert, category: "Security", type: "select", options: ["Financial District", "Military Base", "Entire Map"], label: "Lockdown Zone", action: "Engage Lockdown" },
    { id: "head15", name: "Tebex Store Sync", role: UserRole.STAFF_HEAD, icon: RefreshCw, category: "Integration", type: "toggle", label: "Force Cache Clear on Sync", action: "Sync Store" },

    // Admin (20)
    { id: "adm1", name: "Core Node Reboot", role: UserRole.ADMIN, icon: Server, category: "System", type: "toggle", label: "Graceful Shutdown", action: "Restart Node", destructive: true },
    { id: "adm2", name: "SSH Terminal Access", role: UserRole.ADMIN, icon: Terminal, category: "System", type: "textarea", label: "Bash Command", action: "Run Command", destructive: true },
    { id: "adm3", name: "VPC Networking Setup", role: UserRole.ADMIN, icon: Wifi, category: "System", type: "log", label: "Current Routing Table", action: "Refresh Routes" },
    { id: "adm4", name: "DDoS Mitigation Panel", role: UserRole.ADMIN, icon: Shield, category: "Security", type: "toggle", label: "Under Attack Mode (L7)", action: "Update Mitigation" },
    { id: "adm5", name: "Root Key Rotation", role: UserRole.ADMIN, icon: Key, category: "Security", type: "toggle", label: "Invalidate existing sessions", action: "Rotate Keys", destructive: true },
    { id: "adm6", name: "Kernel Parameters", role: UserRole.ADMIN, icon: Cpu, category: "System", type: "input", label: "sysctl parameter=value", action: "Apply Setting", destructive: true },
    { id: "adm7", name: "Hardware Monitoring", role: UserRole.ADMIN, icon: Activity, category: "Metrics", type: "stats", label: "CPU: 45% | RAM: 32GB/64GB | NET: 2Gbps", action: "View Detailed Graph" },
    { id: "adm8", name: "Backup Region Failover", role: UserRole.ADMIN, icon: Globe, category: "System", type: "select", options: ["US-East", "EU-West", "AP-South"], label: "Target Region", action: "Initiate Failover", destructive: true },
    { id: "adm9", name: "SQL Injection Logs", role: UserRole.ADMIN, icon: Database, category: "Security", type: "log", label: "Blocked Payloads", action: "Export to CSV" },
    { id: "adm10", name: "Zero-Day Patches", role: UserRole.ADMIN, icon: ShieldAlert, category: "Security", type: "toggle", label: "Apply Unstable Patches", action: "Hot-Patch Node", destructive: true },
    { id: "adm11", name: "Container Orchestration", role: UserRole.ADMIN, icon: Codesandbox, category: "System", type: "select", options: ["Scale Up (+3)", "Scale Down (-2)", "Redeploy All"], label: "Swarm Action", action: "Execute" },
    { id: "adm12", name: "Master Architecture", role: UserRole.ADMIN, icon: Layout, category: "System", type: "stats", label: "Microservices Status: ONLINE", action: "View Topology" },
    { id: "adm13", name: "Load Balancer Config", role: UserRole.ADMIN, icon: Radar, category: "System", type: "select", options: ["Round Robin", "Least Connections", "IP Hash"], label: "Balancing Algorithm", action: "Update Proxy" },
    { id: "adm14", name: "Cluster Auto-scaling", role: UserRole.ADMIN, icon: Layers, category: "System", type: "toggle", label: "Enable predictive scaling", action: "Save Config" },
    { id: "adm15", name: "Direct Fiber Route", role: UserRole.ADMIN, icon: Wifi, category: "System", type: "toggle", label: "Bypass standard BGP", action: "Reroute Traffic" },
    { id: "adm16", name: "Firewall Rule Engine", role: UserRole.ADMIN, icon: Lock, category: "Security", type: "input", label: "IPTables rule", action: "Insert Rule", destructive: true },
    { id: "adm17", name: "Threat Intelligence", role: UserRole.ADMIN, icon: Radar, category: "Security", type: "stats", label: "Active Threats: 12 (Low Severity)", action: "Fetch Latest Feeds" },
    { id: "adm18", name: "Deep Memory Dump", role: UserRole.ADMIN, icon: Database, category: "System", type: "toggle", label: "Include kernel space", action: "Generate Dump", destructive: true },
    { id: "adm19", name: "Quantum Encryption", role: UserRole.ADMIN, icon: Key, category: "Security", type: "toggle", label: "Post-quantum key exchange (Experimental)", action: "Enable PQC" },
    { id: "adm20", name: "God Mode Console", role: UserRole.ADMIN, icon: Command, category: "God", type: "textarea", label: "Raw System Buffer", action: "EXECUTE OVERRIDE", destructive: true },
  ];

  const allowedFeatures = features.filter(f => userRole >= f.role);

  const roleColors = {
    [UserRole.STAFF_SENIOR]: "border-blue-500/30 text-blue-400 hover:bg-blue-500/10",
    [UserRole.STAFF_EXECUTIVE]: "border-purple-500/30 text-purple-400 hover:bg-purple-500/10",    
    [UserRole.STAFF_HEAD]: "border-orange-500/30 text-orange-400 hover:bg-orange-500/10",
    [UserRole.ADMIN]: "border-red-500/30 text-red-400 hover:bg-red-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full gap-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif italic text-white/90">
          Advanced Role Capabilities
        </h3>
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
          {allowedFeatures.length} Modules Available
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar pb-20">
        {allowedFeatures.map(feat => {
          const Icon = feat.icon;
          const colorClass = roleColors[feat.role as keyof typeof roleColors] || "border-white/10 text-white/60 hover:bg-white/5";
          
          return (
            <div 
              key={feat.id}
              onClick={() => handleOpen(feat)}
              className={`bg-[#111] border rounded-md p-4 cursor-pointer transition-all duration-300 group ${colorClass}`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon size={18} className="opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
                <span className="text-[8px] uppercase tracking-widest bg-black/50 px-1.5 py-0.5 rounded border border-white/5">
                  {feat.category}
                </span>
              </div>
              <h4 className="text-xs font-medium uppercase tracking-wide mb-1">{feat.name}</h4>
              <p className="text-[9px] text-white/40 font-mono">Req: Level {feat.role}</p>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && selectedFeature && (
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
              className="w-full max-w-md bg-[#0C0C0C] border border-[#333] rounded-md p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-6 border-b border-[#222] pb-4">
                <selectedFeature.icon size={20} className={selectedFeature.destructive ? "text-red-500" : "text-[#D4AF37]"} />
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider">{selectedFeature.name}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">{selectedFeature.category}</p>
                </div>
              </div>

              {!showSuccess ? (
                <div className="space-y-6">
                  {/* Dynamic Form based on Type */}
                  {selectedFeature.type === "input" && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-2 font-mono">{selectedFeature.label}</label>
                      <input 
                        type="text" 
                        value={actionState.val || ""}
                        onChange={(e) => setActionState({...actionState, val: e.target.value})}
                        className="bg-black border border-[#333] rounded px-3 py-2 text-sm text-white w-full focus:border-[#D4AF37] outline-none transition-colors"
                        placeholder="..."
                      />
                    </div>
                  )}

                  {selectedFeature.type === "textarea" && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-2 font-mono">{selectedFeature.label}</label>
                      <textarea 
                        rows={4}
                        value={actionState.val || ""}
                        onChange={(e) => setActionState({...actionState, val: e.target.value})}
                        className="bg-black border border-[#333] rounded px-3 py-2 text-sm text-white w-full focus:border-[#D4AF37] outline-none transition-colors resize-none font-mono"
                        placeholder="..."
                      />
                    </div>
                  )}

                  {selectedFeature.type === "toggle" && (
                    <div className="flex items-center justify-between bg-black border border-[#222] p-3 rounded">
                      <span className="text-xs text-white/80">{selectedFeature.label}</span>
                      <button 
                        onClick={() => setActionState({...actionState, toggle: !actionState.toggle})}
                        className={`w-10 h-5 rounded-full transition-colors relative ${actionState.toggle ? 'bg-[#D4AF37]' : 'bg-[#333]'}`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-all ${actionState.toggle ? 'left-6' : 'left-1'}`}></div>
                      </button>
                    </div>
                  )}

                  {selectedFeature.type === "select" && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-2 font-mono">{selectedFeature.label}</label>
                      <select 
                        value={actionState.val || ""}
                        onChange={(e) => setActionState({...actionState, val: e.target.value})}
                        className="bg-black border border-[#333] rounded px-3 py-2 text-sm text-white w-full focus:border-[#D4AF37] outline-none transition-colors appearance-none"
                      >
                        <option value="">-- Select Option --</option>
                        {selectedFeature.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  )}

                  {selectedFeature.type === "log" && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-2 font-mono">{selectedFeature.label}</label>
                      <div className="bg-black border border-[#333] rounded p-3 text-[10px] text-white/50 font-mono h-24 overflow-y-auto">
                        [10:45:01] SYS: Log query started...<br/>
                        [10:45:02] SYS: 0 results found.<br/>
                        [10:45:02] WAIT: Awaiting command...
                      </div>
                    </div>
                  )}

                  {selectedFeature.type === "stats" && (
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-white/70 block mb-2 font-mono">Current Status</label>
                      <div className="bg-black border border-[#333] rounded p-3 text-xs text-green-400 font-mono text-center">
                        {selectedFeature.label}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#222]">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="text-[10px] uppercase tracking-wider text-white/50 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleExecute}
                      className={`text-[10px] uppercase tracking-wider px-4 py-2 rounded transition-colors font-bold ${selectedFeature.destructive ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20' : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20'}`}
                    >
                      {selectedFeature.action}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-green-500 flex items-center justify-center mb-4 text-green-500">
                    <Zap size={24} />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-2">Command Executed</h4>
                  <p className="text-xs text-white/50 font-mono">The system has processed your request successfully.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
