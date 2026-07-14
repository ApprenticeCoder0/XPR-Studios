import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Map as MapIcon,
  Home,
  IdCard,
  Network,
  List,
  Users,
  HelpCircle,
  Gavel,
  Search,
  Menu,
  X,
  User as UserIcon,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "dashboard", label: "Dashboard", icon: UserIcon },
  { id: "map", label: "Map", icon: MapIcon },
  { id: "about", label: "About", icon: IdCard },
  { id: "projects", label: "Projects", icon: Network },
  { id: "blog", label: "Blog", icon: List },
  { id: "community", label: "Community", icon: Users },
  { id: "support", label: "Support", icon: HelpCircle },
  { id: "bans", label: "Bans", icon: Gavel },
  { id: "wiki", label: "Wiki", icon: Search },
];

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "m" || e.key === "M") {
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="hidden lg:flex items-center gap-8">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 transition-all duration-300 relative ${
                isActive
                  ? "text-[#D4AF37] font-bold"
                  : "text-white/60 hover:text-white/90 font-medium"
              }`}
            >
              <Icon
                size={14}
                className={isActive ? "text-[#D4AF37]" : "opacity-70"}
              />
              <span className="text-[10px] tracking-[0.2em] uppercase">
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-6 left-0 right-0 h-[2px] bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <button
        className="lg:hidden text-white/80 hover:text-[#D4AF37] transition-colors p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-[#0C0C0C]/95 backdrop-blur-xl border-b border-[#1A1A1A] flex flex-col py-4 z-40 shadow-2xl lg:hidden"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-4 px-8 py-4 transition-colors ${
                    isActive
                      ? "bg-[#111] border-l-2 border-[#D4AF37] text-[#D4AF37]"
                      : "text-white/60 hover:bg-[#111] hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-[#D4AF37]" : "opacity-70"}
                  />
                  <span className="text-xs tracking-[0.2em] uppercase">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
