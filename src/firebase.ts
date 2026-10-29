import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  limit,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { Ticket, User, TicketSituation, TicketGrade, TicketTime, UserRole } from "./types";

// Official XPR Studio Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCkf_KTemBBtzNYjForVX7PE-BKYWyHSH4",
  authDomain: "xpr-studio-website.firebaseapp.com",
  databaseURL: "https://xpr-studio-website-default-rtdb.firebaseio.com",
  projectId: "xpr-studio-website",
  storageBucket: "xpr-studio-website.firebasestorage.app",
  messagingSenderId: "875608407852",
  appId: "1:875608407852:web:52a27c8c72d0fff2c4f689",
  measurementId: "G-HGMQ6K663N",
};

// Initialize Firebase App instance
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Safe Analytics initialization (only in browser environments where supported)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

export const isFirebaseConnected = true;

// ---------------------------------------------------------------------------
// TICKET SERVICES (Firestore)
// ---------------------------------------------------------------------------

export const createTicket = async (ticketData: Omit<Ticket, "id" | "createdAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "tickets"), {
      ...ticketData,
      createdAt: new Date().toISOString(),
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.warn("Firestore createTicket (offline or rules fallback):", error);
    // Return temporary client-side ID so app flow is never blocked
    return `tkt-${Date.now()}`;
  }
};

export const subscribeToTickets = (callback: (tickets: Ticket[]) => void) => {
  try {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const tickets = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: data.title || "Untitled Ticket",
              description: data.description || "",
              authorId: data.authorId || "Anonymous",
              category: data.category || "General",
              createdAt: data.createdAt || new Date().toISOString(),
              situation: (data.situation as TicketSituation) || TicketSituation.PENDING,
              grade: (data.grade as TicketGrade) || TicketGrade.NORMAL,
              time: (data.time as TicketTime) || TicketTime.NORMAL_TIME,
            } as Ticket;
          });
          callback(tickets);
        }
      },
      (error) => {
        console.warn("Firestore subscribeToTickets listener note:", error);
      }
    );
  } catch (error) {
    console.warn("Failed to subscribe to tickets:", error);
    return () => {};
  }
};

export const updateTicketStatus = async (
  ticketId: string,
  situation: TicketSituation,
  grade?: TicketGrade,
  time?: TicketTime
) => {
  try {
    const ticketRef = doc(db, "tickets", ticketId);
    const updates: Record<string, any> = { situation };
    if (grade) updates.grade = grade;
    if (time) updates.time = time;
    await updateDoc(ticketRef, updates);
  } catch (error) {
    console.warn("Firestore updateTicketStatus error:", error);
  }
};

// ---------------------------------------------------------------------------
// USER PROFILE SERVICES (Firestore & Auth)
// ---------------------------------------------------------------------------

export const syncUserProfile = async (firebaseUser: FirebaseUser, defaultRole?: UserRole): Promise<User> => {
  const userRef = doc(db, "users", firebaseUser.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        id: firebaseUser.uid,
        name: data.name || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Player",
        email: firebaseUser.email || "",
        role: typeof data.role === "number" ? data.role : (defaultRole ?? UserRole.USER),
        profilePicture: data.profilePicture || firebaseUser.photoURL || undefined,
        bio: data.bio || undefined,
        badges: data.badges || [],
      };
    } else {
      const newUser: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Player",
        email: firebaseUser.email || "",
        role: defaultRole ?? UserRole.USER,
        profilePicture: firebaseUser.photoURL || undefined,
        bio: "Cadet of the Walls",
        badges: ["Recruit"],
      };
      await setDoc(userRef, {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture || null,
        bio: newUser.bio || null,
        badges: newUser.badges || [],
        createdAt: serverTimestamp(),
      });
      return newUser;
    }
  } catch (error) {
    console.warn("Firestore user sync error (using auth profile fallback):", error);
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Player",
      email: firebaseUser.email || "",
      role: defaultRole ?? UserRole.USER,
      profilePicture: firebaseUser.photoURL || undefined,
    };
  }
};
