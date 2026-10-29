import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Image as ImageIcon, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  {
    name: "Scout Reg.",
    url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Tactical Cadet",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Garrison Officer",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Cyberpunk Blade",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Wall Sentinel",
    url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80",
  },
  {
    name: "Commander",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  },
];

export function AvatarModal({ isOpen, onClose }: AvatarModalProps) {
  const { user, updateProfilePicture } = useAuth();
  const { addToast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(user?.profilePicture || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarUrl.trim()) return;
    setSubmitting(true);
    try {
      await updateProfilePicture(avatarUrl.trim());
      addToast("Profile avatar updated successfully.", "success");
      onClose();
    } catch {
      addToast("Failed to update avatar.", "error");
    } finally {
      setSubmitting(false);
    }
  };

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
            className="w-full max-w-md bg-[#0C0C0C] border border-[#222] p-8 relative overflow-hidden rounded-lg shadow-2xl"
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60"></div>

            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                <ImageIcon size={18} />
              </div>
              <div>
                <h3 className="text-lg font-serif italic text-white/95">Change Avatar</h3>
                <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                  Custom URL or Preset Selection
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-4 mb-6 p-3 bg-[#111] border border-[#222] rounded-md">
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/shapes/svg?seed=${user?.name || "Player"}`}
                alt="Avatar Preview"
                className="w-14 h-14 rounded-full border border-[#D4AF37]/40 object-cover bg-black"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/shapes/svg?seed=fallback`;
                }}
              />
              <div className="flex-1">
                <span className="text-xs font-bold text-white/80 block">{user?.name || "Player"}</span>
                <span className="text-[10px] text-[#D4AF37] font-mono">Live Preview</span>
              </div>
            </div>

            {/* Presets */}
            <div className="mb-6">
              <label className="text-[9px] uppercase tracking-widest text-white/40 font-mono mb-2 block">
                Quick Select Preset:
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    title={preset.name}
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`relative rounded-md overflow-hidden border transition-all ${
                      avatarUrl === preset.url
                        ? "border-[#D4AF37] scale-105 shadow-[0_0_8px_#D4AF37]"
                        : "border-[#333] hover:border-white/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-10 object-cover" />
                    {avatarUrl === preset.url && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[#D4AF37]">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="text-[9px] uppercase tracking-widest text-white/40 font-mono mb-1.5 block">
                  Image URL:
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="w-full bg-[#111] border border-[#333] text-xs p-3 rounded outline-none focus:border-[#D4AF37] text-white transition-colors"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-[10px] uppercase tracking-widest border border-[#333] text-white/60 hover:text-white hover:bg-white/5 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 text-[10px] uppercase tracking-widest bg-[#D4AF37] text-black font-bold hover:bg-[#c5a230] rounded transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Avatar"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
