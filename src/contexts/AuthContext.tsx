import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";
import { auth, syncUserProfile, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateProfilePicture: (url: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Derive default role if email matches special keywords
        let defaultRole = UserRole.USER;
        if (firebaseUser.email?.toLowerCase().includes("admin")) {
          defaultRole = UserRole.ADMIN;
        } else if (firebaseUser.email?.toLowerCase().includes("staff")) {
          defaultRole = UserRole.STAFF_INITIATE;
        }

        try {
          const profile = await syncUserProfile(firebaseUser, defaultRole);
          setUser(profile);
        } catch (e) {
          console.warn("Failed to load user profile:", e);
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Player",
            email: firebaseUser.email || "",
            role: defaultRole,
            profilePicture: firebaseUser.photoURL || undefined,
          });
        }
      } else {
        setUser((prev) => (prev?.id.startsWith("mock-") ? prev : null));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out error:", e);
    }
    setUser(null);
  };

  const updateProfilePicture = async (url: string) => {
    if (user) {
      setUser({ ...user, profilePicture: url });
      try {
        if (!user.id.startsWith("mock-")) {
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, { profilePicture: url });
        }
      } catch (err) {
        console.warn("Could not save profile picture to Firestore:", err);
      }
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      try {
        if (!user.id.startsWith("mock-")) {
          const userRef = doc(db, "users", user.id);
          await updateDoc(userRef, data);
        }
      } catch (err) {
        console.warn("Could not update profile in Firestore:", err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateProfilePicture,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
