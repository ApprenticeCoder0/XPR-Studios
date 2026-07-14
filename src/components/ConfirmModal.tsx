import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  destructive = false,
  countdownSeconds = 3,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  destructive?: boolean;
  countdownSeconds?: number;
}) {
  const [countdown, setCountdown] = useState(countdownSeconds);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(countdownSeconds);
      return;
    }
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown, countdownSeconds]);

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="w-full max-w-md bg-[#0C0C0C] border border-[#222] p-8 relative overflow-hidden"
          >
            {destructive && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80"></div>
            )}
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${destructive ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'}`}>
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-xl font-serif italic text-white/90">{title}</h3>
            </div>

            <p className="text-sm text-white/60 mb-8 leading-relaxed">
              {description}
            </p>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-[10px] uppercase tracking-widest border border-[#333] hover:bg-white/5 transition-colors rounded"
              >
                Cancel
              </button>
              <button
                disabled={countdown > 0}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3 text-[10px] uppercase tracking-widest rounded transition-all duration-300 font-bold ${
                  countdown > 0 
                    ? 'bg-[#222] text-white/30 cursor-not-allowed' 
                    : destructive 
                      ? 'bg-red-500 text-black hover:bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                      : 'bg-[#D4AF37] text-black hover:bg-[#c5a230] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                }`}
              >
                {countdown > 0 ? `Wait (${countdown}s)` : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
