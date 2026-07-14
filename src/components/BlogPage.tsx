import React from "react";
import { motion } from "motion/react";
import { Calendar, User, ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    title: "Update 2.4: The Walls Fall: Shiganshina Update",
    excerpt:
      "Explore the new Shiganshina district, fresh ODM gear mechanics, and a complete overhaul of the titan shifting system in our biggest update yet.",
    author: "XPR_Dev",
    date: "July 01, 2026",
    category: "Game Update",
    image:
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2000&auto=format&fit=crop",
    featured: true,
  },
  {
    title: "Community Spotlight: Best Regiment Moments",
    excerpt:
      "Check out the best roleplay moments from last month and see who took home the exclusive Wings of Freedom reward.",
    author: "CommunityTeam",
    date: "June 28, 2026",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop",
    featured: false,
  },
  {
    title: "Developer Insights: Enhancing Titan AI",
    excerpt:
      "A deep dive into how our engineering team rebuilt the Pure Titan AI to make outside the walls feel more dangerous than ever.",
    author: "TechLead",
    date: "June 15, 2026",
    category: "Dev Blog",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
    featured: false,
  },
];

export function BlogPage() {
  const featured = BLOG_POSTS.find((p) => p.featured);
  const others = BLOG_POSTS.filter((p) => !p.featured);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="p-12 sm:p-24 max-w-7xl mx-auto w-full flex flex-col"
    >
      <div className="flex flex-col mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8 flex items-center gap-4"
        >
          <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
          Developer Log
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-serif italic tracking-tighter leading-[0.9] mb-8"
        >
          Latest News
        </motion.h2>
      </div>

      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="group cursor-pointer relative rounded-2xl overflow-hidden h-[500px] mb-12 flex flex-col justify-end p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
        >
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10"></div>
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 mix-blend-luminosity"
            />
          </div>

          <div className="relative z-20 max-w-3xl">
            <span className="text-[10px] uppercase tracking-widest bg-[#D4AF37] text-black font-bold px-3 py-1 rounded-sm mb-4 inline-block">
              {featured.category}
            </span>
            <h3 className="text-4xl sm:text-5xl font-serif italic text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
              {featured.title}
            </h3>
            <p className="text-white/70 mb-6 text-sm leading-relaxed max-w-2xl">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-white/50 font-mono">
              <span className="flex items-center gap-2">
                <User size={12} /> {featured.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={12} /> {featured.date}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {others.map((post, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
            className="group cursor-pointer border border-[#222] bg-[#111] hover:border-[#D4AF37]/30 rounded-xl overflow-hidden transition-all hover:-translate-y-1"
          >
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
              />
            </div>
            <div className="p-8">
              <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-1 rounded-sm mb-4 inline-block">
                {post.category}
              </span>
              <h3 className="text-2xl font-serif italic text-white/90 group-hover:text-white mb-3">
                {post.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#222]">
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-white/40 font-mono">
                  <span>{post.date}</span>
                </div>
                <span className="text-[#D4AF37] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
