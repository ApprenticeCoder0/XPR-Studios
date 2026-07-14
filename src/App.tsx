import { AnimatePresence, motion, useInView, useAnimation } from "motion/react";
import { Command, X, Shield, Upload, FileText, ArrowRight } from "lucide-react";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { CMS_DATA } from "./data";
import { InteractiveBackground } from "./components/InteractiveBackground";
import { Navigation } from "./components/Navigation";
import { StaffPanel } from "./components/StaffPanel";
import { AdminPanel } from "./components/AdminPanel";
import { BansPage } from "./components/BansPage";
import { ProjectsPage } from "./components/ProjectsPage";
import { AboutPage } from "./components/AboutPage";
import { ServerStatus } from "./components/ServerStatus";
import { UserDashboard } from "./components/UserDashboard";
import { CommunityPage } from "./components/CommunityPage";
import { BlogPage } from "./components/BlogPage";
import { WikiPage } from "./components/WikiPage";
import { useAuth } from "./contexts/AuthContext";
import { useAchievements } from "./contexts/AchievementContext";
import { useToast } from "./contexts/ToastContext";
import { useServer } from "./contexts/ServerContext";
import { LiveMap } from "./components/LiveMap";
import {
  UserRole,
  Ticket,
  TicketSituation,
  TicketGrade,
  TicketTime,
} from "./types";


function VortexText({ text }: { text: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const letters = text.split("");

  return (
    <span ref={ref} className="inline-block relative">
      {letters.map((char, index) => {
        if (char === " ")
          return (
            <span key={index} className="inline-block w-[0.3em]">
              &nbsp;
            </span>
          );

        // Random initial positions for the vortex effect
        const randomX = (Math.random() - 0.5) * 800;
        const randomY = (Math.random() - 0.5) * 800;
        const randomRotate = (Math.random() - 0.5) * 720;
        const randomScale = Math.random() * 3 + 0.5;

        return (
          <motion.span
            key={index}
            className="inline-block"
            initial={{
              opacity: 0,
              x: randomX,
              y: randomY,
              rotateZ: randomRotate,
              scale: randomScale,
              filter: "blur(10px)",
            }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotateZ: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }
                : {}
            }
            transition={{
              duration: 2.5,
              ease: [0.16, 1, 0.3, 1],
              delay: index * 0.05 + Math.random() * 0.5,
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}

function ExponentialCounter({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp: number | null = null;
    const duration = 2500; // 2.5 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentCount = Math.floor(easeProgress * target);
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, target]);

  if (count === target) {
    return (
      <span ref={ref}>
        {target >= 1000 ? `${Math.floor(target / 1000)}K` : target}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className="tabular-nums font-mono">
      {count.toLocaleString()}
    </span>
  );
}

function AnimatedStat({ text }: { text: string }) {
  // Check if it's "50K+"
  if (text === "50K+") return <ExponentialCounter target={50000} suffix="+" />;
  // Check if it's "3"
  if (text === "3") return <ExponentialCounter target={3} suffix="" />;

  // For normal text like "<2h" or "N:H"
  return (
    <motion.span
      initial={{ opacity: 0, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      {text}
    </motion.span>
  );
}


export default function App() {
  const [view, setView] = useState("home");
  const { trackNavigation } = useAchievements();

  useEffect(() => {
    trackNavigation(view);
  }, [view, trackNavigation]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout, updateProfilePicture } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#E5E5E5] font-sans flex flex-col">
      {/* Unified Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-20 px-6 sm:px-12 flex items-center justify-between border-b border-[#1A1A1A] bg-[#0C0C0C]/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView("home")}
        >
          <div className="w-3 h-3 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37] group-hover:shadow-[0_0_15px_#D4AF37] transition-shadow duration-500"></div>
          <h1 className="text-xs font-bold tracking-[0.4em] uppercase text-[#D4AF37] group-hover:text-white transition-colors duration-500">
            XPR Studio
          </h1>
        </motion.div>

        <Navigation currentView={view} onNavigate={setView} />

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {user.profilePicture && (
                <img
                  onClick={() => {
                    const url = window.prompt("Enter new profile picture URL:");
                    if (url) updateProfilePicture(url);
                  }}
                  style={{ cursor: "pointer" }}
                  title="Change Profile Picture"
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-[#333]"
                />
              )}
              <span className="text-[10px] uppercase tracking-[0.1em] text-white/70 hidden sm:inline-block">
                {user.name} ({UserRole[user.role]})
              </span>
              {user.role >= UserRole.STAFF_INITIATE && user.role < UserRole.ADMIN && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView("staff")}
                  className="text-[10px] uppercase tracking-[0.2em] px-4 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/10 transition-all duration-500"
                >
                  Staff Panel
                </motion.button>
              )}
              {user.role >= UserRole.ADMIN && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView("admin")}
                  className="text-[10px] uppercase tracking-[0.2em] px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500/10 transition-all duration-500"
                >
                  Admin Panel
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="text-[10px] uppercase tracking-[0.2em] px-4 py-2 border border-[#333] rounded-full hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-500 transition-all duration-500"
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsLoginOpen(true)}
              className="text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 border border-[#333] rounded-full hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all duration-500 flex items-center gap-2"
            >
              Sign In
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          {(() => {
            switch (view) {
              case "dashboard":
                return <UserDashboard key="dashboard" onNavigate={setView} />;
              case "home":
                return <LandingPage key="landing" onNavigate={setView} />;
              case "support":
                return (
                  <SupportPortal
                    key="support"
                    onOpenLogin={() => setIsLoginOpen(true)}
                  />
                );
              case "bans":
                return <BansPage key="bans" />;
              case "staff":
                return <StaffPanel key="staff" />;
              case "admin":
                return <AdminPanel key="admin" />;
              case "projects":
                return <ProjectsPage key="projects" />;
              case "about":
                return <AboutPage key="about" />;
              case "community":
                return <CommunityPage key="community" />;
              case "blog":
                return <BlogPage key="blog" />;
              case "wiki":
                return <WikiPage key="wiki" />;
              default:
                return (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-center min-h-[60vh]"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-serif italic text-white/50 mb-4">
                        Module Offline
                      </h2>
                      <p className="text-white/30 text-sm max-w-md mx-auto">
                        This section is currently undergoing maintenance or has
                        not been deployed to this environment.
                      </p>
                    </div>
                  </motion.div>
                );
            }
          })()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-24 border-t border-[#1A1A1A] px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-[9px] uppercase tracking-[0.3em] opacity-40"
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-0 hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_5px_#D4AF37]"></div>
          <span>XPR Studio</span>
        </div>
        <div className="hover:text-white transition-colors duration-300">
          © 2025 XPR Studio. All rights reserved.
        </div>
      </motion.footer>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && <AuthModal onClose={() => setIsLoginOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}


function AuthModal({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"login" | "register" | "forgot_password">("login");
  const [email, setEmail] = useState("");
  const { login } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    let role = UserRole.USER;
    if (email.includes("staff")) role = UserRole.STAFF_INITIATE;
    if (email.includes("admin")) role = UserRole.ADMIN;
    
    login({
      id: Math.random().toString(36).substring(7),
      name: email.split("@")[0],
      email,
      role,
    });
    addToast("Logged in successfully", "success");
    onClose();
  };

  return (
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
        className="w-full max-w-md bg-[#0C0C0C] border border-[#222] p-8 sm:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8">
          Authentication
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">Email</label>
            <input 
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="player@example.com"
              className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">Password</label>
            <input 
              required
              type="password"
              placeholder="••••••••"
              className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors text-white"
            />
          </div>
          <button
            type="submit"
            className="text-[10px] uppercase tracking-[0.2em] px-8 py-4 bg-[#D4AF37] text-black font-bold hover:bg-white transition-colors mt-4"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addToast("Successfully subscribed to the newsletter!", "success");
    setEmail("");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      onSubmit={handleSubscribe}
      className="flex w-full max-w-md gap-4"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 bg-[#111] border border-[#222] text-sm px-4 py-3 outline-none focus:border-[#D4AF37] transition-colors text-white"
        required
      />
      <button
        type="submit"
        className="text-[10px] uppercase tracking-[0.2em] px-8 py-3 bg-[#D4AF37] text-black font-bold hover:bg-white transition-colors"
      >
        Subscribe
      </button>
    </motion.form>
  );
}

function LandingPage({ onNavigate }: { onNavigate: (view: string) => void; key?: React.Key; }) {
  const { hero, stats, about, experiences } = CMS_DATA;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center px-12 sm:px-24 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03)_0%,transparent_50%)] pointer-events-none"></div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#D4AF37] mb-8 flex items-center gap-4"
        >
          <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
          XPR Studio
        </motion.div>
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl lg:text-8xl leading-[0.85] font-serif tracking-tighter italic max-w-4xl mb-6 relative z-10"
        >
          <VortexText text={hero.title} />
        </motion.h1>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-base leading-relaxed opacity-70 font-light tracking-wide mb-12 relative z-10 space-y-4"
        >
          <p>{hero.subtitle}</p>
          <p className="text-sm border-l-2 border-[#D4AF37]/50 pl-4 py-1">Join thousands of players in an ever-evolving, procedurally simulated universe. Real-time economies, territorial conquest, and unlimited progression.</p>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-8 relative z-10"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("support")}
            className="text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500 rounded-full"
          >
            Open a Ticket
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate("projects")}
            className="text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 border border-[#333] hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all duration-500 rounded-full"
          >
            View Projects
          </motion.button>
          
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={CMS_DATA.socials?.discord || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/60 transition-all duration-500 rounded-full flex items-center gap-2"
          >
            Join Discord
          </motion.a>
        </motion.div>
      </section>

      {/* Community Newsletter */}
      <section className="border-t border-[#1A1A1A] py-20 px-12 sm:px-24">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#D4AF37] mb-6 flex items-center gap-4"
          >
            <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
            Stay Updated
            <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-serif italic tracking-tighter mb-6"
          >
            Community Newsletter
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm leading-relaxed opacity-50 font-light tracking-wide max-w-lg mb-10"
          >
            Subscribe to receive the latest updates, patch notes, and exclusive events directly in your inbox.
          </motion.p>

          <NewsletterForm />
        </div>
      </section>
    </motion.div>
  );
}
function SupportPortal({
  onOpenLogin,
}: {
  onOpenLogin?: () => void;
  key?: React.Key;
}) {
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const myTickets = [
    { id: "1092", title: "Ban Appeal", status: "Communication Phase", category: "ban" },
    { id: "1055", title: "RDM Report", status: "Resolved", category: "report" },
    { id: "1032", title: "Permadeath Appeal", status: "Pending", category: "pd" },
  ];

  const filteredTickets = myTickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (statusFilter === "All" || t.status === statusFilter)
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="p-12 sm:p-24 max-w-6xl mx-auto flex flex-col"
      >
        <div className="flex flex-col mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8 flex items-center gap-4"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_#D4AF37]"></span>
            Support is Online
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-serif italic tracking-tighter leading-[0.9] mb-10"
          >
            Welcome to <br />
            <span className="ml-12 sm:ml-24">Support</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm leading-relaxed opacity-50 font-light tracking-wide max-w-md"
          >
            Open a ticket, report a rule-breaker, or appeal a ban — our team
            handles every request personally.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap gap-8"
          >
            {user ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsTicketOpen(true)}
                className="text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Open New Ticket
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenLogin}
                className="text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                Sign In to Open Ticket
              </motion.button>
            )}
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-20 border-t border-[#1A1A1A] pt-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <h3 className="text-xs uppercase tracking-widest font-bold mb-10 opacity-70">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
              {[
                { id: "report", label: "Report a user" },
                { id: "ban", label: "Appeal your ban" },
                { id: "pd", label: "Permadeath" },
                { id: "general", label: "General" },
              ].map((c, i) => (
                <motion.button
                  whileHover={{ x: 5 }}
                  key={c.id}
                  onClick={() =>
                    user ? setIsTicketOpen(true) : onOpenLogin?.()
                  }
                  className="text-left border-t border-[#222] pt-5 hover:border-[#D4AF37] transition-all duration-500 group flex flex-col relative"
                >
                  <div className="absolute top-[-1px] left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-700 ease-out"></div>
                  <span className="text-[#D4AF37] text-xl font-serif italic opacity-40 mb-5 group-hover:opacity-100 group-hover:scale-110 transform origin-left transition-all duration-500">
                    <ScrambleNumber text={`0${i + 1}`} />
                  </span>
                  <span className="text-xs font-medium tracking-wide mb-3 group-hover:text-white transition-colors duration-500">
                    {c.label}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] opacity-30 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all duration-500">
                    Open Ticket ↗
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col border-l border-[#1A1A1A] md:pl-20"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h3 className="text-xs uppercase tracking-widest font-bold opacity-70">
                My Tickets
              </h3>
              {user && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-[#111] border border-[#222] px-3 py-1.5 text-xs text-white rounded outline-none focus:border-[#D4AF37] w-full sm:w-32"
                  />
                  <select 
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="bg-[#111] border border-[#222] px-2 py-1.5 text-xs text-white rounded outline-none focus:border-[#D4AF37]"
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Communication Phase">Communication</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex flex-col gap-4 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <div key={ticket.id} className="border border-[#222] p-4 bg-[#111] hover:border-[#333] transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium">{ticket.title} #{ticket.id}</p>
                      </div>
                      <p className="text-[10px] text-white/50">
                        Status:{" "}
                        <span className={
                          ticket.status === 'Resolved' ? 'text-green-400' :
                          ticket.status === 'Pending' ? 'text-yellow-400' :
                          'text-blue-400'
                        }>
                          {ticket.status}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-white/40 font-mono">No tickets found.</p>
                )}
              </div>
            ) : (
              <div
                onClick={onOpenLogin}
                className="flex flex-col items-center justify-center h-48 text-center border border-[#222] bg-[#111] hover:bg-[#151515] hover:border-[#333] transition-colors duration-500 group cursor-pointer"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-3 group-hover:opacity-60 transition-opacity duration-500 group-hover:text-[#D4AF37]">
                  Please sign in
                </span>
                <span className="text-[10px] opacity-30 leading-relaxed group-hover:opacity-50 transition-opacity duration-500">
                  Sign in to view your tickets
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isTicketOpen && <TicketModal onClose={() => setIsTicketOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function TicketModal({ onClose }: { onClose: () => void }) {
  const { addToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Ticket submitted successfully. Staff will review it shortly.", "success");
    onClose();
  };

  return (
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
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8">
          New Ticket
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">
              Category
            </label>
            <select className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors appearance-none text-white/80">
              <option>Report a user</option>
              <option>Appeal your ban</option>
              <option>Permadeath</option>
              <option>General support</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">
              Subject
            </label>
            <input 
              required
              type="text"
              placeholder="Brief description of the issue"
              className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors text-white"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">
              Details
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide as much context as possible..."
              className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors text-white resize-none"
            />
          </div>
          <button
            type="submit"
            className="text-[10px] uppercase tracking-[0.2em] px-8 py-4 bg-[#D4AF37] text-black font-bold hover:bg-white transition-colors mt-4"
          >
            Submit Ticket
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ScrambleNumber({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className="inline-flex tracking-tight overflow-hidden">
      {text.split("").map((char, i) => (
        <RouletteChar
          key={i}
          char={char}
          delay={i * 0.15}
          isInView={isInView}
        />
      ))}
    </span>
  );
}

function RouletteChar({
  char,
  delay,
  isInView,
}: { char: string; delay: number; isInView: boolean; key?: React.Key; }) {
  const [display, setDisplay] = useState(char);

  useEffect(() => {
    if (!isInView) return;
    
    let iterations = 0;
    const maxIterations = 20;
    let timeout: NodeJS.Timeout;

    const tick = () => {
      if (iterations >= maxIterations) {
        setDisplay(char);
        return;
      }
      setDisplay(Math.floor(Math.random() * 10).toString());
      iterations++;
      timeout = setTimeout(tick, 30);
    };

    const initialDelay = setTimeout(tick, delay * 1000);
    return () => {
      clearTimeout(timeout);
      clearTimeout(initialDelay);
    };
  }, [char, delay, isInView]);

  return <span className="inline-block w-[0.6em] text-center">{display}</span>;
}
