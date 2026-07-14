import React from "react";
import { motion } from "motion/react";
import { CMS_DATA } from "../data";

export function ProjectsPage() {
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
          Our Experiences
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-serif italic tracking-tighter leading-[0.9] mb-8"
        >
          Active Projects
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm leading-relaxed opacity-50 font-light tracking-wide max-w-xl mb-12"
        >
          Explore the immersive roleplay environments developed by XPR Studio.
          Each project offers a unique setting, custom mechanics, and a
          dedicated community.
        </motion.p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {CMS_DATA.experiences.map((exp, i) => (
          <motion.div
            key={exp.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.4 + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`relative p-8 rounded-2xl overflow-hidden group border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500`}
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-br ${exp.grad}`}
            ></div>
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-4xl mb-6">{exp.icon}</span>
              <h3 className="text-2xl font-serif italic mb-4 text-white/90 group-hover:text-white transition-colors">
                {exp.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-light mb-8 flex-1">
                {exp.desc}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/10 rounded-full text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
