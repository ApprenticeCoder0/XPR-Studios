import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { useToast } from "./ToastContext";

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  desc: string;
  unlockedAt?: number;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_login", icon: "🚀", name: "Pioneer", desc: "Joined the Developer Hub" },
  { id: "explorer", icon: "🗺️", name: "Explorer", desc: "Navigated through the platform" },
  { id: "social", icon: "👥", name: "Social Butterfly", desc: "Visited the Community section" },
  { id: "lore", icon: "📚", name: "Lore Master", desc: "Accessed the Studio Wiki" },
  { id: "map", icon: "📍", name: "Cartographer", desc: "Opened the interactive Map" },
  { id: "rules", icon: "⚖️", name: "Law Abiding", desc: "Checked the Bans / Rules section" },
  { id: "bug_squasher", icon: "🐛", name: "Bug Squasher", desc: "Found 10+ critical bugs" },
  { id: "builder", icon: "🛠️", name: "Builder", desc: "100+ Studio Commits" },
];

interface AchievementContextType {
  unlockedIds: string[];
  unlockAchievement: (id: string) => void;
  trackNavigation: (view: string) => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider = ({ children }: { children: ReactNode }) => {
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("studio_achievements");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const unlockedRef = useRef<Set<string>>(new Set(unlockedIds));
  const [visitedViews, setVisitedViews] = useState<string[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("studio_achievements", JSON.stringify(unlockedIds));
    } catch {}
  }, [unlockedIds]);

  const unlockAchievement = useCallback((id: string) => {
    if (unlockedRef.current.has(id)) return;
    unlockedRef.current.add(id);

    setUnlockedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

    const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === id);
    if (achievement) {
      // Schedule toast asynchronously outside of render phase
      setTimeout(() => {
        addToast(`Achievement Unlocked: ${achievement.name}!`, "success");
      }, 50);
    }
  }, [addToast]);

  const trackNavigation = useCallback((view: string) => {
    setVisitedViews((prev) => {
      if (prev.includes(view)) return prev;
      const next = [...prev, view];
      if (next.length >= 5) {
        setTimeout(() => unlockAchievement("explorer"), 50);
      }
      return next;
    });

    if (view === "dashboard") setTimeout(() => unlockAchievement("first_login"), 50);
    if (view === "community") setTimeout(() => unlockAchievement("social"), 50);
    if (view === "wiki") setTimeout(() => unlockAchievement("lore"), 50);
    if (view === "map") setTimeout(() => unlockAchievement("map"), 50);
    if (view === "bans") setTimeout(() => unlockAchievement("rules"), 50);
  }, [unlockAchievement]);

  return (
    <AchievementContext.Provider value={{ unlockedIds, unlockAchievement, trackNavigation }}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
};
