import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ServerProvider } from "./contexts/ServerContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AchievementProvider } from "./contexts/AchievementContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <AchievementProvider>
      <AuthProvider>
      <ServerProvider>
        <App />
      </ServerProvider>
    </AuthProvider>
      </AchievementProvider>
    </ToastProvider>
  </StrictMode>,
);
