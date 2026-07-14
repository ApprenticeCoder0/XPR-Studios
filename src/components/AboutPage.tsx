import React, { useState } from "react";

import { motion } from "motion/react";
import { CMS_DATA } from "../data";

export function AboutPage() {
  const { about, team } = CMS_DATA;

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
          Who We Are
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-serif italic tracking-tighter leading-[0.9] mb-8 whitespace-pre-line"
        >
          {about.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl"
        >
          <p className="text-sm leading-relaxed opacity-50 font-light tracking-wide mb-6 text-xl">
            {about.subtitle}
          </p>
          <div className="space-y-4 text-sm leading-relaxed opacity-70 font-light">
            <p>{about.p1}</p>
            <p>{about.p2}</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-20 border-t border-[#1A1A1A] pt-20"
      >
        <h3 className="text-3xl font-serif italic mb-12">Our Structure</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((role, i) => (
            <div
              key={role.name}
              className="bg-[#111] border border-[#222] rounded-xl p-6 hover:border-[#D4AF37]/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{role.icon}</span>
                <span
                  className={`text-[9px] uppercase tracking-wider px-2 py-1 rounded ${role.tagClass}`}
                >
                  {role.tag}
                </span>
              </div>
              <h4 className="text-lg font-medium text-white/90 mb-2">
                {role.name}
              </h4>
              <p className="text-xs text-white/50 leading-relaxed font-light">
                {role.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-20 border-t border-[#1A1A1A] pt-20"
      >
        <h3 className="text-3xl font-serif italic mb-12">Frequently Asked Questions</h3>
        <div className="max-w-3xl flex flex-col">
          <FAQItem q="What is XPR Studio?" a="XPR Studio is a procedurally simulated universe with real-time economies, territorial conquest, and unlimited progression." />
          <FAQItem q="Is the game free to play?" a="Yes! While we offer premium store credits for cosmetics, the core game is entirely free to play." />
          <FAQItem q="How does permadeath work?" a="Permadeath is absolute. When your character dies, they are gone forever, along with their non-banked inventory. You can appeal a permadeath ticket if you suspect foul play." />
          <FAQItem q="Where can I report a rule-breaker?" a="Use the Support section to open a 'Report a user' ticket. Our staff will investigate immediately." />
        </div>
      </motion.div>
    </motion.div>
  );
}


function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#222] py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none"
      >
        <h4 className="text-sm font-medium text-white/90">{q}</h4>
        <span className="text-[#D4AF37] text-xl font-mono">{isOpen ? "-" : "+"}</span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="text-xs text-white/50 leading-relaxed font-light mt-4 pb-2">{a}</p>
      </motion.div>
    </div>
  );
}
