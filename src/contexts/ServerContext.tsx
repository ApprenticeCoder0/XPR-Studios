import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Ad {
  id: number;
  tag: string;
  title: string;
  desc: string;
  image: string;
  link: string;
}

interface ServerState {
  serverLocked: boolean;
  whitelistEnforced: boolean;
  globalChatMute: boolean;
}

interface ServerContextType {
  ads: Ad[];
  setAds: React.Dispatch<React.SetStateAction<Ad[]>>;
  serverState: ServerState;
  setServerState: React.Dispatch<React.SetStateAction<ServerState>>;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider = ({ children }: { children: ReactNode }) => {
  const [ads, setAds] = useState<Ad[]>([
    {
      id: 1,
      tag: "Event",
      title: "Summer Roleplay Festival",
      desc: "Join us this weekend for double XP and exclusive in-game events in the Financial District.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
      link: "#"
    },
    {
      id: 2,
      tag: "Store",
      title: "VIP Status - 50% Off",
      desc: "Support the server and get access to priority queue, custom nametags, and exclusive vehicles.",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop",
      link: "#"
    },
    {
      id: 3,
      tag: "Update",
      title: "Patch 3.4.0 Released",
      desc: "New medical system, improved vehicle handling, and expanding the northern map sectors.",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop",
      link: "#"
    }
  ]);

  const [serverState, setServerState] = useState<ServerState>({
    serverLocked: false,
    whitelistEnforced: true,
    globalChatMute: false,
  });

  return (
    <ServerContext.Provider value={{ ads, setAds, serverState, setServerState }}>
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error("useServer must be used within a ServerProvider");
  }
  return context;
};
