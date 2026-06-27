import { AnimatePresence, motion, useInView } from 'motion/react';
import { Command, X } from 'lucide-react';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CMS_DATA } from './data';

export default function App() {
  const [view, setView] = useState<'landing' | 'support'>('landing');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#E5E5E5] font-sans flex flex-col">
      {/* Topbar */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-20 px-6 sm:px-12 flex items-center justify-between border-b border-[#1A1A1A] bg-[#0C0C0C]/80 backdrop-blur-md sticky top-0 z-50"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setView('landing')}
        >
          <div className="w-3 h-3 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37] group-hover:shadow-[0_0_15px_#D4AF37] transition-shadow duration-500"></div>
          <h1 className="text-xs font-bold tracking-[0.4em] uppercase text-[#D4AF37] group-hover:text-white transition-colors duration-500">
            XPR Studio
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsLoginOpen(true)}
            className="text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 border border-[#333] rounded-full hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all duration-500 flex items-center gap-2"
          >
            Sign In
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView(view === 'landing' ? 'support' : 'landing')}
            className="text-[10px] uppercase tracking-[0.2em] px-5 py-2.5 border border-[#333] rounded-full hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-all duration-500 flex items-center gap-2 bg-[#111]"
          >
            {view === 'landing' ? 'Portal' : 'Back to Studio'}
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <LandingPage key="landing" onGoToSupport={() => setView('support')} />
          ) : (
            <SupportPortal key="support" onOpenLogin={() => setIsLoginOpen(true)} />
          )}
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
        <div className="hover:text-white transition-colors duration-300">© 2025 XPR Studio. All rights reserved.</div>
      </motion.footer>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && <AuthModal onClose={() => setIsLoginOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<'login' | 'register' | 'forgot_password'>('login');

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

        <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8 text-center flex flex-col items-center gap-4">
           <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
             <div className="w-2 h-2 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37]"></div>
           </div>
           {view === 'login' && 'Authentication'}
           {view === 'register' && 'Registration'}
           {view === 'forgot_password' && 'Password Reset'}
        </div>

        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          
          <AnimatePresence mode="popLayout">
            {view === 'register' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2 overflow-hidden"
              >
                <label className="text-[9px] uppercase tracking-[0.2em] opacity-50 pt-2">Full Name</label>
                <input type="text" required placeholder="Enter your name" className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors text-white placeholder-white/20" />
              </motion.div>
            )}
            {view === 'forgot_password' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs opacity-70 text-center pb-2 leading-relaxed"
              >
                Enter your email address and we will send you a link to reset your password.
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">Email</label>
            <input type="email" required placeholder="Enter your email" className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors text-white placeholder-white/20" />
          </div>

          <AnimatePresence mode="popLayout">
            {view !== 'forgot_password' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2 overflow-hidden"
              >
                <div className="flex justify-between items-center pt-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">Password</label>
                  {view === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setView('forgot_password')}
                      className="text-[9px] uppercase tracking-[0.1em] text-[#D4AF37] opacity-70 hover:opacity-100 transition-opacity"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input type="password" required placeholder="Enter your password" className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors text-white placeholder-white/20" />
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="text-[10px] uppercase tracking-[0.2em] px-8 py-4 border border-[#D4AF37] text-black bg-[#D4AF37] hover:bg-[#c5a230] transition-colors mt-4 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            {view === 'login' && 'Sign In'}
            {view === 'register' && 'Create Account'}
            {view === 'forgot_password' && 'Send Reset Link'}
          </button>
          
          <div className="text-center mt-4 border-t border-[#1A1A1A] pt-6 flex flex-col gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-[0.1em] opacity-50">
                {view === 'login' ? 'New to XPR Studio? ' : (view === 'forgot_password' ? 'Remember your password? ' : 'Already have an account? ')}
              </span>
              <button 
                type="button" 
                onClick={() => setView(view === 'login' ? 'register' : 'login')}
                className="text-[10px] uppercase tracking-[0.1em] text-[#D4AF37] hover:opacity-80 transition-colors"
              >
                {view === 'login' ? 'Create an account' : 'Sign in instead'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function LandingPage({ onGoToSupport }: { onGoToSupport: () => void; key?: React.Key }) {
  const { hero, stats, about, experiences } = CMS_DATA;

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col justify-center px-12 sm:px-24 py-20 relative overflow-hidden">
        {/* Background decorative text */}
        <motion.div 
          animate={{ y: [0, -15, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-10 -right-10 pointer-events-none"
        >
          <h1 className="text-[300px] leading-none font-serif italic select-none">X</h1>
        </motion.div>

        {/* Floating dust/particles effect (CSS radial gradient in background) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03)_0%,transparent_50%)] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#D4AF37] mb-8 flex items-center gap-4"
        >
          <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
          Roblox Game Studio
        </motion.div>
        
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl lg:text-8xl leading-[0.85] font-serif tracking-tighter italic max-w-4xl mb-12 relative z-10"
        >
          Immersive <br/> 
          <motion.span 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="ml-12 sm:ml-24 inline-block"
          >
            Roleplay
          </motion.span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md text-sm leading-relaxed opacity-50 font-light tracking-wide mb-12 relative z-10"
        >
          {hero.subtitle}
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-8 relative z-10"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500 rounded-full"
          >
            Explore our games
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoToSupport} 
            className="text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 border border-[#333] hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all duration-500 rounded-full"
          >
            Open a ticket
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl relative z-10"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="flex flex-col relative group"
            >
              <div className="absolute -inset-6 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md -z-10"></div>
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 mb-3 group-hover:opacity-100 transition-opacity duration-500 group-hover:text-[#D4AF37]">{stat.label}</span>
              <span className="text-2xl font-serif italic tracking-wide group-hover:text-white transition-colors duration-500"><ScrambleNumber text={stat.num} /></span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-32 px-12 sm:px-24 border-t border-[#1A1A1A] relative">
        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: "32px" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-[1px] bg-[#D4AF37] absolute top-32 left-12 sm:left-24"
        ></motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-16 ml-12"
        >
          About XPR Studio
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <h2 className="text-5xl sm:text-6xl font-serif italic tracking-tighter leading-[0.9]">
              {about.title}
            </h2>
            <p className="text-sm leading-relaxed opacity-50 font-light tracking-wide max-w-md">
              {about.subtitle}
            </p>
            <div className="space-y-6 pt-4 text-[11px] leading-relaxed opacity-70 font-light max-w-md">
              <p>{about.p1}</p>
              <p>{about.p2}</p>
            </div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col space-y-12"
          >
            {about.pillars.map((pillar, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="flex items-start gap-8 border-b border-[#1A1A1A] pb-8 last:border-0 group cursor-default transition-transform duration-500"
              >
                <div className="text-[#D4AF37] text-xl font-serif italic opacity-60 shrink-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500">
                  <ScrambleNumber text={`0${i + 1}`} />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold mb-3 group-hover:text-[#D4AF37] transition-colors duration-500">{pillar.title}</h3>
                  <p className="text-[10px] opacity-40 leading-relaxed max-w-xs group-hover:opacity-70 transition-opacity duration-500">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="py-32 px-12 sm:px-24 border-t border-[#1A1A1A] bg-[#111] relative overflow-hidden">
        <div className="max-w-7xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-10 flex items-center gap-4"
          >
            <span className="w-8 h-[1px] bg-[#D4AF37]/50"></span>
            Our Experiences
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl font-serif italic tracking-tighter leading-[0.9] mb-8"
          >
            Worlds worth playing
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm leading-relaxed opacity-50 font-light tracking-wide max-w-md mb-20"
          >
            Each game in our portfolio is built around a distinct theme and community ruleset.
          </motion.p>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-16"
          >
            {experiences.map((exp, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="flex flex-col group cursor-pointer transition-transform duration-500"
              >
                <div className="h-56 border border-[#222] group-hover:border-[#D4AF37]/30 bg-[#0A0A0A] relative flex items-center justify-center mb-8 overflow-hidden transition-colors duration-700">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] group-hover:opacity-30 transition-opacity duration-700"></div>
                   
                   {/* Interactive glow effect */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                   
                   <motion.div 
                     initial={{ rotate: -8, scale: 0.9 }}
                     whileHover={{ rotate: 0, scale: 1 }}
                     transition={{ duration: 0.6, ease: "easeOut" }}
                     className="w-20 h-28 border border-white/5 bg-white/5 backdrop-blur-sm z-10 flex items-center justify-center text-4xl shadow-xl"
                   >
                     {exp.icon}
                   </motion.div>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-bold mb-4 group-hover:text-[#D4AF37] transition-colors duration-500">{exp.title}</h3>
                  <p className="text-[10px] opacity-40 leading-relaxed mb-6 group-hover:opacity-70 transition-opacity duration-500">{exp.desc}</p>
                  <div className="flex flex-wrap gap-4">
                    {exp.tags.map((tag, tIdx) => (
                      <span key={tag} className="text-[9px] uppercase tracking-[0.2em] opacity-40 group-hover:opacity-80 transition-opacity duration-500" style={{ transitionDelay: `${tIdx * 100}ms` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

function SupportPortal({ onOpenLogin }: { onOpenLogin?: () => void; key?: React.Key }) {
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
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
          Welcome to <br/><span className="ml-12 sm:ml-24">Support</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm leading-relaxed opacity-50 font-light tracking-wide max-w-md"
        >
          Open a ticket, report a rule-breaker, or appeal a ban — our team handles every request personally.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-wrap gap-8"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsTicketOpen(true)}
            className="text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 rounded-full hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            Open New Ticket
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenLogin}
            className="text-[10px] uppercase tracking-[0.2em] px-8 py-3.5 border border-[#333] hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all duration-500 rounded-full"
          >
            Sign In
          </motion.button>
        </motion.div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-20 border-t border-[#1A1A1A] pt-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          <h3 className="text-xs uppercase tracking-widest font-bold mb-10 opacity-70">Categories</h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {[
              { id: 'report', label: 'Report a user' },
              { id: 'ban', label: 'Appeal your ban' },
              { id: 'pd', label: 'Permadeath' },
              { id: 'general', label: 'General' }
            ].map((c, i) => (
              <motion.button 
                whileHover={{ x: 5 }}
                key={c.id} 
                onClick={() => setIsTicketOpen(true)}
                className="text-left border-t border-[#222] pt-5 hover:border-[#D4AF37] transition-all duration-500 group flex flex-col relative"
              >
                <div className="absolute top-[-1px] left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-700 ease-out"></div>
                <span className="text-[#D4AF37] text-xl font-serif italic opacity-40 mb-5 group-hover:opacity-100 group-hover:scale-110 transform origin-left transition-all duration-500"><ScrambleNumber text={`0${i + 1}`} /></span>
                <span className="text-xs font-medium tracking-wide mb-3 group-hover:text-white transition-colors duration-500">{c.label}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] opacity-30 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all duration-500">Open Ticket ↗</span>
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
           <h3 className="text-xs uppercase tracking-widest font-bold mb-10 opacity-70">Recent Activity</h3>
           <div 
             onClick={onOpenLogin}
             className="flex flex-col items-center justify-center h-48 text-center border border-[#222] bg-[#111] hover:bg-[#151515] hover:border-[#333] transition-colors duration-500 group cursor-pointer"
           >
             <span className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-3 group-hover:opacity-60 transition-opacity duration-500 group-hover:text-[#D4AF37]">Please sign in</span>
             <span className="text-[10px] opacity-30 leading-relaxed group-hover:opacity-50 transition-opacity duration-500">Sign in to view your tickets</span>
           </div>
        </motion.div>
      </div>
    </motion.div>

    <AnimatePresence>
      {isTicketOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-[#0C0C0C] border border-[#222] p-8 sm:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
            
            <button 
              onClick={() => setIsTicketOpen(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.4em] mb-8">
               New Ticket
            </div>

            <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); setIsTicketOpen(false); }}>
              <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">Category</label>
                <select className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors appearance-none text-white/80">
                  <option>Report a user</option>
                  <option>Appeal your ban</option>
                  <option>Permadeath</option>
                  <option>General support</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">Subject</label>
                <input type="text" required placeholder="Brief description of your issue" className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors text-white placeholder-white/20" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[9px] uppercase tracking-[0.2em] opacity-50">Details</label>
                <textarea required rows={4} placeholder="Please provide as much detail as possible..." className="bg-[#111] border border-[#222] text-sm p-3 outline-none focus:border-[#D4AF37] transition-colors text-white placeholder-white/20 resize-none"></textarea>
              </div>

              <button type="submit" className="text-[10px] uppercase tracking-[0.2em] px-8 py-4 border border-[#D4AF37] text-black bg-[#D4AF37] hover:bg-[#c5a230] transition-colors mt-4">
                Submit Ticket
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

function RouletteChar({ char, delay, isInView }: { char: string, delay: number, isInView: boolean; key?: React.Key }) {
  const isAlphaNum = /[a-zA-Z0-9<>]/.test(char);
  
  const col = useMemo(() => {
    if (!isAlphaNum) return [char];
    const arr = [];
    const possible = /[0-9]/.test(char) ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let i = 0; i < 24; i++) {
       arr.push(possible[Math.floor(Math.random() * possible.length)]);
    }
    arr.push(char);
    return arr;
  }, [char, isAlphaNum]);

  if (!isAlphaNum) {
    return <span className="inline-block">{char}</span>;
  }

  return (
    <span className="inline-block h-[1em] overflow-hidden leading-none align-bottom tabular-nums">
       <motion.span
         initial={{ y: "0%" }}
         animate={isInView ? { y: `calc(-1em * ${col.length - 1})` } : { y: "0%" }}
         transition={{ duration: 2.5 + delay, ease: [0.16, 1, 0.3, 1] }}
         className="flex flex-col"
       >
         {col.map((c, i) => <span key={i} className="h-[1em] flex items-center justify-center">{c}</span>)}
       </motion.span>
    </span>
  );
}

function ScrambleNumber({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className="inline-flex tracking-tight overflow-hidden">
      {text.split("").map((char, i) => (
        <RouletteChar key={i} char={char} delay={i * 0.15} isInView={isInView} />
      ))}
    </span>
  );
}