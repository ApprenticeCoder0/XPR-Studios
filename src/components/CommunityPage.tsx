import React from "react";
import { motion } from "motion/react";
import { CMS_DATA } from "../data";
import { ExternalLink } from "lucide-react";

export function CommunityPage() {
  const { rules } = CMS_DATA;

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
          Community Hub
        </motion.div>

        
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-serif italic tracking-tighter leading-[0.9] mb-8"
        >
          Community Creations & Events
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap gap-6 mb-16"
        >
          <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] px-8 py-4 bg-[#D4AF37] text-black font-bold hover:bg-white rounded transition-colors shadow-lg shadow-[#D4AF37]/20">
            <span>View Upcoming Events</span>
          </button>
          <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] px-8 py-4 bg-black border border-[#333] hover:border-[#D4AF37] text-white rounded transition-colors">
            <span>Roblox Group</span>
            <ExternalLink size={14} />
          </button>
        </motion.div>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-10 border-t border-[#1A1A1A] pt-20"
      >
        <h3 className="text-3xl font-serif italic mb-4">Community Rules</h3>
        <p className="text-sm text-white/50 font-light mb-12 max-w-2xl">
          By participating in XPR Studio experiences and platforms, you agree to
          adhere to these foundational rules. Ignorance of the rules is not an
          excuse for breaking them.
        </p>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {rules.map((rule, i) => (
            <div key={rule.num} className="group">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-xl font-serif italic text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors">
                  {rule.num}.
                </span>
                <h4 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">
                  {rule.title}
                </h4>
              </div>
              <p className="text-sm text-white/50 leading-relaxed font-light pl-10">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
