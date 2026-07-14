import React from "react";
import { UserRole } from "../types";

export function RoleBadge({ role }: { role: UserRole }) {
  if (role < UserRole.STAFF_INITIATE) return null;

  let color = "";
  let label = "";
  let glow = "";

  switch (role) {
    case UserRole.ADMIN:
      color = "text-red-500 border-red-500/50 bg-red-500/10";
      glow = "shadow-[0_0_10px_rgba(239,68,68,0.3)]";
      label = "DIRECTOR";
      break;
    case UserRole.STAFF_HEAD:
      color = "text-[#D4AF37] border-[#D4AF37]/50 bg-[#D4AF37]/10";
      glow = "shadow-[0_0_10px_rgba(212,175,55,0.3)]";
      label = "HEAD STAFF";
      break;
    case UserRole.STAFF_EXECUTIVE:
      color = "text-purple-400 border-purple-400/50 bg-purple-400/10";
      glow = "shadow-[0_0_10px_rgba(192,132,252,0.3)]";
      label = "EXEC STAFF";
      break;
    case UserRole.STAFF_SENIOR:
      color = "text-gray-300 border-gray-400/50 bg-gray-400/10";
      glow = "shadow-[0_0_10px_rgba(156,163,175,0.3)]";
      label = "SENIOR STAFF";
      break;
    case UserRole.STAFF_INITIATE:
      color = "text-orange-500 border-orange-500/50 bg-orange-500/10";
      glow = "shadow-[0_0_10px_rgba(249,115,22,0.3)]";
      label = "INITIATE";
      break;
    default:
      return null;
  }

  return (
    <span className={`text-[8px] sm:text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${color} ${glow} whitespace-nowrap`}>
      {label}
    </span>
  );
}
