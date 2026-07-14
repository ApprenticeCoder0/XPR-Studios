import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Settings, Award, Briefcase, Link as LinkIcon, Shield, 
  Gamepad2, Code, Box, GitCommit, ExternalLink, Save, Edit3
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { NetworkLatencyGauge } from "./NetworkLatencyGauge";
import { useAchievements, ALL_ACHIEVEMENTS } from "../contexts/AchievementContext";

export function UserDashboard({
  onNavigate,
}: {
  onNavigate: (view: string) => void;
  key?: React.Key;
}) {
  const { user, updateProfilePicture, updateProfile } = useAuth();
  const { unlockedIds } = useAchievements();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");

  const [projects, setProjects] = useState([
    { name: "Sci-Fi Vehicle Kit", role: "Modeller", views: "1.2k" },
    { name: "Advanced Combat System", role: "Scripter", views: "4.5k" },
    { name: "Neon City Map", role: "Level Designer", views: "800" },
    { name: "UI Overhaul V2", role: "UI/UX", views: "3.1k" },
  ]);

  const [socials, setSocials] = useState([
    { name: "Roblox", connected: true, value: "Player", color: "hover:text-red-400" },
    { name: "Discord", connected: false, value: "", color: "hover:text-[#5865F2]" },
    { name: "GitHub", connected: true, value: "dev-player", color: "hover:text-white" },
    { name: "Twitter / X", connected: false, value: "", color: "hover:text-blue-400" },
  ]);

  const handleAddProject = () => {
    const name = window.prompt("Enter Project Name:");
    if (!name) return;
    const role = window.prompt("Enter Your Role:") || "Contributor";
    setProjects(prev => [{ name, role, views: "0" }, ...prev]);
    addToast("Project added to portfolio.", "success");
  };

  const toggleConnection = (index: number) => {
    setSocials(prev => {
      const next = [...prev];
      if (next[index].connected) {
        next[index].connected = false;
        next[index].value = "";
        addToast(next[index].name + " unlinked successfully.", "success");
      } else {
        const val = window.prompt("Enter your " + next[index].name + " username:");
        if (val) {
          next[index].connected = true;
          next[index].value = val;
          addToast(next[index].name + " linked successfully.", "success");
        }
      }
      return next;
    });
  };


  // Form states
  const [robloxUsername, setRobloxUsername] = useState(user?.name || "Player");
  const [bio, setBio] = useState(user?.bio || "Studio Developer & Enthusiast.");
  const [themeColor, setThemeColor] = useState("#D4AF37");
  const [isPublic, setIsPublic] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showBadges, setShowBadges] = useState(true);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Shield size={48} className="text-red-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-serif italic text-white/80 mb-2">
          Authentication Required
        </h2>
        <p className="text-sm text-white/50 mb-6">
          Please sign in to view your developer hub.
        </p>
        <button
          onClick={() => onNavigate("home")}
          className="text-[10px] uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] px-6 py-3 rounded border border-[#D4AF37]/30 hover:bg-[#D4AF37]/30 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const TABS = [
    { id: "overview", label: "Overview", icon: User },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "connections", label: "Connections", icon: LinkIcon },
    { id: "profile", label: "Profile Customization", icon: Settings },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ];

  const handleSave = () => {
    if (updateProfile) updateProfile({ name: robloxUsername, bio: bio });
    addToast("Profile settings saved successfully.", "success");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 w-full"
    >
      {/* Sidebar */}
      <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
        <div className="mb-8 px-4">
          <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-2" style={{ color: themeColor }}>
            Identity Hub
          </div>
          <h2 className="text-2xl font-serif italic">My Profile</h2>
        </div>
        
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                isActive 
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20" 
                  : "text-white/50 hover:text-white/90 hover:bg-[#111]"
              }`}
              style={isActive ? { color: themeColor, borderColor: `${themeColor}33`, backgroundColor: `${themeColor}1a` } : {}}
            >
              <Icon size={16} className={isActive ? "" : "opacity-70"} style={isActive ? { color: themeColor } : {}} />
              <span className="tracking-wide">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#0a0a0a] border border-[#222] rounded-2xl overflow-hidden min-h-[600px] relative">
        {/* Dynamic header colored by theme */}
        <div className="h-32 opacity-20 relative transition-colors duration-500" style={{ backgroundColor: themeColor }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
        </div>
        
        <div className="px-8 pb-8 relative -mt-12">
          {/* Top Profile Card area */}
          <div className="flex items-end gap-6 mb-12">
            <div className="relative group cursor-pointer">
              <img 
                src={user.profilePicture || `https://api.dicebear.com/7.x/shapes/svg?seed=${robloxUsername}`}
                alt="Avatar"
                className="w-24 h-24 rounded-2xl border-4 border-[#0a0a0a] object-cover bg-[#111] transition-all"
              />
              <div 
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                onClick={() => {
                  const url = window.prompt("Enter new avatar URL (or leave blank to use Roblox API placeholder):");
                  if (url) updateProfilePicture(url);
                }}
              >
                <Edit3 size={20} className="text-white" />
              </div>
            </div>
            <div className="pb-2">
              <h1 className="text-3xl font-serif italic">{robloxUsername}</h1>
              <p className="text-sm text-white/50 font-mono mt-1">{bio}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex flex-col justify-between hover:border-[#333] transition-colors">
                      <div className="text-white/50 text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Code size={14}/> Scripts</div>
                      <div className="text-3xl font-mono transition-colors" style={{ color: themeColor }}>14,203</div>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex flex-col justify-between hover:border-[#333] transition-colors">
                      <div className="text-white/50 text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Box size={14}/> Models</div>
                      <div className="text-3xl font-mono transition-colors" style={{ color: themeColor }}>84</div>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex flex-col justify-between hover:border-[#333] transition-colors">
                      <div className="text-white/50 text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><GitCommit size={14}/> Commits</div>
                      <div className="text-3xl font-mono transition-colors" style={{ color: themeColor }}>1,092</div>
                    </div>
                    <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex flex-col justify-between hover:border-[#333] transition-colors">
                      <div className="text-white/50 text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Gamepad2 size={14}/> Hours</div>
                      <div className="text-3xl font-mono transition-colors" style={{ color: themeColor }}>450.5</div>
                    </div>
                  </div>
                  <div className="col-span-1 bg-[#111] p-6 rounded-xl border border-[#222] flex flex-col items-center justify-center">
                    <NetworkLatencyGauge />
                  </div>
                </div>

                <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="text-xs uppercase tracking-widest text-white/50 mb-6">Recent Studio Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: "Pushed commit to 'Core Systems'", time: "2 hours ago" },
                      { action: "Earned badge 'Bug Squasher'", time: "1 day ago" },
                      { action: "Published model 'Sci-Fi Vehicle Kit'", time: "3 days ago" },
                      { action: "Linked Discord Account", time: "1 week ago" }
                    ].map((act, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-[#222] pb-4 last:border-0 last:pb-0">
                        <span className="text-sm text-white/80">{act.action}</span>
                        <span className="text-xs text-white/40 font-mono">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "portfolio" && (
              <motion.div key="portfolio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm uppercase tracking-widest text-white/70">My Creations</h3>
                  <button onClick={handleAddProject} className="text-[10px] uppercase tracking-widest text-black px-4 py-2 rounded font-bold transition-colors hover:brightness-110" style={{ backgroundColor: themeColor }}>+ Add Project</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((proj, i) => (
                     <div key={i} className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#444] transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-medium transition-colors" style={{ color: themeColor }}>{proj.name}</h4>
                        <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50" />
                      </div>
                      <div className="flex justify-between items-center text-xs text-white/50">
                        <span className="px-2 py-1 bg-[#222] rounded text-white/70">{proj.role}</span>
                        <span className="font-mono">{proj.views} views</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "achievements" && (
              <motion.div key="achievements" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-white/70 mb-6">Studio Badges</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {ALL_ACHIEVEMENTS.map((badge, i) => {
                    const isUnlocked = unlockedIds.includes(badge.id);
                    return (
                    <div key={i} className={`bg-[#111] border ${isUnlocked ? 'border-[#D4AF37]/50' : 'border-[#222] opacity-50 grayscale'} rounded-xl p-4 text-center transition-all`}>
                      <div className="text-4xl mb-3 drop-shadow-md">{badge.icon}</div>
                      <div className="text-sm font-medium mb-1 text-white/90">{badge.name}</div>
                      <div className="text-[10px] text-white/40 leading-tight">{badge.desc}</div>
                    </div>
                  )})}
                </div>
              </motion.div>
            )}

            {activeTab === "connections" && (
              <motion.div key="connections" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-white/70 mb-6">Linked Accounts</h3>
                <div className="space-y-4 max-w-2xl">
                  {socials.map((social, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#111] border border-[#222] rounded-xl p-5 gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full shadow-sm ${social.connected ? "bg-green-500 shadow-green-500/50" : "bg-red-500 shadow-red-500/50"}`}></div>
                        <span className={`font-medium ${social.color} transition-colors cursor-pointer`}>{social.name}</span>
                      </div>
                      {social.connected ? (
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-white/50 font-mono bg-[#1a1a1a] px-3 py-1 rounded">{social.value}</span>
                          <button onClick={() => toggleConnection(i)} className="text-[10px] uppercase tracking-widest text-white/30 hover:text-red-500 transition-colors">Unlink</button>
                        </div>
                      ) : (
                        <button onClick={() => toggleConnection(i)} className="text-[10px] uppercase tracking-widest bg-[#222] text-white/70 px-6 py-2 rounded hover:bg-[#333] transition-colors self-start sm:self-auto">Connect</button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-2xl">
                <h3 className="text-sm uppercase tracking-widest text-white/70 mb-6">Profile Customization</h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2">Display / Roblox Username</label>
                    <input 
                      type="text" 
                      value={robloxUsername}
                      onChange={e => setRobloxUsername(e.target.value)}
                      className="w-full bg-[#111] border border-[#222] rounded px-4 py-3 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors"
                    />
                    <p className="text-[10px] text-white/30 mt-2">This is used to fetch your Roblox avatar if no custom profile picture is set.</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2">Biography</label>
                    <textarea 
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={4}
                      className="w-full bg-[#111] border border-[#222] rounded px-4 py-3 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-2">Avatar URL</label>
                    <input 
                      type="text" 
                      value={user?.profilePicture || ""}
                      onChange={e => updateProfilePicture(e.target.value)}
                      placeholder="Leave blank for Roblox ID fallback"
                      className="w-full bg-[#111] border border-[#222] rounded px-4 py-3 text-sm text-white focus:border-[#D4AF37] outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-3">Theme Color</label>
                    <div className="flex gap-4 flex-wrap">
                      {["#D4AF37", "#4ade80", "#60a5fa", "#c084fc", "#f87171", "#eab308", "#2dd4bf"].map(color => (
                        <button
                          key={color}
                          onClick={() => setThemeColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${themeColor === color ? "border-white scale-110 shadow-lg" : "border-transparent"}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="pt-6">
                    <button onClick={handleSave} className="flex items-center gap-2 text-[10px] uppercase tracking-widest bg-[#D4AF37] text-black px-8 py-3 rounded font-bold hover:bg-white transition-colors">
                      <Save size={14} />
                      Save Settings
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 max-w-2xl">
                <h3 className="text-sm uppercase tracking-widest text-white/70 mb-6">Privacy & Security</h3>
                <div className="space-y-4">
                  <div className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222]">
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-white/90">Public Profile</h4>
                        <p className="text-xs text-white/40">Master toggle for your public presence.</p>
                      </div>
                      <button 
                        onClick={() => setIsPublic(!isPublic)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${isPublic ? "bg-[#D4AF37]" : "bg-[#333]"}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${isPublic ? "left-7" : "left-1"}`} />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-white/90">Show Portfolio</h4>
                        <p className="text-xs text-white/40">Display your creations on your public page.</p>
                      </div>
                      <button 
                        onClick={() => setShowPortfolio(!showPortfolio)}
                        disabled={!isPublic}
                        className={`w-12 h-6 rounded-full relative transition-colors ${showPortfolio && isPublic ? "bg-[#D4AF37]" : "bg-[#333]"} ${!isPublic && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${showPortfolio && isPublic ? "left-7" : "left-1"}`} />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-white/90">Show Statistics</h4>
                        <p className="text-xs text-white/40">Display your studio hours and commit counts.</p>
                      </div>
                      <button 
                        onClick={() => setShowStats(!showStats)}
                        disabled={!isPublic}
                        className={`w-12 h-6 rounded-full relative transition-colors ${showStats && isPublic ? "bg-[#D4AF37]" : "bg-[#333]"} ${!isPublic && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${showStats && isPublic ? "left-7" : "left-1"}`} />
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-white/90">Show Badges</h4>
                        <p className="text-xs text-white/40">Display your studio achievements publicly.</p>
                      </div>
                      <button 
                        onClick={() => setShowBadges(!showBadges)}
                        disabled={!isPublic}
                        className={`w-12 h-6 rounded-full relative transition-colors ${showBadges && isPublic ? "bg-[#D4AF37]" : "bg-[#333]"} ${!isPublic && 'opacity-50 cursor-not-allowed'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${showBadges && isPublic ? "left-7" : "left-1"}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-white/90">Two-Factor Authentication</h4>
                      <p className="text-xs text-white/40">Add an extra layer of security to your studio account.</p>
                    </div>
                    <button className="text-[10px] uppercase tracking-widest border border-[#333] hover:border-[#D4AF37] hover:text-[#D4AF37] text-white px-6 py-2 rounded transition-colors self-start sm:self-auto">
                      Enable
                    </button>
                  </div>

                  <div className="bg-[#111] border border-[#222] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-white/90">Activity Status</h4>
                      <p className="text-xs text-white/40">Show when you are active in Roblox Studio.</p>
                    </div>
                    <button 
                      onClick={() => {}}
                      className={`w-12 h-6 rounded-full relative transition-colors bg-[#D4AF37]`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all left-7`} />
                    </button>
                  </div>

                  <div className="bg-[#111] border border-red-500/20 rounded-xl p-6 mt-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                    <h4 className="text-sm font-medium text-red-500 mb-2">Danger Zone</h4>
                    <p className="text-xs text-white/40 mb-5 max-w-md leading-relaxed">Permanently delete your account and all associated studio data. This action cannot be undone.</p>
                    <button className="text-[10px] uppercase tracking-widest bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 px-6 py-3 rounded transition-colors font-bold">
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
