import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Book,
  Shield,
  Gavel,
  Users,
  Info,
  ChevronRight,
  FileText,
} from "lucide-react";

const WIKI_CATEGORIES = [
  { id: "getting-started", label: "Getting Started", icon: Book },
  { id: "rules", label: "Server Rules", icon: Gavel },
  { id: "factions", label: "Factions & Jobs", icon: Users },
  { id: "mechanics", label: "Game Mechanics", icon: Info },
  { id: "staff", label: "Staff & Moderation", icon: Shield },
];

const WIKI_ARTICLES: Record<string, { title: string; content: string }[]> = {
  "getting-started": [
    {
      title: "How to Join the Server",
      content:
        "To join, you must first link your Discord account. Download the required mods, then use the connection IP provided in the verified channel.",
    },
    {
      title: "Creating Your First Character",
      content:
        "Character creation requires a valid backstory. Please avoid using famous names or copyrighted characters. Approval usually takes less than 24 hours.",
    },
    {
      title: "Basic Keybinds",
      content:
        "F1: Phone, F2: Inventory, K: Seatbelt, X: Hands Up, T: Chat/Commands. You can rebind these in the game settings menu under FiveM.",
    },
  ],
  rules: [
    {
      title: "RDM and VDM",
      content:
        "Random Death Match (killing without roleplay reason) and Vehicle Death Match (using vehicles as weapons without valid RP) are strictly prohibited and lead to permanent bans.",
    },
    {
      title: "New Life Rule (NLR)",
      content:
        "If you die (respawn at hospital), you forget the events leading up to your death and cannot return to the scene for 30 minutes.",
    },
    {
      title: "Fail RP",
      content:
        "Doing unrealistic things your character wouldn't do (e.g. jumping off a 4 story building and running away) is considered Fail RP.",
    },
  ],
  factions: [
    {
      title: "Survey Corps",
      content:
        "The Survey Corps fights titans outside the walls. To join, you must pass the Trainee Corps.",
    },
    {
      title: "Garrison",
      content:
        "The Garrison protects the walls and maintains order in the cities.",
    },
    {
      title: "Military Police",
      content:
        "The Military Police oversees the interior and protects the King. Strict entry requirements.",
    },
  ],
  mechanics: [
    {
      title: "Economy & Banking",
      content:
        "Money can be earned through legal jobs or illegal activities. Keep your money in the bank; cash on hand can be robbed.",
    },
    {
      title: "Inventory System",
      content:
        "We use a slot-based inventory. Drag and drop items. Weight limits apply based on your character's strength.",
    },
  ],
  staff: [
    {
      title: "Reporting Players",
      content:
        "Use the /report command in-game or open a ticket on the dashboard for rule breaks. Always provide video evidence.",
    },
    {
      title: "Staff Applications",
      content:
        "Applications open on the 1st of every month. You must have a clean record for 60 days to apply.",
    },
  ],
};

export function WikiPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("getting-started");
  const [activeArticle, setActiveArticle] = useState<number | null>(null);

  const articles = WIKI_ARTICLES[activeCat] || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-12 sm:p-24 max-w-7xl mx-auto w-full flex flex-col"
    >
      <div className="flex flex-col mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8 flex items-center gap-4"
        >
          <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
          Knowledge Base
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl font-serif italic tracking-tighter leading-[0.9]"
          >
            Official Wiki
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full md:w-80"
          >
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111] border border-[#333] focus:border-[#D4AF37] outline-none rounded-lg py-3 px-4 pl-10 text-sm text-white placeholder-white/30 transition-colors"
            />
            <Search
              size={16}
              className="absolute left-4 top-3.5 text-white/30"
            />
          </motion.div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-1 flex flex-col gap-2"
        >
          <h3 className="text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4 font-mono">
            Categories
          </h3>
          {WIKI_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCat(cat.id);
                  setActiveArticle(null);
                }}
                className={`flex items-center gap-3 p-3 text-sm rounded-lg transition-all text-left ${isActive ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30" : "bg-[#111] border border-[#222] text-white/60 hover:text-white hover:border-[#333]"}`}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="lg:col-span-3 bg-[#111] border border-[#222] rounded-xl p-8"
        >
          <AnimatePresence mode="wait">
            {activeArticle === null ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-serif italic text-white/90 mb-6">
                  {WIKI_CATEGORIES.find((c) => c.id === activeCat)?.label}
                </h3>
                {articles.map((article, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveArticle(i)}
                    className="w-full text-left bg-[#1a1a1a] border border-[#333] hover:border-[#D4AF37]/50 p-5 rounded-lg flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center text-white/40 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-colors">
                        <FileText size={18} />
                      </div>
                      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                        {article.title}
                      </span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-white/30 group-hover:text-[#D4AF37] transition-colors"
                    />
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="article"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <button
                  onClick={() => setActiveArticle(null)}
                  className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors flex items-center gap-2 mb-8 self-start bg-[#D4AF37]/10 px-3 py-1.5 rounded-sm"
                >
                  <ChevronRight size={12} className="rotate-180" /> Back to
                  Category
                </button>

                <h1 className="text-3xl font-serif italic text-white mb-6 leading-tight">
                  {articles[activeArticle].title}
                </h1>
                <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed space-y-4 font-light">
                  <p>{articles[activeArticle].content}</p>
                </div>

                <div className="mt-12 pt-6 border-t border-[#222] flex items-center justify-between text-[10px] uppercase tracking-widest font-mono text-white/30">
                  <span>Last updated: July 2026</span>
                  <span>
                    Category:{" "}
                    {WIKI_CATEGORIES.find((c) => c.id === activeCat)?.label}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
