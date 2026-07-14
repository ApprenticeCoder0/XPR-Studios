import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
    const saved = localStorage.getItem("studio_achievements");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [visitedViews, setVisitedViews] = useState<string[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem("studio_achievements", JSON.stringify(unlockedIds));
  }, [unlockedIds]);

  const unlockAchievement = (id: string) => {
    setUnlockedIds(prev => {
      if (!prev.includes(id)) {
        const achievement = ALL_ACHIEVEMENTS.find(a => a.id === id);
        if (achievement) {
          addToast(`Achievement Unlocked: ${achievement.name}!`, "success");
        }
        return [...prev, id];
      }
      return prev;
    });
  };

  const trackNavigation = (view: string) => {
    setVisitedViews(prev => {
      const next = prev.includes(view) ? prev : [...prev, view];
      
      // Check for explorer
      if (next.length >= 5) {
        // use a timeout to avoid setting state while rendering if called during render, though usually it's in a handler
        setTimeout(() => unlockAchievement("explorer"), 0);
      }
      
      return next;
    });

    if (view === "dashboard") setTimeout(() => unlockAchievement("first_login"), 0);
    if (view === "community") setTimeout(() => unlockAchievement("social"), 0);
    if (view === "wiki") setTimeout(() => unlockAchievement("lore"), 0);
    if (view === "map") setTimeout(() => unlockAchievement("map"), 0);
    if (view === "bans") setTimeout(() => unlockAchievement("rules"), 0);
  };

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
